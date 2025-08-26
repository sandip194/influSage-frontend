// CampaignStep2.jsx
import React, { useState, useEffect } from "react";
import { Select } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

const { Option } = Select;

const genderOptions = [
  { id: 1, label: "Male" },
  { id: 2, label: "Female" },
  { id: 3, label: "Other" },
];

const influencerTiers = [
  { id: 5, name: "Mega", minfollowers: 1000000, maxfollowers: null },
  { id: 4, name: "Macro", minfollowers: 100000, maxfollowers: 1000000 },
  { id: 3, name: "Micro", minfollowers: 50000, maxfollowers: 100000 },
  { id: 2, name: "Mini", minfollowers: 10000, maxfollowers: 50000 },
  { id: 1, name: "Nano", minfollowers: 1000, maxfollowers: 10000 },
];

const languages = [
  { id: 1, name: "English" },
  { id: 2, name: "Hindi" },
  { id: 3, name: "Spanish" },
];

const formatFollowers = (num) => {
  if (num >= 1_000_000_000)
    return (num / 1_000_000_000).toFixed(1).replace(".0", "") + "B";
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1).replace(".0", "") + "M";
  if (num >= 1_000)
    return (num / 1_000).toFixed(1).replace(".0", "") + "k";
  return num.toString();
};

const CampaignStep2 = ({ data, onNext, onBack }) => {
  const { userId, token } = useSelector((state) => state.auth);

  const [errors, setErrors] = useState({
    gender: false,
    shipProducts: false,
    targetedInfluencers: false,
    language: false,
  });

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    gender: null,
    shipProducts: null,
    targetedInfluencers: [],
    language: [],
  });

  useEffect(() => {
    setFormData({
      gender: data.gender || null,
      shipProducts:
        typeof data.shipProducts === "boolean" ? data.shipProducts : null,
      targetedInfluencers: data.targetedInfluencers || [],
      language: data.language || [],
    });
  }, [data]);

  const toggleGender = (id) => {
    setFormData((prev) => ({
      ...prev,
      gender: prev.gender === id ? null : id,
    }));
    setErrors((prev) => ({ ...prev, gender: false }));
  };

  const handleShipProducts = (value) => {
    setFormData({ ...formData, shipProducts: value });
    setErrors((prev) => ({ ...prev, shipProducts: false }));
  };

  const toggleInfluencerTier = (id) => {
    setFormData((prev) => {
      const alreadySelected = prev.targetedInfluencers.includes(id);
      return {
        ...prev,
        targetedInfluencers: alreadySelected
          ? prev.targetedInfluencers.filter((i) => i !== id)
          : [...prev.targetedInfluencers, id],
      };
    });
    setErrors((prev) => ({ ...prev, targetedInfluencers: false }));
  };

  const handleMultiSelectChange = (field, values) => {
    setFormData((prev) => ({
      ...prev,
      [field]: values,
    }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleContinue = async () => {
  const newErrors = {
    gender: !formData.gender,
    shipProducts: formData.shipProducts === null,
    targetedInfluencers: formData.targetedInfluencers.length === 0,
    language: formData.language.length === 0,
  };

  setErrors(newErrors);

  const hasError = Object.values(newErrors).some((e) => e);
  if (hasError) return;

  // 🔥 Build proper JSON for backend
  const campaigninfluencertiers = formData.targetedInfluencers.map((id) => {
    const tier = influencerTiers.find((t) => t.id === id);
    return {
      influencertierid: tier.id,
      influencertiername: tier.name,
    };
  });

  const campaignlanguages = formData.language.map((id) => {
    const lang = languages.find((l) => l.id === id);
    return {
      languageid: lang.id,
      languagename: lang.name,
    };
  });

  const p_vendorinfojson = {
    genderid: formData.gender,
    isproductshipping: formData.shipProducts,
    campaigninfluencertiers,
    campaignlanguages,
  };

  try {
    setLoading(true);

    const fd = new FormData();
    fd.append("p_userid", userId);
    fd.append("p_vendorinfojson", JSON.stringify(p_vendorinfojson));

    const res = await axios.post("/vendor/create-campaign", fd, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Saved Step 2:", res.data);
    onNext({ ...data, ...p_vendorinfojson });
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    alert("Failed to save campaign step. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-white p-6 rounded-2xl">
      {/* Gender */}
      <h2 className="text-xl font-semibold mb-4">Gender</h2>
      <div className="flex flex-wrap gap-4 mb-2">
        {genderOptions.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => toggleGender(id)}
            className={`border px-6 py-2 rounded-xl ${
              formData.gender === id
                ? "border-[#0D132D] font-semibold"
                : "border-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {errors.gender && (
        <div className="text-red-500 text-sm mb-4">
          Please select a gender
        </div>
      )}

      <hr className="my-1 border-gray-200" />

      {/* Ship Products */}
      <h2 className="text-xl font-semibold mb-4">
        Aiming to ship physical products to influencers?
      </h2>
      <div className="flex gap-4 mb-2">
        {[{ label: "Yes", value: true }, { label: "No", value: false }].map(
          ({ label, value }) => (
            <button
              key={label}
              onClick={() => handleShipProducts(value)}
              className={`border px-6 py-2 rounded-xl capitalize ${
                formData.shipProducts === value
                  ? "border-[#0D132D] font-semibold"
                  : "border-gray-300"
              }`}
            >
              {label}
            </button>
          )
        )}
      </div>
      {errors.shipProducts && (
        <div className="text-red-500 text-sm mb-4">
          Please select Yes or No
        </div>
      )}

      <hr className="my-1 border-gray-200" />

      {/* Targeted Influencers */}
      <h2 className="text-xl font-semibold mb-4">Targeted Influencers</h2>
      <div className="flex flex-col gap-3 mb-2">
        {influencerTiers.map((tier) => (
          <label key={tier.id} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.targetedInfluencers.includes(tier.id)}
              onChange={() => toggleInfluencerTier(tier.id)}
              className="w-5 h-5 accent-[#141843] rounded"
            />
            <span className="text-sm text-[#141843]">
              {tier.name} Influencer (
              {tier.maxfollowers
                ? `${formatFollowers(tier.minfollowers)} - ${formatFollowers(
                    tier.maxfollowers
                  )}`
                : `${formatFollowers(tier.minfollowers)}+`}{" "}
              Followers)
            </span>
          </label>
        ))}
      </div>
      {errors.targetedInfluencers && (
        <div className="text-red-500 text-sm mb-4">
          Please select at least one influencer tier
        </div>
      )}

      <hr className="my-1 border-gray-200" />

      {/* Language */}
      <h2 className="text-xl font-semibold mb-4">Language</h2>
      <Select
        mode="multiple"
        size="large"
        style={{ width: "100%" }}
        placeholder="Select Languages"
        value={formData.language}
        onChange={(values) => handleMultiSelectChange("language", values)}
        className="mb-6"
      >
        {languages.map(({ id, name }) => (
          <Option key={id} value={id}>
            {name}
          </Option>
        ))}
      </Select>

      {errors.language && (
        <div className="text-red-500 text-sm mb-4 mt-2">
          Please select at least one language
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={onBack}
          className="bg-white cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
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

export default CampaignStep2;
