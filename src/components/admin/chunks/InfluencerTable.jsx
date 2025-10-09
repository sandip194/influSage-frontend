import React, { useState } from "react";
import { Input, Tooltip, Select } from "antd";
import {
  RiCheckLine,
  RiCloseLine,
  RiEyeLine,
  RiArrowDownSLine,
} from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";

// Mock data
const mockInfluencers = [
  {
    id: 1,
    name: "Jane Fitness",
    username: "@fitlife_jane",
    avatar: "https://i.pravatar.cc/100?img=13",
    platforms: ["IG", "TikTok"],
    followers: {
      IG: "45K",
      TikTok: "120K",
    },
    category: "Fitness",
    location: "Los Angeles, USA",
    appliedOn: "2025-10-06",
  },
  {
    id: 2,
    name: "Alex Tech",
    username: "@tech_guru",
    avatar: "https://i.pravatar.cc/100?img=14",
    platforms: ["YouTube"],
    followers: {
      YouTube: "80K",
    },
    category: "Tech",
    location: "New York, USA",
    appliedOn: "2025-10-07",
  },
  {
    id: 3,
    name: "Priya Sharma",
    username: "@foodie_life",
    avatar: "https://i.pravatar.cc/100?img=15",
    platforms: ["IG"],
    followers: {
      IG: "22K",
    },
    category: "Food",
    location: "Mumbai, India",
    appliedOn: "2025-10-09",
  },
];

// Platform badge color map
const platformColors = {
  IG: "bg-pink-200 text-pink-700",
  YouTube: "bg-red-200 text-red-700",
  TikTok: "bg-black text-white",
};

// Category badge colors
const categoryColors = {
  Fitness: "bg-orange-100 text-orange-600",
  Tech: "bg-blue-100 text-blue-600",
  Food: "bg-yellow-100 text-yellow-600",
};

const InfluencerTable = () => {
  const [search, setSearch] = useState("");

  // Filter logic
  const filteredData = mockInfluencers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Influencer Applications</h2>
        <Input
          size="large"
          prefix={<SearchOutlined />}
          placeholder="Search influencer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-[1000px] w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Profile</th>
              <th className="px-4 py-3">Influencer Name / Username</th>
              <th className="px-4 py-3">Platform(s)</th>
              <th className="px-4 py-3">Followers</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Applied On</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user, index) => (
              <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-gray-800">{user.name}</div>
                  <div className="text-blue-600 text-sm">{user.username}</div>
                </td>
                <td className="px-4 py-3 space-x-1">
                  {user.platforms.map((platform) => (
                    <span
                      key={platform}
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${platformColors[platform]}`}
                    >
                      {platform}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3">
                  {Object.entries(user.followers).map(([platform, count]) => (
                    <div key={platform}>
                      <span className="font-medium">{platform}:</span> {count}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[user.category]}`}
                  >
                    {user.category}
                  </span>
                </td>
                <td className="px-4 py-3">{user.location}</td>
                <td className="px-4 py-3">{user.appliedOn}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Tooltip title="Approve">
                    <button className="text-green-600 hover:text-green-700">
                      <RiCheckLine size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <button className="text-red-600 hover:text-red-700">
                      <RiCloseLine size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip title="View">
                    <button className="text-blue-600 hover:text-blue-700">
                      <RiEyeLine size={18} />
                    </button>
                  </Tooltip>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  No influencers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InfluencerTable;
