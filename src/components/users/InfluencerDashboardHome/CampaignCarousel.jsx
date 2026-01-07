import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useSelector } from "react-redux";
import { Skeleton, Empty } from "antd";
import {
  RiCalendar2Line,
  RiImageLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "@remixicon/react";
import "swiper/css/pagination";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("-");
  if (!day || !month || !year) return "";
  return `${day}/${month}/${year}`;
};

// ---------- Skeleton Card ----------
const SkeletonCard = () => (
  <div className="w-[260px] h-[300px] bg-gray-200 rounded-2xl animate-pulse"></div>
);

const CampaignCategories = ({ categories }) => {
  const containerRef = React.useRef(null);
  const [canShowTwo, setCanShowTwo] = React.useState(true);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    setCanShowTwo(el.scrollWidth <= el.clientWidth);
  }, [categories]);

  if (!categories || categories.length === 0) return null;

  const total = categories.length;
  const showCount = total > 2 || (total === 2 && !canShowTwo);

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-hidden whitespace-nowrap"
    >
      {/* First category */}
      <span className="px-2 py-1 rounded-full text-xs font-medium border border-[#0D132D26] whitespace-nowrap flex-shrink-0">
        {categories[0].categoryname}
      </span>

      {/* Second category only if it fits */}
      {categories[1] && canShowTwo && (
        <span className="px-2 py-1 rounded-full text-xs font-medium border border-[#0D132D26] whitespace-nowrap flex-shrink-0">
          {categories[1].categoryname}
        </span>
      )}

      {/* Count pill */}
      {showCount && (
        <span className="px-2 py-1 rounded-full text-xs font-medium border border-[#0D132D26] bg-gray-300 whitespace-nowrap flex-shrink-0">
          +{canShowTwo ? total - 2 : total - 1}
        </span>
      )}
    </div>
  );
};




// ---------- Campaign Card ----------
const CampaignCard = ({ campaign }) => {
  return (
    <Link
      to={`/dashboard/browse/description/${campaign.id}`}
      className="block h-full"
    >
      {/* ===== Card Wrapper ===== */}
      <div
        className="
        rounded-2xl
        overflow-hidden
        bg-[#335CFF0D]
        border border-[#335CFF26]
        flex flex-col hover:shadow-md transition 
      "
      >
        {/* ===== Image Section ===== */}
        <div className="h-36 w-full overflow-hidden">
          <img
            src={campaign.photopath || "/Brocken-Defualt-Img.jpg"}
            alt={campaign.name}
            onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
            className="h-full w-full object-cover"
          />
        </div>

        {/* ===== Content Section ===== */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          {/* ===== Title ===== */}
          <h3 className="text-[15px] font-semibold text-[#0D132D] truncate h-[22px]">
            {campaign.name}
          </h3>

          {/* ===== Description ===== */}
          <p className="text-sm text-gray-500 line-clamp-2 h-[40px]">
            {campaign.description || ""}
          </p>

          {/* ===== Apply Date ===== */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1  text-sm max-[340px]:text-xs text-[#335CFF]">
            {campaign.applicationstartdate && campaign.applicationenddate && (
              <>
                <RiCalendar2Line size={16} className="shrink-0" />
                <span className="whitespace-nowrap">Apply:</span>

                <span className="break-words">
                  {formatDate(campaign.applicationstartdate)}
                  <span className="mx-1 font-medium">-</span>
                  {formatDate(campaign.applicationenddate)}
                </span>
              </>
            )}
          </div>


          {/* ===== Categories ===== */}
          <CampaignCategories categories={campaign.campaigncategories} />


          {/* ===== Budget Section ===== */}
          <div className="mt-auto">
            {campaign.estimatedbudget && (
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
                    ₹ {campaign.estimatedbudget.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// ---------- Campaign Carousel ----------
const CampaignCarousel = () => {
  const { token } = useSelector((state) => state.auth);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getLimitedCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("user/browse-all-campaigns/fiterWithSort", {
        params: { pagenumber: 1, pagesize: 10 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns(res.data.records || []);
    } catch (err) {
      console.error(err);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getLimitedCampaigns();
  }, [getLimitedCampaigns]);

  return (
    <div className="my-3 bg-white p-4 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Browse Campaign</h2>

        <button
          onClick={() => navigate("/dashboard/browse")}
          className="cursor-pointer text-[#0D132D] text-sm sm:text-base font-medium hover:underline"
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <Empty
          description="No campaigns found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Swiper
          spaceBetween={15}
          slidesPerView={1} // mobile default
          breakpoints={{
            640: { slidesPerView: 1 },
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
          {campaigns.map((c) => (
            <SwiperSlide key={c.id} className="">
              <CampaignCard campaign={c} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default CampaignCarousel;
