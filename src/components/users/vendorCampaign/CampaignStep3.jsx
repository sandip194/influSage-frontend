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

    // Handle milestones if present
    const initialMilestones = Array.isArray(data.milestones)
      ? data.milestones.map((m) => ({
        description: m.description || "",
        amount: m.amount || 0,
        enddate: m.enddate ? dayjs(m.enddate, "DD-MM-YYYY") : null,
      }))
      : [
        {
          description: "",
          amount: 0,
          enddate: null,
        },
      ];

    setFormData({
      title: data.name || "",
      description: data.description || "",
      hashtags: Array.isArray(data.hashtags)
        ? data.hashtags.map((tag) => tag.hashtag)
        : [],
      budgetType: data.budgetType || "Fixed Price",
      budgetAmount: data.estimatedbudget || "",
      currency: data.currency || "₹",
      startDate: data.startdate ? dayjs(data.startdate, "DD-MM-YYYY") : null,
      endDate: data.enddate ? dayjs(data.enddate, "DD-MM-YYYY") : null,
      applicationstartdate: data.applicationstartdate
        ? dayjs(data.applicationstartdate, "DD-MM-YYYY")
        : null,
      applicationenddate: data.applicationenddate
        ? dayjs(data.applicationenddate, "DD-MM-YYYY")
        : null,

      aboutBrand: data.branddetail || "",
      profileImageUrl: imageUrl,
      milestones: initialMilestones,
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
      setProfileError(
        "Only JPG, JPEG, or WEBP files are allowed. PNG is not allowed."
      );
      setProfileImage(null);
      setPreview(formData.profileImageUrl || null);
      return;
    }

    setProfileError("");
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleMilestoneChange = (index, field, value) => {
    const updated = [...formData.milestones];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, milestones: updated }));
    // Clear specific milestone error immediately on change (unified with other fields)
    setErrors((prev) => {
      const newMilestonesErrors = [...(prev.milestones || [])];
      newMilestonesErrors[index] = { ...newMilestonesErrors[index], [field]: false };
      return { ...prev, milestones: newMilestonesErrors };
    });
  };

  const validateFields = (formData, profileImage) => {
    return {
      title: !formData.title?.trim(),
      description: !formData.description?.trim(),
      budgetAmount: !formData.budgetAmount || Number(formData.budgetAmount) <= 0,
      applicationstartdate: !formData.applicationstartdate,
      applicationenddate:
        !formData.applicationenddate ||
        (formData.applicationstartdate &&
          dayjs(formData.applicationenddate).isBefore(dayjs(formData.applicationstartdate))) ||
        (formData.startDate &&
          dayjs(formData.applicationenddate).isAfter(dayjs(formData.startDate))),

      startDate:
        !formData.startDate ||
        (formData.applicationenddate &&
          !dayjs(formData.startDate).isAfter(dayjs(formData.applicationenddate))),

      endDate:
        !formData.endDate ||
        (formData.startDate &&
          dayjs(formData.endDate).isBefore(dayjs(formData.startDate))),
      aboutBrand: !formData.aboutBrand?.trim(),
      profileImage: !profileImage && !formData.profileImageUrl,
    };
  };


  const validateMilestones = (milestones = [], campaignStart, campaignEnd) => {
    return milestones.map((m, index) => {
      const errors = {
        description: !m.description?.trim(),
        amount: !m.amount || Number(m.amount) <= 0,
        enddate: !m.enddate,
      };

      if (m.enddate && campaignStart && campaignEnd) {
        const isBeforeStart = m.enddate.isBefore(campaignStart, "day");
        const isAfterEnd = m.enddate.isAfter(campaignEnd, "day");

        const prev = milestones[index - 1];
        const isBeforePrev = prev?.enddate && m.enddate.isBefore(prev.enddate, "day");

        if (isBeforeStart || isAfterEnd || isBeforePrev) {
          errors.enddate = true;
        }
      }

      return errors;
    });
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
      photopath: profileImage
        ? null
        : formData.profileImageUrl?.replace(`${BASE_URL}/`, "") || null,
      milestones: formData.milestones?.map(m => ({
        description: m.description,
        amount: Number(m.amount),
        enddate: m.enddate?.format("DD-MM-YYYY") || null,
      })),
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
    const fieldErrors = validateFields(formData, profileImage);
    const milestoneErrors = validateMilestones(formData.milestones, formData.startDate, formData.endDate);

    const hasFieldErrors = Object.values(fieldErrors).some((val) => !!val);
    const hasMilestoneErrors = milestoneErrors.some((m) =>
      Object.values(m).some(Boolean)
    );

    if (hasFieldErrors || hasMilestoneErrors) {
      setErrors({ ...fieldErrors, milestones: milestoneErrors });
      return;
    }

    const totalMilestoneAmount = formData.milestones.reduce(
      (sum, m) => sum + Number(m.amount || 0),
      0
    );

    if (totalMilestoneAmount > Number(formData.budgetAmount)) {
      toast.error("Total milestone amounts cannot exceed the campaign budget");
      return;
    }

    const payload = buildPayload(formData, profileImage);

    try {
      setLoading(true);
      const fd = buildFormData(payload, profileImage);
      await axios.post("/vendor/update-campaign", fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onNext();
    } catch (err) {
      console.error("❌ API Error:", err.response?.data || err.message);
      toast.error("Failed to save campaign step. Try again.");
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
        <p className="text-red-500 text-sm mt-2">
          Please upload a campaign photo
        </p>
      )}
      {profileError && (
        <p className="text-red-500 text-sm mb-3">{profileError}</p>
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

      {/* Proposal Breakdown */}
      <hr className="my-4 border-gray-200" />
      <label className="font-semibold block mb-2">Proposal Breakdown</label>
      <p className="text-sm mb-3 text-gray-500">
        Suggest a milestone schedule for your client
      </p>

      {formData.milestones?.map((milestone, index) => (
        <div key={index} className="mb-6">
          <label className="font-semibold block mb-2">Milestone {index + 1} <span className="text-red-500">*</span></label>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Description */}
            <div className="md:col-span-4">
              <Input
                size="large"
                placeholder="Description"
                value={milestone.description}
                onChange={(e) => handleMilestoneChange(index, "description", e.target.value)}
              />
              {errors.milestones?.[index]?.description && (
                <p className="text-red-500 text-sm mt-1">Description is required</p>
              )}
            </div>

            {/* Amount */}
            <div className="md:col-span-3">
              <Input
                size="large"
                type="number"
                addonBefore="₹"
                min={0}
                placeholder={`Enter amount for milestone ${index + 1}`}
                value={milestone.amount}
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Number(e.target.value);
                  handleMilestoneChange(index, "amount", val);
                }}
              />
              {errors.milestones?.[index]?.amount && (
                <p className="text-red-500 text-sm mt-1">Amount must be greater than 0</p>
              )}
            </div>

            {/* Due Date */}
            <div className="md:col-span-4">
              <DatePicker
                size="large"
                format="DD-MM-YYYY"
                style={{ width: "100%" }}
                placeholder="Due Date"
                value={milestone.enddate}
                disabledDate={(current) => {
                  const campaignStart = formData.startDate;
                  const campaignEnd = formData.endDate;
                  const prevMilestone = formData.milestones[index - 1];

                  if (!campaignStart || !campaignEnd) return current < dayjs().startOf("day");

                  const isBeforeCampaignStart = current.isBefore(campaignStart, "day");
                  const isAfterCampaignEnd = current.isAfter(campaignEnd, "day");
                  const isBeforePrevMilestone =
                    prevMilestone?.enddate &&
                    current.isBefore(prevMilestone.enddate, "day");

                  return (
                    current < dayjs().startOf("day") ||
                    isBeforeCampaignStart ||
                    isAfterCampaignEnd ||
                    isBeforePrevMilestone
                  );
                }}
                onChange={(date) => handleMilestoneChange(index, "enddate", date)}
              />
              {errors.milestones?.[index]?.enddate && (
                <p className="text-red-500 text-sm mt-1">Due Date is required and must be valid</p>
              )}
            </div>

            {/* Remove Button */}
            {index !== 0 && (
              <div className="md:col-span-1 flex md:justify-center">
                <button
                  type="button"
                  className="text-red-500 p-2 bg-gray-100 rounded-full cursor-pointer hover:text-red-700"
                  onClick={() => {
                    const updated = [...formData.milestones];
                    updated.splice(index, 1);
                    setFormData((prev) => ({ ...prev, milestones: updated }));
                    // Clear errors for removed milestone
                    setErrors((prev) => {
                      const newMilestonesErrors = prev.milestones?.filter((_, i) => i !== index) || [];
                      return { ...prev, milestones: newMilestonesErrors };
                    });
                  }}
                >
                  <RiDeleteBin6Line size={18} className="text-red-500 hover:text-red-700" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}


      {/* Add Milestone Button */}
      <button
        type="button"
        onClick={() => {
          const last = formData.milestones[formData.milestones.length - 1];
          const isIncomplete =
            !last.description?.trim() || !last.amount || !last.amount > 0 || !last.enddate;

          if (isIncomplete) {
            toast.warning(
              "Please complete the current milestone before adding a new one."
            );
            return;
          }

          setFormData((prev) => ({
            ...prev,
            milestones: [
              ...prev.milestones,
              { description: "", amount: 0, enddate: null },
            ],
          }));
        }}
        className="text-blue-600 text-sm hover:underline mt-2"
      >
        + Add Milestone
      </button>


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
