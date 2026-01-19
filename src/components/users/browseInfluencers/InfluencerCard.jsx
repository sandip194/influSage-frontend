import React from "react";
import { useNavigate } from "react-router-dom";
import {
  RiHeartLine,
  RiHeartFill,
  RiUserAddLine,
  RiGlobalLine,
  RiStarFill,
  RiStarLine,
  RiMapPin2Line,
  RiStarHalfFill
} from "@remixicon/react";
import { Tooltip } from "antd";


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
          title={influencer?.savedinfluencer ? "Unfavourite" : "Favourite"}
          placement="top"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(influencer?.id);
            }}
            className="w-10 h-10 bg-white border border-[#0D132D26] rounded-full flex items-center justify-center"
          >
            {influencer?.savedinfluencer ? (
              <RiHeartFill className="text-red-500" size={20} />
            ) : (
              <RiHeartLine className="text-gray-600" size={20} />
            )}
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default InfluencerCard;
