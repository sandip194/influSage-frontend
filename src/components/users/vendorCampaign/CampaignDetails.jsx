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
import { Modal, Input, Tabs, DatePicker, Skeleton } from 'antd';
import VendorCampaignOverview from './VendorCampaignOverview';
import VendorActivity from './VendorActivity';
import VendorMessage from './VendorMessage';
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
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter); // ✅ Extend dayjs with the plugin


const CampaignDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposal, setProposal] = useState(""); 
  const [errors, setErrors] = useState({});
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelModel, setCancelModel] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [cancelReasons, setCancelReasons] = useState([]);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
  });



  const navigate = useNavigate();
  const { campaignId } = useParams()
  const { token } = useSelector((state) => state.auth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getCampaignDetails = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/vendor/singlecampaign/${campaignId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

     // console.log(res?.data?.data)
      setCampaignDetails(res?.data?.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
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
      toast.success(res.data?.message);
      setCancelModel(false);
      setCancelReason("");
      setErrors({});
      // getCampaignDetails();
    } else {
      toast.error(res.data?.message);
    }
  } catch (error) {
    console.error("Cancel error:", error);
    toast.error(error);
  }
};

// Function to pause the campaign

const handlePauseCampaign = async () => {
  if (!campaignDetails?.id) {
    toast.error("Campaign ID not found");
    return;
  }

  try {
    const res = await axios.post(
      `/vendor/pause-campaign/${campaignDetails.id}`,
      null,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 200) {
      toast.success(res.data?.message);
      setIsPauseModalOpen(false);
      // getCampaignDetails();
    } else {
      toast.error(res.data?.message);
    }
  } catch (error) {
    console.error("Pause campaign error:", error);
    toast.error(error);
  }
};

 const handleEditClick = () => {
  if (campaignDetails?.iseditable === true || campaignDetails?.iseditable === "Is editable") {
    navigate(`/vendor-dashboard/vendor-campaign/edit-campaign/${campaignDetails?.id}`);
  } else {
    setFormData({
  startDate: campaignDetails?.requirements?.startdate
    ? dayjs(campaignDetails.requirements.startdate, "DD-MM-YYYY")
    : null,
  endDate: campaignDetails?.requirements?.enddate
    ? dayjs(campaignDetails.requirements.enddate, "DD-MM-YYYY")
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
    p_campaignjson: {
      startdate: formData.startDate?.format("DD-MM-YYYY"),
      enddate: formData.endDate?.format("DD-MM-YYYY"),
    },
  };

  try {
    setLoading(true);
    const res = await axios.post("/vendor/update-campaign", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data?.success) {
      toast.success(res.data?.message || "Campaign dates updated successfully!");
      setIsDateModalOpen(false);
      getCampaignDetails();
    } else {
      toast.error(res.data?.message || "Failed to update dates");
    }
  } catch (err) {
    console.error("❌ API Error:", err.response?.data || err.message);
    toast.error("Failed to update campaign dates. Try again.");
  } finally {
    setLoading(false);
  }
};


  if (loading) return <div className="text-center">Loading campaign...</div>;
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
                 {campaignDetails?.iseditable !== "Not editable" && (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="w-full sm:w-auto px-6 py-2 rounded-full border border-gray-400 text-black font-semibold hover:bg-gray-50"
                  >
                    Edit Campaign
                  </button>
                )}
                  <button
                    onClick={() => setIsPauseModalOpen(true)}
                    className="w-full sm:w-auto bg-[#0f122f] text-white font-semibold rounded-full px-6 py-2 hover:bg-[#23265a] transition"
                  >
                    Pause Campaign
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
        open={isPauseModalOpen}
        onCancel={() => setIsPauseModalOpen(false)}
        centered
        footer={null}
      >
        <h2 className="text-xl font-semibold mb-2">Pause Campaign</h2>
        <p className="text-gray-600">
          Are you sure you want to pause this campaign? You can resume it later.
        </p>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setIsPauseModalOpen(true)}
            className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handlePauseCampaign}
            className="px-6 py-2 rounded-full bg-[#0f122f] text-white hover:bg-[#23265a]"
          >
            Pause
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
              disabledDate={(current) => current && current.isBefore(dayjs().startOf("day"))}
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
              disabledDate={(current) => current && formData.startDate && current.isBefore(formData.startDate)}
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
