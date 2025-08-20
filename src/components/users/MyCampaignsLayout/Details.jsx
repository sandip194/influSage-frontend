import {
  RiCheckboxCircleFill,
  RiMenLine,
  RiMoneyRupeeCircleLine,
  RiStackLine,
  RiTranslate,
  RiArrowLeftSLine,
  RiStarLine,
  RiArrowDownSLine,
  RiMoreFill,
  RiCalendarLine,
} from "@remixicon/react";
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

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

const BrandReviews = [
  {
    name: "Cameron Williamson",
    date: "11 Nov 2024",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 1,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
  },
  {
    name: "Eleanor Pena",
    date: "11 Nov 2024",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 2,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
  },
  {
    name: "Albert Flores",
    date: "11 Nov 2024",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    rating: 3,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
  },
];

const SimilarCampaigns = [
  {
    name: "Instagram Campaign",
    brand: "Tiktokstar",
    image: "https://cdn-icons-png.flaticon.com/512/1384/1384063.png",
  },
  {
    name: "Tiktok Campaign",
    brand: "Tiktokstar",
    image: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
  },
  {
    name: "Youtube Campaign",
    brand: "Tiktokstar",
    image: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
  },
  {
    name: "Facebook Campaign",
    brand: "Tiktokstar",
    image: "https://cdn-icons-png.flaticon.com/512/1384/1384053.png",
  },
];

const Details = () => {
  const [selected, setSelected] = useState("overview");

  const navigate = useNavigate();
  const location = useLocation();

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
      path: "/dashboard/my-campaigns/details/",
    },
    {
      id: "message",
      label: "Message",
      path: "/dashboard/my-campaigns/details/",
    },
    {
      id: "files&medis",
      label: "Files & Media",
      path: "/dashboard/my-campaigns/details/",
    },
  ];

  const selectedButton = buttons.find((b) => location.pathname === b.path)?.id;

  return (
    <div className="w-full max-w-7xl mx-auto text-sm overflow-x-hidden">
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
                src="https://images.pexels.com/photos/33350497/pexels-photo-33350497.jpeg?_gl=1*1dx09le*_ga*MTYyNzc2NDMzNi4xNzM2MTY4MzY0*_ga_8JE65Q40S6*czE3NTU1ODI1NDQkbzIkZzEkdDE3NTU1ODMzNzgkajUyJGwwJGgw"
                alt="Banner"
                className="w-full h-28 object-cover"
              />
              <img
                src="https://images.pexels.com/photos/25835001/pexels-photo-25835001.jpeg?_gl=1*vflnmv*_ga*MTYyNzc2NDMzNi4xNzM2MTY4MzY0*_ga_8JE65Q40S6*czE3NTU1ODI1NDQkbzIkZzEkdDE3NTU1ODI2ODEkajUwJGwwJGgw"
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
                  <button className="bg-[#0f122f] text-white font-semibold rounded-full px-6 py-2 hover:bg-[#23265a] transition">
                    Mark As Complete
                  </button>
                  <button className="p-2 rounded-full border border-gray-300 text-gray-500 hover:text-black hover:border-gray-500">
                    <RiMoreFill className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Campaign Details Section */}
              <div className="flex flex-wrap md:justify-around mt-3 gap-6 border border-gray-200 rounded-2xl p-4">
                <div className="flex-row items-center gap-2">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiStackLine className="w-5" />
                    <span>Platform</span>
                  </div>
                  <p>Instagram Reels</p>
                  <p>Youtube Video</p>
                </div>
                <div className="flex-row items-center justify-center gap-2">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiMoneyRupeeCircleLine className="w-5" />
                    <span>Budget</span>
                  </div>
                  <p>$120-$150/Reel</p>
                </div>
                <div className="flex-row items-center justify-center gap-2">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiTranslate className="w-5" />
                    <span>Language</span>
                  </div>
                  <p>English</p>
                  <p>Hindi</p>
                  <p>Gujarati</p>
                  <p>Maliyalam</p>
                  <p>Telugu</p>
                </div>
                <div className="flex-row items-center justify-center gap-2">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiMenLine className="w-5" />
                    <span>Gender</span>
                  </div>
                  <p>Male</p>
                  <p>Female</p>
                  <p>Othere</p>
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

            <hr className="my-4 border-gray-200" />

            {/* Description */}
            <div className="campaign-description border-b border-gray-200">
              <h3 className="font-semibold text-lg mb-2">
                Campaign Description
              </h3>
              <p className="text-gray-700 leading-relaxed py-4">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry...
              </p>
            </div>

            {/* Requirements */}
            <div className="requirements py-4 border-b-1 border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Requirements</h3>
              <ul className="space-y-2 text-gray-700">
                {Requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <RiCheckboxCircleFill />
                    <span>
                      {item.label} <strong>{item.value}</strong>
                    </span>
                  </li>
                ))}
              </ul>

              <hr className="my-4 border-gray-200" />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {["Fixed Price", "Expert", "Beauty", "Micro Influencer"].map(
                  (tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>

              {/* Milestones
              <h3 className="font-semibold text-base mb-2 my-4">Milestones</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map((_, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl p-4 space-y-2"
                  >
                    <p className="text-gray-600 text-sm">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Read More...
                    </p>
                    <hr className="my-2 border-gray-200 my-3" />
                    <div className="flex items-center text-gray-500 text-sm gap-2">
                      <RiMoneyDollarCircleLine className="w-4 h-4" />
                      <span className="text-gray-800 font-medium my-3">
                        120.25 / Video
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm gap-2">
                      <RiCalendarLine className="w-4 h-4" />
                      <span className="text-gray-800 font-medium">
                        11 Jun, 2025
                      </span>
                    </div>
                  </div>
                ))}
              </div> */}

            </div>
          </div>

          {/* Brand Reviews */}
          <div className="bg-white p-4 rounded-2xl mt-4">
            <h3 className="font-semibold text-lg mb-4">
              Brand’s Recent History
            </h3>
            <div className="space-y-6">
              {BrandReviews.map((review, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <RiStarLine
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm">{review.text}</p>
                  <hr className="my-4 border-gray-200" />
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm flex items-center gap-1 font:bold hover:underline">
              View More <RiArrowDownSLine size={20} />
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">
          <div className="bg-white rounded-2xl p-4 shadow-sm w-full text-sm">
            <h3 className="font-semibold text-lg mb-4">About Brand</h3>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500">Brand Name</p>
                <p className="font-medium text-gray-900">Tiktokstar</p>
              </div>

              <hr className="my-4 border-gray-200" />

              <div>
                <p className="text-gray-500">Industry</p>
                <p className="font-medium text-gray-900">Health & Beauty</p>
              </div>

              <hr className="my-4 border-gray-200" />

              <div>
                <p className="text-gray-500">Brand Location</p>
                <p className="font-medium text-gray-900">India</p>
              </div>

              <hr className="my-4 border-gray-200" />

              <div>
                <p className="text-gray-500">Total Campaign Posted</p>
                <p className="font-medium text-gray-900">118 Campaign posted</p>
              </div>

              <hr className="my-4 border-gray-200" />

              <div>
                <p className="text-gray-500 mb-1">Reviews</p>
                <div className="flex items-center gap-2 text-gray-800">
                  <div className="flex">
                    <span>
                      <RiStarLine size={20} />
                    </span>
                    <span>
                      <RiStarLine size={20} />
                    </span>
                    <span>
                      <RiStarLine size={20} />
                    </span>
                    <span>
                      <RiStarLine size={20} />
                    </span>
                    <span>
                      <RiStarLine size={20} />
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">4.8</span>
                  <span className="text-gray-500">(1,245 Reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Campaigns */}
          <div className="bg-white rounded-2xl p-4 text-sm w-full">
            <h3 className="font-bold mb-4 text-base">Similar Campaigns</h3>
            <div className="space-y-4">
              {SimilarCampaigns.map((campaign, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3">
                    <img
                      src={campaign.image}
                      alt={campaign.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {campaign.name}
                      </p>
                      <p className="text-gray-500 text-xs">{campaign.brand}</p>
                    </div>
                  </div>
                  {index !== SimilarCampaigns.length - 1 && (
                    <hr className="my-3 border-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
