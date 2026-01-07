import React, { useEffect, useState } from 'react';
import {
  RiMenLine,
  RiMoneyRupeeCircleLine,
  RiTranslate,
  RiCheckboxBlankCircleLine,
} from '@remixicon/react';
import { Modal,  Tabs, DatePicker, Skeleton, ConfigProvider, Empty } from 'antd';
import VendorCampaignOverview from './VendorCampaignOverview';
import VendorActivity from './VendorActivity';
import VendorFilesMedia from './VendorFilesMedia';
import VendorPayment from './VendorPayment';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RiArrowLeftLine, RiCheckboxCircleFill } from "react-icons/ri";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"; // ✅ Add this
import toast from 'react-hot-toast';

import dayjs from 'dayjs';
import VendorContract from './VendorContract';
import ViewAllOffers from '../../vendor/offers/ViewAllOffers';
import VendorContentLinksTab from './VendorContentLinksTab';
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter); // ✅ Extend dayjs with the plugin


const formatFollowers = (num) => {
  if (!num) return "0";

  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }

  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }

  return num.toString();
};

const formatToDDMMYYYY = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.includes("-") ? dateStr.split("-") : [];
  // If already DD-MM-YYYY
  if (parts.length === 3 && parts[0].length === 2) {
    return `${parts[0]}/${parts[1]}/${parts[2]}`;
  }
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  const d = new Date(dateStr);
  if (isNaN(d)) return "";

  return d.toLocaleDateString("en-GB");
};

const CampaignDetails = () => {
  //  const [isModalOpen, setIsModalOpen] = useState(false);
  //  const [proposal, setProposal] = useState("");
  const [errors, setErrors] = useState({});
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelModel, setCancelModel] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false); // New state for redirecting
  const [cancelReasons, setCancelReasons] = useState([]);
  // const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
  });



  const navigate = useNavigate();
  const { campaignId } = useParams()
  const { token } = useSelector((state) => state.auth);
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [isCampaignPreviewOpen, setIsCampaignPreviewOpen] = useState(false);
  // const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getCampaignDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/vendor/singlecampaign/${campaignId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 200) {
        setCampaignDetails(res?.data?.data);
        setLoading(false); // Set loading false on success
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 403) {
          // Handle Forbidden
          toast.error(data?.message || "Unauthorized access");
          setRedirecting(true); // Set redirecting to true
          // Optional: redirect user to dashboard or another page
          setTimeout(() => {
            navigate("/vendor-dashboard/vendor-campaign");
          }, 1000);
        } else {
          console.error("API Error:", data);
          toast.error(data?.message || "Something went wrong");
          setLoading(false); // Set loading false for other errors
        }
      } else {
        console.error("Error:", error);
        toast.error("Network error. Please try again.");
        setLoading(false); // Set loading false for network errors
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    getCampaignDetails()
  }, [])

  useEffect(() => {
    const fetchCancelReasons = async () => {
      try {
        const res = await axios.get(`/vendor/reason-list`);
        setCancelReasons(res?.data?.data);
      } catch (error) {
        console.error("Error fetching cancel reasons:", error);
      }
    };

    if (isCancelModel) {
      fetchCancelReasons();
    }
  }, [isCancelModel]);

  const handleCancelComplete = async () => {
    const newErrors = {};
    if (!cancelReason) newErrors.cancelReason = "Please select a reason for cancellation.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedReason = cancelReasons.find(
      (reason) => (reason.reason_name || reason.name) === cancelReason
    );

    try {
      const payload = {
        p_campaignid: campaignDetails?.campaignid || campaignId,
        p_objectiveid: selectedReason.id,
      };

      console.log("Cancel payload:", payload);

      const res = await axios.post(
        `/vendor/cancle-campaign`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        toast.success(res.data?.message || "Campaign cancelled successfully!");
        setCancelModel(false);
        setCancelReason("");
        setErrors({});
        // getCampaignDetails();
        setTimeout(() => {
          navigate("/vendor-dashboard/vendor-campaign");
        }, 1000);
      } else {
        toast.error(res.data?.message);
      }
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error(error);
    }
  };

  const handleEditClick = () => {
    if (campaignDetails?.iseditable === true || campaignDetails?.iseditable === "Is editable") {
      navigate(`/vendor-dashboard/vendor-campaign/edit-campaign/${campaignDetails?.id}`);
    } else {
      setFormData({
        startDate: campaignDetails?.requirements?.campaignstartdate
          ? dayjs(campaignDetails.requirements.campaignstartdate, "DD-MM-YYYY")
          : null,
        endDate: campaignDetails?.requirements?.campaignenddate
          ? dayjs(campaignDetails.requirements.campaignenddate, "DD-MM-YYYY")
          : null,
      });

      setIsDateModalOpen(true);
    }
  };

  const validateDates = () => {
    const newErrors = {};

    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.startDate && formData.endDate && formData.endDate.isBefore(formData.startDate)) {
      newErrors.endDate = "End date cannot be before start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDates = async () => {
    if (!validateDates()) return;

    const payload = {
      campaignId: Number(campaignId),
      isFinalSubmit: true,
      p_campaignjson: {
        campaignstartdate: formData.startDate?.format("DD-MM-YYYY"),
        campaignenddate: formData.endDate?.format("DD-MM-YYYY"),
      }
    };

    try {
      setLoading(true);
      const res = await axios.post(`/vendor/update-campaign`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.status) {
        toast.success("Campaign dates updated successfully!");
        setIsDateModalOpen(false);
        getCampaignDetails();
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      console.error("API Error:", err);
      toast.error("Failed to update dates");
    } finally {
      setLoading(false);
    }
  };

  if (loading || redirecting) {
    return (
      <div className="w-full text-sm overflow-x-hidden space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Skeleton.Button active size="small" shape="circle" />
          <Skeleton.Input active size="small" style={{ width: 100 }} />
        </div>

        <Skeleton.Input active size="default" style={{ width: 200 }} />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side */}
          <div className="flex-1 space-y-6">
            {/* Banner Card */}
            <div className="bg-white w-full rounded-2xl overflow-hidden">
              <div className="p-6 space-y-4">
                <Skeleton.Avatar active size={64} shape="circle" />
                <Skeleton.Input active style={{ width: 200 }} size="small" />
                <Skeleton.Input active style={{ width: 150 }} size="small" />
                <div className="flex gap-4">
                  <Skeleton.Button active />
                  <Skeleton.Button active />
                </div>
                <div className="flex gap-6 flex-wrap mt-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="min-w-[120px] text-center">
                      <Skeleton.Input active size="small" style={{ width: 100 }} />
                      <Skeleton.Input active size="small" style={{ width: 80 }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description & Requirements */}
            <div className="bg-white p-6 rounded-2xl space-y-6">
              <Skeleton.Input active size="default" style={{ width: 200 }} />
              <Skeleton paragraph={{ rows: 3 }} active />

              <Skeleton.Input active size="default" style={{ width: 180 }} />
              <ul className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Skeleton.Avatar size="small" shape="circle" active />
                    <Skeleton.Input active size="small" style={{ width: 200 }} />
                  </li>
                ))}
              </ul>

              <div>
                <Skeleton.Input active size="default" style={{ width: 150 }} />
                <div className="flex gap-2 flex-wrap mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton.Button key={i} active shape="round" size="small" />
                  ))}
                </div>
              </div>

              <div>
                <Skeleton.Input active size="default" style={{ width: 220 }} />
                <div className="flex gap-4 mt-4 flex-wrap">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton.Image key={i} active style={{ width: 96, height: 96 }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <aside className="w-full md:w-[300px] space-y-6 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <Skeleton.Input active size="default" style={{ width: 160 }} />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <Skeleton.Input active size="small" style={{ width: 100 }} />
                  <Skeleton.Input active size="small" style={{ width: 200 }} />
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 space-y-4">
              <Skeleton.Input active size="default" style={{ width: 200 }} />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <Skeleton.Input active size="small" style={{ width: 180 }} />
                  <Skeleton.Input active size="small" style={{ width: 140 }} />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-sm overflow-x-hidden">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center cursor-pointer gap-2 text-gray-600 mb-2"
      >
        <RiArrowLeftLine /> Back
      </button>


      <h1 className="text-2xl font-semibold mb-4">Campaign Details</h1>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Section */}
        <div className="flex-1 space-y-4 ">
          <div className="bg-white rounded-xl p-6 border border-gray-100">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-gray-200 pb-4">

              {/* Left Section */}
              <div className="flex items-start gap-4">
                <img
                  src={campaignDetails?.photopath}
                  onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                  alt="Profile"
                  onClick={() => setIsPreviewOpen(true)}
                  className="w-16 h-16 rounded-full object-cover cursor-pointer hover:opacity-90 transition"
                />
                {isPreviewOpen && (
                  <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setIsPreviewOpen(false)}
                  >
                    <button
                      onClick={() => setIsPreviewOpen(false)}
                      className="absolute cursor-pointer top-5 right-6 text-white text-3xl font-bold hover:text-gray-300"
                    >
                      ×
                    </button>
                    <img
                      src={campaignDetails?.photopath}
                      alt="Preview"
                      onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                      className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}

                <div>
                  <h2 className="font-semibold text-lg text-gray-900">
                    {campaignDetails?.name || "Campaign Name"}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {campaignDetails?.businessname}
                  </p>
                </div>
              </div>

              {/* Right Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

                {campaignDetails?.iseditable !== "Not editable" && (
                  <button
                    onClick={handleEditClick}
                    className="bg-[#0f122f] cursor-pointer text-white px-6 py-2 rounded-full border border-[#0f122f] font-semibold hover:bg-[#1a1d4f] transition w-full sm:w-auto"
                  >
                    Edit Campaign
                  </button>
                )}

                <button
                  onClick={() => setCancelModel(true)}
                  disabled={campaignDetails?.iseditable === "Not editable"}
                  className={`px-6 py-2 rounded-full border font-semibold transition w-full sm:w-auto
          ${campaignDetails?.iseditable === "Not editable"
                      ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "border-red-400 cursor-pointer text-red-900 hover:bg-gray-50"
                    }`}
                >
                  Cancel Campaign
                </button>
                {/* {campaignDetails?.isfeedback === true && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInfluencer(null);
                      setFeedbackModal(true);
                    }}
                    className="bg-[#0f122f] text-white px-6 py-2 rounded-full border border-[#0f122f] font-semibold hover:bg-[#1a1d4f] transition w-full sm:w-auto"
                  >
                    Send Feedback
                  </button>
                )} */}
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">

              {/* Budget */}
              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <RiMoneyRupeeCircleLine className="w-5 h-5" />
                  <span>Budget</span>
                </div>
                <p className="text-[#0D132D] font-bold text-xl">
                  ₹{campaignDetails?.estimatedbudget}
                </p>
              </div>

              {/* Language */}
              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <RiTranslate className="w-5 h-5" />
                  <span>Language</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {campaignDetails?.campaignlanguages?.map((lang) => (
                    <span
                      key={lang.languageid}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg text-xs font-medium"
                    >
                      {lang.languagename}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <RiMenLine className="w-5 h-5" />
                  <span>Gender</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {campaignDetails?.campaigngenders?.map((gender) => (
                    <span
                      key={gender.genderid}
                      className="bg-pink-100 text-pink-800 px-3 py-1 rounded-lg text-xs font-medium"
                    >
                      {gender.gendername}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>


          {/* Tabs + Content */}
          <div className="bg-white p-5 rounded-2xl">

            <ConfigProvider
              theme={{
                components: {
                  Tabs: {
                    colorBgContainer: "#0f122f",        // Background for tab container
                    itemColor: "#0f122f",            // Text color for inactive tab
                    itemHoverColor: "#0f122f",       // Text color on hover
                    itemSelectedColor: "#fff",       // Text color when active
                    itemActiveColor: "#fff",         // Ensures text stays white
                    itemActiveBg: "#fff",         // ✅ Active tab background
                    itemHoverBg: "#f4f5ff",          // Hover background
                    cardBg: "#fff",                  // Card tab background
                    inkBarColor: "#0f122f",          // Underline indicator (for line type)
                    colorBorderSecondary: "#e5e7eb", // Light border color
                    colorTextDisabled: "#b0b0b0",    // Disabled tab text
                  },
                },
              }}
            >
              <Tabs type="card" defaultActiveKey="overview">
                <Tabs.TabPane tab="Overview" key="overview">
                  {campaignDetails && (
                    <VendorCampaignOverview campaignData={campaignDetails} />
                  )}
                </Tabs.TabPane>

                <Tabs.TabPane tab="Applications" key="applications">
                  {campaignDetails && (
                    <ViewAllOffers campaignData={campaignDetails} />
                  )}
                </Tabs.TabPane>

                <Tabs.TabPane tab="Contract" key="contract" disabled={!campaignDetails?.iscontracttab}>
                  <VendorContract
                    campaignStart={campaignDetails?.requirements.campaignstartdate}
                    campaignEnd={campaignDetails?.requirements.campaignenddate}
                    campaignId={campaignId}
                  />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Content Links" key="contentLinks" disabled={!campaignDetails?.iscontracttab}>
                  <VendorContentLinksTab campaignId={campaignId} />
                </Tabs.TabPane>


                <Tabs.TabPane tab="Activity" key="activity" disabled>
                  <VendorActivity />
                </Tabs.TabPane>

                {/* <Tabs.TabPane  tab="Message" key="message">
                  <VendorMessage />
                </Tabs.TabPane> */}

                <Tabs.TabPane tab="Files & Media" key="files&media" disabled>
                  <VendorFilesMedia />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Payment" key="payment" disabled>
                  <VendorPayment />
                </Tabs.TabPane>
              </Tabs>
            </ConfigProvider>

          </div>
        </div>

        {/* Right Section */}
        <div className=" w-full md:w-[350px] flex-shrink-0 flex flex-col gap-6
            [@media(min-width:768px)_and_(max-width:1024px)]:w-full
            [&>*]:w-full">
          {/* Campaign Info Card */}
          <div className="bg-white p-4 rounded-2xl">
            <h3 className="text-xl font-bold">Campaign Details</h3>

            <div className="py-4 border-b border-gray-200">
              <p className="text-sm font-bold text-gray-900">Campaign Number</p>
              <p>{campaignDetails?.branddetails?.campaignnumber}</p>
            </div>


           <div className="py-4 border-b border-gray-200">
            <p className="text-sm font-bold text-gray-900">Campaign Duration</p>
            <p className="text-gray-700 text-sm">
              {formatToDDMMYYYY(campaignDetails?.requirements?.campaignstartdate)}
              {" "}{"-"}{" "}
              {formatToDDMMYYYY(campaignDetails?.requirements?.campaignenddate)}
            </p>
          </div>

          <div className="py-4">
            <p className="text-sm font-bold text-gray-900">Application Window</p>
            <p className="text-gray-700 text-sm">
              {formatToDDMMYYYY(campaignDetails?.applicationstartdate)}
              {" "}{"-"}{" "}
              {formatToDDMMYYYY(campaignDetails?.applicationenddate)}
            </p>
          </div>

          </div>


          <div className="space-y-6 w-full">
            {/* Platform Card */}
            <div className="bg-white p-4 rounded-2xl">
              <h3 className="font-semibold text-lg py-3">Platform</h3>

              <div className="space-y-4">
                {campaignDetails?.providercontenttype?.map((platform) => (
                  <div
                    key={platform.providerid}
                    className="pb-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-start justify-between gap-3">

                      {/* Left: Icon + Platform Name */}
                      <div className="flex items-center gap-2">
                        {platform.iconpath && (
                          <img
                            src={platform.iconpath}
                            alt={platform.providername}
                            onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                            className="w-5 h-5 object-contain shrink-0"
                          />
                        )}

                        <span className="text-gray-800 font-medium">
                          {platform.providername}
                        </span>
                      </div>

                      {/* Right: Content Types */}
                      <span className="text-gray-500 text-sm text-right">
                        {platform.contenttypes
                          ?.map((c) => c.contenttypename)
                          ?.join(", ")}
                      </span>
                    </div>

                    {/* Caption */}
                    {platform.caption && (
                      <p className="mt-2 text-gray-600 italic text-xs border-l-2 border-gray-200 pl-3">
                        {platform.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>

            </div>


            {/* Influencers List */}
            <div className="bg-white p-4 rounded-2xl mt-6">
              <h3 className="font-semibold text-lg mb-4">Influencers</h3>
              {campaignDetails?.influencers?.length > 0 ? (
                campaignDetails.influencers.map((influencer) => (
                  <div
                    key={influencer.influencerid}
                    className="flex border border-gray-200 rounded-2xl items-start p-3 gap-4 mb-4 cursor-pointer hover:bg-gray-100"
                    onClick={() =>
                      navigate(`/vendor-dashboard/browse-influencers/influencer-details/${influencer.influencerid}`)
                    }
                  >
                    <img
                      src={influencer.userphoto}
                      onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                      alt={`${influencer.firstname} ${influencer.lastname}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {influencer.influencername}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {influencer.statename}, {influencer.countryname}
                      </p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {influencer.providers.map((provider) => (
                          <div key={provider.providerid} className="flex items-center gap-1 text-sm text-gray-600">
                            <img
                              src={provider.iconpath}
                              alt={provider.providername}
                              onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                              className="w-4 h-4"
                            />
                            <span>{formatFollowers(provider.nooffollowers)}</span>

                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-1 flex-wrap text-xs text-gray-500">
                        {influencer.categories.slice(0, 3).map((cat) => (
                          <span key={cat.categoryid} className="bg-gray-100 px-2 py-0.5 rounded-full">
                            {cat.categoryname}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Empty
                  description="No influencers found"
                  className="py-0"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </div>

            {/* Track Campaign */}
            <div className="bg-white p-6 rounded-2xl mt-6">
              <h3 className="font-semibold text-lg mb-4">Track Campaign</h3>
              <div className="relative">
                {[
                   {
                    name: "Campaign Created",
                    date: formatToDDMMYYYY(campaignDetails?.trackcampaign?.createddate),
                  },
                  {
                    name: "Campaign Started",
                    date: formatToDDMMYYYY(campaignDetails?.trackcampaign?.campaignstartdate),
                  },
                  {
                    name: "Campaign Ended",
                    date: formatToDDMMYYYY(campaignDetails?.trackcampaign?.campaignenddate),
                  },
                ].map((step, idx, arr) => {
                  const stepDate = dayjs(step.date, "DD-MM-YYYY HH:mm");
                  const now = dayjs();
                  const isCompleted = now.isAfter(stepDate) || now.isSame(stepDate);

                  return (
                    <div key={idx} className="relative pl-10 pb-6 last:pb-0">
                      {idx !== arr.length - 1 && (
                        <div className="absolute left-[8px] top-5 h-full border-l-2 border-dashed border-gray-300"></div>
                      )}
                      <span className="absolute left-0 top-1 z-10">
                        {isCompleted ? (
                          <RiCheckboxCircleFill className="text-[#0f122f]" size={20} />
                        ) : (
                          <RiCheckboxBlankCircleLine className="text-gray-400" size={18} />
                        )}
                      </span>
                      <div>
                        <h4 className={`font-semibold ${isCompleted ? "text-gray-800" : "text-gray-400"}`}>
                          {step.name}
                        </h4>
                        <p className={`text-sm ${isCompleted ? "text-gray-600" : "text-gray-400"}`}>
                          {step.date || "Pending"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Cancel Campaign Modal */}
      <Modal
        open={isCancelModel}
        onCancel={() => setCancelModel(false)}
        footer={null}
        centered
      >
        <h2 className="text-xl font-semibold mb-4">Cancel Campaign</h2>
        <p className="text-gray-600 mb-4">
          Are you sure you want to cancel this campaign?
        </p>

        {/* Cancel Reasons */}
        <div className="space-y-3 mb-2">
          {cancelReasons.length > 0 ? (
            cancelReasons.map((reason, index) => (
              <label
                key={index}
                className="flex items-center gap-3 cursor-pointer text-gray-700"
              >
                <input
                  type="radio"
                  name="cancelReason"
                  value={reason.reason_name || reason.name}
                  checked={cancelReason === (reason.reason_name || reason.name)}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="accent-[#0f122f] w-4 h-4"
                />
                {reason.reason_name || reason.name}
              </label>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Loading reasons...</p>
          )}
        </div>
        {errors.cancelReason && (
          <p className="text-red-500 text-xs mt-1">{errors.cancelReason}</p>
        )}

        {/* Modal Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setCancelModel(false)}
            className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleCancelComplete}
            className="px-6 py-2 rounded-full bg-[#0f122f] text-white hover:bg-[#23265a]"
          >
            Cancel Campaign
          </button>
        </div>
      </Modal>

      {/* Edit Campaign Modal */}
      <Modal
        title="Edit Campaign Dates"
        open={isDateModalOpen}
        onCancel={() => setIsDateModalOpen(false)}
        footer={null}
        className="rounded-xl"
      >
        <div className="flex gap-4">
          {/* Start Date */}
          <div className="w-full">
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              format="DD-MM-YYYY"
              placeholder="Start Date"
              value={formData.startDate}
              disabledDate={(current) => {
                if (!current) return false;

                // Convert current to dayjs to be safe
                const currentDate = dayjs(current);

                const today = dayjs().startOf("day");
                const appEndDate = campaignDetails?.applicationenddate
                  ? dayjs(campaignDetails.applicationenddate, "DD-MM-YYYY")
                  : today;

                const minDate = today.isAfter(appEndDate) ? today : appEndDate;

                // Disable all dates on or before minDate
                return currentDate.isSame(minDate, "day") || currentDate.isBefore(minDate, "day");
              }}

              onChange={(date) => handleChange("startDate", date)}
            />
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
          </div>

          {/* End Date */}
          <div className="w-full">
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              format="DD-MM-YYYY"
              placeholder="End Date"
              value={formData.endDate}
              disabledDate={(current) => {
                if (!current) return false;

                const currentDate = dayjs(current);
                // Disable dates before campaign start date
                return formData.startDate && currentDate.isBefore(formData.startDate, "day");
              }}
              onChange={(date) => handleChange("endDate", date)}
            />
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          </div>

        </div>



        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setIsDateModalOpen(false)}
            className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveDates}
            className="px-6 py-2 rounded-full bg-[#0f122f] text-white hover:bg-[#23265a]"
          >
            Save
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default CampaignDetails;
