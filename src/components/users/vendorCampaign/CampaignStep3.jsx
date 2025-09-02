import React, { useState, useRef, useEffect } from "react";
import { Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { useSelector } from "react-redux";
import { RiImageAddLine } from "react-icons/ri";

const { TextArea } = Input;
const { Option } = Select;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CampaignStep3 = ({ data = {}, onNext, onBack }) => {
  const token = useSelector((state) => state.auth.token);

  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();

  useEffect(() => {
    if (!data) return;

    // Prefer p_campaignfilejson > photopath
    const photoPath =
      data.p_campaignfilejson?.[0]?.filepath || data.photopath || null;

    const imageUrl = photoPath
      ? `${BASE_URL}/${photoPath.replace(/^\/+/, "")}`
      : null;

    setFormData({
      title: data.name || "",
      description: data.description || "",
      hashtags: Array.isArray(data.hashtags)
        ? data.hashtags.map((tag) => tag.hashtag)
        : [],
      budgetType: data.budgetType || "Fixed Price",
      budgetAmount: data.estimatedbudget || "",
      currency: data.currency || "₹",
      startDate: data.startdate ? dayjs(data.startdate) : null,
      endDate: data.enddate ? dayjs(data.enddate) : null,
      aboutBrand: data.branddetail || "",
      profileImageUrl: imageUrl,
    });

    setPreview(imageUrl);
  }, [data, BASE_URL]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setProfileError("Only JPG, JPEG, or WEBP files are allowed. PNG is not allowed.");
      setProfileImage(null);
      setPreview(formData.profileImageUrl || null);
      return;
    }

    setProfileError("");
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
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
  if (Object.values(newErrors).some((e) => e)) return;

  const payload = {
    name: formData.title,
    description: formData.description,
    estimatedbudget: parseFloat(formData.budgetAmount),
    startdate: formData.startDate ? formData.startDate.format("YYYY-MM-DD") : null,
    enddate: formData.endDate ? formData.endDate.format("YYYY-MM-DD") : null,
    branddetail: formData.aboutBrand,
    hashtags: formData.hashtags.map((tag) => ({ hashtag: tag })),

    photopath: profileImage
      ? null 
      : formData.profileImageUrl?.replace(`${BASE_URL}/`, "") || null,
  };

  try {
    setLoading(true);

    const fd = new FormData();
    fd.append("p_campaignjson", JSON.stringify(payload));

    if (profileImage) {
      fd.append("photo", profileImage);
    }

    await axios.post("/vendor/create-campaign", fd, {
      headers: { Authorization: `Bearer ${token}` },
    });

    onNext();
  } catch (err) {
    console.error("❌ API Error:", err.response?.data || err.message);
    alert("Failed to save campaign step. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-white p-6 rounded-2xl">
      {/* Profile Image Upload */}
      <div className="p-[10px] relative rounded-full w-36 h-36 border-2 border-dashed border-[#c8c9cb] my-6">
        <div className="relative m-auto w-30 h-30 rounded-full overflow-hidden bg-[#0D132D0D] hover:opacity-90 cursor-pointer border border-gray-100 group">
          {preview ? (
            <img
              src={preview}
              alt="Profile preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-800 opacity-50">
              <RiImageAddLine className="w-8 h-8" />
            </div>
          )}
          <input
            type="file"
            accept=".jpg,.jpeg,.webp"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
      {profileError && <p className="text-red-500 text-sm mb-3">{profileError}</p>}

      {/* Campaign Title */}
      <label className="font-semibold block mb-2">Campaign Title</label>
      <Input
        size="large"
        placeholder="Enter Campaign Title"
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
      />
      {errors.title && <p className="text-red-500 text-sm mt-1">Please enter a title</p>}

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
        <p className="text-red-500 text-sm mt-1">Please enter a description</p>
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
        <p className="text-red-500 text-sm mt-1">Please enter a budget amount</p>
      )}

      <hr className="my-4 border-gray-200" />

      {/* Duration */}
      <label className="font-semibold block mb-2">Duration</label>
      <div className="flex gap-4 mb-2">
        <DatePicker
          size="large"
          style={{ width: "100%" }}
          format="DD/MM/YYYY"
          placeholder="Start Date"
          value={formData.startDate}
          disabledDate={(current) => current && current < dayjs().startOf("day")}
          onChange={(date) => handleChange("startDate", date)}
        />
        <DatePicker
          size="large"
          style={{ width: "100%" }}
          format="DD/MM/YYYY"
          placeholder="End Date"
          value={formData.endDate}
          disabledDate={(current) =>
            current &&
            (current < dayjs().startOf("day") ||
              (formData.startDate &&
                current < dayjs(formData.startDate).startOf("day")))}
          onChange={(date) => handleChange("endDate", date)}
        />
      </div>
      {errors.startDate && (
        <p className="text-red-500 text-sm mt-1">Please select a start date</p>
      )}
      {errors.endDate && (
        <p className="text-red-500 text-sm mt-1">Please select a valid end date</p>
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
        <p className="text-red-500 text-sm mt-1">Please describe your brand</p>
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
          className="bg-[#121A3F] text-white cursor-pointer px-8 py-3 rounded-full hover:bg-[#0D132D] disabled:opacity-60"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default CampaignStep3;
