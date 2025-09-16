import React, { useState, useCallback } from "react";
import {
  RiArrowDownSLine,
  RiEyeLine,
  RiMessage2Line,
  RiSearchLine,
  RiStarLine,
  RiHeartLine,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Empty, Input, Pagination, Select, Tooltip } from "antd";
import { FaInstagram, FaYoutube, FaFacebook, FaTiktok } from "react-icons/fa";

const Invited = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleClick = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );
  const [activeTab, setActiveTab] = useState("all");
  const [likedInfluencers, setLikedInfluencers] = useState(new Set());
  const handleLike = (id) => {
    setLikedInfluencers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const influencers = [
    {
      id: 1,
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      name: "Courtney Henry",
      location: "Ahmedabad, India",
      rating: 4.2,
      reviews: 112,
      tags: ["Fashion", "Beauty", "Fitness", "Other"],
      instagram: "11.5k",
      youtube: "10.2k",
      facebook: "2.1k",
      tiktok: "2.1k",
    },
    {
      id: 2,
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      name: "Wade Warren",
      location: "Delhi, India",
      rating: 4.8,
      reviews: 98,
      tags: ["Food", "Travel"],
      instagram: "20.1k",
      youtube: "15.3k",
      facebook: "5.2k",
      tiktok: "3.4k",
    },
    {
      id: 3,
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      name: "Courtney Henry",
      location: "Ahmedabad, India",
      rating: 4.2,
      reviews: 112,
      tags: ["Fashion", "Beauty", "Fitness", "Other"],
      instagram: "11.5k",
      youtube: "10.2k",
      facebook: "2.1k",
      tiktok: "2.1k",
    },
    {
      id: 4,
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      name: "Courtney Henry",
      location: "Ahmedabad, India",
      rating: 4.2,
      reviews: 112,
      tags: ["Fashion", "Beauty", "Fitness", "Other"],
      instagram: "11.5k",
      youtube: "10.2k",
      facebook: "2.1k",
      tiktok: "2.1k",
    },
    {
      id: 5,
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      name: "Courtney Henry",
      location: "Ahmedabad, India",
      rating: 4.2,
      reviews: 112,
      tags: ["Fashion", "Beauty", "Fitness", "Other"],
      instagram: "11.5k",
      youtube: "10.2k",
      facebook: "2.1k",
      tiktok: "2.1k",
    },
  ];

  const buttons = [
    { id: "all", label: "All", path: "/vendor-dashboard/browse-influencers" },
    {
      id: "favorites",
      label: "Favorites",
      path: "/vendor-dashboard/browse-influencers/favorites",
    },
    {
      id: "invited",
      label: "Invited",
      path: "/vendor-dashboard/browse-influencers/invited",
    },
  ];

  const sortOptions = [
    { value: "createddate_desc", label: "Newest" },
    { value: "followers_desc", label: "Followers: High to Low" },
    { value: "followers_asc", label: "Followers: Low to High" },
  ];

  return (
    <div>
      <div className="header mb-4">
        <h3 className="text-2xl text-[#0D132D] font-bold mb-2">
          Browse Influencers
        </h3>
        <p className="text-base text-[#0D132D]">
          Browse Influencers To Promote Your Brand
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg mb-6 flex flex-col sm:flex-row gap-3">
        {buttons.map(({ id, label, path }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id);
              handleClick(path);
            }}
            className={`px-4 py-2 rounded-md border transition
              ${
                activeTab === id
                  ? "bg-[#141843] text-white border-[#141843]"
                  : "bg-white text-[#141843] border-gray-300 hover:bg-gray-100"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Influencers List */}
      <div className="bg-white p-4 rounded-lg">
        {/* Search + Sort + Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            size="large"
            prefix={<RiSearchLine />}
            placeholder="Search influencers"
            className="w-full sm:w-auto flex-1"
          />

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Select
              size="large"
              defaultValue="createddate_desc"
              className="w-full sm:w-48"
              placeholder="Sort By"
              suffixIcon={<RiArrowDownSLine size={16} />}
            >
              {sortOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Influencer Cards */}
        <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {influencers.map((influencer) => (
            <div
              key={influencer.id}
              className="border rounded-2xl transition hover:shadow-sm border-gray-200 bg-white p-5 flex flex-col"
            >
              {/* Profile Section */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={influencer.image}
                  alt={influencer.name}
                  loading="lazy"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="max-w-full">
                  <div className="font-semibold truncate text-gray-900">
                    {influencer.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {influencer.location}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <RiStarLine size={13} />
                    <span>
                      {influencer.rating} ({influencer.reviews})
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {influencer.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 rounded-xl text-xs text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <hr className="my-2 border-gray-200" />

              {/* Social Stats */}
              <div className="flex flex-wrap justify-between text-xs text-gray-600 mb-4 gap-3">
                <span className="flex items-center gap-1 text-pink-600">
                  <FaInstagram /> {influencer.instagram}
                </span>
                <span className="flex items-center gap-1 text-red-600">
                  <FaYoutube /> {influencer.youtube}
                </span>
                <span className="flex items-center gap-1 text-blue-600">
                  <FaFacebook /> {influencer.facebook}
                </span>
                <span className="flex items-center gap-1 text-black">
                  <FaTiktok /> {influencer.tiktok}
                </span>
              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col md:flex-row items-stretch gap-2 mt-auto">
                {/* View Profile */}
                <button
                  className="flex-1 py-2 flex items-center justify-center gap-2 
               rounded-3xl border border-gray-300 cursor-pointer 
               font-medium text-gray-700 hover:bg-gray-100 transition truncate"
                >
                  <RiEyeLine size={18} /> View Profile
                </button>

                {/* Message */}
                <Tooltip title="Message">
                  <button
                    aria-label="Message"
                    className="py-2 flex items-center justify-center rounded-3xl 
                 bg-[#0f122f] cursor-pointer text-white hover:bg-[#23265a] 
                 transition w-full md:w-12"
                  >
                    <RiMessage2Line size={18} />
                  </button>
                </Tooltip>

                {/* Like */}
                <Tooltip
                  title={
                    likedInfluencers.has(influencer.id) ? "Unlike" : "Like"
                  }
                >
                  <button
                    onClick={() => handleLike(influencer.id)}
                    aria-label={
                      likedInfluencers.has(influencer.id) ? "Unlike" : "Like"
                    }
                    className="py-2 flex items-center justify-center rounded-3xl border 
                 border-gray-300 cursor-pointer text-gray-700 hover:bg-gray-100 
                 transition w-full md:w-12"
                  >
                    {likedInfluencers.has(influencer.id) ? (
                      <RiHeartFill size={18} color="red" />
                    ) : (
                      <RiHeartLine size={18} />
                    )}
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <Pagination current={1} pageSize={10} total={20} showSizeChanger />
        </div>
      </div>
    </div>
  );
};

export default Invited;
