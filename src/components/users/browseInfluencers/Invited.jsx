import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { RiHeartLine, RiHeartFill, RiUserAddLine } from "@remixicon/react";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Pagination, Modal, Spin, Empty, Tooltip } from "antd";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";

const Invited = () => {
  const [influencers, setInfluencers] = useState([]);
  const [totalInfluencers, setTotalInfluencers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [likedInfluencers, setLikedInfluencers] = useState(new Set());
  const [activeTab, setActiveTab] = useState("invited");
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [inviteCampaigns, setInviteCampaigns] = useState([]);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [filters, setFilters] = useState({
    pagenumber: 1,
    pagesize: 15,
    sortby: "createddate",
    sortorder: "desc",
  });

  const navigate = useNavigate();
  const { token, userId } = useSelector(state => state.auth);

const fetchInvitedInfluencers = async () => {
  if (!userId) return toast.error("User ID not found");

  setLoading(true);
  try {
    // 1️⃣ Fetch invited influencers
    const influencerRes = await axios.get("/vendor/browse/inviteinfluencer", {
      params: {
        p_pagenumber: filters.pagenumber,
        p_pagesize: filters.pagesize,
        p_search: searchTerm || null,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    const influencersData = influencerRes.data?.data?.records || [];
    const totalCount = influencerRes.data?.data?.totalcount || 0;

    // 2️⃣ Fetch favorite influencers
    const favRes = await axios.get("/vendor/getfavourite/influencer", {
      params: { userId },
      headers: { Authorization: `Bearer ${token}` },
    });

    const favIds = new Set(
      favRes.data?.data?.records?.map((inf) => inf.id) || []
    );

    // 3️⃣ Map isLiked based on favIds
    const updatedInfluencers = influencersData.map((inf) => ({
      ...inf,
      isLiked: favIds.has(inf.id),
    }));

    // 4️⃣ Update state
    setInfluencers(updatedInfluencers);
    setLikedInfluencers(favIds);
    setTotalInfluencers(totalCount);
  } catch (err) {
    console.error(err);
    toast.error("Failed to load influencers");
  } finally {
    setLoading(false);
  }
};



const handleLike = async (influencerId) => {
  if (!userId) return toast.error("User not logged in");

  setInfluencers((prev) =>
    prev.map((inf) =>
      inf.id === influencerId ? { ...inf, isLiked: !inf.isLiked } : inf
    )
  );

  try {
    const response = await axios.post(
      "/vendor/addfavourite/influencer",
      {
        p_userId: userId,
        p_influencerId: influencerId,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.status) {
      toast.success(
        influencers.find((i) => i.id === influencerId)?.isLiked
          ? "Removed from favorites"
          : "Added to favorites"
      );
    } else {
      toast.error(response.data.message || "Failed to update favourite");
    }
  } catch (err) {
    toast.error("Something went wrong");
  }
};



  // for invite
  const handleInvite = async (influencerId) => {
    if (!userId) return toast.error("User not logged in");

    setSelectedInfluencer(influencerId);
    setIsInviteModalVisible(true);
    setLoadingInvite(true);

    try {
      const res = await axios.get("/vendor/inviteinfluencer/Campaigns", {
        params: { p_userid: userId, p_influencerid: influencerId },
        headers: { Authorization: `Bearer ${token}` },
      });

      const campaigns = res.data?.data || [];
      setInviteCampaigns(campaigns);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      toast.error("Something went wrong while fetching campaigns");
    } finally {
      setLoadingInvite(false);
    }
  };

const handleBulkInvite = async () => {
  if (selectedCampaigns.length === 0) {
    toast.error("Please select at least one campaign");
    return;
  }

  try {
    setSubmitting(true);

    const formattedCampaigns = selectedCampaigns.map((id) => ({
      campaignid: id,
    }));

    const res = await axios.post(
      "/vendor/campaign/invite",
      {
        p_influencerid: selectedInfluencer,
        p_campaignidjson: formattedCampaigns,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.status === 200) {
      toast.success(res.data?.message || "Invited successfully");
      setIsInviteModalVisible(false);
      setSelectedCampaigns([]);
      if (typeof refreshData === "function") refreshData();
    } else {
      toast.error(res.data?.message || "Failed to invite");
    }
  } catch (error) {
    console.error("Invite API error:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
  } finally {
    setSubmitting(false);
  }
};

useEffect(() => {
 if (activeTab === "invited") {
    fetchInvitedInfluencers();
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
                       placeholder="Search campaigns"
                       className="w-full sm:w-auto flex-1"
                       value={searchInput}
                       onChange={(e) => setSearchInput(e.target.value)}
                       onKeyDown={(e) => {
                         const trimmedInput = searchInput.trim();
         
                         if ((e.key === "Enter" || e.key === " ") && trimmedInput !== "") {
                     setFilters((prev) => ({
                       ...prev,
                       pagesize: window.innerWidth < 640 ? 10 : 15,
                       pagenumber: 1,
                     }));
                     setSearchTerm(trimmedInput);
                         }
         
                         if (e.key === "Enter" && trimmedInput === "") {
                     // Reset search
                     setSearchTerm("");
                     setFilters((prev) => ({
                       ...prev,
                       pagesize: window.innerWidth < 640 ? 10 : 15,
                       pagenumber: 1,
                     }));
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
                    <Tooltip title={influencer.isLiked ? "UnFavorite" : "Favorite"}>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleLike(influencer.id);
                                            }}
                                            className="w-9 h-9 flex items-center justify-center rounded-full 
                               bg-[#0f122f] text-white hover:bg-[#23265a] transition"
                                          >
                                            {influencer.isLiked ? (
                                              <RiHeartFill
                                                size={20}
                                                className="text-red-500 cursor-pointer"
                                              />
                                            ) : (
                                              <RiHeartLine
                                                size={20}
                                                className="text-gray-400 cursor-pointer"
                                              />
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

      <Modal
        title={
          <h3 className="text-lg font-semibold text-[#0D132D]">
            Invite Influencer to Campaign
          </h3>
        }
        open={isInviteModalVisible}
        onCancel={() => {
          setIsInviteModalVisible(false);
          setSelectedCampaigns([]);
        }}
        footer={null}
        className="rounded-xl"
      >
        {loadingInvite ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : inviteCampaigns && inviteCampaigns.length > 0 ? (
          <div className="max-h-96 overflow-y-auto pr-2 space-y-3">
            {inviteCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                onClick={() => {
                  if (selectedCampaigns.includes(campaign.id)) {
                    setSelectedCampaigns((prev) =>
                      prev.filter((id) => id !== campaign.id)
                    );
                  } else {
                    setSelectedCampaigns((prev) => [...prev, campaign.id]);
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedCampaigns.includes(campaign.id)}
                  readOnly
                  className="w-4 h-4 accent-[#0f122f] mr-4"
                />

                <div className="flex-1">
                  <h4 className="font-semibold text-[#0D132D]">
                    {campaign.name}
                  </h4>
                  {campaign.startdate && campaign.enddate && (
                    <p className="text-xs text-gray-500">
                      {campaign.startdate} → {campaign.enddate}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No campaigns available
          </p>
        )}

        {/* Footer */}
        {inviteCampaigns.length > 0 && (
          <div className="flex justify-end sticky bottom-0 bg-white pt-4 mt-4 border-t">
            <button
              type="button"
              onClick={handleBulkInvite}
              disabled={selectedCampaigns.length === 0 || submitting}
              className="px-5 py-2 bg-[#0f122f] text-white rounded-lg font-medium 
                             hover:bg-[#23265a] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting
                ? "Inviting..."
                : `Invite Selected (${selectedCampaigns.length})`}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Invited;
