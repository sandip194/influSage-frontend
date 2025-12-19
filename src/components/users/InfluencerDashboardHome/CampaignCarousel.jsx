import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Autoplay } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/navigation';
import { useSelector } from "react-redux";

const SkeletonCard = () => (
    <div className="w-[240px] h-[25px] bg-gray-200 rounded-lg animate-pulse"></div>
);


// ---------- Campaign Card ----------

const CampaignCard = ({ campaign }) => {
    return (
        <Link
            to={`/dashboard/browse/description/${campaign.id}`}
            className="block" // ensures full card is clickable
        >
            <div className="bg-[#ebf1f7] hover:bg-[#d6e4f6] border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-lg transition-transform flex flex-col justify-between mb-8 h-64 cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                    <img
                        loading="lazy"
                        src={campaign.photopath}
                        alt={campaign.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className="text-lg font-semibold text-gray-900">{campaign.name}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-4 flex-grow">
                    {campaign.description.length > 50
                        ? `${campaign.description.slice(0, 50)}...`
                        : campaign.description
                    }
                </p>

                <div className="flex flex-wrap gap-1 mb-2 min-h-[20px]">
                    {campaign.campaigncategories?.map((tag, i) => (
                        <span
                            key={i}
                            className="px-2 py-1 bg-blue-200 rounded-full text-xs text-black"
                        >
                            {tag.categoryname}
                        </span>
                    ))}
                </div>

                <div className="flex justify-between items-start pt-2 border-t border-gray-300">
                    <p className="text-xs text-gray-600 mt-1">Budget</p>
                    <p className="font-bold text-xl text-black">
                        ₹{Number(campaign.estimatedbudget).toLocaleString('en-IN')}
                    </p>
                </div>
            </div>
        </Link>
    );
};


// ---------- Main Carousel ----------
const CampaignCarousel = () => {
    const { token } = useSelector((state) => state.auth);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    // API Call - get only 6 campaigns
    const getLimitedCampaigns = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get("user/browse-all-campaigns/fiterWithSort", {
                params: { pagenumber: 1, pagesize: 6 },
                headers: { Authorization: `Bearer ${token}` },
            });
            setCampaigns(res.data.records);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        getLimitedCampaigns();
    }, [getLimitedCampaigns]);

    return (
        <div className=" my-3 bg-white p-3 rounded-2xl">
            <div className="p-2 mb-1">
                <h2 className="text-lg sm:text-xl font-semibold">Browse Campaign</h2>
            </div>
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
                    1280: { slidesPerView: 4 },
                }}
            >
                {loading
                    ? Array.from({ length: 6 }).map((_, idx) => (
                        <SwiperSlide key={idx}>
                            <SkeletonCard />
                        </SwiperSlide>
                    ))
                    : campaigns.map((c) => (
                        <SwiperSlide key={c.id} style={{ height: "auto" }}>
                            <CampaignCard campaign={c} />
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    );
};

export default CampaignCarousel;
