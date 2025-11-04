import React, { useEffect, useState } from 'react';
import { Input, message } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RiCheckLine } from '@remixicon/react';

const CampaignExpectationSelector = ({ data, onNext, userId: propUserId, campaignId }) => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(data?.contentExpectation || "");
  const [durationDays, setDurationDays] = useState(null);
  const [addLinkToBio, setAddLinkToBio] = useState(
    typeof data?.addLinkToBio === "boolean" ? data.addLinkToBio : null
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    contentExpectation: false,
    durationDays: false,
    addLinkToBio: false,
  });

  const { token, userId: reduxUserId } = useSelector((state) => state.auth);

  // Fetch campaign objectives from API
  useEffect(() => {
  const fetchObjectives = async () => {
    try {
      const res = await axios.get("/vendor/campaign/objectives", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedOptions = res.data.objectives || [];
      setOptions(fetchedOptions);

      if (fetchedOptions.length > 0 && !data?.objectiveid && !selected) {
        setSelected(fetchedOptions[0].id);
      }

    } catch (err) {
      console.error("Error fetching objectives:", err);
      message.error("Failed to load campaign objectives.");
    }
  };
  fetchObjectives();
}, [token, data, selected]);

  useEffect(() => {
    setSelected(data?.objectiveid || "");
    setDurationDays(data?.postdurationdays ? Number(data.postdurationdays) : "");
    setAddLinkToBio(
      typeof data?.isincludevendorprofilelink === "boolean"
        ? data.isincludevendorprofilelink
        : null
    );
  }, [data]);

  const handleContinue = async () => {
    const newErrors = {
      contentExpectation: !selected,
      durationDays:
        !durationDays || isNaN(durationDays) || Number(durationDays) <= 0,
      addLinkToBio: addLinkToBio === null,
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e);
    if (hasError) return;

    const finalUserId = reduxUserId || propUserId;

    if (!token || !finalUserId) {
      message.error("User not authenticated.");
      return;
    }
    const p_objectivejson = {
      objectiveid: selected,
      postdurationdays: Number(durationDays),
      isincludevendorprofilelink: addLinkToBio,
    };

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("p_userid", finalUserId);
      if (campaignId) formData.append("campaignId", campaignId);
      formData.append("p_objectivejson", JSON.stringify(p_objectivejson));

      const res = await axios.post("/vendor/update-campaign", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) onNext(p_objectivejson);

    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      message.error("Something went wrong while saving campaign step.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl">
      {/* Content Expectation */}
      <h2 className="text-xl font-semibold mb-6">
        What do you expect influencers to do for your campaign?
      </h2>
      <div className="space-y-2 mb-1">
        {options.map((opt) => {
          const isSelected = selected === opt.id;

          return (
            <div
              key={opt.id}
              onClick={() => {
                setSelected(opt.id);
                setErrors((prev) => ({ ...prev, contentExpectation: false }));
              }}
              className={`flex justify-between items-center px-3 sm:px-5 py-3 sm:py-4 rounded-xl border cursor-pointer transition-all ${isSelected
                  ? "bg-[#0D132D26] text-black border-[#0D132D26]"
                  : "bg-white text-black border-gray-300 hover:border-[#141843]"
                }`}
            >
              <span className="text-xs sm:text-sm md:text-base break-words pr-2 text-justify">
                {opt.name}
              </span>

              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full border transition-all shrink-0 ${isSelected
                    ? "bg-[#141843] border-[#0D132D26] text-white"
                    : "bg-transparent border-gray-400 text-transparent"
                  }`}
              >
                {isSelected && <RiCheckLine size={16} className="sm:w-5 sm:h-5" />}
              </div>
            </div>
          );
        })}
      </div>
      {errors.contentExpectation && (
        <div className="text-red-500 text-sm mb-4">
          Please select at least one option
        </div>
      )}

      <hr className="my-6 border-gray-200" />

      {/* Post Duration */}
      <h2 className="text-xl font-semibold mb-4 ">
        How long would you like the post to stay on the influencer’s social
        accounts?
      </h2>
      <div className="flex items-center gap-2 mb-2">
        <Input
          type="number"
          size="large"
          min={1}
          value={durationDays}
          onChange={(e) => {
            setDurationDays(e.target.value);
            setErrors((prev) => ({ ...prev, durationDays: false }));
          }}
          style={{ width: 100 }}
          placeholder="Enter"
        />
        <span className="text-md font-medium">Days</span>
      </div>
      {errors.durationDays && (
        <div className="text-red-500 text-sm mb-4">
          Please enter a valid number of days
        </div>
      )}

      <hr className="my-6 border-gray-200" />

      {/* Add Link to Bio */}
      <h2 className="text-xl font-semibold mb-4 text-justify">
        Would you like to have influencers add your link in their bio when
        publishing your campaign?
      </h2>
      <div className="flex gap-4 mb-2">
        {[{ label: "Yes", value: true }, { label: "No", value: false }].map(
          ({ label, value }) => {
            const isSelected = addLinkToBio === value;

            return (
              <div
                key={label}
                onClick={() => {
                  setAddLinkToBio(value);
                  setErrors((prev) => ({ ...prev, addLinkToBio: false }));
                }}
                className={`flex items-center justify-between gap-3 px-6 py-3 rounded-xl border cursor-pointer transition-all w-32


            ${isSelected
                    ? "bg-[#0D132D26] text-black border-[#0D132D26]"
                    : "bg-white text-black border-gray-300  hover:border-[#141843]"
                  }`}
              >
                <span className={`capitalize font-medium text-sm text-black`}>

                  {label}
                </span>

                <div
                  className={`w-5 h-5 flex items-center justify-center rounded-full border transition-all

              ${isSelected
                      ? "bg-[#141843] border-[#0D132D26] text-white"
                      : "bg-transparent border-gray-400 text-transparent"
                    }`}
                >
                  <RiCheckLine size={14} />
                </div>
              </div>
            );
          }
        )}
      </div>
      {errors.addLinkToBio && (
        <div className="text-red-500 text-sm mb-4">
          Please select Yes or No
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-6">
        {/* <button
          className="bg-white cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
          disabled
        >
          Back
        </button> */}
        <button
          onClick={handleContinue}
          disabled={loading}
          className="bg-[#121A3F] text-white cursor-pointer px-8 py-3 rounded-full hover:bg-[#0D132D] disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default CampaignExpectationSelector;
