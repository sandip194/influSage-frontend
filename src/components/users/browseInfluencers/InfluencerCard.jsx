import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiHeartLine,
  RiHeartFill,
  RiUserAddLine,
  RiGlobalLine,
  RiStarFill,
  RiStarLine,
  RiMapPin2Line,
  RiStarHalfFill,
  RiHeart3Line,
  RiHeart3Fill,
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

// Function to render star ratings
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      // Full star
      stars.push(<RiStarFill key={i}  className="text-yellow-400" />);
    } else if (rating >= i - 0.75) {
      // Half star
      stars.push(<RiStarHalfFill key={i}  className="text-yellow-400" />);
    } else {
      // Empty star
      stars.push(<RiStarLine key={i}  className="text-gray-300" />);
    }
  }
  return stars;
};

const InfluencerCard = ({ influencer, onLike, onInvite }) => {
  const navigate = useNavigate();
  const formatNumber = (num) => {
    if (!num && num !== 0) return "0";

    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }

    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }

    return num.toString();
  };
  const [showAnimation, setShowAnimation] = useState(false);

  return (
    <div
      onClick={() =>
        navigate(
          `/vendor-dashboard/browse-influencers/influencer-details/${influencer?.id}`
        )
      }
      className="
        bg-[#f4f7ff]
        border border-[#cdd8ff]
        rounded-2xl
        p-5
        shadow-sm
        hover:shadow-md
        transition
        cursor-pointer
        flex flex-col
        h-full
      "
    >
      {/* ===== Header ===== */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={influencer?.photopath || "/default.jpg"}
            alt="profile"
            onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {influencer?.influencername}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <RiMapPin2Line size={14} className="text-gray-400" />
              {influencer?.statename}, {influencer?.countryname}
            </p>

            <div className="flex items-center gap-1 text-xs mt-1">
              {Number(influencer?.ratingcount) > 0 &&
                renderStars(Number(influencer.ratingcount)).map((star) =>
                  React.cloneElement(star, { size: 14 }) // small size for this place
                )}
            </div>

          </div>
        </div>
      </div>

      {/* ===== Categories ===== */}
      <div className="flex gap-2 flex-nowrap overflow-visible min-w-0">
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

      {/* ===== Social Stats ===== */}
      <div className="flex items-center gap-5 mb-3">
        {(influencer?.providers || [])
          .filter((p) => p.nooffollowers > 0)
          .slice(0, 4)
          .map((p) => (
            <div
              key={p.providerid}
              className="flex items-center gap-1 text-sm font-medium text-gray-700"
            >
              <img
                src={p.iconpath}
                alt=""
                className="w-5 h-5"
                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
              />
              {formatNumber(p.nooffollowers)}
            </div>
          ))}
      </div>

      {/* ===== Completed Campaigns ===== */}
      {influencer && (
        <div className="flex items-center gap-2 text-sm mb-4">
          <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs">
            {influencer.completedcampaigncount ?? 0}
          </span>
          <span className="text-gray-800">Completed Campaigns</span>
        </div>
      )}

      {/* ===== Actions ===== */}
      <div className="mt-auto flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInvite(influencer?.id);
          }}
          className="
            flex-1
            bg-[#0f122f]
            text-white
            py-2
            rounded-full
            text-sm
            font-semibold
            hover:bg-[#1f2357]
            transition
            flex items-center justify-center gap-2
          "
        >
          <RiUserAddLine size={16} />
          Invite
        </button>

        {/* Heart */}
        <Tooltip
          title={
            influencer?.savedinfluencer
              ? "Remove from Favorites"
              : "Add to Favorites"
          }
        >
            <button
             onClick={(e) => {
                e.stopPropagation();

                // Play animation ONLY when adding to favorites
                if (!influencer?.savedinfluencer) {
                  setShowAnimation(true);
                  setTimeout(() => setShowAnimation(false), 600);             }

              onLike(influencer?.id);
            }}
            className={`relative cursor-pointer flex items-center justify-center sm:justify-start gap-2 px-1 py-1 rounded-full text-sm font-medium border transition ${
              influencer?.savedinfluencer
                ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <div className="relative flex items-center justify-center w-8 h-8">
              {/* Heart Icon */}
              <motion.div
                key={influencer?.savedinfluencer ? "fill" : "outline"}
                initial={{ scale: 0.8 }}
                animate={{ scale: showAnimation ? 1.6 : 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 12 }}
                className="relative z-10"
              >
                {influencer?.savedinfluencer ? (
                  <RiHeart3Fill size={26} className="text-red-500" />
                ) : (
                  <RiHeart3Line size={26} className="text-gray-700" />
                )}
              </motion.div>

              {/* Floating heart particles */}
              <AnimatePresence>
                {showAnimation &&
                  [
                    { x: -20, y: -10, delay: 0 },
                    { x: 15, y: -20, delay: 0.05 },
                    { x: -15, y: 15, delay: 0.3 },
                    { x: 20, y: 10, delay: 0.25 },
                    { x: 0, y: -25, delay: 0.4 },
                  ].map((p, idx) => (
                    <HeartParticle key={idx} {...p} />
                  ))}
              </AnimatePresence>
            </div>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default InfluencerCard;
