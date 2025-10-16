import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  RiEqualizerFill,
  RiCloseFill,
} from "@remixicon/react";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Pagination, Empty, Skeleton } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import InviteModal from "./InviteModal";
import InfluencerCard from "./InfluencerCard";


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
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

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
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    if (!userId) {
      toast.error("User not logged in");
      return;
    }

    try {
      const response = await axios.post(
        "/vendor/addfavourite/influencer",
        {
          p_userId: userId,
          p_influencerId: influencerId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {

        // Show toast for success
        toast.success(response?.data?.message);

      } else {
        toast.error(response.data.message || "Failed to update favourite");
      }

      getAllInfluencers()
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong");
    }
  };

  // Fetch platforms
  const getAllPlatforms = async () => {
    try {
      const res = await axios.get("providers");
      if (res.status === 200) setPlatforms(res.data.data);
    } catch (error) {
      console.error(error);
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
      console.error(error);
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
      console.error(error);
    }
  };

  // Fetch ContentTypes
  const getAllContentTypes = async () => {
    try {
      const res = await axios.get("/influencer-type", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // console.log("Content types response:", res.data);

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


  // for invite
  const handleInvite = (influencerId) => {
    if (!userId) return toast.error("User not logged in");

    setSelectedInfluencer(influencerId);
    setIsInviteModalVisible(true);
  };

  return (
        <div className="w-full text-sm pb-24 sm:pb-0">

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
      <div className="bg-white p-4 rounded-lg mb-6 flex flex-row gap-2 flex-wrap sm:flex-nowrap">
        {buttons.map(({ id, label, path }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id);
              navigate(path);
            }}
            className={`flex-1 sm:flex-none px-3 py-2 rounded-md border border-gray-300 transition text-sm
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
            placeholder="Search Influencers"
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

         {/* Desktop view */}
        <div className="hidden sm:flex gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center justify-center gap-2 border border-gray-200 rounded-md px-4 py-2 bg-white hover:bg-gray-100"
          >
            Filter
            <RiEqualizerFill size={16} />
          </button>
        </div>

        {/* Mobile view: fixed at bottom */}
        {!showFilter && (
          <div className="sm:hidden fixed bottom-0 left-0 w-full z-50 bg-white p-3 flex justify-end shadow-md">
            <button
              onClick={() => setShowFilter(true)}
              className="flex items-center justify-center gap-2 border border-gray-200 rounded-md px-4 py-2 bg-white hover:bg-gray-100 w-full max-w-xs mx-auto"
            >
              Filter
              <RiEqualizerFill size={16} />
            </button>
          </div>
        )}
        </div>

        {/* Influencers List */}
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-2xl">
                <Skeleton.Avatar active size={64} shape="circle" />
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            ))
          ) : influencers.length === 0 ? (
            <div className="col-span-full py-10">
              <Empty description="No influencers found." />
            </div>
          ) : (
            influencers.map((influencer) => (
              <InfluencerCard
                key={influencer.id}
                influencer={influencer}
                onLike={handleLike}
                onInvite={handleInvite}
                BASE_URL={BASE_URL}
              />
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
              <h4 className="font-semibold mb-2">Platforms</h4>
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

      <InviteModal
        visible={isInviteModalVisible}
        influencerId={selectedInfluencer}
        userId={userId}
        token={token}
        onClose={() => {
          setIsInviteModalVisible(false);
          setSelectedInfluencer(null);
        }}
      />
    </div>
  );
};

export default BrowseInfluencersLayout;
