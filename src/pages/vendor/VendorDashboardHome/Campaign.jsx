import React from "react";
import { RiMoreFill, RiTiktokFill, RiInstagramFill, RiYoutubeFill, RiMapPin2Line, RiMessage3Line, RiUser3Line } from "@remixicon/react";

const Campaign = () => {
  const campaigns = [
    {
      id: 1,
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-700",
      icon: <RiTiktokFill className="text-2xl text-black" />,
      title: "Instagram Campaign",
      subtitle: "Tiktokstar",
      type: "Tiktok Video",
      date: "16 Jan,2025",
    },
    {
      id: 2,
      status: "Rejected",
      statusColor: "bg-red-100 text-red-700",
      icon: <RiInstagramFill className="text-2xl text-pink-600" />,
      title: "Instagram Campaign",
      subtitle: "Yourinsta",
      type: "Instagram Reel",
      date: "16 Jan,2025",
    },
    {
      id: 3,
      status: "Completed",
      statusColor: "bg-green-100 text-green-700",
      icon: <RiYoutubeFill className="text-2xl text-red-600" />,
      title: "Instagram Campaign",
      subtitle: "YourTeam",
      type: "YouTube Short",
      date: "16 Jan,2025",
    },
  ];

  const influencers = [
    {
      id: 1,
      name: "Jenny Willson",
      location: "Ahmedabad, India",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      tags: ["Fashion", "Beauty", "Fitness", "Other"],
      stats: { youtube: "11.5k", insta: "10.2k", facebook: "2.1k", tiktok: "2.1k" },
    },
    {
      id: 2,
      name: "Sean Smith",
      location: "Ahmedabad, India",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      tags: ["Fashion", "Beauty", "Fitness", "Other"],
      stats: { youtube: "11.5k", insta: "10.2k", facebook: "2.1k", tiktok: "2.1k" },
    },
    {
      id: 3,
      name: "Denny Nathan",
      location: "Ahmedabad, India",
      avatar: "https://randomuser.me/api/portraits/women/25.jpg",
      tags: ["Fashion", "Beauty", "Fitness", "Other"],
      stats: { youtube: "11.5k", insta: "10.2k", facebook: "2.1k", tiktok: "2.1k" },
    },
  ];

  return (
    <div className="space-y-3">
      {/* ================= My Campaigns ================= */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 mt-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">My Campaign</h2>
          <button className="text-[#0D132D] text-sm sm:text-base font-medium hover:underline"
                >View All</button>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white border border-gray-200 rounded-xl"
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${item.statusColor}`}>
                  {item.status}
                </span>
                <RiMoreFill className="text-gray-500 cursor-pointer" />
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-full">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{item.title}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">{item.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 text-gray-500 text-xs sm:text-sm">
                <span>{item.type}</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= Browse Influencers ================= */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Browse Influencers</h2>
          <button className="text-[#0D132D] text-sm sm:text-base font-medium hover:underline"
                >View All</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {influencers.map((inf) => (
            <div
              key={inf.id}
              className="border border-gray-200 rounded-xl p-5 bg-white"
            >
              <div className="flex items-center gap-4">
                <img
                  src={inf.avatar}
                  alt={inf.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{inf.name}</h3>
                  <p className="flex items-center gap-1 text-gray-500 text-sm">
                    <RiMapPin2Line className="w-4 h-4" /> {inf.location}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {inf.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between mt-4 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <RiYoutubeFill className="text-red-600" /> {inf.stats.youtube}
                </div>
                <div className="flex items-center gap-2">
                  <RiInstagramFill className="text-pink-600" /> {inf.stats.insta}
                </div>
                <div className="flex items-center gap-2">
                  <RiUser3Line className="text-blue-600" /> {inf.stats.facebook}
                </div>
                <div className="flex items-center gap-2">
                  <RiTiktokFill className="text-black" /> {inf.stats.tiktok}
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button className="flex-1 border border-gray-300 rounded-full py-2 text-sm font-medium hover:bg-gray-50">
                  View Profile
                </button>
                <button
                    className="flex-1 bg-[#0D132D] text-white rounded-full py-2 sm:py-2.5 text-sm font-medium 
                                flex items-center justify-center gap-2"
                    >
                    <RiMessage3Line className="w-4 h-4 sm:w-5 sm:h-5" />
                    Message
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Campaign;
