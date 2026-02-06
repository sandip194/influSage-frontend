import React, { useEffect, useState } from 'react';
import {
  RiMenLine,
  RiMoneyRupeeCircleLine,
  RiTranslate,
  RiCheckboxBlankCircleLine,
  RiInstagramFill,
  RiYoutubeFill,
  RiStarLine,
} from '@remixicon/react';
import { Modal, Input, Tabs, Skeleton, ConfigProvider } from 'antd';
import api from '../../../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RiArrowLeftLine, RiCheckboxCircleFill } from "react-icons/ri";

import dayjs from 'dayjs';
import VendorCampaignOverview from '../vendorCampaign/VendorCampaignOverview';
import ContractTab from './tabs/ContractTab';
import ApplicationTab from './tabs/ApplicationTab';
import ContentLinksTab from './tabs/ContentLinksTab';
import MediaPreviewModal from "../../../pages/commonPages/MediaPreviewModal";

const { TextArea } = Input;


const UserActivity = () => <div>Activity content for user (implement as needed)</div>;
const UserMessage = () => <div>Message content for user (implement as needed)</div>;
const UserFilesMedia = () => <div>Files & Media content for user (implement as needed)</div>;
const UserPayment = () => <div>Payment content for user (implement as needed)</div>;

const formatToINR = (amount) => {
  if (isNaN(amount)) return "₹0";
  return `₹${new Intl.NumberFormat("en-IN").format(amount)}`;
};

const Details = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposal, setProposal] = useState("");
  const [errors, setErrors] = useState({});
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelModel, setCancelModel] = useState(false);
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(false)

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewType, setPreviewType] = useState("image");

  const navigate = useNavigate();
  const { campaignId } = useParams()
  const { token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // const [isLogoPreviewOpen, setIsLogoPreviewOpen] = useState(false);
  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return "N/A";

    // Backend sends DD-MM-YYYY
    if (typeof dateStr === "string" && dateStr.includes("-")) {
      const [dd, mm, yyyy] = dateStr.split("-");
      return `${dd}/${mm}/${yyyy}`;
    }

    const d = new Date(dateStr);
    if (isNaN(d)) return "N/A";

    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  // Complete action (adapted from vendor)
  const handleComplete = () => {
    let newErrors = {};
    if (!proposal) newErrors.proposal = "Please add a review";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsModalOpen(false);
    // Add API call to complete campaign if needed
  };

  const handleCancelComplete = () => {
    let newErrors = {};

    if (!cancelReason) {
      newErrors.cancelReason = "Please select a reason for cancellation.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setCancelModel(false);
    // Add API call to cancel campaign if needed
  };

  const getCampaignDetail = async () => {
    try {
      setLoading(true)
      const res = await api.get(`user/influencer-campaign/${campaignId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      //console.log(res?.data?.data)
      setCampaign(res?.data?.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCampaignDetail()
  }, [])

  const steps = [
    {
      name: "Campaign Started",
      date: campaign?.trackcampaign?.campaignstartdate,
    },
    {
      name: "Contract Started",
      date: campaign?.trackcampaign?.contractstart,
    },
    {
      name: "Contract Completed",
      date: campaign?.trackcampaign?.contractcompleted,
    },
    {
      name: "Campaign Ended",
      date: campaign?.trackcampaign?.campaignenddate,
    },
  ];


  if (loading) {
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


  if (!campaign) return <div>No campaign data available.</div>;

  return (
    <div className="w-full text-sm overflow-x-hidden">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex cursor-pointer items-center gap-2 text-gray-600 mb-2"
      >
        <RiArrowLeftLine /> Back
      </button>

      <h1 className="text-2xl font-semibold mb-4">Campaign Details</h1>

      <div className="flex flex-col lg:flex-row gap-4 min-w-0 items-stretch">
        {/* Left Section */}
         <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Header / Overview Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                {/* Profile */}
                <img
                  src={campaign?.photopath}
                  onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover cursor-pointer"
                  onClick={() => {
                    setPreviewUrl(campaign?.photopath);
                    setPreviewType("image");
                    setPreviewOpen(true);
                  }}
                />
                <div>
                  <h2 className="font-semibold text-lg text-gray-900">
                    {campaign?.name || "Campaign Name"}
                  </h2>
                  <p className="text-gray-500 text-sm">{campaign?.businessname}</p>
                </div>
              </div>

              {/* Right Buttons */}
              <div className="flex gap-2 items-start">
                <button
                  disabled
                  aria-disabled="true"
                  className="bg-[#0f122f] text-white px-4 py-1.5 rounded-lg font-medium opacity-50 cursor-not-allowed transition"
                >
                  Complete & Payment
                </button>

                {/* Optional Cancel button */}
                {/* Uncomment if needed */}
                {/* <button
        onClick={() => setCancelModel(true)}
        className="w-full sm:w-auto px-4 py-1.5 rounded-lg border border-red-400 text-red-900 font-medium hover:bg-gray-50 transition"
      >
        Cancel
      </button> */}
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">

              {/* Budget */}
              <div className="min-w-[150px]">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <RiMoneyRupeeCircleLine className="w-4 h-4" />
                  Budget
                </div>
                <p className="text-[#0D132D] font-bold text-xl">
                  {formatToINR(campaign?.estimatedbudget)}
                </p>
              </div>

              {/* Language */}
              <div className="min-w-[150px]">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <RiTranslate className="w-4 h-4" />
                  Language
                </div>
                <div className="flex gap-2 flex-wrap">
                  {campaign?.campaignlanguages?.map((lang) => (
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
              <div className="min-w-[150px]">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <RiMenLine className="w-4 h-4" />
                  Gender
                </div>
                <div className="flex gap-2 flex-wrap">
                  {campaign?.campaigngenders?.map((gender) => (
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
          <div className="bg-white p-5 rounded-2xl flex-1 min-h-0 flex flex-col">

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
              <Tabs type="card" defaultActiveKey="contract">
                <Tabs.TabPane tab="Overview" key="overview">
                  {campaign && (
                    <VendorCampaignOverview campaignData={campaign} isEditable={false} />
                  )}
                </Tabs.TabPane>
                <Tabs.TabPane tab="Application" key="application">
                  <ApplicationTab campaignId={campaignId} token={token} />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Contract" key="contract">
                  <ContractTab campaignId={campaignId} token={token} />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Content Links" key="contentLinks" disabled={!campaign.iscontentlinktab}>
                  <ContentLinksTab campaignId={campaignId} contractId={campaign?.contractid ? campaign?.contractid : null} token={token} />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Activity" key="activity" disabled>
                  <UserActivity />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Message" key="message" disabled>
                  <UserMessage />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Files & Media" key="files&media" disabled>
                  <UserFilesMedia />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Payment" key="payment" disabled>
                  <UserPayment />
                </Tabs.TabPane>
              </Tabs>

            </ConfigProvider>

          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-[25%] flex-shrink-0 flex flex-col gap-6 h-full">
          {/* Campaign Info Card */}
          <div className="bg-white p-4 rounded-2xl">
            <h3 className="font-semibold text-lg">Campaign Details</h3>
            <div className="py-4 border-b border-gray-200">
              <p className="text-sm font-bold text-gray-900">Campaign Duration</p>
              <p>
                {formatDateDDMMYYYY(
                  campaign?.campaignstartdate ||
                  campaign?.requirements?.campaignstartdate
                )}
                {" "}
                {"-"}
                {" "}
                {formatDateDDMMYYYY(
                  campaign?.campaignenddate ||
                  campaign?.requirements?.campaignenddate
                )}
              </p>
            </div>

            <div className="py-4">
              <p className="text-sm font-bold text-gray-900">Application Window</p>
              <p>
                {formatDateDDMMYYYY(
                  campaign?.applicationstartdate
                )}
                {" "}
                {"-"}
                {" "}
                {formatDateDDMMYYYY(
                  campaign?.applicationenddate
                )}
              </p>
            </div>
          </div>

          <div className="space-y-4 w-full max-w-xs">
            { /* Platform Card */}
            <div className="bg-white p-4 rounded-2xl">
              <h3 className="font-semibold text-lg py-3">Platform</h3>
              <div className="space-y-4">
                {campaign?.providercontenttype?.map((platform) => (
                  <div key={platform.providercontenttypeid}>

                    {/* Top Row */}
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center gap-2">
                        {platform.iconpath && (
                          <img
                            src={platform.iconpath}
                            alt={platform.providername}
                            onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                            className="w-5 h-5 object-contain"
                          />
                        )}
                        <span className="text-gray-800 font-medium">
                          {platform.providername}
                        </span>
                      </div>

                      <span className="text-gray-500 text-sm text-right">
                        {platform.contenttypes && platform.contenttypes.length > 0
                          ? platform.contenttypes.map((ct) => ct.contenttypename).join(", ")
                          : "No types"}
                      </span>
                    </div>

                    {/* Caption under platform */}
                    {platform.caption && (
                      <p className="text-gray-600 italic text-xs border-l-2 border-gray-200 pl-3">
                        {platform.caption}
                      </p>
                    )}

                  </div>
                ))}
              </div>
            </div>

            {/* Influencers List - REMOVED as per requirement */}

            {/* Milestones (adapted from your user component) */}
            {/* <div className="bg-white p-4 rounded-2xl mt-6">
              <h3 className="font-semibold text-lg mb-3">Milestones</h3>
              {campaign?.milestones?.length > 0 ? (
                campaign.milestones.map((milestone, index) => (
                  <div key={index} className="mb-2 border-b border-gray-100 pb-2 last:border-none">
                    <p className="font-medium text-gray-800">{milestone.description}</p>
                    <p className="text-sm text-gray-600">
                      Due:{" "}
                      {milestone.enddate
                        ? dayjs(milestone.enddate).format("DD-MM-YYYY")
                        : "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">Amount: ₹{milestone.amount}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No milestones available.</p>
              )}
            </div> */}



            <div className="bg-white p-6 rounded-2xl mt-6">
              <h3 className="font-semibold text-lg mb-4">Track Campaign</h3>

              <div className="relative">
                {steps.map((step, idx) => {
                  const stepDate = dayjs(step.date, "DD-MM-YYYY HH:mm");
                  const now = dayjs();

                  const isCompleted = now.isAfter(stepDate) || now.isSame(stepDate);
                  const isLast = idx === steps.length - 1;

                  return (
                    <div key={idx} className="relative pl-10 pb-6 last:pb-0">
                      {/* Vertical line */}
                      {!isLast && (
                        <div className="absolute left-[8px] top-[22px] h-full border-l-2 border-dashed border-gray-300"></div>
                      )}

                      {/* Checkbox */}
                      <span className="absolute left-0 top-1">
                        {isCompleted ? (
                          <RiCheckboxCircleFill className="text-[#0f122f]" size={20} />
                        ) : (
                          <RiCheckboxBlankCircleLine className="text-gray-400" size={18} />
                        )}
                      </span>

                      {/* Content */}
                      <div>
                        <h4
                          className={`font-semibold ${isCompleted ? "text-gray-800" : "text-gray-400"
                            }`}
                        >
                          {step.name}
                        </h4>
                        <p
                          className={`text-sm ${isCompleted ? "text-gray-600" : "text-gray-400"
                            }`}
                        >
                          {formatDateDDMMYYYY(step.date)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
        <MediaPreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          src={previewUrl}
          type={previewType}
        />
      </div>

      {/* Modal - Adapted from vendor (Complete with stars and review) */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <h2 className="text-xl font-semibold mb-4">Mark As Complete</h2>
        <p className="text-gray-600 mb-4">
          Are you sure you want to mark this campaign as completed?
        </p>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          <RiStarLine className="text-xl" />
          <RiStarLine className="text-xl" />
          <RiStarLine className="text-xl" />
          <RiStarLine className="text-xl" />
          <RiStarLine className="text-xl" />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block font-medium text-sm mb-1">
            Review <span className="text-red-500">*</span>
          </label>

          <TextArea
            rows={4}
            placeholder="Write Your Review..."
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            status={errors.proposal ? "error" : ""}
          />
          {errors.proposal && (
            <p className="text-red-500 text-xs mt-1">{errors.proposal}</p>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            className="px-6 py-2 rounded-full bg-[#0f122f] text-white hover:bg-[#23265a]"
          >
            Complete
          </button>
        </div>
      </Modal>

      {/* Cancel Campaign Modal - Same as vendor */}
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
          {["Cancel Reason 1", "Cancel Reason 2", "Cancel Reason 3", "Cancel Reason 4"].map(
            (reason, index) => (
              <label
                key={index}
                className="flex items-center gap-3 cursor-pointer text-gray-700"
              >
                <input
                  type="radio"
                  name="cancelReason"
                  value={reason}
                  checked={cancelReason === reason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="accent-[#0f122f] w-4 h-4"
                />
                {reason}
              </label>
            )
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
    </div>
  );
};

export default Details;