import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    RiHeartLine,
    RiHeartFill,
    RiGlobalLine,
    RiHeart3Line,
    RiHeart3Fill
} from "@remixicon/react";
import { Tooltip } from "antd";
import { motion, AnimatePresence } from "framer-motion";

const HeartParticle = ({ x, y, delay, size = 12 }) => (
  <motion.div
    className="absolute"
    style={{ width: size, height: size, backgroundColor: "transparent" }}
    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
    animate={{ scale: [0, 1, 0], x, y, opacity: [1, 1, 0] }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    <svg viewBox="0 0 20 20" fill="#ff3b6b" className="w-6 h-6">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
      4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
      14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
      6.86-8.55 11.54L12 21.35z"/>
    </svg>
  </motion.div>
);


// Helper function to format numbers
const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
};


const InfluencerCardNew = ({ influencer, onLike }) => {
    const navigate = useNavigate();
    const [showAnimation, setShowAnimation] = useState(false);

    return (
        <div
            onClick={() =>
            navigate(
                `/vendor-dashboard/browse-influencers/influencer-details/${influencer?.id}`
            )
            }
            className="
            relative
            bg-[#F6F8FF]
            border border-[#DDE3FF]
            rounded-2xl
            p-4
            cursor-pointer
            hover:shadow-md
            transition-all
            flex flex-col
            h-full
            "
        >
            {/* Like Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();

                    // Play animation only when liking
                    if (!influencer?.savedinfluencer) {
                    setShowAnimation(true);
                    setTimeout(() => setShowAnimation(false), 600);
                    }

                    onLike(influencer?.id);
                }}
                className="
                    absolute top-4 right-4
                    w-9 h-9
                    rounded-full
                    bg-white
                    border border-[#0D132D26]
                    flex items-center justify-center
                    overflow-hidden
                "
                >
                <div className="relative flex items-center justify-center w-5 h-5">
                    {/* Heart icon */}
                    <motion.div
                    key={influencer?.savedinfluencer ? "fill" : "outline"}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: showAnimation ? 1.6 : 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 12 }}
                    className="relative z-10"
                    >
                    {influencer?.savedinfluencer ? (
                        <RiHeartFill size={18} className="text-red-500" />
                    ) : (
                        <RiHeartLine size={18} className="text-gray-600" />
                    )}
                    </motion.div>

                    {/* Floating heart particles */}
                    <AnimatePresence>
                    {showAnimation &&
                        [
                        { x: -12, y: -10, delay: 0 },
                        { x: 10, y: -14, delay: 0.05 },
                        { x: -10, y: 10, delay: 0.2 },
                        { x: 12, y: 8, delay: 0.15 },
                        ].map((p, idx) => (
                        <HeartParticle key={idx} {...p} />
                        ))}
                    </AnimatePresence>
                </div>
                </button>

            {/* ===== Profile Header ===== */}
            <div className="flex items-center gap-3">
            <img
                src={influencer?.photopath || "/Brocken-Defualt-Img.jpg"}
                alt="profile"
                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />

            <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                {influencer?.influencername}
                </p>
                <p className="text-xs text-gray-500 truncate">
                {influencer?.statename}, {influencer?.countryname}
                </p>
            </div>
            </div>

            {/* ===== Categories ===== */}
            <div className="flex gap-2 mt-3 flex-nowrap overflow-visible min-w-0">
                {influencer?.categories?.slice(0, 2).map((cat, i) => (
                    <span
                    key={i}
                    className="
                        px-2 py-1
                        rounded-full
                        text-xs font-medium
                        border border-[#0D132D26]
                        whitespace-nowrap
                        overflow-hidden
                        text-ellipsis
                        min-w-0
                        max-w-full
                    "
                    title={cat.categoryname}
                    >
                    {cat.categoryname}
                    </span>
                ))}

                {/* + more */}
                {influencer?.categories?.length > 2 && (
                    <span
                    className="
                        px-2 py-1
                        rounded-full
                        text-xs font-medium
                        border border-[#0D132D26]
                        bg-gray-300
                        whitespace-nowrap
                        flex-shrink-0
                    "
                    title={influencer.categories
                        .slice(2)
                        .map((c) => c.categoryname)
                        .join(", ")}
                    >
                    +{influencer.categories.length - 2}
                    </span>
                )}
            </div>


            {/* ===== Bio ===== */}
            <p className="text-sm text-gray-500 line-clamp-2 h-[40px] mt-3">
                {influencer?.bio || "No bio available"}
            </p>

            {/* ===== Languages ===== */}
            {influencer?.contentlanguages?.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                    {/* Icon box */}
                    <span className="w-5 h-5 flex items-center justify-center">
                    <RiGlobalLine size={14} className="text-[#0D132D]" />
                    </span>

                    {/* Text */}
                    <p className="text-sm text-gray-700 font-medium truncate">
                    {(influencer.contentlanguages || [])
                        .map((l) => l.languagename)
                        .join(", ")}
                    </p>
                </div>
            )}

            <div className="border-t border border-[#0D132D26] my-3" />

            {/* ===== Social Stats Footer ===== */}
            <div className="flex items-center gap-6">
                {(influencer?.providers || [])
                    .filter((p) => p.nooffollowers > 0)
                    .slice(0, 4)
                    .map((p) => (
                    <div
                        key={p.providerid}
                        className="flex items-center gap-1 text-sm font-medium text-gray-700"
                    >
                        <img src={p.iconpath} alt="" className="w-5 h-5" />
                        {formatNumber(p.nooffollowers)}
                    </div>
                    ))}
            </div>
        </div>
        );
};

export default InfluencerCardNew;
