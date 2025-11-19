import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  RiMoreFill,
  RiTiktokFill,
  RiInstagramFill,
  RiYoutubeFill,
  RiMapPin2Line,
  RiMessage3Line,
  RiUser3Line,
} from "@remixicon/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import InfluencerCard from "../../../components/users/browseInfluencers/InfluencerCard";
import { toast } from "react-toastify";
import InviteModal from "../../../components/users/browseInfluencers/InviteModal";
import InfluencerCardNew from "./InfluencerCardNew";


const Campaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  const [influencers, setInfluencers] = useState([]);
  const [infLoading, setInfLoading] = useState(false);

  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();


  /* ===================== FETCH CAMPAIGNS (NO FILTERS) ===================== */
  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get("vendor/allcampaign", {
        params: {
          p_pagenumber: 1,
          p_pagesize: 10, // fetch 10
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const allCampaigns = res?.data?.data?.records || [];

      // Show only 6 items on dashboard
      setCampaigns(allCampaigns);

    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);



  /* ===================== FETCH INFLUENCERS (NO FILTERS) ===================== */
  const fetchInfluencers = useCallback(async () => {
    try {
      setInfLoading(true);

      const res = await axios.get("/vendor/allinfluencer/browse", {
        params: {
          p_pagenumber: 1,
          p_pagesize: 10, // fetch 10, show 6
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const allInfluencers = res?.data?.data?.records || [];

      // Only show first 6 influencers on dashboard
      setInfluencers(allInfluencers);

    } catch (error) {
      console.error("Error fetching influencers:", error);
    } finally {
      setInfLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInfluencers();
  }, [fetchInfluencers]);






  // for invite
  const handleInvite = (influencerId) => {

    setSelectedInfluencer(influencerId);
    setIsInviteModalVisible(true);
  };


  const handleLike = async (influencerId) => {

    try {
      const response = await axios.post(
        "/vendor/addfavourite/influencer",
        {
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

    } catch (err) {
      console.error(err)
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-3">
      {/* ===================== My Campaigns =================== */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 mt-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">My Campaign</h2>
          <button
            onClick={() => navigate("/vendor-dashboard/vendor-campaign")}
            className="text-[#0D132D] text-sm sm:text-base font-medium hover:underline"
          >
            View All
          </button>

        </div>


        <Swiper
          spaceBetween={15}
          slidesPerView="auto"
          freeMode={true}
          grabCursor={true}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          modules={[FreeMode, Navigation]}
          className="mySwiper pb-5"
        >
          {campaigns.map((item) => (
            <SwiperSlide key={item.id} className="!w-auto pb-4">
              <div
                className="min-w-[260px] max-w-[260px] bg-[#e6eff9]
    border border-gray-200 rounded-2xl shadow-xl/30 hover:shadow-lg transition-all duration-300 p-3 flex flex-col justify-between"
              >
                {/* ======= Top Section (Status + Menu) ======= */}
                <div className="flex justify-end items-center">
                  <span
                    className={`text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm
        ${item.status === "Completed"
                        ? "bg-green-200 text-green-800"
                        : item.status === "Pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : item.status === "Rejected"
                            ? "bg-red-200 text-red-800"
                            : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {item.status}
                  </span>

                </div>

                {/* ======= Middle Section (Image + Details) ======= */}
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={item.photopath}
                    alt={item.name}
                    className="w-14 h-14 rounded-full object-cover border border-gray-300 shadow-sm"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[16px] font-bold text-gray-900 leading-tight truncate">
                      {item.name}
                    </h3>

                    <p className="text-[11px] text-gray-500">
                      Created: {new Date(item.createddate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* ======= Budget Highlight ======= */}
                <div className="mt-4">
                  <span
                    className="inline-block bg-blue-50 text-[#0f1330] font-semibold 
        px-3 py-1 rounded-full text-xs shadow-sm"
                  >
                    Budget: ₹{item.estimatedbudget?.toLocaleString()}
                  </span>
                </div>

                {/* ======= Dates Section ======= */}
                <div className="mt-4 p-3 bg-white/40 rounded-xl border border-gray-300 text-xs text-gray-700">
                  <p>
                    <span className="font-semibold text-gray-800">Campaign Start:</span>{" "}
                    {item.campaignstartdate}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold text-gray-800">Campaign End:</span>{" "}
                    {item.campaignenddate}
                  </p>
                </div>
              </div>
            </SwiperSlide>



          ))}
        </Swiper>


      </div>


      {/* ===================== Browse Influencers ===================== */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Browse Influencers</h2>
          <button
            onClick={() => navigate("/vendor-dashboard/browse-influencers")}
            className="text-[#0D132D] text-sm sm:text-base font-medium hover:underline"
          >
            View All
          </button>
        </div>

        <Swiper
          spaceBetween={15}
          slidesPerView={1} // default for mobile
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          freeMode={true}
          grabCursor={true}
          navigation={{
            nextEl: ".influencer-button-next",
            prevEl: ".influencer-button-prev",
          }}
          modules={[FreeMode, Navigation]}
          className="pb-5"
        >
          {infLoading ? (
            <p>Loading...</p>
          ) : influencers.length === 0 ? (
            <p>No influencers found</p>
          ) : (
            influencers.map((inf) => (
              <SwiperSlide key={inf.id} className="pb-4">
                <InfluencerCardNew
                  influencer={inf}
                  onLike={handleLike}
                  onInvite={handleInvite}
                />
              </SwiperSlide>
            ))
          )}
        </Swiper>

      </div>



      <InviteModal
        visible={isInviteModalVisible}
        influencerId={selectedInfluencer}
        token={token}
        onClose={() => {
          setIsInviteModalVisible(false);
          setSelectedInfluencer(null);
        }}
      />
    </div>
  );
};

export default Campaign;
