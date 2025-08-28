import React, { useEffect, useState } from "react";
import { Input, message } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { RiCheckLine } from "@remixicon/react";

const options = [
  {
    id: 1,
    text: "Post my existing content (video & Images) on their social media without creating any content on their own",
  },
  {
    id: 2,
    text: "Create content (Video or Images) on their own as well as publishing them on their social media",
  },
  {
    id: 3,
    text: "Only create content (Video or Images) for me.",
  },
];

const CampaignExpectationSelector = ({ data, onNext, userId: propUserId }) => {
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

  useEffect(() => {
    if (data?.objectiveid) setSelected(data.objectiveid);
    if (data?.postdurationdays) setDurationDays(Number(data.postdurationdays));
    if (typeof data?.isincludevendorprofilelink === "boolean") setAddLinkToBio(data.isincludevendorprofilelink);
  }, [data]);

  const handleContinue = async () => {
    const newErrors = {
      contentExpectation: !selected,
      durationDays: !durationDays || isNaN(durationDays) || Number(durationDays) <= 0,
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
      formData.append("p_objectivejson", JSON.stringify(p_objectivejson));

      const res = await axios.post("/vendor/create-campaign", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", res.data);
      onNext(p_objectivejson);
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
        {options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => {
              setSelected(opt.id);
              setErrors((prev) => ({ ...prev, contentExpectation: false }));
            }}
            className={`flex justify-between items-center px-5 py-4 rounded-xl border cursor-pointer transition-all ${selected === opt.id
              ? "bg-[#0D132DE5] text-white border-[#0D132DE5]"
              : "bg-white text-black border-gray-300 hover:bg-[#0D132D26] hover:border-[#0D132DBF]"
              }`}
          >
            <span className="text-sm">{opt.text}</span>

            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full border transition-all ${selected === opt.id
                ? "bg-[#12B76A] border-[#13297E] text-[#0D132DE5]"
                : "bg-transparent border-gray-400"
                }`}
            >
              {selected === opt.id && <RiCheckLine size={18} />}
            </div>
          </div>
        ))}
      </div>
      {errors.contentExpectation && (
        <div className="text-red-500 text-sm mb-4">Please select at least one option</div>
      )}

      <hr className="my-6 border-gray-200" />

      {/* Post Duration */}
      <h2 className="text-xl font-semibold mb-4">
        How long would you like the post to stay on the influencer’s social accounts?
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
        <div className="text-red-500 text-sm mb-4">Please enter a valid number of days</div>
      )}

      <hr className="my-6 border-gray-200" />

      {/* Add Link to Bio */}
      <h2 className="text-xl font-semibold mb-4">
        Would you like to have influencers add your link in their bio when publishing your campaign?
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
                    ? "bg-[#0D132DE5] text-white border-[#0D132DE5]"
                    : "bg-white text-black border-gray-300 hover:bg-[#0D132D26] hover:border-[#0D132DBF]"
                  }`}
              >
                <span className={`capitalize font-medium text-sm ${isSelected ? "text-white" : "text-black"}`}>
                  {label}
                </span>

                <div
                  className={`w-5 h-5 flex items-center justify-center rounded-full border transition-all
              ${isSelected
                      ? "bg-[#12B76A] border-[#12B76A] text-white"
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
        <div className="text-red-500 text-sm mb-4">Please select Yes or No</div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          className="bg-white cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
          disabled
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={loading}
          className="bg-[#121A3F] text-white cursor-pointer inset-shadow-sm inset-shadow-gray-500 px-8 py-3 rounded-full hover:bg-[#0D132D] disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default CampaignExpectationSelector;
