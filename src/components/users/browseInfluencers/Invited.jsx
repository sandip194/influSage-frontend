import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Pagination, Empty,  } from "antd";
import { toast } from "react-toastify";
import {  useNavigate,  } from "react-router-dom";
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

const Invited = () => {
  const [influencers, setInfluencers] = useState([]);
  const [totalInfluencers, setTotalInfluencers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState("invited");
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  const [filters, setFilters] = useState({
    pagenumber: 1,
    pagesize: 15,
    sortby: "createddate",
    sortorder: "desc",
  });

  const navigate = useNavigate();
  const { token, userId } = useSelector(state => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;



  const fetchInvitedInfluencers = async () => {

    setLoading(true);
    try {
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

      setInfluencers(influencersData);
      setTotalInfluencers(totalCount);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load influencers");
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

      fetchInvitedInfluencers()
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong");
    }
  };
  // for invite
  const handleInvite = async (influencerId) => {
    if (!userId) return toast.error("User not logged in");

    setSelectedInfluencer(influencerId);
    setIsInviteModalVisible(true);
  };

  useEffect(() => {
    if (activeTab === "invited") {
      fetchInvitedInfluencers();
    }
  }, [filters.pagenumber, filters.pagesize, searchTerm, activeTab]);

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
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
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

export default Invited;
