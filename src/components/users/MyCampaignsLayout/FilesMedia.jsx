import {
  RiMenLine,
  RiMoneyRupeeCircleLine,
  RiStackLine,
  RiTranslate,
  RiArrowLeftSLine,
  RiMoreFill,
  RiCheckboxBlankCircleLine,
  RiFileDownloadFill,
  RiChatUploadLine,
  RiDeleteBin6Line,
} from "@remixicon/react";
import React, { useState } from "react";
import { Modal, Upload, Input } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
const { TextArea } = Input;

const steps = [
  { name: "Campaign Created", date: "16 Jun 2021, 05:00 PM" },
  { name: "Campaign Processed", date: "16 Jun 2021, 05:00 PM" },
  { name: "Campaign Delivered", date: "16 Jun 2021, 05:00 PM" },
];

const files = [
  { id: 1, name: "Project Doc.pdf", size: "2.4 MB", type: "pdf" },
  { id: 2, name: "Wireframe.png", size: "2.4 MB", type: "image" },
  { id: 3, name: "Project Doc.pdf", size: "2.4 MB", type: "pdf" },
  { id: 4, name: "Wireframe.png", size: "2.4 MB", type: "image" },
  { id: 5, name: "Wireframe.png", size: "2.4 MB", type: "image" },
  { id: 6, name: "Project Doc.pdf", size: "2.4 MB", type: "pdf" },
];

const FilesMedia = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposal, setProposal] = useState("");
  const [errors, setErrors] = useState({});
  const [fileList, setFileList] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (path) => {
    navigate(path);
  };

  const handleUpload = ({ fileList }) => {
    let newErrors = {};
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "application/pdf",
      "video/mp4",
    ];
    const maxSize = 5 * 1024 * 1024;

    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;

      if (!allowedTypes.includes(file.type)) {
        newErrors.portfolioFile =
          "Invalid file type. Allowed: PNG, JPG, PDF, MP4.";
        setErrors(newErrors);
        return;
      }

      if (file.size > maxSize) {
        newErrors.portfolioFile = "File size must be less than 5MB.";
        setErrors(newErrors);
        return;
      }

      setErrors({});
    }

    setFileList(fileList);
  };

  const handleComplete = () => {
    let newErrors = {};

    if (!proposal) {
      newErrors.proposal = "Please add a bio";
    }

    if (fileList.length === 0) {
      newErrors.portfolioFile = "Please upload your file.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsModalOpen(false);
  };

  const getFileIcon = (type) => {
    if (type === "pdf")
      return (
        <img
          src="https://img.icons8.com/color/48/000000/pdf.png"
          alt="pdf"
          className="w-10 h-10"
        />
      );
    if (type === "image")
      return (
        <img
          src="https://img.icons8.com/color/48/000000/image.png"
          alt="img"
          className="w-10 h-10 rounded-md"
        />
      );
  };

  const buttons = [
    {
      id: "overview",
      label: "Overview",
      path: "/dashboard/my-campaigns/details/",
    },
    {
      id: "activity",
      label: "Activity",
      path: "/dashboard/my-campaigns/Activity/",
    },
    {
      id: "message",
      label: "Message",
      path: "/dashboard/my-campaigns/Message/",
    },
    {
      id: "files&medis",
      label: "Files & Media",
      path: "/dashboard/my-campaigns/FilesMedia/",
    },
  ];

  const selectedButton = buttons.find((b) => location.pathname === b.path)?.id;

  return (
    <div className="w-full text-sm overflow-x-hidden">
      <button
        onClick={() => window.history.back()}
        className="text-gray-600 flex items-center gap-2 hover:text-gray-900 transition"
      >
        <RiArrowLeftSLine /> Back
      </button>
      <h1 className="text-2xl font-semibold mb-4">Campaign Details</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Side */}
        <div className="flex-1 space-y-4">
          {/* Banner */}
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
                className="absolute rounded-full top-18 left-4 w-22 h-22 "
              />
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="font-semibold text-lg">
                      Instagram Campaign
                    </h2>
                    <p className="text-gray-500 text-sm">Tiktokstar</p>
                  </div>
                </div>

                {/* Right: Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#0f122f] text-white font-semibold rounded-full px-6 py-2 hover:bg-[#23265a] transition"
                  >
                    Mark As Complete
                  </button>
                  <button className="p-2 rounded-full border border-gray-300 text-gray-500 hover:text-black hover:border-gray-500">
                    <RiMoreFill className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Campaign Details Section */}
              <div className="flex flex-wrap md:justify-around mt-3 gap-6 border border-gray-200 rounded-2xl p-4">
                <div>
                  <div className="flex gap-2 items-center mb-2 text-gray-400">
                    <RiStackLine className="w-5" />
                    <span>Platform</span>
                  </div>
                  <p>Instagram Reels</p>
                  <p>Youtube Video</p>
                </div>
                <div>
                  <div className="flex gap-2 items-center mb-2 text-gray-400">
                    <RiMoneyRupeeCircleLine className="w-5" />
                    <span>Budget</span>
                  </div>
                  <p>$120-$150/Reel</p>
                </div>
                <div>
                  <div className="flex gap-2 items-center mb-2 text-gray-400">
                    <RiTranslate className="w-5" />
                    <span>Language</span>
                  </div>
                  <p>English</p>
                  <p>Hindi</p>
                  <p>Gujarati</p>
                  <p>Maliyalam</p>
                  <p>Telugu</p>
                </div>
                <div>
                  <div className="flex gap-2 items-center mb-2 text-gray-400">
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

          <div className="bg-white p-5 rounded-2xl">
            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {buttons.map(({ id, label, path }) => (
                <button
                  key={id}
                  onClick={() => handleClick(path)}
                  className={`px-4 py-2 rounded-md border border-gray-300 transition
          ${
            selectedButton === id
              ? "bg-[#0f122f] text-white"
              : "bg-white text-[#141843] hover:bg-gray-100"
          }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <hr className="border-gray-200" />

            {/* Content based on selected button */}
            <div className="bg-white p-4 rounded-2xl">
              <h3 className="font-semibold text-lg mb-4">Attachments</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between border border-gray-200 rounded-2xl p-3 transition"
                  >
                    {/* File Info */}
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div>
                        <p className="font-medium text-sm text-gray-800">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                    </div>

                    {/* Download Icon */}
                    <button className="p-2 rounded-full hover:bg-gray-100 transition">
                      <RiFileDownloadFill className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">
          {/* Campaign Details */}
          <div className="bg-white p-4 rounded-2xl">
            <h3 className="font-semibold text-lg">Campaign Details</h3>
            <div className="py-4 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Campaign Number</p>
              <p>#251HJ8888410Kl</p>
            </div>
            <div className="py-4 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Order By</p>
              <p>Tiktokstar</p>
            </div>
            <div className="py-4 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Delivery Date</p>
              <p>22 June, 2025</p>
            </div>
            <div className="py-4 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Total Price</p>
              <p>250R</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-4">Track Campaign</h3>

            <div className="relative">
              {/* Vertical Dashed Line */}
              <div className="absolute left-2 top-0 h-full border-l-2 border-dashed border-gray-300"></div>

              {steps.map((step, idx) => (
                <div key={idx} className="relative pl-10 pb-6">
                  {/* Circle Icon */}
                  <span className="absolute left-0 top-1 text-gray-700">
                    <RiCheckboxBlankCircleLine size={18} />
                  </span>

                  {/* Step Details */}
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

      {/* Design Modal */}
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

        <div className="mb-4">
          <label className="block font-medium text-sm mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <TextArea
            rows={3}
            placeholder="Enter your bio..."
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            status={errors.proposal ? "error" : ""}
          />
          {errors.proposal && (
            <p className="text-red-500 text-xs mt-1">{errors.proposal}</p>
          )}
        </div>

        <div className="mb-4">
          <Upload.Dragger
            beforeUpload={() => false}
            maxCount={1}
            fileList={fileList}
            onChange={handleUpload}
            accept=".png,.jpg,.jpeg,.pdf,.mp4"
          >
            <p className="ant-upload-drag-icon">
              <RiChatUploadLine className="text-2xl text-gray-600 mx-auto" />
            </p>
            <p className="ant-upload-text font-semibold">
              Click or drag to upload
            </p>
            <p className="ant-upload-hint text-sm text-gray-500">
              Supported: PNG, JPG, MP4, PDF (Max 5MB)
            </p>
          </Upload.Dragger>
          {errors.portfolioFile && (
            <p className="text-red-500 text-xs mt-1">{errors.portfolioFile}</p>
          )}
        </div>

        <div className="references py-4 border-b-1 border-gray-200">
          <div className="flex gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="relative w-48 h-40 rounded-2xl overflow-hidden"
              >
                <img
                  src={`https://images.pexels.com/photos/32429493/pexels-photo-32429493.jpeg?_gl=1*bt0pi*_ga*MTYyNzc2NDMzNi4xNzM2MTY4MzY0*_ga_8JE65Q40S6*czE3NTU1OTExMTYkbzMkZzEkdDE3NTU1OTExMjIkajU0JGwwJGgw`}
                  alt="Reference"
                  className="w-full h-full object-cover"
                />
                <button className="absolute cursor-pointer top-2 right-2 bg-gray-100 bg-opacity-10 text-black p-2 rounded-full">
                  <RiDeleteBin6Line className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

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
    </div>
  );
};

export default FilesMedia;
