import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { RiCalendar2Line } from "@remixicon/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import 'swiper/css/pagination';

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
          <h2 className="text-xl font-bold text-gray-900">My Campaign</h2>
          <button
            onClick={() => navigate("/vendor-dashboard/vendor-campaign")}
            className="text-[#0D132D] cursor-pointer text-sm sm:text-base font-medium hover:underline"
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
              640: { slidesPerView: 1.2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            freeMode={true}
            autoplay={{ delay: 3000, disableOnInteraction: true }}
            grabCursor={true}
            navigation={true}
            modules={[FreeMode, Navigation, Autoplay, Pagination]}
            className="mySwiper pb-5"
          >
            {campaigns.map((item) => (
              <SwiperSlide key={item.id} className="pb-4">
                <div
                  onClick={() =>
                    navigate(`/vendor-dashboard/vendor-campaign/campaignDetails/${item.id}`)
                  }
                  className="
                    rounded-2xl
                    overflow-hidden
                    bg-[#335CFF0D]
                    border border-[#335CFF26]
                    flex flex-col
                    hover:shadow-md
                    transition
                    cursor-pointer
                  "
                >
                  {/* ===== Image Section ===== */}
                  <div className="relative h-36 w-full overflow-hidden">
                    <img
                      src={item.photopath || '/Brocken-Defualt-Img.jpg'}
                      alt={item.name}
                      onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                      className="h-full w-full object-cover"
                    />

                    {/* Status Badge */}
                    {item.status && (
                      <span
                        className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full shadow-md
                          ${
                            statusStyles[item.status?.toLowerCase()] ||
                            'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {item.status}
                      </span>
                    )}
                  </div>

                  {/* ===== Content Section ===== */}
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    {/* Title */}
                    <h3 className="text-[15px] font-semibold text-[#0D132D] truncate h-[22px]">
                      {item.name}
                    </h3>

                    {/* Dates */}
                    {item.campaignstartdate && item.campaignenddate ? (
                      <div className="flex items-center gap-2 text-sm text-[#335CFF] h-[20px]">
                        <RiCalendar2Line size={15} className="shrink-0" /> Date :
                        <span className="truncate">
                          {parseDDMMYYYY(item.campaignstartdate).toLocaleDateString("en-GB")}
                          <span className="mx-1 font-medium">-</span>
                          {parseDDMMYYYY(item.campaignenddate).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Campaign dates not available</p>
                    )}

                    {/* Categories */}
                    {item.campaigncategories?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.campaigncategories.slice(0, 2).map((cat, i) => (
                          <span
                            key={i}
                            className="
                              px-2 py-1
                              rounded-full
                              text-xs font-medium
                              border border-[#0D132D26]
                              bg-white
                              whitespace-nowrap
                            "
                          >
                            {cat.categoryname}
                          </span>
                        ))}

                        {item.campaigncategories.length > 2 && (
                          <span
                            className="
                              px-2 py-1
                              rounded-full
                              text-xs font-medium
                              border border-[#0D132D26]
                              bg-gray-200
                            "
                          >
                            +{item.campaigncategories.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* ===== Budget Section ===== */}
                    <div className="mb-3">
                      {item.estimatedbudget  && (
                        <div
                          className="
                          bg-white
                          border border-[#0D132D26]
                          rounded-xl
                          px-2 py-2
                          flex items-center gap-3
                        "
                        >
                        <div className="flex items-center w-full text-sm">
                          <span className="text-xs text-gray-400">
                            Estimated Budget:
                          </span>

                          <span className="ml-auto font-semibold text-[#0D132D]">
                            ₹ {item.estimatedbudget .toLocaleString("en-IN")}
                          </span>
                        </div>

                        </div>
                      )}
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
          <h2 className="text-xl font-bold text-gray-900">Browse Influencers</h2>
          <button
            onClick={() => navigate("/vendor-dashboard/browse-influencers")}
            className="text-[#0D132D] cursor-pointer text-sm sm:text-base font-medium hover:underline"
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
          <Empty
            description="No influencers found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Swiper
            spaceBetween={15}
            slidesPerView={1} // default for mobile
            breakpoints={{
              640: { slidesPerView: 1.2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            freeMode={true}
            autoplay={{ delay: 3000, disableOnInteraction: true }}
            grabCursor={true}
            navigation={true}
            modules={[FreeMode, Navigation, Autoplay, Pagination]}
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





