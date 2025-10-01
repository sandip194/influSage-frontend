import {
  RiCheckboxCircleFill,
  RiMenLine,
  RiMoneyRupeeCircleLine,
  RiStackLine,
  RiTranslate,
  RiArrowLeftSLine,
  RiMoreFill,
  RiCheckboxBlankCircleLine,
  RiChatUploadLine,
  RiDeleteBin6Line,
  RiInstagramFill,
  RiYoutubeFill,
} from '@remixicon/react';
import React, { useEffect, useState } from 'react';
import { Modal, Upload, Input } from 'antd';
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
const { TextArea } = Input;

const Requirements = [
  { label: "Shopify User: ", value: "Yes" },
  {
    label: "Expectation: ",
    value:
      "Post my existing content Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
  },
  { label: "Due Date: ", value: "11 Jul 2025" },
  { label: "Ship Products: ", value: "Yes" },
  { label: "Target Country: ", value: "India" },
  { label: "Duration: ", value: "2 Months" },
  { label: "Offers: ", value: "Allow Influencer to make offers" },
];

const milestones = [
  {
    name: "Milestone Name 1",
    amount: "$12.35",
    dueDate: "16 Jun 2021, 05:00 PM",
    status: "Paid",
  },
  {
    name: "Milestone Name 2",
    amount: "$12.35",
    dueDate: "16 Jun 2021, 05:00 PM",
    status: "Paid",
  },
  {
    name: "Milestone Name 3",
    amount: "$12.35",
    dueDate: "16 Jun 2021, 05:00 PM",
    status: "Pending",
  },
];

const steps = [
  { name: "Campaign Created", date: "16 Jun 2021, 05:00 PM" },
  { name: "Campaign Processed", date: "16 Jun 2021, 05:00 PM" },
  { name: "Campaign Delivered", date: "16 Jun 2021, 05:00 PM" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-600";
    case "Pending":
      return "bg-yellow-100 text-yellow-600";
    case "Overdue":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const Details = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposal, setProposal] = useState("");
  const [errors, setErrors] = useState({});
  const [fileList, setFileList] = useState([]);
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();
  const location = useLocation();
  const { campaignId } = useParams()
  const { token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  const getCampaignDetail = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`user/influencer-campaign/${campaignId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setCampaign(res.data.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCampaignDetail()
  }, [])

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

  const handleClick = (path) => {
    navigate(path);
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

  if (!campaign) return <div>No campaign data available.</div>;

  return (
    <div className="w-full text-sm overflow-x-hidden">
      <h1 className="text-2xl font-semibold mb-4">Campaign Details</h1>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Section */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="relative h-40 bg-gray-200">
              <img
                src={`${BASE_URL}/${campaign.photopath}`}
                alt="Logo"
                className="absolute rounded-full top-14 left-4 w-20 h-20 border-4 border-white object-cover"
              />
            </div>

            <div className="p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div>
                  <h2 className="font-semibold text-lg">{campaign.name}</h2>
                  <p className="text-gray-500 text-sm">{campaign.businessname}</p>
                </div>
              </div>

              {/* Campaign Info */}
              <div className="flex flex-wrap justify-between gap-6 border border-gray-200 rounded-2xl p-4">
                <div>
                  <div className="flex gap-2 items-center text-gray-400 mb-2">
                    <RiMoneyRupeeCircleLine className="w-5" />
                    <span>Budget</span>
                  </div>
                  <p>₹{campaign.estimatedbudget}</p>
                </div>

                <div>
                  <div className="flex gap-2 items-center text-gray-400 mb-2">
                    <RiTranslate className="w-5" />
                    <span>Language</span>
                  </div>
                  {campaign.campaignlanguages?.map(lang => (
                    <p key={lang.languageid}>{lang.languagename}</p>
                  ))}
                </div>

                <div>
                  <div className="flex gap-2 items-center text-gray-400 mb-2">
                    <RiMenLine className="w-5" />
                    <span>Gender</span>
                  </div>
                  {campaign.campaigngenders?.map(gender => (
                    <p key={gender.genderid || Math.random()}>
                      {gender.gendername || 'Not specified'}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Description */}
          <div className="bg-white p-4 rounded-2xl">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{campaign.description}</p>
          </div>

          {/* Brand Info */}
          <div className="bg-white p-4 rounded-2xl">
            <h3 className="text-lg font-semibold mb-2">About Brand</h3>
            <p className="text-gray-600">{campaign.branddetails?.aboutbrand}</p>
            <p className="text-gray-500 text-sm mt-2">Location: {campaign.branddetails?.location}</p>
            <p className="text-gray-500 text-sm">Industry: {campaign.branddetails?.Industry}</p>
          </div>

          {/* Campaign Files */}
          <div className="bg-white p-4 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">Campaign Files</h3>
            <div className="flex gap-4 flex-wrap">
              {campaign.campaignfiles?.map((file, idx) => (
                <img
                  key={idx}
                  src={`${BASE_URL}/${file.filepath}`}
                  alt={`Campaign File ${idx + 1}`}
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">
          {/* Timeline */}
          <div className="bg-white p-6 rounded-2xl">
            <h3 className="font-semibold text-lg mb-4">Track Campaign</h3>
            <div className="relative">
              <div className="absolute left-2 top-0 h-full border-l-2 border-dashed border-gray-300"></div>
              {[
                { name: "Campaign Created", date: campaign.trackcampaign?.createddate },
                { name: "Campaign Started", date: campaign.trackcampaign?.startdate },
                { name: "Campaign Ended", date: campaign.trackcampaign?.enddate },
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

          {/* Platform Info */}
          <div className="bg-white p-4 rounded-2xl">
            <h3 className="font-semibold text-lg mb-3">Platforms</h3>
            {campaign.providercontenttype?.map((platform) => (
              <div key={platform.providercontenttypeid} className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  {platform.providerid === 1 && <RiInstagramFill className="text-pink-600" />}
                  {platform.providerid === 2 && <RiYoutubeFill className="text-red-600" />}
                  <span className="text-gray-700 font-medium">{platform.providername}</span>
                </div>
                <span className="text-gray-500 text-sm">
                  {platform.contenttypename}
                </span>
              </div>
            ))}
          </div>

          {/* Milestones */}
          <div className="bg-white p-4 rounded-2xl">
            <h3 className="font-semibold text-lg mb-3">Milestones</h3>
            {campaign.milestones?.map((milestone, index) => (
              <div key={index} className="mb-2">
                <p className="font-medium text-gray-800">{milestone.description}</p>
                <p className="text-sm text-gray-600">Due: {milestone.enddate}</p>
                <p className="text-sm text-gray-600">Amount: ₹{milestone.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details
