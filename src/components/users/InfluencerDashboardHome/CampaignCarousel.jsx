import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Autoplay } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import { useSelector } from "react-redux";
import { Skeleton, Empty } from "antd";



// ---------- Helper: Parse DD-MM-YYYY ----------
const parseDDMMYYYY = (dateStr) => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("-");
  return new Date(`${year}-${month}-${day}`);
};

// ---------- Skeleton Card ----------
const SkeletonCard = () => (
  <div className="w-[260px] h-[300px] bg-gray-200 rounded-2xl animate-pulse"></div>
);

// ---------- Campaign Card ----------  
const CampaignCard = ({ campaign }) => {


  return (
    <Link
      to={`/dashboard/browse/description/${campaign.id}`}
      className="block h-full"
    >
      <div
        className="
        bg-[#e6eff9] border border-gray-200 rounded-2xl
        overflow-hidden shadow-sm
        flex flex-col
        cursor-pointer hover:shadow-md transition-shadow duration-300
        relative
        w-[300px]
      "
      >
        {/* ===== Banner ===== */}
        <div className="relative h-32 shrink-0">
          <img
            src={campaign.photopath || "/placeholder.jpg"}
            alt={campaign.name}
            className="w-full h-full object-cover"
          />

          {/* Apply Dates Badge */}
          {campaign.applicationstartdate && campaign.applicationenddate && (
            <div
              className="
              absolute top-3 right-3 px-3 py-1 text-xs font-semibold
              rounded-full shadow-md
              bg-white
              text-[#0D132D] whitespace-nowrap
            "
            >
              Apply:{" "}
              {parseDDMMYYYY(
                campaign.applicationstartdate
              ).toLocaleDateString("en-GB")}{" "}
              -{" "}
              {parseDDMMYYYY(
                campaign.applicationenddate
              ).toLocaleDateString("en-GB")}
            </div>
          )}
        </div>

        {/* ===== Info Section ===== */}
        <div className="p-3 flex flex-col flex-1">
          {/* Campaign Name */}
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {campaign.name}
          </h3>

          {/* Description */}
          {campaign.description && (
            <p className="text-xs text-gray-700 mt-1 line-clamp-2 h-9">
              {campaign.description}
            </p>
          )}

          {/* Categories */}
          <div className="flex flex-wrap gap-1 mt-2">
            {campaign.campaigncategories?.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-200 rounded-full text-xs text-black"
              >
                {tag.categoryname}
              </span>
            ))}
          </div>
          <hr className="my-2" />

          {/* Budget */}
          <div className="mt-auto pt-1">
            {campaign.estimatedbudget && (
              <div
                className="
                flex items-center justify-between
                bg-white
                border border-blue-100
                rounded-xl
                px-4 py-3
                cursor-default
                select-none
                min-w-[180px]
              "
              >
                {/* Text */}
                <div>
                  <div className="text-base font-semibold text-[#0D132D] leading-tight">
                    ₹{campaign.estimatedbudget.toLocaleString()}
                  </div>
                  <div className="text-[11px] uppercase tracking-wide text-gray-400">
                    Estimated Budget
                  </div>
                </div>

                {/* Icon */}
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  ₹
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
      <h2 className="text-xl font-bold text-gray-900 mb-4">Browse Campaign</h2>

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
          spaceBetween={12}
          slidesPerView="auto"
          freeMode={true}
          grabCursor={true}
          modules={[FreeMode, Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: true }}
          className="pb-6"
          breakpoints={{
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2.5 },
            1280: { slidesPerView: 3 },
          }}
        >
          {campaigns.map((c) => (
            <SwiperSlide
              key={c.id}
              className="!w-[300px]"
            >
              <CampaignCard campaign={c} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default CampaignCarousel;
