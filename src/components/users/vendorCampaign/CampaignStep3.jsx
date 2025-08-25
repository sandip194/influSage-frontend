import React, { useState } from "react";
import { Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import axios from "axios";

const { TextArea } = Input;
const { Option } = Select;

const CampaignStep3 = ({ data = {}, onNext, onBack, userId }) => {
  const [formData, setFormData] = useState({
    title: data.title || "",
    description: data.description || "",
    hashtags: data.hashtags || [],
    budgetType: data.budgetType || "Fixed Price",
    budgetAmount: data.budgetAmount || "",
    currency: data.currency || "₹",
    startDate: data.startDate ? dayjs(data.startDate) : null,  
  endDate: data.endDate ? dayjs(data.endDate) : null,        
    aboutBrand: data.aboutBrand || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleContinue = async () => {
    const newErrors = {
      title: !formData.title,
      description: !formData.description,
      budgetAmount: !formData.budgetAmount,
      startDate: !formData.startDate,
      endDate:
        !formData.endDate ||
        (formData.startDate &&
          dayjs(formData.endDate).isBefore(dayjs(formData.startDate))),
      aboutBrand: !formData.aboutBrand,
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((e) => e);
    if (hasErrors) return;

   const payload = {
    campaignjson: {
        ...formData,
        startDate: formData.startDate ? formData.startDate.format("YYYY-MM-DD") : null,
        endDate: formData.endDate ? formData.endDate.format("YYYY-MM-DD") : null,
    },
    };
        
    try {
      setLoading(true);

       const token = localStorage.getItem("token");

      const res = await axios.post("/vendor/create-campaign", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Step 3 Saved:", res.data);
      onNext(payload.campaignjson);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      alert("Failed to save campaign step. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl">
      {/* Campaign Title */}
      <label className="font-semibold block mb-2">Campaign Title</label>
      <Input
        size="large"
        placeholder="Enter Campaign Title"
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
      />
      {errors.title && (
        <p className="text-red-500 text-sm mt-1">Please enter a title</p>
      )}

      <hr className="my-4 border-gray-200" />

      {/* Description */}
      <label className="font-semibold block mb-2">Description</label>
      <TextArea
        size="large"
        rows={4}
        placeholder="Enter Campaign Description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />
      {errors.description && (
        <p className="text-red-500 text-sm mt-1">
          Please enter a description
        </p>
      )}

      <hr className="my-4 border-gray-200" />

      {/* Hashtags */}
      <label className="font-semibold block mb-2">Hashtags</label>
      <Select
        mode="tags"
        style={{ width: "100%" }}
        size="large"
        placeholder="Search Hashtags"
        value={formData.hashtags}
        onChange={(value) => handleChange("hashtags", value)}
      />

      <hr className="my-4 border-gray-200" />

      {/* Budget */}
      <label className="font-semibold block mb-2">
        Budget <span>(Approx Price)</span>
      </label>
      <div className="flex gap-4 mb-1">
        <Input
          size="large"
          type="number"
          placeholder="0.00"
          value={formData.budgetAmount}
          onChange={(e) => handleChange("budgetAmount", e.target.value)}
        />
        <span>{formData.currency}</span>
      </div>
      {errors.budgetAmount && (
        <p className="text-red-500 text-sm mt-1">
          Please enter a budget amount
        </p>
      )}

      <hr className="my-4 border-gray-200" />

      {/* Duration */}
      <label className="font-semibold block mb-2">Duration</label>
      <div className="flex gap-4 mb-2">
        {/* Start Date */}
        <DatePicker
          size="large"
          style={{ width: "100%" }}
          format="DD/MM/YYYY"
          placeholder="Start Date"
          value={formData.startDate ? dayjs(formData.startDate) : null}
          disabledDate={(current) =>
            current && current < dayjs().startOf("day")
          }
          onChange={(date) => handleChange("startDate", date)}
        />

        {/* End Date */}
        <DatePicker
          size="large"
          style={{ width: "100%" }}
          format="DD/MM/YYYY"
          placeholder="End Date"
          value={formData.endDate ? dayjs(formData.endDate) : null}
          disabledDate={(current) =>
            current &&
            (current < dayjs().startOf("day") ||
              (formData.startDate &&
                current < dayjs(formData.startDate).startOf("day")))
          }
          onChange={(date) => handleChange("endDate", date)}
        />
      </div>
      {errors.startDate && (
        <p className="text-red-500 text-sm mt-1">
          Please select a start date
        </p>
      )}
      {errors.endDate && (
        <p className="text-red-500 text-sm mt-1">
          Please select a valid end date
        </p>
      )}

      <hr className="my-4 border-gray-200" />

      {/* About Brand */}
      <label className="font-semibold block mb-2">About Brand</label>
      <TextArea
        size="large"
        rows={3}
        placeholder="About Brand"
        value={formData.aboutBrand}
        onChange={(e) => handleChange("aboutBrand", e.target.value)}
      />
      {errors.aboutBrand && (
        <p className="text-red-500 text-sm mt-1">
          Please describe your brand
        </p>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={onBack}
          className="bg-white cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={loading}
          className="bg-[#121A3F] text-white cursor-pointer inset-shadow-sm inset-shadow-gray-500 px-8 py-3 rounded-full hover:bg-[#0D132D] disabled:opacity-60"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default CampaignStep3;
