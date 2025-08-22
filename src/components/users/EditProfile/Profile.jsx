import {
  RiStarLine,
  RiPlayCircleFill,
  RiArrowDownSLine,
  RiStarFill,
  RiArrowUpSLine,
} from "@remixicon/react";

import React, { useState } from "react";
import { Link } from "react-router-dom";

const socialMediaData = [
  {
    name: "Instagram",
    username: "@instagramusername",
    image: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
    link: "https://instagram.com/instagramusername",
  },
  {
    name: "YouTube",
    username: "@youtubeusername",
    image: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
    link: "https://youtube.com/@youtubeusername",
  },
  {
    name: "Facebook",
    username: "@facebookusername",
    image: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
    link: "https://facebook.com/facebookusername",
  },
  {
    name: "Tiktok",
    username: "@tiktokusername",
    image: "https://cdn-icons-png.flaticon.com/512/3046/3046120.png",
    link: "https://tiktok.com/@tiktokusername",
  },
];

const portfolioData = [
  {
    id: 1,
    img: "https://images.pexels.com/photos/3768913/pexels-photo-3768913.jpeg",
    isVideo: true,
  },
  {
    id: 2,
    img: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    isVideo: true,
  },
  {
    id: 3,
    img: "https://images.pexels.com/photos/4158292/pexels-photo-4158292.jpeg",
    isVideo: true,
  },
  {
    id: 4,
    img: "https://images.pexels.com/photos/4158293/pexels-photo-4158293.jpeg",
    isVideo: false,
  },
  {
    id: 5,
    img: "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg",
    isVideo: false,
  },
  {
    id: 6,
    img: "https://images.pexels.com/photos/3764011/pexels-photo-3764011.jpeg",
    isVideo: false,
  },
  {
    id: 7,
    img: "https://images.pexels.com/photos/2533269/pexels-photo-2533269.jpeg",
    isVideo: false,
  },
  {
    id: 8,
    img: "https://images.pexels.com/photos/3761521/pexels-photo-3761521.jpeg",
    isVideo: false,
  },
];

const workHistoryData = [
  {
    id: 1,
    title: "Instagram Campaign for reels",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    user: "Cameron Williamson",
    date: "11 Nov 2024",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    rating: 4,
  },
  {
    id: 2,
    title: "Instagram Campaign for reels",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    user: "Ralph Edwards",
    date: "11 Nov 2024",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    rating: 5,
  },
  {
    id: 3,
    title: "Instagram Campaign for reels",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    user: "Jenny Wilson",
    date: "11 Nov 2024",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    rating: 3,
  },
];

const Profile = () => {
  const [showAll, setShowAll] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const visibleData = showAllHistory
    ? workHistoryData
    : workHistoryData.slice(0, 2);
  const visibleItems = showAll ? portfolioData : portfolioData.slice(0, 4);
  return (
    <div className="w-full text-sm overflow-x-hidden">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile</h2>
      <p className="mb-6 text-gray-700 text-sm">
        You can view or edit your profile from here
      </p>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Side */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {/* Banner */}
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/33350497/pexels-photo-33350497.jpeg"
                alt="Banner"
                className="w-full h-32 object-cover"
              />
              {/* Profile Image */}
              <img
                src="https://images.pexels.com/photos/25835001/pexels-photo-25835001.jpeg"
                alt="Profile"
                className="absolute left-6 -bottom-10 w-20 h-20 rounded-full border-4 border-white shadow"
              />
            </div>
            <div className="p-6 pt-14 flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Sean Smith</h2>
                  <p className="text-gray-500 text-sm">
                    seandsmith@gmail.com | +01 98765 43210
                  </p>
                </div>
              </div>
              <div className="flex gap-10 text-center mt-4 md:mt-0">
                <div>
                  <p className="text-gray-500 text-sm">Total Campaign</p>
                  <p className="font-semibold text-lg">112</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Earning</p>
                  <p className="font-semibold text-lg">$1,200</p>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Link
                to="/dashboard/editProfile"
                className="bg-[#0f122f] text-white px-5 py-2 rounded-full font-medium hover:bg-[#23265a] transition inline-block"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            {/* Bio Section */}
            <div className="mb-6">
              <h2 className="font-bold text-base mb-3">Bio</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-3 justify-content">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed justify-content">
                It has survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Categories Section */}
            <div>
              <h2 className="font-bold text-base mb-3">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {["Beauty", "Health", "Fitness", "Fashion", "Technology"].map(
                  (item, index) => (
                    <span
                      key={index}
                      className="px-4 py-1.5 text-sm bg-gray-100 rounded-full text-gray-700"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl">
            <h2 className="font-semibold text-base mb-4">Portfolio</h2>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="relative group rounded-lg overflow-hidden"
                >
                  <img
                    src={item.img}
                    alt="portfolio"
                    className="w-full h-40 object-cover"
                  />
                  {item.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition">
                      <RiPlayCircleFill className="text-white text-4xl" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* View More / View Less */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm font-semibold text-gray-700 flex items-center gap-1 hover:underline"
              >
                {showAll ? "View Less" : "View More"}{" "}
                {showAll ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h2 className="font-bold text-base mb-4">Work History</h2>
            <div className="space-y-6">
              {visibleData.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-gray-400 pb-4 last:border-none"
                >
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-gray-600 text-sm my-2">
                    {item.description}
                  </p>

                  <div className="items-center justify-between mt-2">
                    {/* Left: User Info */}
                    <div className="flex items-center gap-2">
                      <img
                        src={item.avatar}
                        alt={item.user}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {item.user}
                      </span>
                    </div>

                    {/* Rating + Date */}
                    <div className="flex items-center gap-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) =>
                          i < item.rating ? (
                            <RiStarFill
                              key={i}
                              className="text-yellow-400 w-4 h-4"
                            />
                          ) : (
                            <RiStarLine
                              key={i}
                              className="text-gray-300 w-4 h-4"
                            />
                          )
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {workHistoryData.length > 2 && (
              <div className="text-center mt-4">
                <button
                  className="flex items-center mx-auto gap-1 text-sm font-medium text-gray-600 hover:text-black"
                  onClick={() => setShowAllHistory(!showAllHistory)}
                >
                  {showAllHistory ? "View Less" : "View More"}
                  {showAllHistory ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">
          <div className="bg-white rounded-2xl p-4 shadow-sm w-full text-sm">
            <h3 className="font-semibold text-lg mb-4">Personal Details</h3>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500">Gender</p>
                <p className="font-medium text-gray-900">Male</p>
              </div>

              <hr className="my-4 border-gray-200" />

              <div>
                <p className="text-gray-500">Date Of Birth</p>
                <p className="font-medium text-gray-900">11 Nov, 1993</p>
              </div>

              <hr className="my-4 border-gray-200" />

              <div>
                <p className="text-gray-500">Address</p>
                <p className="font-medium text-gray-900">
                  4140 Parker Rd. Allentown, New Mexico 31134
                </p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-2xl p-4 text-sm w-full">
            <h3 className="font-bold mb-4 text-base">Social Media</h3>
            <div className="space-y-4">
              {socialMediaData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 p-2 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-gray-500 text-xs">{item.username}</p>
                    </div>
                  </div>
                  {index !== socialMediaData.length - 1 && (
                    <hr className="my-3 border-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pyment Details */}
          <div className="bg-white rounded-2xl p-4 text-sm w-full">
            <h3 className="font-bold mb-4 text-base">Payment Details</h3>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-xs">Country</p>
                <p className="text-gray-900 font-medium">India</p>
              </div>
              <hr className="my-4 border-gray-200" />

              <div>
                <p className="text-gray-500 text-xs">Bank</p>
                <p className="text-gray-900 font-medium">State Bank Of India</p>
              </div>
              <hr className="my-4 border-gray-200" />

              <div>
                <p className="text-gray-500 text-xs">Account Holder’s Name</p>
                <p className="text-gray-900 font-medium">Sean Smith</p>
              </div>
              <hr className="my-4 border-gray-200" />

              <div>
                <p className="text-gray-500 text-xs">Account Number</p>
                <p className="text-gray-900 font-medium">32800 **** *****</p>
              </div>
              <hr className="my-4 border-gray-200" />

              <div>
                <p className="text-gray-500 text-xs">IFSC Code</p>
                <p className="text-gray-900 font-medium">SBIN0010000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
