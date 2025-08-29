// CampaignStep2.jsx
import React, { useState, useEffect } from "react";
import { Select } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { RiCheckLine } from "@remixicon/react";

const { Option } = Select;

const formatFollowers = (num) => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(".0", "") + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(".0", "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(".0", "") + "k";
  return num.toString();
};

const CampaignStep2 = ({ data, onNext, onBack }) => {
  const [languages, setLanguages] = useState([]);
  const [genders, setGenders] = useState([]);
  const [influencerTiers, setInfluencerTiers] = useState([]);

  const [loadingLanguages, setLoadingLanguages] = useState(false);
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [loadingTiers, setLoadingTiers] = useState(false);

  const { userId, token } = useSelector((state) => state.auth);

  const [errors, setErrors] = useState({
    gender: false,
    shipProducts: false,
    targetedInfluencers: false,
    language: false,
  });

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    gender: Array.isArray(data?.gender) ? data.gender : [],
    shipProducts: typeof data?.shipProducts === "boolean" ? data.shipProducts : null,
    targetedInfluencers: data?.targetedInfluencers ?? [],
    language: data?.language ?? [],
  });

  useEffect(() => {
    if (!data) return;
    setFormData({
      gender: Array.isArray(data?.gender) ? data.gender : [],
      shipProducts: typeof data?.shipProducts === "boolean" ? data.shipProducts : null,
      targetedInfluencers: data?.targetedInfluencers ?? [],
      language: data?.language ?? [],
    });
  }, [data]);

  // Fetch Languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoadingLanguages(true);
        const res = await axios.get("/vendor/campaign/languages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLanguages(res.data.languages || []);
      } catch (err) {
        console.error("Error fetching languages:", err);
      } finally {
        setLoadingLanguages(false);
      }
    };
    fetchLanguages();
  }, [token]);

  // Fetch Genders
  useEffect(() => {
    const fetchGenders = async () => {
      try {
        setLoadingGenders(true);
        const res = await axios.get("/vendor/gender", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGenders(res.data.genders || []);
      } catch (err) {
        console.error("Error fetching genders:", err);
      } finally {
        setLoadingGenders(false);
      }
    };
    fetchGenders();
  }, [token]);

  // Fetch Influencer Tiers
  useEffect(() => {
    const fetchTiers = async () => {
      try {
        setLoadingTiers(true);
        const res = await axios.get("/vendor/influencer-type", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInfluencerTiers(res.data.influencerType || []); 
      } catch (err) {
        console.error("Error fetching influencer tiers:", err);
      } finally {
        setLoadingTiers(false);
      }
    };
    fetchTiers();
  }, [token]);

  const toggleGender = (id) => {
    setFormData((prev) => {
      const isSelected = prev.gender.includes(id);
      return {
        ...prev,
        gender: isSelected ? prev.gender.filter((g) => g !== id) : [...prev.gender, id],
      };
    });
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
    setFormData((prev) => ({ ...prev, [field]: values }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleContinue = async () => {
    const newErrors = {
      gender: !formData.gender.length,
      shipProducts: formData.shipProducts === null,
      targetedInfluencers: formData.targetedInfluencers.length === 0,
      language: formData.language.length === 0,
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e)) return;

    const campaigninfluencertiers = formData.targetedInfluencers.map((id) => {
      const tier = influencerTiers.find((t) => t.id === id);
      return { influencertierid: tier.id, influencertiername: tier.name };
    });

    const campaignlanguages = formData.language.map((id) => {
      const lang = languages.find((l) => l.id === id);
      return { languageid: lang.id, languagename: lang.name };
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
        headers: { Authorization: `Bearer ${token}` },
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
    <div className="bg-white rounded-2xl">
      {/* Gender */}
      <h2 className="text-xl font-semibold mb-4">Please select the gender(s) of influencers you'd like to work with</h2>
      <div className="flex flex-wrap gap-4 mb-2">
        {genders.map(({ id, name }) => {
          const isSelected = formData.gender.includes(id);
          return (
            <div
              key={id}
              onClick={() => toggleGender(id)}
              className={`flex items-center justify-between gap-3 px-6 py-3 rounded-xl border cursor-pointer transition-all w-32
                ${isSelected ? "bg-[#0D132D26] text-black border-[#0D132D26]" : "bg-white text-black border-gray-300 hover:bg-[#0D132D0D] hover:border-[#0D132D80]"}`}
            >
              <span className="capitalize font-medium text-sm">{name}</span>
              <div className={`w-5 h-5 flex items-center justify-center rounded-full border transition-all
                ${isSelected ? "bg-[#0D132DE5] border-[#0D132D26] text-white" : "bg-transparent border-gray-400 text-transparent"}`}>
                <RiCheckLine size={14} />
              </div>
            </div>
          );
        })}
      </div>
      {errors.gender && <div className="text-red-500 text-sm mb-4">Please select at least one gender</div>}

      <hr className="my-1 border-gray-200" />

      {/* Ship Products */}
      <h2 className="text-xl font-semibold mb-4 mt-6">Aiming to ship physical products to influencers?</h2>
      <div className="flex gap-4 mb-2">
        {[{ label: "Yes", value: true }, { label: "No", value: false }].map(({ label, value }) => {
          const isSelected = formData.shipProducts === value;
          return (
            <div
              key={label}
              onClick={() => handleShipProducts(value)}
              className={`flex items-center justify-between gap-3 px-6 py-3 rounded-xl border cursor-pointer transition-all w-32
                ${isSelected ? "bg-[#0D132D26] text-black border-[#0D132D26]" : "bg-white text-black border-gray-300 hover:bg-[#0D132D26] hover:border-[#0D132DBF]"}`}
            >
              <span className="capitalize font-medium text-sm">{label}</span>
              <div className={`w-5 h-5 flex items-center justify-center rounded-full border transition-all
                ${isSelected ? "bg-[#0D132DE5] border-[#0D132D26] text-white" : "bg-transparent border-gray-400 text-transparent"}`}>
                <RiCheckLine size={14} />
              </div>
            </div>
          );
        })}
      </div>
      {errors.shipProducts && <div className="text-red-500 text-sm mb-4">Please select Yes or No</div>}

      <hr className="my-1 border-gray-200" />

      {/* Targeted Influencers */}
      <h2 className="text-xl font-semibold mb-4 mt-6">Targeted Influencers</h2>
      <div className="flex-col space-y-2 flex-wrap gap-4 mb-2">
        {influencerTiers.map((tier) => {
          const isSelected = formData.targetedInfluencers.includes(tier.id);
          return (
            <div
              key={tier.id}
              onClick={() => toggleInfluencerTier(tier.id)}
              className={`flex items-center justify-between gap-3 px-6 py-3 rounded-xl border cursor-pointer transition-all w-56 sm:w-80 md:w-90
                ${isSelected ? "bg-[#0D132D26] text-black border-[#0D132D26]" : "bg-white text-black border-gray-300 hover:bg-[#0D132D26] hover:border-[#0D132DBF]"}`}
            >
              <span className="text-sm">
                {tier.name} Influencer (
                {tier.maxfollowers
                  ? `${formatFollowers(tier.minfollowers)} - ${formatFollowers(tier.maxfollowers)}`
                  : `${formatFollowers(tier.minfollowers)}+`} Followers)
              </span>
              <div className={`w-5 h-5 flex items-center justify-center rounded-full border transition-all
                ${isSelected ? "bg-[#141843] border-[#0D132D26] text-white" : "bg-transparent border-gray-400 text-transparent"}`}>
                <RiCheckLine size={14} />
              </div>
            </div>
          );
        })}
      </div>
      {errors.targetedInfluencers && <div className="text-red-500 text-sm mb-4">Please select at least one influencer tier</div>}

      <hr className="my-1 border-gray-200" />

      {/* Language */}
      <h2 className="text-xl font-semibold mb-4 mt-6">Select preferred languages for the content</h2>
      <Select
        mode="multiple"
        size="large"
        style={{ width: "100%" }}
        placeholder={loadingLanguages ? "Loading languages..." : "Select Languages"}
        value={formData.language}
        onChange={(values) => handleMultiSelectChange("language", values)}
        className="mb-6"
        loading={loadingLanguages}
      >
        {languages.map(({ id, name }) => (
          <Option key={id} value={id}>
            {name}
          </Option>
        ))}
      </Select>
      {errors.language && <div className="text-red-500 text-sm mb-4 mt-2">Please select at least one language</div>}

      {/* Navigation */}
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
