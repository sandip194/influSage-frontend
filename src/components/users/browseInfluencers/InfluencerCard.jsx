import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiHeartLine, RiHeartFill, RiUserAddLine } from "@remixicon/react";
import { Tooltip } from "antd";

const InfluencerCard = ({ influencer, onLike, onInvite, BASE_URL }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/vendor-dashboard/browse-influencers/influencer-details/${influencer?.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative group rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center text-center p-4 bg-white/30 backdrop-blur-xl"
    >
      {/* Blob only in one corner (e.g., bottom-right) */}
      <div
        className="absolute w-30 h-30 bg-red-600 opacity-10 blur-2xl rounded-3xl z-0"
        style={{
          bottom: "180px",
          right: "40px",
          animation: "blob-bounce 6s ease-in-out infinite",
        }}
      ></div>
      <div
        className="absolute w-30 h-30 bg-blue-600 opacity-10 blur-2xl rounded-3xl z-0"
        style={{
          bottom: "60px",
          right: "180px",
          animation: "blob-bounce 6s ease-in-out infinite",
        }}
      ></div>

      {/* Profile Image */}
      <div className="z-10 mb-4 relative w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden shadow-inner">
        <img
          src={
            influencer?.photopath
              ? `${BASE_URL}/${influencer?.photopath}`
              : "https://via.placeholder.com/150"
          }
          alt="profile"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* Name */}
      <Link
        to={`/vendor-dashboard/browse-influencers/influencer-details/${influencer?.id}`}
        onClick={(e) => e.stopPropagation()}
        className="z-10 text-base font-semibold text-gray-900 hover:underline"
      >
        {influencer?.firstname} {influencer?.lastname}
      </Link>

      {/* Location */}
      <div className="z-10 text-xs text-gray-500 mt-1">
        {influencer?.statename}, {influencer?.countryname}
      </div>

      {/* Languages */}
      <div className="z-10 text-xs text-gray-400 mt-1">
        {influencer?.contentlanguages?.map((lang, idx) => (
          <span key={idx}>
            {lang.languagename}
            {idx < influencer?.contentlanguages.length - 1 && ", "}
          </span>
        ))}
      </div>

      {/* Categories */}
      <div className="z-10 flex flex-wrap gap-2 justify-center mt-3">
        {influencer?.categories?.map((cat, idx) => (
          <span
            key={idx}
            className="text-[10px] px-3 py-1 rounded-full bg-gray-200 text-gray-800"
          >
            {cat.categoryname}
          </span>
        ))}
      </div>

      {/* Followers */}
      <div className="z-10 flex justify-center gap-4 mt-2 text-sm text-gray-700">
        {influencer?.providers
          ?.filter((p) => p.nooffollowers > 0)
          .map((p) => (
            <div key={p.providerid} className="flex items-center gap-1">
              <img
                src={`${BASE_URL}/${p.iconpath}`}
                alt={p.providername}
                className="w-5 h-5"
              />
              {p.nooffollowers}
            </div>
          ))}
      </div>

      {/* Action Buttons */}
      <div className="z-10 mt-5 flex gap-3 w-full justify-center">
        <Tooltip title="Invite">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInvite(influencer?.id);
            }}
            className="flex items-center gap-1 text-sm text-white px-4 py-1.5 rounded-full bg-[#141843] hover:bg-[#0e102b] transition"
          >
            <RiUserAddLine size={16} />
            Invite
          </button>
        </Tooltip>

        <Tooltip title={influencer?.savedinfluencer ? "Unfavorite" : "Favorite"}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(influencer?.id);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            {influencer?.savedinfluencer ? (
              <RiHeartFill size={18} className="text-red-500" />
            ) : (
              <RiHeartLine size={18} />
            )}
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default InfluencerCard;
