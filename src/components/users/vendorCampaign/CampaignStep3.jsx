import React, { useState, useRef, useEffect } from "react";
import { Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import api from "../../../api/axios";import { useSelector } from "react-redux";
import {
  RiImageAddLine,
  RiInformationLine,
} from "react-icons/ri";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"; // ✅ Add this
import { toast } from "react-toastify";

const { TextArea } = Input;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter); // ✅ Extend dayjs with the plugin

const FIELD_ORDER = [
  "profileImage",
  "title",
  "description",
  "hashtags",
  "applicationstartdate",
  "applicationenddate",
  "startDate",
  "endDate",
  "budgetAmount",
  "aboutBrand",
];


const CampaignStep3 = ({ data = {}, onNext, onBack, campaignId }) => {
  const token = useSelector((state) => state.auth.token);

  const [appEndPickerMonth, setAppEndPickerMonth] = useState(undefined);
  const [campStartPickerMonth, setCampStartPickerMonth] = useState(undefined);
  const [campEndPickerMonth, setCampEndPickerMonth] = useState(undefined);


  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();
  const fieldRefs = useRef({});

  const scrollToFirstError = (errors) => {
    const firstErrorKey = FIELD_ORDER.find((key) => errors[key]);
    if (!firstErrorKey) return;

    const el = fieldRefs.current[firstErrorKey];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

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
    const MAX_SIZE = 5 * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) {
      setProfileError("Only JPG, JPEG, or WEBP files are allowed. PNG is not allowed.");
      setProfileImage(null);
      setPreview(formData.profileImageUrl || null);
      return;
    }

    if (file.size > MAX_SIZE) {
      setProfileError("Image size must be 5 MB or less.");
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
      budgetAmount: budgetAmount <= 0 ||
        String(budgetAmount).length > 7,
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
      campaignstartdate: formData.startDate?.format("DD-MM-YYYY") || null,
      campaignenddate: formData.endDate?.format("DD-MM-YYYY") || null,
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
      scrollToFirstError(fieldErrors);
      // toast.error("Please fill all required fields before continuing."); 
      return;
    }

    const payload = buildPayload(sanitizedFormData, profileImage);
    try {
      setLoading(true);
      const fd = buildFormData(payload, profileImage);
      if (campaignId) fd.append("campaignId", campaignId);

      const res = await api.post("/vendor/update-campaign", fd, {
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
      <div
        className="p-[10px] relative rounded-full w-36 h-36 border-2 border-dashed border-[#c8c9cb] my-6"
        ref={(el) => (fieldRefs.current.profileImage = el)} tabIndex={-1}
      >
        <div className="relative m-auto w-30 h-30 rounded-full overflow-hidden bg-[#0D132D0D] hover:opacity-90 cursor-pointer border border-gray-100 group">
          {preview ? (
            <img
              src={preview}
              alt="Profile preview"
              onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
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
      <div ref={(el) => (fieldRefs.current.title = el)} tabIndex={-1}>

        <label className="font-semibold block mb-2">
          Campaign Title <span className="text-red-500">*</span>
        </label>
        <Input
          size="large"
          placeholder="Enter Campaign Title"
          value={formData.title}
          maxLength={100}
          onChange={(e) => {
            let value = e.target.value.trimStart(); // remove leading spaces

            // Allow only letters, numbers, spaces, hyphens, underscores
            value = value.replace(/[^a-zA-Z0-9\s-_]/g, "");

            // Hard limit
            if (value.length > 100) return;

            setFormData(prev => ({ ...prev, title: value }));
            setErrors(prev => ({ ...prev, title: "" }));
          }}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">Please enter a title</p>
        )}
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Description */}
      <div ref={(el) => (fieldRefs.current.description = el)} tabIndex={-1} className="mb-6">

        <label className="font-semibold block mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <TextArea
          size="large"
          rows={4}
          showCount
          maxLength={500}
          placeholder="Enter Campaign Description"
          value={formData.description}
          onChange={(e) => {
            const value = e.target.value;

            if (value.length > 500) return;

            setFormData(prev => ({ ...prev, description: value }));
            setErrors(prev => ({ ...prev, description: "" }));
          }}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">Please enter a description</p>
        )}

      </div>


      <hr className="my-4 border-gray-200" />

      {/* Hashtags */}
      <div ref={(el) => (fieldRefs.current.hashtags = el)} tabIndex={-1}>
        <label className="font-semibold block mb-2">Hashtags <span className="text-red-500">*</span></label>
        <Select
          mode="tags"
          style={{ width: "100%" }}
          size="large"
          placeholder="Search Hashtags"
          value={formData.hashtags}
          onChange={(value) => {
            // Split any entries that contain spaces
            const processed = value.flatMap((tag) =>
              tag.includes(" ") ? tag.split(" ").filter(Boolean) : tag
            );

            // Remove duplicates
            const uniqueTags = Array.from(new Set(processed));

            handleChange("hashtags", uniqueTags);
          }}
        />

        {errors.hashtags && (
          <p className="text-red-500 text-sm mt-1">Please enter hashtages</p>
        )}

      </div>

      <hr className="my-4 border-gray-200" />

      {/* Application Duration (Application start and End Date) */}
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
        <div
          className="w-full"
          ref={(el) => (fieldRefs.current.applicationstartdate = el)} tabIndex={-1}
        >
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
            onChange={(date) => {
              handleChange("applicationstartdate", date);

              // ✅ NEW (does not affect disable logic)
              if (date) {
                setAppEndPickerMonth(date);
              }
            }}
          />
          {errors.applicationstartdate && (
            <p className="text-red-500 text-sm mt-1">Please select an application start date</p>
          )}
        </div>

        {/* Application End Date */}
        <div
          className="w-full"
          ref={(el) => (fieldRefs.current.applicationenddate = el)} tabIndex={-1}
        >
          <DatePicker
            size="large"
            style={{ width: "100%" }}
            format="DD-MM-YYYY"
            placeholder="Application End Date"
            value={formData.applicationenddate}
            {...(dayjs.isDayjs(appEndPickerMonth) && {
              pickerValue: appEndPickerMonth,
              onPanelChange: (value) => setAppEndPickerMonth(value),
            })}
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
            onChange={(date) => {
              handleChange("applicationenddate", date);

              // ✅ NEW
              if (date) {
                setCampStartPickerMonth(date);
              }
            }}
          />
          {errors.applicationenddate && (
            <p className="text-red-500 text-sm mt-1">Please select a valid application end date</p>
          )}
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Campaign Duration (Campaign start and End Date) */}
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
        <div
          className="w-full"
          ref={(el) => (fieldRefs.current.startDate = el)} tabIndex={-1}
        >
          <DatePicker
            size="large"
            style={{ width: "100%" }}
            format="DD-MM-YYYY"
            placeholder="Start Date"
            value={formData.startDate}
            {...(dayjs.isDayjs(campStartPickerMonth) && {
              pickerValue: campStartPickerMonth,
              onPanelChange: (value) => setCampStartPickerMonth(value),
            })}
            disabledDate={(current) => {
              if (!current) return false;
              const today = dayjs().startOf("day");
              const appEnd = formData.applicationenddate;
              if (current.isBefore(today)) return true;
              if (appEnd && !current.isAfter(appEnd, "day")) return true;
              return false;
            }}
            onChange={(date) => {
              handleChange("startDate", date);

              // ✅ NEW
              if (date) {
                setCampEndPickerMonth(date);
              }
            }}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">Please select a valid campaign start date</p>
          )}
        </div>

        {/* Campaign End Date */}
        <div
          className="w-full"
          ref={(el) => (fieldRefs.current.endDate = el)} tabIndex={-1}
        >
          <DatePicker
            size="large"
            style={{ width: "100%" }}
            format="DD-MM-YYYY"
            placeholder="End Date"
            value={formData.endDate}
            {...(dayjs.isDayjs(campEndPickerMonth) && {
              pickerValue: campEndPickerMonth,
              onPanelChange: (value) => setCampEndPickerMonth(value),
            })}
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
      <div ref={(el) => (fieldRefs.current.budgetAmount = el)} tabIndex={-1}>
        <label className="font-semibold block mb-2">
          Budget <span>(Approx Price)</span> <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4 mb-1">
          <Input
            size="large"
            type="number"
            min={1}
            placeholder="0.00"
            value={formData.budgetAmount}
            prefix={formData.currency}
            onChange={(e) => {
              const value = e.target.value;

              // Allow only digits
              if (!/^\d*$/.test(value)) return;

              // Max 7 digits
              if (value.length > 7) {
                setErrors((prev) => ({
                  ...prev,
                  budgetAmount: "Budget cannot exceed 7 digits."
                }));
                return;
              }

              handleChange("budgetAmount", value);

              if (!value || Number(value) <= 0) {
                setErrors((prev) => ({
                  ...prev,
                  budgetAmount: "Budget is required and must be greater than 0 and cannot exceed 7 digits.",
                }));
              } else {
                setErrors((prev) => ({
                  ...prev,
                  budgetAmount: "",
                }));
              }
            }}

          />

        </div>
        {errors.budgetAmount && (
          <p className="text-red-500 text-sm mt-1">Budget is required and must be greater than 0 and cannot exceed 7 digits.</p>
        )}

      </div>

      <hr className="my-4 border-gray-200" />

      {/* About Brand */}
      <div ref={(el) => (fieldRefs.current.budgetAmount = el)} tabIndex={-1}>
        <label className="font-semibold block mb-2">
          About Brand <span className="text-red-500">*</span>
        </label>
        <TextArea
          size="large"
          rows={3}
          showCount
          maxLength={250}
          placeholder="About Brand"
          value={formData.aboutBrand}
          onChange={(e) => {
            const value = e.target.value;

            if (value.length > 250) return;

            setFormData(prev => ({ ...prev, aboutBrand: value }));
            setErrors(prev => ({ ...prev, aboutBrand: "" }));
          }}
        />
        {errors.aboutBrand && (
          <p className="text-red-500 text-sm mt-1">Please describe your brand</p>
        )}
      </div>


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