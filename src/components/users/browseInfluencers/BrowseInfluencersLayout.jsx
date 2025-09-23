import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  RiEqualizerFill,
  RiCloseFill,
  RiHeartLine,
  RiHeartFill,
  RiUserAddLine,
} from "@remixicon/react";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Pagination, Modal, Spin, Empty, Tooltip } from "antd";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";


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

const BrowseInfluencersLayout = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [platforms, setPlatforms] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [totalInfluencers, setTotalInfluencers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [inviteCampaigns, setInviteCampaigns] = useState([]);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [filters, setFilters] = useState({
    providers: [],
    languages: [],
    influencertiers: [],
    sortby: "createddate",
    sortorder: "desc",
    pagenumber: 1,
    pagesize: 15,
    gender: [],
    location: ""
  });
  const [draftFilters, setDraftFilters] = useState(filters);

  const navigate = useNavigate();
  const { token, userId } = useSelector(state => state.auth);

  const getAllInfluencers = async () => {
    const params = {
      p_userid: userId,
      p_location: filters?.location || null,
      p_providers: filters?.providers?.length ? JSON.stringify(filters.providers) : null,
      p_influencertiers: filters?.influencertiers?.length ? JSON.stringify(filters.influencertiers) : null,
      p_ratings: filters?.ratings?.length ? JSON.stringify(filters.ratings) : null,
      p_genders: filters?.gender?.length ? JSON.stringify(filters.gender) : null,
      p_languages: filters?.languages?.length ? JSON.stringify(filters.languages) : null,
      p_pagenumber: filters?.pagenumber || 1,
      p_pagesize: filters?.pagesize || 20,
      p_search: searchTerm?.trim() || null,
    };

    // Remove null or undefined params
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== null && v !== undefined)
    );
    try {
      setLoading(true);

      const influencerRes = await axios.get("/vendor/allinfluencer/browse", {
        params: cleanParams,
        headers: { Authorization: `Bearer ${token}` },
      })

      const influencersData = influencerRes.data?.data?.records || [];
      const totalCount = influencerRes.data?.data?.totalcount || 0;
      setInfluencers(influencersData);
      setTotalInfluencers(totalCount);

    } catch (err) {
      console.error("Error fetching influencers:", err);
      toast.error("Failed to fetch influencers");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (influencerId) => {
    try {
      const res = await axios.post(
        "/vendor/addfavourite/influencer",
        { p_userId: userId, p_influencerId: influencerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      getAllInfluencers()
    } catch (err) {
      console.log(err)
      toast.error("Something went wrong");
    }
  };

  // Fetch platforms
  const getAllPlatforms = async () => {
    try {
      const res = await axios.get("providers");
      if (res.status === 200) setPlatforms(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch languages
  const getAllLanguages = async () => {
    try {
      const res = await axios.get("languages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLanguages(res.data.languages || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Gender
  const getAllGender = async () => {
    try {
      const res = await axios.get("genders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGenderOptions(res.data.genders || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch ContentTypes
  const getAllContentTypes = async () => {
    try {
      const res = await axios.get("/vendor/influencer-type", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Content types response:", res.data);

      setContentTypes(res.data.influencerType || []);
    } catch (error) {
      console.error("Error fetching content types:", error);
      toast.error("Failed to load content types. Please try again.");
    }
  };

  const handleCheckboxChange = useCallback((category, id) => {
    setDraftFilters(prev => {
      const updated = prev[category].includes(id)
        ? prev[category].filter(v => v !== id)
        : [...prev[category], id];

      return { ...prev, [category]: updated };
    });
  }, []);


  useEffect(() => {
    getAllLanguages();
    getAllPlatforms();
    getAllContentTypes();
    getAllGender();
  }, []);

  useEffect(() => {
    getAllInfluencers();
  }, [
    filters,
    searchTerm,
  ]);

  //get Campaigns when Vendor Wants to invite Influencer for Campaign
  const getCampaigns = async (influencerId) => {
    try {
      setLoadingInvite(true);
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
  }

  // for invite
  const handleInvite = (influencerId) => {
    if (!userId) return toast.error("User not logged in");

    setSelectedInfluencer(influencerId);
    setIsInviteModalVisible(true);
    getCampaigns(influencerId)
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
      }
    } catch (error) {
      console.error("Invite API error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
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
            onClick={() => {
              setActiveTab(id);
              navigate(path);
            }}
            className={`px-4 py-2 rounded-md border transition
              ${activeTab === id
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
        {/* Search + Sort + Filter */}
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

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowFilter(true)}
              className="flex items-center justify-center gap-2 border border-gray-200 rounded-md px-4 py-2 bg-white hover:bg-gray-100"
            >
              Filter
              <RiEqualizerFill size={16} />
            </button>
          </div>
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
                className="border justify-between rounded-2xl transition border-gray-200 bg-white p-5 flex flex-col cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/vendor-dashboard/browse-influencers/influencer-details/${influencer.id}`)}
              >
                {/* Profile Section */}
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
                        to={`/vendor-dashboard/browse-influencers/influencer-details/${influencer.id}`}
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
                      <span>
                        <button
                          type="button"
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
                      </span>
                    </Tooltip>

                    <Tooltip title={influencer.savedinfluencer ? "UnFavorite" : "Favorite"}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(influencer.id);
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-full 
           bg-[#0f122f] text-white hover:bg-[#23265a] transition"
                      >
                        {influencer.savedinfluencer ? (
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

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4 mt-2">
                  {influencer.categories?.slice(0, 3).map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-300 rounded-xl text-xs"
                    >
                      {cat.categoryname}
                    </span>
                  ))}
                  {influencer.categories &&
                    influencer.categories.length > 3 && (
                      <span className="px-2 py-1 bg-gray-300 rounded-xl text-xs">
                        ...
                      </span>
                    )}
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

      {/* Filter Sidebar */}
      {showFilter && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowFilter(false)}
          />
          <div className="fixed top-0 right-0 w-80 h-full bg-white p-4 z-50 shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filter Options</h3>
              <button onClick={() => setShowFilter(false)}>
                <RiCloseFill />
              </button>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold mb-2">Location</h4>
              <Input  
                prefix={<SearchOutlined />}
                placeholder="Search"
                value={draftFilters.location}
                onChange={(e) => setDraftFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full"
              />
            </div>

            <hr className="my-4 border-gray-200" />

            <div>
              <h4 className="font-semibold mb-2">Platform</h4>
              {platforms?.map((platform) => (
                <label key={platform.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={draftFilters.providers.includes(platform.id)}
                    onChange={() =>
                      handleCheckboxChange("providers", platform.id)
                    }
                  />
                  <span className="text-sm">{platform.name}</span>
                </label>
              ))}
            </div>

            <hr className="my-4 border-gray-200" />
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Followers</h4>
              {contentTypes?.map((type) => (
                <label key={type.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={draftFilters.influencertiers?.includes(type.id)}
                    onChange={() =>
                      handleCheckboxChange("influencertiers", type.id)
                    }
                  />
                  <span className="text-sm">
                    {type.name}{" "}
                    <span>
                      (
                      {type.maxfollowers
                        ? `${type.minfollowers} - ${type.maxfollowers} followers`
                        : `Over ${type.minfollowers} followers`}
                      )
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <hr className="my-4 border-gray-200" />
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Languages</h4>
              {languages?.map((lang) => (
                <label key={lang.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={draftFilters.languages.includes(lang.id)}
                    onChange={() => handleCheckboxChange("languages", lang.id)}
                  />
                  <span className="text-sm">{lang.name}</span>
                </label>
              ))}
            </div>
            <hr className="my-4 border-gray-200" />
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Gender</h4>
              {genderOptions?.map((g) => (
                <label key={g.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={draftFilters.gender.includes(g.id)}
                    onChange={() => handleCheckboxChange("gender", g.id)}
                  />
                  <span className="text-sm">{g.name}</span>
                </label>
              ))}
            </div>
            <hr className="my-4 border-gray-200" />

            <div className="flex gap-3 mt-4 px-4">
              <button
                className="flex-1 py-2 bg-gray-200 rounded-full"
                onClick={() => {
                  const cleared = {
                    providers: [],
                    languages: [],
                    influencertiers: [],
                    gender: [],
                    sortby: "createddate",
                    sortorder: "desc",
                    pagenumber: 1,
                    pagesize: 15,
                    location: ""
                  };
                  setDraftFilters(cleared);
                  setFilters(cleared); // <-- trigger API call
                  setShowFilter(false);
                }}
              >
                Clear
              </button>

              <button
                className="flex-1 py-2 bg-[#0f122f] text-white rounded-full"
                onClick={() => {
                  setFilters(draftFilters);
                  setShowFilter(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}

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

export default BrowseInfluencersLayout;
