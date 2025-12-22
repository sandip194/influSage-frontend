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

// import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import InfluencerCard from "../../../components/users/browseInfluencers/InfluencerCard";
import { toast } from "react-toastify";
// import InviteModal from "../../../components/users/browseInfluencers/InviteModal";
import InfluencerCardNew from "./InfluencerCardNew";
import { Empty, Skeleton } from "antd";



const parseDDMMYYYY = (dateStr) => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("-");
  return new Date(`${year}-${month}-${day}`);
};

const statusStyles = {
  draft: "bg-gray-100 text-gray-700",
  published: "bg-blue-100 text-blue-700",
  underreview: "bg-purple-100 text-purple-700",
  inprogress: "bg-yellow-100 text-yellow-700",
  complete: "bg-green-100 text-green-700",
  canceled: "bg-red-100 text-red-700",
  paused: "bg-orange-100 text-orange-700",
};



const Campaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  const [influencers, setInfluencers] = useState([]);
  const [infLoading, setInfLoading] = useState(false);

  // const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  // const [selectedInfluencer, setSelectedInfluencer] = useState(null);

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
  // const handleInvite = (influencerId) => {

  //   setSelectedInfluencer(influencerId);
  //   setIsInviteModalVisible(true);
  // };


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
        fetchInfluencers()
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
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <Skeleton key={idx} active paragraph={{ rows: 4 }} />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <Empty description="No campaigns found" />
        ) : (
          <Swiper
            spaceBetween={15}
            slidesPerView={1} // mobile default
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
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
              <SwiperSlide key={item.id} className="pb-4">
                <div
                  onClick={() => navigate(`/vendor-dashboard/vendor-campaign/campaignDetails/${item.id}`)}
                  className="cursor-pointer min-w-[260px] max-w-[280px] bg-[#e6eff9] border border-gray-200 
      rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden"
                >
                  {/* ======= Campaign Banner + Status ======= */}
                  <div className="relative h-30">
                    <img
                      src={item.photopath || "/placeholder.jpg"} // fallback image
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full shadow-md
    ${statusStyles[item.status?.toLowerCase()] || "bg-gray-100 text-gray-700"}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* ======= Campaign Info ======= */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Campaign Name */}
                    <h3 className="text-lg font-bold text-gray-900 truncate">{item.name}</h3>

                    {/* Dates */}
                    {item.campaignstartdate && item.campaignenddate ? (
                      <div className="mt-2 flex flex-col gap-1 text-xs text-gray-500">
                        <p>
                          <span className="font-semibold text-gray-700">Campaign Start:</span>{" "}
                          <span className="text-gray-900 font-medium">
                            {parseDDMMYYYY(item.campaignstartdate).toLocaleDateString("en-GB")}
                          </span>
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">Campaign End:</span>{" "}
                          <span className="text-gray-900 font-medium">
                            {parseDDMMYYYY(item.campaignenddate).toLocaleDateString("en-GB")}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">Campaign dates not available</p>
                    )}




                    {/* Budget */}
                    {item.estimatedbudget && (
                      <span className="inline-block bg-[#0D132D] text-white
          font-semibold px-3 py-1 rounded-full mt-3 text-sm shadow-sm w-max">
                        Budget: ₹{item.estimatedbudget?.toLocaleString()}
                      </span>
                    )}

                    {/* Platform Icons */}
                    <div className="flex gap-2 mt-2">
                      {item.platforms?.includes("TikTok") && <RiTiktokFill className="text-2xl text-gray-600" />}
                      {item.platforms?.includes("Instagram") && <RiInstagramFill className="text-2xl text-pink-500" />}
                      {item.platforms?.includes("YouTube") && <RiYoutubeFill className="text-2xl text-red-600" />}
                    </div>
                  </div>
                </div>
              </SwiperSlide>

            ))}
          </Swiper>
        )}
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
        {infLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <Skeleton key={idx} active avatar paragraph={{ rows: 3 }} />
            ))}
          </div>
        ) : influencers.length === 0 ? (
          <Empty description="No influencers found" />
        ) : (
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
            {
              influencers.map((inf) => (
                <SwiperSlide key={inf.id} className="pb-4">
                  <InfluencerCardNew
                    influencer={inf}
                    onLike={handleLike}
                  // onInvite={handleInvite}
                  />
                </SwiperSlide>
              ))
            }
          </Swiper>
        )}
      </div>



      {/* <InviteModal
        visible={isInviteModalVisible}
        influencerId={selectedInfluencer}
        token={token}
        onClose={() => {
          setIsInviteModalVisible(false);
          setSelectedInfluencer(null);
        }}
      /> */}
    </div>
  );
};

export default Campaign;





