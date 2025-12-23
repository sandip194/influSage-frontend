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
    <div className="
      bg-[#e6eff9] border border-gray-200 rounded-2xl
      overflow-hidden shadow-sm
      flex flex-col h-full
      cursor-pointer hover:shadow-md transition-shadow duration-300
      relative
    ">

      {/* ===== Banner ===== */}
      <div className="relative h-36 shrink-0">
        <img
          src={campaign.photopath || '/placeholder.jpg'}
          alt={campaign.name}
          className="w-full h-full object-cover"
        />

        {/* Apply Dates Badge */}
        {campaign.applicationstartdate && campaign.applicationenddate && (
          <div className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full shadow-md 
            bg-gradient-to-r from-blue-100 to-blue-300 text-[#0D132D] whitespace-nowrap">
            Apply: {parseDDMMYYYY(campaign.applicationstartdate).toLocaleDateString("en-GB")}
            {" - "}
            {parseDDMMYYYY(campaign.applicationenddate).toLocaleDateString("en-GB")}
          </div>
        )}
      </div>

      {/* ===== Info Section ===== */}
      <div className="p-4 flex flex-col flex-1">
        {/* Campaign Name */}
        <h3 className="text-lg font-bold text-gray-900 truncate">
          {campaign.name}
        </h3>


        {/* Description */}
        {campaign.description && (
          <p className="text-sm text-gray-700 mt-1 line-clamp-2 h-10">
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

        {/* Push budget to bottom */}
        <div className="mt-3">
          {campaign.estimatedbudget && (
            <span className="inline-block bg-[#0D132D] text-white font-semibold px-3 py-1 rounded-full text-sm shadow-sm">
              Budget: ₹{campaign.estimatedbudget.toLocaleString()}
            </span>
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
        <div className="my-3 bg-white p-3 rounded-2xl">
            <h2 className="text-lg sm:text-xl font-semibold mb-3">Browse Campaign</h2>

            {loading ? (
                <div className="flex gap-4 overflow-x-auto">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <SkeletonCard key={idx} />
                    ))}
                </div>
            ) : campaigns.length === 0 ? (
                <Empty description="No campaigns found" />
            ) : (
                <Swiper
                    spaceBetween={15}
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
                        <SwiperSlide key={c.id} style={{ height: "auto" }}>
                            <CampaignCard campaign={c} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
};

export default CampaignCarousel;
