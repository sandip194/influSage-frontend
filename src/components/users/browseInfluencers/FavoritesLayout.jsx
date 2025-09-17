import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { RiHeartLine, RiHeartFill, RiUserAddLine } from "@remixicon/react";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Pagination, Empty, Tooltip } from "antd";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const FavoritesLayout = () => {
  const [influencers, setInfluencers] = useState([]);
  const [totalInfluencers, setTotalInfluencers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [likedInfluencers, setLikedInfluencers] = useState(new Set());
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    pagenumber: 1,
    pagesize: 15,
    sortby: "createddate",
    sortorder: "desc",
  });

  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const getFavouriteInfluencers = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const res = await axios.get("/vendor/getfavourite/influencer", {
        params: {
          userId,
          p_pagenumber: filters.pagenumber,
          p_pagesize: filters.pagesize,
          p_search: searchTerm,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status) {
        const favData = res.data.data[0]?.fn_get_influencersave || {};
        const records = favData.records || [];
        const totalcount = favData.totalcount || 0;

        const favIds = records.map((inf) => inf.id) || [];
        setLikedInfluencers(new Set(favIds));
        setInfluencers(records);
        setTotalInfluencers(totalcount);
      }
    } catch (err) {
      console.error("Failed to fetch favourite influencers:", err);
      toast.error("Failed to load favourites");
    }
  };

  const handleLike = async (influencerId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User not logged in");
      return;
    }

    const isLiked = likedInfluencers.has(influencerId);

    // Optimistic update
    setLikedInfluencers((prev) => {
      const updated = new Set(prev);
      if (isLiked) updated.delete(influencerId);
      else updated.add(influencerId);
      return updated;
    });

    try {
      const response = await axios.post("/vendor/addfavourite/influencer", {
        p_userId: userId,
        p_influencerId: influencerId,
      });

      if (response.data.status) {
        // Show toast for success
        if (isLiked) {
          toast.success("Removed from favorites");
        } else {
          toast.success("Added to favorites");
        }
      } else {
        // Revert if API fails
        setLikedInfluencers((prev) => {
          const updated = new Set(prev);
          if (isLiked) updated.add(influencerId);
          else updated.delete(influencerId);
          return updated;
        });
        toast.error(response.data.message || "Failed to update favourite");
      }
    } catch (err) {
      // Revert if API error
      setLikedInfluencers((prev) => {
        const updated = new Set(prev);
        if (isLiked) updated.add(influencerId);
        else updated.delete(influencerId);
        return updated;
      });
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (activeTab === "favorites") {
      getFavouriteInfluencers();
    }
  }, [filters.pagenumber, filters.pagesize, searchTerm, activeTab]);

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
  const handleTabClick = (id, path) => {
    setActiveTab(id);
    setFilters((prev) => ({ ...prev, pagenumber: 1 }));
    navigate(path);
  };
  return (
    <div>
      {/* Header */}
      <div className="header mb-4">
        <h3 className="text-2xl text-[#0D132D] font-bold mb-2">
          Browse Influencers
        </h3>
        <p className="text-base text-[#0D132D]">
          Browse Influencers To Promote Your Brand
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white p-4 rounded-lg mb-6 flex flex-col sm:flex-row gap-3">
        {buttons.map(({ id, label, path }) => (
          <button
            key={id}
            onClick={() => handleTabClick(id, path)}
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

      {/* Main Card Wrapper */}
      <div className="bg-white p-4 rounded-lg">
        {/* Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search influencers"
            className="w-full sm:w-auto flex-1"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              const trimmed = searchInput.trim();
              if (e.key === "Enter") {
                setFilters((prev) => ({ ...prev, pagenumber: 1 }));
                setSearchTerm(trimmed);
              }
            }}
          />
        </div>

        {/* Influencers List */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6">
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
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
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
                    <div>
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

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Tooltip title="Invite">
                      <button
                        aria-label="Invite"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInvite(influencer.id);
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-full 
               bg-[#0f122f] text-white hover:bg-[#23265a] transition"
                      >
                        <RiUserAddLine size={16} />
                      </button>
                    </Tooltip>
                    <Tooltip
                      title={
                        likedInfluencers.has(influencer.id) ? "Unlike" : "Like"
                      }
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(influencer.id);
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-full 
               bg-[#0f122f] text-white hover:bg-[#23265a] transition"
                      >
                        {likedInfluencers.has(influencer.id) ? (
                          <RiHeartFill className="text-red-500 cursor-pointer" />
                        ) : (
                          <RiHeartLine className="text-gray-400 cursor-pointer" />
                        )}
                      </button>
                    </Tooltip>
                  </div>
                </div>

                {/* Providers */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
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
          <Pagination
            current={filters.pagenumber}
            pageSize={filters.pagesize}
            total={totalInfluencers}
            showSizeChanger
            onChange={(page, pageSize) =>
              setFilters((prev) => ({
                ...prev,
                pagenumber: page,
                pagesize: pageSize,
              }))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default FavoritesLayout;
