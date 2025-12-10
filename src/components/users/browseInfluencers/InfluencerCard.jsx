import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  RiHeartLine,
  RiHeartFill,
  RiUserAddLine,
  RiStarFill,
} from "@remixicon/react";
import { Tooltip } from "antd";
// import "./heartAnimation.css";

const InfluencerCard = ({ influencer, onLike, onInvite, BASE_URL }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(
      `/vendor-dashboard/browse-influencers/influencer-details/${influencer?.id}`
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-[#ebf1f7] hover:bg-[#d6e4f6] border border-gray-200 rounded-2xl p-6 shadow-xl/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
    >

       <div className="absolute top-3 right-3 z-10">
          <Tooltip title={influencer?.savedinfluencer ? "Unfavorite" : "Favorite"}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onLike(influencer?.id);
              }}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition relative overflow-visible"
            >
              {influencer?.savedinfluencer ? (
                <RiHeartFill
                  key={`heart-${influencer?.id}-fill`}
                  size={22}
                  className="text-red-500 animate-like"
                />
              ) : (
                <RiHeartLine
                  key={`heart-${influencer?.id}-line`}
                  size={22}
                  className="text-gray-600 animate-dislike"
                />
              )}
            </button>
          </Tooltip>
        </div>

      {/* --- Top Section: Image + Actions --- */}
      <div className="flex justify-between items-start mb-4 relative">
        <div className="flex items-center gap-3">
          <img
            src={
              influencer?.photopath
                ? influencer.photopath
                : "https://via.placeholder.com/150"
            }
            alt="Profile"
            loading="lazy"
            className="w-14 h-14 rounded-full object-cover border border-gray-200"
          />
          <div>
            <Link
              to={`/vendor-dashboard/browse-influencers/influencer-details/${influencer?.id}`}
              onClick={(e) => e.stopPropagation()}
              className="block text-base font-semibold text-gray-900 hover:underline hover:text-blue-900 transition-colors duration-150"
            >
              {influencer?.firstname} {influencer?.lastname}
            </Link>
            <p className="text-xs text-gray-500">
              {influencer?.statename}, {influencer?.countryname}
            </p>

            <div className="flex items-center gap-1 text-xs">
              {Number(influencer?.ratingcount) > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: Math.round(influencer.ratingcount) }).map((_, i) => (
                    <RiStarFill
                      key={i}
                      size={12}
                      className="text-yellow-400"
                      style={{ stroke: "black", strokeWidth: 1 }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

       
      </div>

      {/* --- Languages --- */}
      {influencer?.contentlanguages?.length > 0 && (
        <div className="text-xs text-gray-500 mb-3">
          {influencer.contentlanguages
            .map((lang) => lang.languagename)
            .join(", ")}
        </div>
      )}

      {/* --- Categories --- */}
      {influencer?.categories?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {influencer.categories.map((cat, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-blue-200 rounded-xl text-xs text-black"
            >
              {cat.categoryname}
            </span>
          ))}
        </div>
      )}

      {/* --- Followers --- */}
      {influencer?.providers?.some((p) => p.nooffollowers > 0) && (
        <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-700">
          {influencer.providers
            .filter((p) => p.nooffollowers > 0)
            .map((p) => (
              <div key={p.providerid} className="flex items-center gap-2">
                <img
                  src={p.iconpath}
                  alt={p.providername}
                  className="w-5 h-5 object-contain"
                />
                <span>{p.nooffollowers}</span>
              </div>
            ))}
        </div>
      )}
      {influencer?.completedcampaigncount > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1.5 border-2 border-gray-300 bg-gray-100 rounded-lg text-xs text-gray-900 flex items-center gap-2 font-semibold">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-500 text-white rounded-full text-xs">
                      {influencer.completedcampaigncount}
                      </span>
                      <span className="whitespace-nowrap">
                      {influencer.completedcampaigncount === 1 ? "completed campaign" : "completed campaigns"}
                      </span>
                    </span>
                    </div>
                  )}

      {/* --- Action Buttons --- */}
      <div className="mt-auto border-t border-black pt-4 flex justify-end items-center">
        <Tooltip title="Invite">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInvite(influencer?.id);
            }}
            className="flex items-center justify-center gap-2 text-sm text-white font-semibold px-5 py-2 rounded-full bg-[#0f122f] hover:bg-[#23265a] transition"
          >
            <RiUserAddLine size={16} />
            Invite
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default InfluencerCard;
