import React, { useState, useEffect } from "react";
import { Select } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { RiCheckLine } from "@remixicon/react";

const { Option } = Select;

const formatFollowers = (num) => {
  if (num >= 1_000_000_000)
    return (num / 1_000_000_000).toFixed(1).replace(".0", "") + "B";
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1).replace(".0", "") + "M";
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
    genderid: false,
    isproductshipping: false,
    campaigninfluencertiers: false,
    campaignlanguages: false,
  });

  const [loading, setLoading] = useState(false);

  // Initialize formData with IDs extracted from incoming data JSON structure
  const [formData, setFormData] = useState({
    genderid: Array.isArray(data?.genderid) ? data.genderid : [],
    isproductshipping:
      typeof data?.isproductshipping === "boolean"
        ? data.isproductshipping
        : null,
    campaigninfluencertiers: Array.isArray(data?.campaigninfluencertiers)
      ? data.campaigninfluencertiers.map((t) => t.influencertierid)
      : [],
    campaignlanguages: Array.isArray(data?.campaignlanguages)
      ? data.campaignlanguages.map((l) => l.languageid)
      : [],
  });

  useEffect(() => {
    if (!data) return;
    setFormData({
      genderid: Array.isArray(data?.genderid) ? data.genderid : [],
      isproductshipping:
        typeof data?.isproductshipping === "boolean"
          ? data.isproductshipping
          : null,
      campaigninfluencertiers: Array.isArray(data?.campaigninfluencertiers)
        ? data.campaigninfluencertiers.map((t) => t.influencertierid)
        : [],
      campaignlanguages: Array.isArray(data?.campaignlanguages)
        ? data.campaignlanguages.map((l) => l.languageid)
        : [],
    });
  }, [data]);

  // Fetch Languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoadingLanguages(true);
        const res = await axios.get("languages", {
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
        const res = await axios.get("genders", {
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
      const isSelected = prev.genderid.includes(id);
      return {
        ...prev,
        genderid: isSelected
          ? prev.genderid.filter((g) => g !== id)
          : [...prev.genderid, id],
      };
    });
    setErrors((prev) => ({ ...prev, genderid: false }));
  };

  const handleShipProducts = (value) => {
    setFormData({ ...formData, isproductshipping: value });
    setErrors((prev) => ({ ...prev, isproductshipping: false }));
  };

  const toggleInfluencerTier = (id) => {
    setFormData((prev) => {
      const alreadySelected = prev.campaigninfluencertiers.includes(id);
      return {
        ...prev,
        campaigninfluencertiers: alreadySelected
          ? prev.campaigninfluencertiers.filter((i) => i !== id)
          : [...prev.campaigninfluencertiers, id],
      };
    });
    setErrors((prev) => ({ ...prev, campaigninfluencertiers: false }));
  };

  const handleMultiSelectChange = (field, values) => {
    setFormData((prev) => ({ ...prev, [field]: values }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleContinue = async () => {
    const newErrors = {
      genderid: !formData.genderid.length,
      isproductshipping: formData.isproductshipping === null,
      campaigninfluencertiers: formData.campaigninfluencertiers.length === 0,
      campaignlanguages: formData.campaignlanguages.length === 0,
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e)) return;

    // Map IDs back to full objects for JSON
    const campaigninfluencertiers = formData.campaigninfluencertiers.map(
      (id) => {
        const tier = influencerTiers.find((t) => t.id === id);
        return { influencertierid: tier.id, influencertiername: tier.name };
      }
    );

    const campaignlanguages = formData.campaignlanguages.map((id) => {
      const lang = languages.find((l) => l.id === id);
      return { languageid: lang.id, languagename: lang.name };
    });

    const p_vendorinfojson = {
      genderid: formData.genderid,
      isproductshipping: formData.isproductshipping,
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

     if(res.status === 200) onNext({ ...data, ...p_vendorinfojson });
      
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
      <h2 className="text-xl font-semibold mb-4">
        Please select the gender(s) of influencers you'd like to work with
      </h2>
      <div className="flex flex-wrap gap-4 mb-2">
        {genders.map(({ id, name }) => {
          const isSelected = formData.genderid.includes(id);
          return (
            <div
              key={id}
              onClick={() => toggleGender(id)}
              className={`flex items-center justify-between gap-3 px-6 py-3 rounded-xl border cursor-pointer transition-all 
          w-full sm:w-32
          ${
            isSelected
              ? "bg-[#0D132D26] text-black border-[#0D132D26]"
              : "bg-white text-black border-gray-300 hover:border-[#141843]"
          }`}
            >
              <span className="capitalize font-medium text-sm">{name}</span>

              <div
                className={`w-5 h-5 flex items-center justify-center rounded-full border transition-all
            ${
              isSelected
                ? "bg-[#141843] border-[#0D132D26] text-white"
                : "bg-transparent border-gray-400 text-transparent"
            }`}
              >
                <RiCheckLine size={14} />
              </div>
            </div>
          );
        })}
      </div>

      {errors.genderid && (
        <div className="text-red-500 text-sm mb-4">
          Please select at least one gender
        </div>
      )}

      <hr className="my-1 border-gray-200" />

      {/* Ship Products */}
      <h2 className="text-xl font-semibold mb-4 mt-6">
        Aiming to ship physical products to influencers?
      </h2>
      <div className="flex gap-4 mb-2">
        {[
          { label: "Yes", value: true },
          { label: "No", value: false },
        ].map(({ label, value }) => {
          const isSelected = formData.isproductshipping === value;

          return (
            <div
              key={label}
              onClick={() => handleShipProducts(value)}
              className={`flex items-center justify-between gap-3 px-6 py-3 rounded-xl border cursor-pointer transition-all w-32
            ${
              isSelected
                ? "bg-[#0D132D26] text-black border-[#0D132D26]"
                : "bg-white text-black border-gray-300 hover:border-[#141843]"
            }`}
            >
              <span className={`capitalize font-medium text-sm`}>{label}</span>

              <div
                className={`w-5 h-5 flex items-center justify-center rounded-full border transition-all
              ${
                isSelected
                  ? "bg-[#141843] border-[#0D132D26] text-white"
                  : "bg-transparent border-gray-400 text-transparent"
              }`}
              >
                <RiCheckLine size={14} />
              </div>
            </div>
          );
        })}
      </div>
      {errors.isproductshipping && (
        <div className="text-red-500 text-sm mb-4">Please select Yes or No</div>
      )}

      <hr className="my-1 border-gray-200" />

      {/* Targeted Influencers */}
      <h2 className="text-xl font-semibold mb-4 mt-6">Targeted Influencers</h2>
      <div className="flex flex-col gap-4 mb-2">
        {influencerTiers.map((tier) => {
          const isSelected = formData.campaigninfluencertiers.includes(tier.id);
          return (
            <div
              key={tier.id}
              onClick={() => toggleInfluencerTier(tier.id)}
              className={`flex items-center justify-between gap-3 px-6 py-3 rounded-xl border cursor-pointer transition-all 
          w-full sm:w-80 md:w-96
          ${
            isSelected
              ? "bg-[#0D132D26] text-black border-[#0D132D26]"
              : "bg-white text-black border-gray-300 hover:border-[#141843]"
          }`}
            >
              {/* Text */}
              <span className="text-sm flex-1">
                {tier.name} Influencer (
                {tier.maxfollowers
                  ? `${formatFollowers(tier.minfollowers)} - ${formatFollowers(
                      tier.maxfollowers
                    )}`
                  : `${formatFollowers(tier.minfollowers)}+`}{" "}
                Followers)
              </span>

              {/* Circle button */}
              <div
                className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full border transition-all
            ${
              isSelected
                ? "bg-[#141843] border-[#0D132D26] text-white"
                : "bg-transparent border-gray-400 text-transparent"
            }`}
              >
                <RiCheckLine size={14} />
              </div>
            </div>
          );
        })}
      </div>

      {errors.campaigninfluencertiers && (
        <div className="text-red-500 text-sm mb-4">
          Please select at least one influencer tier
        </div>
      )}

      <hr className="my-1 border-gray-200" />

      {/* Language */}
      <h2 className="text-xl font-semibold mb-4 mt-6">
        Select preferred languages for the content
      </h2>
      <div className="w-full sm:w-1/2">
        <Select
          mode="multiple"
          size="large"
          style={{ width: "100%" }}
          placeholder={
            loadingLanguages ? "Loading languages..." : "Select Languages"
          }
          value={formData.campaignlanguages}
          onChange={(values) =>
            handleMultiSelectChange("campaignlanguages", values)
          }
          className="mb-6"
          loading={loadingLanguages}
        >
          {languages.map(({ id, name }) => (
            <Option key={id} value={id}>
              {name}
            </Option>
          ))}
        </Select>
      </div>
      {errors.campaignlanguages && (
        <div className="text-red-500 text-sm mb-4 mt-2">
          Please select at least one language
        </div>
      )}

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
          className="bg-[#121A3F] text-white cursor-pointer px-8 py-3 rounded-full hover:bg-[#0D132D] disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default CampaignStep2;
