import React, { useState, useEffect } from "react";
import { Input, message } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

const { TextArea } = Input;

const CampaignStep5 = ({ onNext, onBack }) => {
  const { token } = useSelector((state) => state.auth) || {};
  const [platforms, setPlatforms] = useState([]); 
  const [formState, setFormState] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const res = await axios.get("/vendor/provider-content-type", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const apiPlatforms = res.data.providorType || [];

        const grouped = apiPlatforms.reduce((acc, item) => {
          if (!acc[item.providername]) {
            acc[item.providername] = [];
          }
          acc[item.providername].push({
            id: item.providercontenttypeid,
            label: item.contenttypename,
          });
          return acc;
        }, {});

        setPlatforms(grouped);

        const initial = {};
        Object.keys(grouped).forEach((platform) => {
          initial[platform] = { selectedTypes: [], caption: "" };
        });
        setFormState(initial);
      } catch (err) {
        console.error("Error fetching provider content types:", err);
        message.error("Failed to load content types");
      }
    };

    fetchPlatforms();
  }, [token]);

  const toggleContentType = (platform, typeId) => {
    setFormState((prev) => {
      const selected = prev[platform].selectedTypes;
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
    setFormState((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], caption: value },
    }));
  };

  const handleContinue = async () => {
    const newErrors = {};
    let hasError = false;

    const contenttypejson = Object.entries(formState).map(
      ([platform, data]) => {
        const selectedTypes = data.selectedTypes.map((typeId) => {
          const type = platforms[platform].find((item) => item.id === typeId);
          return {
            contenttypename: type.label,
            providercontenttypeid: typeId,
          };
        });

        if (selectedTypes.length === 0 || !data.caption.trim()) {
          newErrors[platform] = {
            type: selectedTypes.length === 0,
            caption: !data.caption.trim(),
          };
          hasError = true;
        }

        const providerObj = Object.values(platforms)
          .flat()
          .find((t) => t.label === selectedTypes[0]?.contenttypename);

        return {
          providerid: providerObj?.providerid || null,
          providername: platform,
          caption: data.caption.trim(),
          contenttypes: selectedTypes,
        };
      }
    );

    setErrors(newErrors);

    if (hasError) {
      message.error(
        "Please select at least one type and add a caption for each platform."
      );
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "/vendor/create-campaign",
        { p_contenttypejson: contenttypejson },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
          <div key={platform} className="mb-5">
            <p className="font-semibold mb-2">{platform}</p>
            <div className="flex gap-2 mb-3 flex-wrap">
             {types.map(({ id, label }, index) => (
  <button
    key={`type-${platform}-${id || index}`}  
    type="button"
    onClick={() => toggleContentType(platform, id)}
    className={`px-6 py-2 rounded-xl cursor-pointer border ${
      selectedTypes.includes(id)
        ? "border-[#0D132D] font-semibold bg-gray-100"
        : "border-gray-300"
    }`}
  >
    {label}
  </button>
))}

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
              onChange={(e) => handleCaptionChange(platform, e.target.value)}
              rows={2}
              className="rounded-2xl p-2"
            />

            {platformErrors.caption && (
              <p className="text-red-500 text-sm mt-1">Caption is required</p>
            )}

            <hr className="mt-5 border-gray-200" />
          </div>
        );
      })}

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
