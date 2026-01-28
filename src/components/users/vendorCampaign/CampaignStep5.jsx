import React, { useState, useEffect, useRef } from 'react';
import { Input, message } from 'antd';
import api from '../../../api/axios';
import { useSelector } from 'react-redux';
import { RiCheckLine } from '@remixicon/react';

const { TextArea } = Input;

const CAPTION_MAX_LENGTH = 250;


const CampaignStep5 = ({ onNext, onBack, data, campaignId }) => {
  const { token } = useSelector((state) => state.auth) || {};
  const [platforms, setPlatforms] = useState({});
  const [formState, setFormState] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const fieldRefs = useRef({});

  const FIELD_ORDER = ["__global__", ...Object.keys(platforms)];


  const scrollToFirstError = (errors, globalError) => {
    // Global error has highest priority
    if (globalError && fieldRefs.current.__global__) {
      fieldRefs.current.__global__.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    const firstPlatform = FIELD_ORDER.find(
      (key) => key !== "__global__" && errors[key]
    );

    if (!firstPlatform) return;

    const el = fieldRefs.current[firstPlatform];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };


  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const res = await api.get("/vendor/provider-content-type", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const apiPlatforms = res.data.providorType || [];


        const grouped = apiPlatforms.reduce((acc, item, index) => {
          if (!acc[item.providername]) {
            acc[item.providername] = [];
          }
          acc[item.providername].push({
            id: item.providercontenttypeid
              ? Number(item.providercontenttypeid)
              : Number(`${item.providerid}${index}`),
            label: item.contenttypename || "Unknown",
            providerid: item.providerid,
          });
          return acc;
        }, {});

        setPlatforms(grouped);

        // 🔹 Build base empty state
        const initial = {};
        Object.keys(grouped).forEach((platform) => {
          initial[platform] = { selectedTypes: [], caption: "" };
        });

        // 🔹 Merge parent data (if provided)
        if (Array.isArray(data)) {
          data.forEach((entry) => {
            const platformName = entry.providername;
            if (grouped[platformName]) {
              initial[platformName] = {
                selectedTypes: entry.contenttypes.map((t) => t.providercontenttypeid),
                caption: entry.caption || "",
              };
            }
          });
        }

        setFormState(initial);
      } catch (err) {
        console.error("Error fetching provider content types:", err);
        message.error("Failed to load content types");
      }
    };

    fetchPlatforms();
  }, [token, data]);

  const toggleContentType = (platform, typeId) => {
    setFormState((prev) => {
      const selected = Array.isArray(prev[platform]?.selectedTypes)
        ? prev[platform].selectedTypes
        : [];
      const alreadySelected = selected.includes(typeId);

      return {
        ...prev,
        [platform]: {
          ...prev[platform],
          selectedTypes: alreadySelected
            ? selected.filter((id) => id !== typeId)
            : [...selected, typeId],
        },
      };
    });
  };

  const handleCaptionChange = (platform, value) => {
    // Trim to max length immediately
    const trimmedValue = value.slice(0, CAPTION_MAX_LENGTH);

    setFormState((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], caption: trimmedValue },
    }));

    // Clear errors for this platform
    setErrors((prev) => {
      if (!prev[platform]) return prev;

      return {
        ...prev,
        [platform]: {
          ...prev[platform],
          caption: false,
          captionLength: false,
        },
      };
    });
  };



  const handleContinue = async () => {
    const newErrors = {};
    let validPlatforms = [];

    const contenttypejson = Object.entries(formState)
      .map(([platform, data]) => {
        const typeObjs = platforms[platform].filter((item) =>
          (data.selectedTypes || []).includes(item.id)
        );

        // Skip completely empty platforms
        if (!typeObjs.length && !data.caption.trim()) {
          return null;
        }

        // If partially filled → error
        const captionText = data.caption.trim();

        if (
          !typeObjs.length ||
          !captionText ||
          captionText.length > CAPTION_MAX_LENGTH
        ) {
          newErrors[platform] = {
            type: !typeObjs.length,
            caption: !captionText,
            captionLength: captionText.length > CAPTION_MAX_LENGTH,
          };
          return null;
        }


        validPlatforms.push(platform);

        return {
          providerid: typeObjs[0].providerid,
          providername: platform,
          caption: data.caption.trim(),
          contenttypes: typeObjs.map((t) => ({
            contenttypename: t.label,
            providercontenttypeid: t.id,
          })),
        };
      })
      .filter(Boolean);

    setErrors(newErrors);

    // 🔹 Global error if no platform is fully valid
    if (!contenttypejson.length) {
      setGlobalError("Please select at least one platform (type + caption).");
      scrollToFirstError(newErrors, true);
      return;
    } else {
      setGlobalError("");
    }

    // ✅ ADD (when platform-level errors exist)
    if (Object.keys(newErrors).length) {
      scrollToFirstError(newErrors, false);
      return;
    }
    try {
      setLoading(true);

      await api.post(
        "/vendor/update-campaign",
        { p_contenttypejson: contenttypejson, campaignId: campaignId ? campaignId : null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Step 5 saved successfully!");
      onNext(contenttypejson);
    } catch (err) {
      console.error(err);
      message.error("Failed to save Step 5. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl">
      <h2 className="text-xl font-bold mb-6">Content Types & Captions</h2>

      {Object.entries(platforms).map(([platform, types]) => {
        const { selectedTypes = [], caption = "" } = formState[platform] || {};
        const platformErrors = errors[platform] || {};


        return (
          <div
            key={platform} className="mb-5"
            ref={(el) => (fieldRefs.current[platform] = el)}
            tabIndex={-1}
          >
            <p className="font-semibold mb-2">{platform}</p>

            <div className="flex gap-2 mb-3 flex-wrap">
              {types.map(({ id, label }, idx) => {
                const isSelected = selectedTypes.includes(id);

                return (
                  <button
                    key={`type-${platform}-${id || idx}`}
                    type="button"
                    onClick={() => toggleContentType(platform, id)}
                    className={`px-6 py-2 rounded-xl cursor-pointer border flex items-center gap-2 transition-colors
                    ${isSelected
                        ? "bg-[#0D132D26] text-black border-[#0D132D26]"
                        : "bg-white text-black border-gray-300 hover:border-[#141843]"
                      }
                  `}
                  >
                    {label}

                    {/* Checkmark inside button */}
                    <div
                      className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-md border transition-all
                      ${isSelected
                          ? "bg-[#141843] border-[#0D132D26] text-white"
                          : "bg-transparent border-gray-400 text-transparent"
                        }`}

                    >
                      <RiCheckLine size={14} />
                    </div>
                  </button>
                );
              })}
            </div>

            {platformErrors.type && (
              <p className="text-red-500 text-sm mb-2">
                Select at least one type
              </p>
            )}

            <TextArea
              placeholder="Caption"
              size="large"
              value={caption}
              maxLength={CAPTION_MAX_LENGTH} // still good for UI
              showCount
              onChange={(e) => handleCaptionChange(platform, e.target.value)}
              rows={2}
              className="rounded-2xl p-2"
            />


            {platformErrors.caption && (
              <p className="text-red-500 text-sm mt-1">Caption is required</p>
            )}

            {platformErrors.captionLength && (
              <p className="text-red-500 text-sm mt-1">
                Caption cannot exceed {CAPTION_MAX_LENGTH} characters
              </p>
            )}


            <hr className="mt-8 border-gray-200" />
          </div>
        );
      })}

      {/* 🔹 Global error */}
      {globalError && (
        <p
          ref={(el) => (fieldRefs.current.__global__ = el)}
          tabIndex={-1}
          className="text-red-500 text-sm mb-4"
        >
          {globalError}
        </p>
      )}


      <div className="flex gap-4 mt-6">
        <button
          onClick={onBack}
          className="bg-white text-[#0D132D] cursor-pointer px-8 py-3 rounded-full border border-[#121a3f26] hover:bg-[#0D132D] hover:text-white transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={loading}
          className="bg-[#121A3F] text-white cursor-pointer px-8 py-3 rounded-full hover:bg-[#0D132D] disabled:opacity-60"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default CampaignStep5;
