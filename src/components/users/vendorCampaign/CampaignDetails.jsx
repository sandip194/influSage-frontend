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
import { Modal, Input, Tabs } from 'antd';
import VendorCampaignOverview from './VendorCampaignOverview';
import VendorActivity from './VendorActivity';
import VendorMessage from './VendorMessage';
import VendorFilesMedia from './VendorFilesMedia';
import VendorPayment from './VendorPayment';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RiArrowLeftLine, RiCheckboxCircleFill } from "react-icons/ri";

import dayjs from 'dayjs';

const { TextArea } = Input;


const CampaignDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposal, setProposal] = useState(""); 
  const [errors, setErrors] = useState({});
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelModel, setCancelModel] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState(null)
  const [loading, setLoading] = useState(false)



  const navigate = useNavigate();
  const { campaignId } = useParams()
  const { token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Complete action
  const handleComplete = () => {
    let newErrors = {};
    if (!proposal) newErrors.proposal = "Please add a review";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsModalOpen(false);
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
  };

  const getCampaignDetails = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`vendor/singlecampaign/${campaignId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log(res?.data?.data)
      setCampaignDetails(res?.data?.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCampaignDetails()
  }, [])



  if (loading) return <div className="text-center">Loading campaign...</div>;

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
              {/* <img
                src="https://images.pexels.com/photos/33350497/pexels-photo-33350497.jpeg"
                alt="Banner"
                className="w-full h-28 object-cover"
              /> */}
              <img
                src={`${BASE_URL}/${campaignDetails?.photopath}`}
                alt="Logo"
                className="absolute rounded-full top-14 left-4 w-20 h-20 border-4 border-white object-cover"
              />
            </div>

            <div className="p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div>
                  <h2 className="font-semibold text-lg">{campaignDetails?.name}</h2>
                  <p className="text-gray-500 text-sm">{campaignDetails?.businessname}</p>

                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto bg-[#0f122f] text-white font-semibold rounded-full px-6 py-2 hover:bg-[#23265a] transition"
                  >
                    Complete & Payment
                  </button>
                  <button
                    onClick={() => setCancelModel(true)}
                    className="w-full sm:w-auto px-6 py-2 rounded-full border border-gray-400 text-black font-semibold hover:bg-gray-50"
                  >
                    Cancel Campaign
                  </button>
                </div>
              </div>
              {/* Campaign Info */}
              <div className="flex flex-wrap justify-between gap-6 border border-gray-200 rounded-2xl p-4">
                <div>
                  <div className="flex gap-2 items-center text-gray-400 mb-2">
                    <RiMoneyRupeeCircleLine className="w-5" />
                    <span>Budget</span>
                  </div>
                  <p>₹{campaignDetails?.estimatedbudget}</p>

                </div>
                <div>
                  <div className="flex gap-2 items-center text-gray-400 mb-2">
                    <RiTranslate className="w-5" />
                    <span>Language</span>
                  </div>
                  {campaignDetails?.campaignlanguages?.map((lang) => (
                    <p key={lang.languageid}>{lang.languagename}</p>
                  ))}

                </div>
                <div>
                  <div className="flex gap-2 items-center text-gray-400 mb-2">
                    <RiMenLine className="w-5" />
                    <span>Gender</span>
                  </div>
                  {campaignDetails?.campaigngenders?.map((gender) => (
                    <p key={gender.genderid}>{gender.gendername}</p>
                  ))}

                </div>
              </div>
            </div>
          </div>

          {/* Tabs + Content */}
          <div className="bg-white p-5 rounded-2xl">
            <Tabs defaultActiveKey="overview">
              <Tabs.TabPane tab="Overview" key="overview">
                {campaignDetails && (
                  <VendorCampaignOverview campaignData={campaignDetails} />
                )}

              </Tabs.TabPane>

              <Tabs.TabPane tab="Activity" key="activity">
                <VendorActivity />
              </Tabs.TabPane>

              <Tabs.TabPane tab="Message" key="message">
                <VendorMessage />
              </Tabs.TabPane>

              <Tabs.TabPane tab="Files & Media" key="files&media">
                <VendorFilesMedia />
              </Tabs.TabPane>

              <Tabs.TabPane tab="Payment" key="payment">
                <VendorPayment />
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
              <p className="text-sm font-bold text-gray-900">Campaign Number</p>
              <p>{campaignDetails?.branddetails?.campaignnumber}</p>
            </div>


            <div className="py-4 border-b border-gray-200">
              <p className="text-sm font-bold text-gray-900">Campaign Duration</p>
              <p>
                {campaignDetails?.requirements.startdate} — {campaignDetails?.requirements.enddate}
              </p>
            </div>

            <div className="py-4 border-b border-gray-200">
              <p className="text-sm font-bold text-gray-900">Application Window</p>
              <p>
                {campaignDetails?.applicationstartdate} — {campaignDetails?.applicationenddate}
              </p>
            </div>

            <div className="py-4 border-b border-gray-200">
              <p className="text-sm font-bold text-gray-900">Delivery Date</p>
              <p>{campaignDetails?.requirements.enddate}</p>
            </div>

            <div className="py-4">
              <p className="text-sm font-bold text-gray-900">Total Price</p>
              <p>₹{campaignDetails?.estimatedbudget}</p>
            </div>
          </div>


          <div className="space-y-4 w-full max-w-xs">
            {/* Platform Card */}
            <div className="bg-white p-4 rounded-2xl">
              <h3 className="font-semibold text-lg py-3">Platform</h3>
              <div className="space-y-3">
                {campaignDetails?.providercontenttype?.map((platform) => (
                  <div key={platform.providercontenttypeid} className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      {platform.providerid === 1 && <RiInstagramFill className="text-pink-600" />}
                      {platform.providerid === 2 && <RiYoutubeFill className="text-red-600" />}
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
                      src={`${BASE_URL}/${influencer.userphoto}`}
                      alt={`${influencer.firstname} ${influencer.lastname}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {influencer.firstname} {influencer.lastname}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {influencer.statename}, {influencer.countryname}
                      </p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {influencer.providers.map((provider) => (
                          <div key={provider.providerid} className="flex items-center gap-1 text-sm text-gray-600">
                            <img
                              src={`${BASE_URL}/${provider.iconpath}`}
                              alt={provider.providername}
                              className="w-4 h-4"
                            />
                            <span>{provider.nooffollowers.toLocaleString()}</span>
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
                <p className="text-gray-500">No influencers found.</p>
              )}
            </div>


            <div className="bg-white p-6 rounded-2xl mt-6">
              <h3 className="font-semibold text-lg mb-4">Track Campaign</h3>
              <div className="relative">
                <div className="absolute left-2 top-0 h-full border-l-2 border-dashed border-gray-300"></div>
                {[
                  { name: "Campaign Created", date: campaignDetails?.trackcampaign?.createddate },
                  { name: "Campaign Started", date: campaignDetails?.trackcampaign?.startdate },
                  { name: "Campaign Ended", date: campaignDetails?.trackcampaign?.enddate },
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

      {/* Modal */}
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

export default CampaignDetails;
