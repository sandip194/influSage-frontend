import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import {
  RiArrowDownSLine,
  RiEqualizerFill,
  RiCloseFill,
  RiMessage2Line,
  RiStarLine,
  RiHeartLine,
  RiHeartFill,
  RiSearchLine,
} from "react-icons/ri";
import { useNavigate, Link } from "react-router-dom";
import { Empty, Input, Pagination, Select, Tooltip } from "antd";

const BrowseInfluencersLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [likedInfluencers, setLikedInfluencers] = useState(new Set());
  const [showFilter, setShowFilter] = useState(false);
  const [total, setTotal] = useState(0);
  const [influencers, setInfluencers] = useState([]);

  const handleClick = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  // Fetch Influencers
  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const res = await axios.get("/vendor/allinfluencer/browse");
        const records =
          res.data?.data?.[0]?.fn_get_influencerbrowse?.records || [];
        const totalcount =
          res.data?.data?.[0]?.fn_get_influencerbrowse?.totalcount || 0;

        setInfluencers(records);
        setTotal(totalcount);
      } catch (error) {
        console.error("Failed to fetch influencers", error);
      }
    };

    fetchInfluencers();
  }, []);

  useEffect(() => {
  const fetchInfluencers = async () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");
      // Fetch all influencers
      const res = await axios.get("/vendor/allinfluencer/browse");
      const records =
        res.data?.data?.[0]?.fn_get_influencerbrowse?.records || [];
      const totalcount =
        res.data?.data?.[0]?.fn_get_influencerbrowse?.totalcount || 0;

      setInfluencers(records);
      setTotal(totalcount);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch influencers", error);
      setLoading(false);
    }
  };

  fetchInfluencers();
}, []);

const handleLike = async (influencerId) => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    toast.error("User not logged in");
    return;
  }

  const isLiked = likedInfluencers.has(influencerId);

  setLikedInfluencers((prev) => {
    const newSet = new Set(prev);
    isLiked ? newSet.delete(influencerId) : newSet.add(influencerId);
    return newSet;
  });

  try {
    const response = await axios.post("/vendor/addfavourite/influencer", {
      userId,
      influencerId,
    });

    if (response.data.status) {
      toast.success(
        !isLiked ? "Added to favourites!" : "Removed from favourites!"
      );
    } else {
      toast.error(response.data.message || "Failed to update favourite");

      setLikedInfluencers((prev) => {
        const newSet = new Set(prev);
        isLiked ? newSet.add(influencerId) : newSet.delete(influencerId);
        return newSet;
      });
    }
  } catch (error) {
    console.error("Error calling favourite API:", error);
    toast.error("Something went wrong. Please try again.");
    
    setLikedInfluencers((prev) => {
      const newSet = new Set(prev);
      isLiked ? newSet.add(influencerId) : newSet.delete(influencerId);
      return newSet;
    });
  }
};

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

            <button
              onClick={() => setShowFilter(true)}
              className="flex items-center justify-center gap-2 border border-gray-200 rounded-md px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 transition"
            >
              Filter <RiEqualizerFill size={16} />
            </button>
          </div>
        </div>

        {/* Influencer Cards */}
        <div className={`grid gap-6 flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6`} >
          {loading ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              Loading influencers...
            </div>
          ) : influencers.length === 0 ? (
            <div className="col-span-full py-10">
              <Empty description="No influencers found." />
            </div>
          ) : (
            influencers.map((influencer) => (
              <div
                key={influencer.id}
                className="border rounded-2xl transition border-gray-200 bg-white p-5 flex flex-col cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/influencer/${influencer.id}`)}
              >

                {/* Profile Section */}
                <div className="flex items-center justify-between mb-3">
                  {/* Left: Avatar + Details */}
                  <div className="flex items-center gap-3 h">
                    <img
                      src={
                        influencer.photopath
                          ? `http://localhost:3001/${influencer.photopath}`
                          : "https://via.placeholder.com/150"
                      }
                      alt="profile"
                      loading="lazy"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="max-w-full">
                      <Link
                        to={`vendor-dashboard/browse-influencers/influencer/${influencer.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-gray-900 truncate hover:text-blue-600 hover:underline"
                      >
                        {influencer.firstname} {influencer.lastname}
                      </Link>

                      <div className="text-xs text-gray-500">
                        {influencer.statename}, {influencer.countryname}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {influencer.contentlanguages?.map((lang, idx) => (
                          <span key={idx}>
                            {lang.languagename}
                            {idx < influencer.contentlanguages.length - 1 &&
                              ", "}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Footer Buttons */}
                  <div className="flex gap-2">
                    <Tooltip title="Message">
                      <button
                        aria-label="Message"
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 flex items-center justify-center rounded-3xl 
               bg-[#0f122f] text-white hover:bg-[#23265a] transition"
                      >
                        <RiMessage2Line size={16} />
                      </button>
                    </Tooltip>

                    <Tooltip
                      title={likedInfluencers.has(influencer.id) ? "Unlike" : "Like"}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(influencer.id);
                        }}
                        aria-label={
                          likedInfluencers.has(influencer.id) ? "Unlike" : "Like"
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-3xl bg-[#0f122f] text-white hover:bg-[#23265a] transition"
                      >
                        {likedInfluencers.has(influencer.id) ? (
                          <RiHeartFill size={16} color="red" />
                        ) : (
                          <RiHeartLine size={16} />
                        )}
                      </button>
                    </Tooltip>
                  </div>
                </div>

                {/* Providers (Followers) */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-0">
                {influencer.providers
                    ?.filter((p) => p.nooffollowers > 0)
                    .map((p) => (
                    <span
                        key={p.providerid}
                        className="flex items-center gap-1"
                    >
                        <img
                        src={`http://localhost:3001/${p.iconpath}`}
                        alt={p.providername}
                        className="w-4 h-4"
                        />
                        {p.nooffollowers}
                    </span>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <Pagination current={1} pageSize={10} total={total} showSizeChanger />
        </div>
      </div>

      {/* Side Filter */}
      {showFilter && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowFilter(false)}
          />
          <div className="fixed top-0 right-0 w-80 h-full bg-white p-4 z-50 shadow-lg overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filter</h3>
              <button
                onClick={() => setShowFilter(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                <RiCloseFill size={20} />
              </button>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Location */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                size="middle"
                placeholder="Search"
                prefix={<RiSearchLine />}
                className="w-full"
              />
            </div>

            {/* Platform */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Platform</label>
              <div className="flex flex-col gap-1">
                {["All", "Instagram", "Youtube", "Facebook", "Tiktok"].map(
                  (platform) => (
                    <label
                      key={platform}
                      className="flex items-center gap-2 text-gray-700 text-sm"
                    >
                      <input type="checkbox" className="w-4 h-4" />
                      {platform}
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Followers */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Followers
              </label>
              <div className="flex flex-col gap-1">
                {[
                  "All",
                  "Nano (5k-10k followers)",
                  "Micro (10k-100k followers)",
                  "Macro (100k-1M followers)",
                  "Mega (Over 1M followers)",
                ].map((f) => (
                  <label
                    key={f}
                    className="flex items-center gap-2 text-gray-700 text-sm"
                  >
                    <input type="checkbox" className="w-4 h-4" />
                    {f}
                  </label>
                ))}
              </div>
            </div>

            {/* Ratings */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Ratings</label>
              <div className="flex flex-col gap-1">
                {[5, 4, 3, 2, 1].map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-2 text-gray-700 text-sm"
                  >
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="flex">
                      {[...Array(r)].map((_, i) => (
                        <RiStarLine key={i} />
                      ))}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Gender</label>
              <div className="flex flex-col gap-1">
                {["All", "Male", "Female"].map((g) => (
                  <label
                    key={g}
                    className="flex items-center gap-2 text-gray-700 text-sm"
                  >
                    <input type="checkbox" className="w-4 h-4" />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Language</label>
              <div className="flex flex-col gap-1">
                {["All", "English", "Hindi", "Gujarati"].map((lang) => (
                  <label
                    key={lang}
                    className="flex items-center gap-2 text-gray-700 text-sm"
                  >
                    <input type="checkbox" className="w-4 h-4" />
                    {lang}
                  </label>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between mt-6">
              <button className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition w-1/2 mr-2">
                Clear
              </button>
              <button className="px-4 py-2 rounded-md bg-[#0f122f] text-white hover:bg-[#23265a] transition w-1/2 ml-2">
                Filter
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BrowseInfluencersLayout;
