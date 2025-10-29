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
import { Modal, Input, Tabs, Skeleton } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RiArrowLeftLine, RiCheckboxCircleFill } from "react-icons/ri";

import dayjs from 'dayjs';
import VendorCampaignOverview from '../vendorCampaign/VendorCampaignOverview';

const { TextArea } = Input;


const UserActivity = () => <div>Activity content for user (implement as needed)</div>;
const UserMessage = () => <div>Message content for user (implement as needed)</div>;
const UserFilesMedia = () => <div>Files & Media content for user (implement as needed)</div>;
const UserPayment = () => <div>Payment content for user (implement as needed)</div>;

const Details = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposal, setProposal] = useState("");
  const [errors, setErrors] = useState({});
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelModel, setCancelModel] = useState(false);
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();
  const { campaignId } = useParams()
  const { token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      const res = await axios.get(`user/influencer-campaign/${campaignId}`, {
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
        className="flex items-center gap-2 text-gray-600 mb-2"
      >
        <RiArrowLeftLine /> Back
      </button>

      <h1 className="text-2xl font-semibold mb-4">Campaign Details</h1>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Section */}
        <div className="flex-1 space-y-4">
          {/* Banner + Profile */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="relative h-40 bg-gray-200">
              <img
                src={campaign?.photopath}
                alt="Logo"
                className="absolute rounded-full top-14 left-4 w-20 h-20 border-4 border-white object-cover"
              />
            </div>

            <div className="p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div>
                  <h2 className="font-semibold text-lg">{campaign?.name}</h2>
                  <p className="text-gray-500 text-sm">{campaign?.businessname}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto bg-[#0f122f] text-white font-semibold rounded-full px-6 py-2 hover:bg-[#23265a] transition"
                  >
                    Complete & Payment
                  </button>
                  {/* <button
                    onClick={() => setCancelModel(true)}
                    className="w-full sm:w-auto px-6 py-2 rounded-full border border-gray-400 text-black font-semibold hover:bg-gray-50"
                  >
                    Cancel Campaign
                  </button> */}
                </div>
              </div>
              {/* Campaign Info */}
              <div className="flex flex-wrap justify-between gap-6 border border-gray-200 rounded-2xl p-4">
                <div>
                  <div className="flex gap-2 items-center text-gray-900 mb-2">
                    <RiMoneyRupeeCircleLine className="w-5 font-semibold" />
                    <span>Budget</span>
                  </div>
                  <p className='text-gray-800'>₹{campaign?.estimatedbudget}</p>
                </div>
                <div>
                  <div className="flex gap-2 items-center text-gray-900 mb-2">
                    <RiTranslate className="w-5 font-semibold" />
                    <span>Language</span>
                  </div>
                  {campaign?.campaignlanguages?.map((lang) => (
                    <p key={lang.languageid} className='text-gray-800'>{lang.languagename}</p>
                  ))}
                </div>
                <div>
                  <div className="flex gap-2 items-center text-gray-900 mb-2">
                    <RiMenLine className="w-5 font-semibold" />
                    <span>Gender</span>
                  </div>
                  {campaign?.campaigngenders?.map((gender) => (
                    <p key={gender.genderid} className='text-gray-800'>{gender.gendername}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs + Content */}
          <div className="bg-white p-5 rounded-2xl">
            <Tabs defaultActiveKey="overview">
              <Tabs.TabPane tab="Overview" key="overview">
                {campaign && (
                  <VendorCampaignOverview campaignData={campaign} isEditable={false} />
                )}
              </Tabs.TabPane>

              <Tabs.TabPane tab="Activity" key="activity">
                <UserActivity />
              </Tabs.TabPane>

              <Tabs.TabPane tab="Message" key="message">
                <UserMessage />
              </Tabs.TabPane>

              <Tabs.TabPane tab="Files & Media" key="files&media">
                <UserFilesMedia />
              </Tabs.TabPane>

              <Tabs.TabPane tab="Payment" key="payment">
                <UserPayment />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">
          {/* Campaign Info Card */}
          <div className="bg-white p-4 rounded-2xl">
            <h3 className="font-semibold text-lg">Campaign Details</h3>
            <div className="py-4 border-b border-gray-200">
              <p className="text-sm font-bold text-gray-900">Campaign Duration</p>
              <p>
                {campaign?.requirements?.startdate} — {campaign?.requirements?.enddate}
              </p>
            </div>

            <div className="py-4 border-b border-gray-200">
              <p className="text-sm font-bold text-gray-900">Application Window</p>
              <p>
                {campaign?.applicationstartdate} — {campaign?.applicationenddate}
              </p>
            </div>

            <div className="py-4 border-b border-gray-200">
              <p className="text-sm font-bold text-gray-900">Delivery Date</p>
              <p>{campaign?.requirements?.enddate}</p>
            </div>

            <div className="py-4">
              <p className="text-sm font-bold text-gray-900">Total Price</p>
              <p>₹{campaign?.estimatedbudget}</p>
            </div>
          </div>

          <div className="space-y-4 w-full max-w-xs">
            {/* Platform Card */}
            <div className="bg-white p-4 rounded-2xl">
              <h3 className="font-semibold text-lg py-3">Platform</h3>
              <div className="space-y-3">
                {campaign?.providercontenttype?.map((platform) => (
                  <div key={platform.providercontenttypeid} className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      {/* {platform.providerid === 1 && <RiInstagramFill className="text-pink-600" />}
                      {platform.providerid === 2 && <RiYoutubeFill className="text-red-600" />} */}
                      {/* Add conditions for other platforms as needed */}
                      <span className="text-gray-700 font-medium">{platform.providername}</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {platform.contenttypename}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Influencers List - REMOVED as per requirement */}

            {/* Milestones (adapted from your user component) */}
            <div className="bg-white p-4 rounded-2xl mt-6">
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
            </div>

            <div className="bg-white p-6 rounded-2xl mt-6">
              <h3 className="font-semibold text-lg mb-4">Track Campaign</h3>
              <div className="relative">
                <div className="absolute left-2 top-0 h-full border-l-2 border-dashed border-gray-300"></div>
                {[
                  { name: "Campaign Created", date: campaign?.trackcampaign?.createddate },
                  { name: "Campaign Started", date: campaign?.trackcampaign?.startdate },
                  { name: "Campaign Ended", date: campaign?.trackcampaign?.enddate },
                ].map((step, idx) => {
                  const stepDate = dayjs(step.date, "DD-MM-YYYY HH:mm");
                  const now = dayjs();
                  const isCompleted = now.isAfter(stepDate) || now.isSame(stepDate);

                  return (
                    <div key={idx} className="relative pl-10 pb-6">
                      <span className="absolute left-0 top-1">
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
                          {step.date}
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