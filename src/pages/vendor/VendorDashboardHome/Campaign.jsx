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
import InfluencerCard from "../../../components/users/browseInfluencers/InfluencerCard";
import { toast } from "react-toastify";
import InviteModal from "../../../components/users/browseInfluencers/InviteModal";


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
      setCampaigns(allCampaigns.slice(0, 6));

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
      setInfluencers(allInfluencers.slice(0, 6));

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
            <SwiperSlide key={item.id} className="!w-auto">
              <div className="min-w-[260px] max-w-[260px] p-4 bg-white border border-gray-200 rounded-xl shadow-sm">

                {/* ======= Status + Menu ======= */}
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${item.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : item.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : item.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {item.status}
                  </span>
                  <RiMoreFill className="text-gray-500 cursor-pointer" />
                </div>

                {/* ======= Image + Title Row ======= */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.photopath}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight truncate">
                      {item.name}
                    </h3>

                    <p className="text-gray-500 text-xs mt-0.5">
                      Created: {new Date(item.createddate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* ======= Budget ======= */}
                <div className="mt-3">
                  <p className="text-gray-600 text-xs">
                    <span className="font-medium">Budget:</span> ₹{item.estimatedbudget?.toLocaleString()}
                  </p>
                </div>

                {/* ======= Campaign Start ======= */}
                <p className="text-gray-500 text-xs mt-1">
                  Campaign start : {item.campaignstartdate}
                </p>

                {/* ======= Campaign Start ======= */}
                <p className="text-gray-500 text-xs mt-1">
                  Campaign End : {item.campaignenddate}
                </p>

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
                <InfluencerCard
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
