import React, { useState } from 'react';
import {
  RiMoreFill,
  RiMenLine,
  RiMoneyRupeeCircleLine,
  RiTranslate,
  RiArrowLeftSLine,
  RiCheckboxBlankCircleLine,
  RiInstagramFill,
  RiYoutubeFill,
  RiFacebookFill,
  RiTiktokFill,
  RiStarFill,
  RiStarLine,
  RiEmotionLine,
  RiAttachment2,
  RiSendPlane2Line,
} from '@remixicon/react';
import { Modal, Upload, Input } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { TextArea } = Input;

const steps = [
  { name: "Campaign Created", date: "16 Jun 2021, 05:00 PM" },
  { name: "Campaign Processed", date: "16 Jun 2021, 05:00 PM" },
  { name: "Campaign Delivered", date: "16 Jun 2021, 05:00 PM" },
];

const VendorFilesMedia = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModel, setCancelModel] = useState(false);
  const [proposal, setProposal] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [errors, setErrors] = useState({});
  const [fileList, setFileList] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

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

  const buttons = [
    {
      id: "overview",
      label: "Overview",
      path: "/vendor-dashboard/vendor-campaign/campaignDetails",
    },
    {
      id: "activity",
      label: "Activity",
      path: "/vendor-dashboard/vendor-campaign/vendoractivity",
    },
    {
      id: "message",
      label: "Message",
      path: "/vendor-dashboard/vendor-campaign/vendorMessage",
    },
    {
      id: "files&media",
      label: "Files & Media",
      path: "/vendor-dashboard/vendor-campaign/vendorFilesMedia",
    },
    {
      id: "payment",
      label: "payment",
      path: "/vendor-dashboard/vendor-campaign/payment",
    },
  ];
  const selectedButton = buttons.find((b) => location.pathname === b.path)?.id;

  return (
    <div className="w-full text-sm overflow-x-hidden">
      {/* Back */}
      <button
        onClick={() => window.history.back()}
        className="text-gray-600 flex items-center gap-2 hover:text-gray-900 transition"
      >
        <RiArrowLeftSLine /> Back
      </button>

      <h1 className="text-2xl font-semibold mb-4">Campaign Details</h1>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Section */}
        <div className="flex-1 space-y-4">
          {/* Banner + Profile */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="relative h-40">
              <img
                src="https://images.pexels.com/photos/33350497/pexels-photo-33350497.jpeg"
                alt="Banner"
                className="w-full h-28 object-cover"
              />
              <img
                src="https://images.pexels.com/photos/25835001/pexels-photo-25835001.jpeg"
                alt="Logo"
                className="absolute rounded-full top-14 left-4 w-20 h-20 border-4 border-white object-cover"
              />
            </div>

            <div className="p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
              <div>
                <h2 className="font-semibold text-lg">Instagram Campaign</h2>
                <p className="text-gray-500 text-sm">Tiktokstar</p>
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
              <div className="flex flex-wrap justify-around gap-6 border border-gray-200 rounded-2xl p-4">
                <div>
                  <div className="flex gap-2 items-center text-gray-400 mb-2">
                    <RiMoneyRupeeCircleLine className="w-5" />
                    <span>Budget</span>
                  </div>
                  <p>$120-$150/Reel</p>
                </div>
                <div>
                  <div className="flex gap-2 items-center text-gray-400 mb-2">
                    <RiTranslate className="w-5" />
                    <span>Language</span>
                  </div>
                  <p>English</p>
                  <p>Hindi</p>
                </div>
                <div>
                  <div className="flex gap-2 items-center text-gray-400 mb-2">
                    <RiMenLine className="w-5" />
                    <span>Gender</span>
                  </div>
                  <p>Male</p>
                  <p>Female</p>
                  <p>Other</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs + Content */}
          <div className="bg-white p-5 rounded-2xl">
            <div className="flex flex-wrap gap-3 mb-6">
              {buttons.map(({ id, label, path }) => (
                <button
                  key={id}
                  onClick={() => navigate(path)}
                  className={`px-4 py-2 rounded-md border transition ${
                    selectedButton === id
                      ? "bg-[#0f122f] text-white"
                      : "bg-white text-[#141843] border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Message Section */}
            <div className="bg-white p-4 rounded-2xl mt-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">John Doe</h3>
                    <p className="text-xs text-gray-500">
                      Last Seen : 45 Mins Ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <RiStarLine className="text-gray-500 w-5 h-5" />
                  <RiMoreFill className="text-gray-500 w-5 h-5" />
                </div>
              </div>

              {/* Chat Body */}
              <div className="py-4 space-y-6">
                {/* Message - Left */}
                <div className="flex items-start gap-3">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="John"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">John Doe</p>
                    <div className="bg-gray-100 px-4 py-2 rounded-xl inline-block text-gray-800">
                      Hi How Are You?
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">12:28 PM</p>
                  </div>
                </div>

                {/* Message - Right */}
                <div className="flex items-end justify-end">
                  <div className="text-right">
                    <div className="bg-[#0f122f] text-white px-4 py-2 rounded-xl inline-block">
                      Nice to Meet you. Let's talk about the project
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">12:28 PM</p>
                  </div>
                  <img
                    src="https://randomuser.me/api/portraits/men/76.jpg"
                    alt="Me"
                    className="w-8 h-8 rounded-full ml-2"
                  />
                </div>

                {/* Message - Left with image */}
                <div className="flex items-start gap-3">
                  <img
                    src="https://randomuser.me/api/portraits/men/33.jpg"
                    alt="Sean"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Sean Smith</p>
                    <div className="bg-gray-100 p-3 rounded-xl max-w-xs space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <img
                          src="https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg"
                          className="w-full h-20 object-cover rounded-lg"
                          alt="attached"
                        />
                        <img
                          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                          className="w-full h-20 object-cover rounded-lg"
                          alt="attached"
                        />
                        <img
                          src="https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg"
                          className="w-full h-20 object-cover rounded-lg"
                          alt="attached"
                        />
                        <img
                          src="https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg"
                          className="w-full h-20 object-cover rounded-lg"
                          alt="attached"
                        />
                      </div>
                      <p className="text-gray-800 text-sm mt-2">
                        Here is the screenshot attached for it
                      </p>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">12:28 PM</p>
                  </div>
                </div>

                {/* Message - Right */}
                <div className="flex items-end justify-end">
                  <div className="text-right">
                    <div className="bg-[#0f122f] text-white px-4 py-2 rounded-xl inline-block">
                      Thanks for sharing the details
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">12:28 PM</p>
                  </div>
                  <img
                    src="https://randomuser.me/api/portraits/men/76.jpg"
                    alt="Me"
                    className="w-8 h-8 rounded-full ml-2"
                  />
                </div>
              </div>

              {/* Input Box */}
              <div className="pt-3">
                <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                  <input
                    type="text"
                    placeholder="Write Your Message"
                    className="flex-1 bg-transparent focus:outline-none text-sm placeholder-gray-500"
                  />
                  <div className="flex items-center gap-3 ml-2">
                    <RiEmotionLine className="text-gray-500 w-5 h-5 cursor-pointer" />
                    <RiAttachment2 className="text-gray-500 w-5 h-5 cursor-pointer" />
                    <button className="bg-[#0f122f] text-white p-2 rounded-full">
                      <RiSendPlane2Line className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">
          {/* Campaign Info Card */}
          <div className="bg-white p-4 rounded-2xl">
            <h3 className="font-semibold text-lg">Campaign Details</h3>
            <div className="py-4 border-b">
              <p className="text-sm text-gray-500">Campaign Number</p>
              <p>#251HJ8888410Kl</p>
            </div>
            <div className="py-4 border-b">
              <p className="text-sm text-gray-500">Order By</p>
              <p>Tiktokstar</p>
            </div>
            <div className="py-4 border-b">
              <p className="text-sm text-gray-500">Delivery Date</p>
              <p>22 June, 2025</p>
            </div>
            <div className="py-4">
              <p className="text-sm text-gray-500">Total Price</p>
              <p>250R</p>
            </div>
          </div>

          <div className="space-y-4 w-full max-w-xs">
            {/* Platform Card */}
            <div className="bg-white p-4 rounded-2xl">
              <h3 className="font-semibold text-lg py-3">Platform</h3>
              <div className="space-y-3">
                {/* Instagram */}
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <RiInstagramFill className="text-pink-600" />
                    <span className="text-gray-700 font-medium">Instagram</span>
                  </div>
                  <span className="text-gray-500 text-sm">Reel</span>
                </div>

                <hr className="my-4 border-gray-200" />

                {/* YouTube */}
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <RiYoutubeFill className="text-red-600" />
                    <span className="text-gray-700 font-medium">YouTube</span>
                  </div>
                  <span className="text-gray-500 text-sm">Short Video</span>
                </div>

                <hr className="my-4 border-gray-200" />

                {/* Facebook */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RiFacebookFill className="text-blue-600" />
                    <span className="text-gray-700 font-medium">Facebook</span>
                  </div>
                  <span className="text-gray-500 text-sm">Post</span>
                </div>
              </div>
            </div>

            {/* Influencer Details Card */}
            <div className="bg-white p-4 rounded-2xl">
              <h3 className="font-semibold text-lg">Influencer Details</h3>
              <div className="flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Courtney Henry
                  </h3>
                  <p className="text-sm text-gray-500">Ahmedabad, India</p>
                  <div className="flex items-center text-yellow-500 text-sm">
                    <RiStarFill />
                    <RiStarFill />
                    <RiStarFill />
                    <RiStarFill />
                    <RiStarLine className="text-gray-300" />
                    <span className="ml-2 text-gray-700">4.2 (112)</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {["Fashion", "Beauty", "Fitness", "Other"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <hr className="my-4 border-gray-200" />

              {/* Social Counts */}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-700">
                <span className="flex items-center gap-1">
                  <RiInstagramFill className="text-pink-600" /> 11.5k
                </span>
                <span className="flex items-center gap-1">
                  <RiYoutubeFill className="text-red-600" /> 10.2k
                </span>
                <span className="flex items-center gap-1">
                  <RiFacebookFill className="text-blue-600" /> 2.1k
                </span>
                <span className="flex items-center gap-1">
                  <RiTiktokFill className="text-black" /> 2.1k
                </span>
              </div>
              <hr className="my-4 border-gray-200" />

              {/* Buttons */}
              <div className="flex gap-3 mt-4">
                <button className="flex-1 border border-gray-300 text-gray-800 rounded-full py-2 text-sm font-medium hover:bg-gray-100 transition">
                  View Profile
                </button>
                <button className="flex-1 bg-[#141843] text-white rounded-full py-2 text-sm font-medium hover:bg-[#1d214f] transition">
                  Message
                </button>
              </div>
            </div>
             {/* Track Campaign */}
          <div className="bg-white p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-4">Track Campaign</h3>
            <div className="relative">
              <div className="absolute left-2 top-0 h-full border-l-2 border-dashed border-gray-300"></div>
              {steps.map((step, idx) => (
                <div key={idx} className="relative pl-10 pb-6">
                  <span className="absolute left-0 top-1 text-gray-700">
                    <RiCheckboxBlankCircleLine size={18} />
                  </span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{step.name}</h4>
                    <p className="text-sm text-gray-600">{step.date}</p>
                  </div>
                </div>
              ))}
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
          {[
            "Cancel Reason 1",
            "Cancel Reason 2",
            "Cancel Reason 3",
            "Cancel Reason 4",
          ].map((reason, index) => (
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
          ))}
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

export default VendorFilesMedia;
