import React, { useState, useRef, useEffect } from "react";
import { Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  RiImageAddLine,
  RiInformationLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"; // ✅ Add this
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Option } = Select;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter); // ✅ Extend dayjs with the plugin

const CampaignStep3 = ({ data = {}, onNext, onBack, campaignId }) => {
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

    const photoPath =
      data.p_campaignfilejson?.[0]?.filepath || data.photopath || null;

    const imageUrl = photoPath
      ? photoPath
      : null;

    // ✅ Ensure budget is number, not string
    setFormData({
      title: data.name || "",
      description: data.description || "",
      hashtags: Array.isArray(data.hashtags)
        ? data.hashtags.map((tag) => tag.hashtag)
        : [],
      budgetType: data.budgetType || "Fixed Price",
      budgetAmount: Number(data.estimatedbudget) || "", // ✅ Fix here
      currency: data.currency || "₹",
      startDate: data.campaignstartdate ? dayjs(data.campaignstartdate, "DD-MM-YYYY") : null,
      endDate: data.campaignenddate ? dayjs(data.campaignenddate, "DD-MM-YYYY") : null,
      applicationstartdate: data.applicationstartdate
        ? dayjs(data.applicationstartdate, "DD-MM-YYYY")
        : null,
      applicationenddate: data.applicationenddate
        ? dayjs(data.applicationenddate, "DD-MM-YYYY")
        : null,
      aboutBrand: data.branddetail || "",
      profileImageUrl: imageUrl,
    });

    setPreview(imageUrl);
  }, [data, BASE_URL]);

  const handleChange = (field, value) => {
    let newValue = value;

    // If the field is "title", sanitize the input
    if (field === "title") {
      // Allow only letters, numbers, spaces, hyphens, and underscores
      newValue = value.replace(/[^a-zA-Z0-9\s-_]/g, "");
    }

    setFormData((prev) => ({ ...prev, [field]: newValue }));
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
    setErrors(prev => ({ ...prev, profileImage: false }));

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };


  const validateFields = (formData, profileImage) => {
    const budgetAmount = Number(formData.budgetAmount) || 0;

    const errors = {
      title: !formData.title?.trim(),
      description: !formData.description?.trim(),
      budgetAmount: budgetAmount <= 0,
      applicationstartdate: !formData.applicationstartdate,
      applicationenddate:
        !formData.applicationenddate ||
        (formData.applicationstartdate &&
          dayjs(formData.applicationenddate).isBefore(dayjs(formData.applicationstartdate))) ||
        (formData.startDate &&
          dayjs(formData.applicationenddate).isAfter(dayjs(formData.startDate))),

      aboutBrand: !formData.aboutBrand?.trim(),
      profileImage: !profileImage && !formData.profileImageUrl,
      hashtags: !Array.isArray(formData.hashtags) || formData.hashtags.length === 0,

      // ⭐ NEW VALIDATION
      startDate: !formData.startDate,
      endDate:
        !formData.endDate ||
        (formData.startDate &&
          dayjs(formData.endDate).isBefore(dayjs(formData.startDate))),
    };

    return errors;
  };


  const buildPayload = (formData, profileImage) => {
    return {
      name: formData.title,
      description: formData.description,
      estimatedbudget: parseFloat(formData.budgetAmount),
      startdate: formData.startDate?.format("DD-MM-YYYY") || null,
      enddate: formData.endDate?.format("DD-MM-YYYY") || null,
      applicationstartdate: formData.applicationstartdate?.format("DD-MM-YYYY") || null,
      applicationenddate: formData.applicationenddate?.format("DD-MM-YYYY") || null,
      branddetail: formData.aboutBrand,
      hashtags: formData.hashtags.map(tag => ({ hashtag: tag })),
      profileImage: !profileImage && !formData.profileImageUrl,
      photopath: profileImage
        ? null
        : formData.profileImageUrl,
    };
  };

  const buildFormData = (payload, profileImage) => {
    const fd = new FormData();
    fd.append("p_campaignjson", JSON.stringify(payload));

    if (profileImage) {
      fd.append("photo", profileImage);
    }

    return fd;
  };

  const handleContinue = async () => {
    const sanitizedFormData = {
      ...formData,
      title: formData.title.trim(),
    };

    const fieldErrors = validateFields(sanitizedFormData, profileImage);

    const hasFieldErrors = Object.values(fieldErrors).some(Boolean);

    if (hasFieldErrors) {
      setErrors({ ...fieldErrors });
      // toast.error("Please fill all required fields before continuing."); 
      return;
    }

    const payload = buildPayload(sanitizedFormData, profileImage);
    try {
      setLoading(true);
      const fd = buildFormData(payload, profileImage);
      if (campaignId) fd.append("campaignId", campaignId);

      const res = await axios.post("/vendor/update-campaign", fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.message?.toLowerCase().includes("title already exists")) {
        setErrors((prev) => ({
          ...prev,
          title: "Campaign title already exists",
        }));
        toast.error("Campaign title already exists.");
        return;
      }

      onNext();
    } catch (err) {
      console.error("❌ API Error:", err.response?.data || err.message);
      const msg = err.response?.data?.message;

      if (msg && msg.toLowerCase().includes("title already exists")) {
        setErrors((prev) => ({
          ...prev,
          title: "Campaign title already exists",
        }));
        toast.error("Campaign title already exists.");
      } else {
        toast.error("Failed to save campaign step. Try again.");
      }
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
      {errors.profileImage && (
        <p className="text-red-500 text-sm mt-1">Please upload a campaign image</p>
      )}
      {profileError && (
        <p className="text-red-500 text-sm mt-1">{profileError}</p>
      )}

      {/* Campaign Title */}
      <label className="font-semibold block mb-2">
        Campaign Title <span className="text-red-500">*</span>
      </label>
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
      <label className="font-semibold block mb-2">
        Description <span className="text-red-500">*</span>
      </label>
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
      <label className="font-semibold block mb-2">Hashtags <span className="text-red-500">*</span></label>
      <Select
        mode="tags"
        style={{ width: "100%" }}
        size="large"
        placeholder="Search Hashtags"
        value={formData.hashtags}
        onChange={(value) => handleChange("hashtags", value)}
      />
      {errors.hashtags && (
        <p className="text-red-500 text-sm mt-1">Please enter hashtages</p>
      )}

      <hr className="my-4 border-gray-200" />

      <label className="font-semibold block mb-2 flex items-center gap-2 mt-6">
        Application Duration <span className="text-red-500">*</span>
        <div className="relative group">
          <RiInformationLine className="text-blue-600 cursor-pointer" size={18} />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-72 bg-gray-900 text-white text-xs rounded px-2 py-1 z-10">
            Application Start and End Dates define when influencers can apply. These must be before the campaign start date and cannot be in the past.
          </div>
        </div>
      </label>

      <div className="flex gap-4">
        {/* Application Start Date */}
        <div className="w-full">
          <DatePicker
            size="large"
            style={{ width: "100%" }}
            format="DD-MM-YYYY"
            placeholder="Application Start Date"
            value={formData.applicationstartdate}
            disabledDate={(current) => {
              const today = dayjs().startOf("day");
              const campaignStart = formData.startDate;
              if (!current) return false;
              const currentDay = dayjs(current);
              if (campaignStart) {
                return currentDay.isBefore(today) || currentDay.isAfter(campaignStart, "day");
              }
              return currentDay.isBefore(today);
            }}
            onChange={(date) => handleChange("applicationstartdate", date)}
          />
          {errors.applicationstartdate && (
            <p className="text-red-500 text-sm mt-1">Please select an application start date</p>
          )}
        </div>

        {/* Application End Date */}
        <div className="w-full">
          <DatePicker
            size="large"
            style={{ width: "100%" }}
            format="DD-MM-YYYY"
            placeholder="Application End Date"
            value={formData.applicationenddate}
            disabledDate={(current) => {
              const today = dayjs().startOf("day");
              const appStart = formData.applicationstartdate;
              const campaignStart = formData.startDate;
              if (!current) return false;
              const currentDay = dayjs(current);

              if (campaignStart && appStart) {
                return currentDay.isBefore(appStart, "day") || currentDay.isAfter(campaignStart, "day");
              }

              if (campaignStart) {
                return currentDay.isBefore(today) || currentDay.isAfter(campaignStart, "day");
              }

              if (appStart) {
                return currentDay.isBefore(appStart, "day");
              }

              return currentDay.isBefore(today);
            }}
            onChange={(date) => handleChange("applicationenddate", date)}
          />
          {errors.applicationenddate && (
            <p className="text-red-500 text-sm mt-1">Please select a valid application end date</p>
          )}
        </div>
      </div>

      <hr className="my-4 border-gray-200" />
      <label className="font-semibold block mb-2 flex items-center gap-2 mt-6">
        Campaign Duration <span className="text-red-500">*</span>
        <div className="relative group">
          <RiInformationLine className="text-blue-600 cursor-pointer" size={18} />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-64 bg-gray-900 text-white text-xs rounded px-2 py-1 z-10">
            Campaign Start and End Dates define when your campaign runs.
          </div>
        </div>
      </label>

      <div className="flex gap-4">
        {/* Campaign Start Date */}
        <div className="w-full">
          <DatePicker
            size="large"
            style={{ width: "100%" }}
            format="DD-MM-YYYY"
            placeholder="Start Date"
            value={formData.startDate}
            disabledDate={(current) => {
              if (!current) return false;
              const today = dayjs().startOf("day");
              const appEnd = formData.applicationenddate;
              if (current.isBefore(today)) return true;
              if (appEnd && !current.isAfter(appEnd, "day")) return true;
              return false;
            }}
            onChange={(date) => handleChange("startDate", date)}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">Please select a valid campaign start date</p>
          )}
        </div>

        {/* Campaign End Date */}
        <div className="w-full">
          <DatePicker
            size="large"
            style={{ width: "100%" }}
            format="DD-MM-YYYY"
            placeholder="End Date"
            value={formData.endDate}
            disabledDate={(current) =>
              current &&
              (current < dayjs().startOf("day") ||
                (formData.startDate &&
                  current < dayjs(formData.startDate).startOf("day")))
            }
            onChange={(date) => handleChange("endDate", date)}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">Please select a valid campaign end date</p>
          )}
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Budget */}
      <label className="font-semibold block mb-2">
        Budget <span>(Approx Price)</span>
      </label>
      <div className="flex gap-4 mb-1">
        <Input
          size="large"
          type="number"
          min={1}
          placeholder="0.00"
          value={formData.budgetAmount}
          onChange={(e) => {
            const value = e.target.value;

            // Update form data
            handleChange("budgetAmount", value);

            // Inline validation: set error if 0 or empty
            if (!value || Number(value) <= 0) {
              setErrors((prev) => ({
                ...prev,
                budgetAmount: "Budget is required and must be greater than 0",
              }));
            } else {
              setErrors((prev) => ({
                ...prev,
                budgetAmount: "",
              }));
            }
          }}
        />
        <span>{formData.currency}</span>
      </div>
      {errors.budgetAmount && (
        <p className="text-red-500 text-sm mt-1">Budget is required and must be greater than 0</p>
      )}

      <hr className="my-4 border-gray-200" />

      {/* About Brand */}
      <label className="font-semibold block mb-2">
        About Brand <span className="text-red-500">*</span>
      </label>
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