import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiHeartLine, RiHeartFill, RiUserAddLine } from "@remixicon/react";
import { Tooltip } from "antd";

const InfluencerCard = ({ influencer, onLike, onInvite, BASE_URL }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(
      `/vendor-dashboard/browse-influencers/influencer-details/${influencer?.id}`
    );
  };

  return (
    <div
      className="border rounded-2xl transition border-gray-200 bg-white p-5 flex flex-col cursor-pointer hover:bg-gray-100"
      onClick={handleCardClick}
    >
      {/* Top Section: Image + Name */}
      <div className="flex items-center gap-4 mb-3">
        <img
          src={
            influencer?.photopath
              ? influencer.photopath
              : "https://via.placeholder.com/150"
          }
          alt="profile"
          loading="lazy"
          className="w-14 h-14 object-cover rounded-full flex-shrink-0"
        />

        <div className="flex flex-col min-w-0">
          <Link
            to={`/vendor-dashboard/browse-influencers/influencer-details/${influencer?.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-base font-semibold text-gray-900 truncate hover:underline"
          >
            {influencer?.firstname} {influencer?.lastname}
          </Link>
          <div className="text-xs text-gray-500 truncate">
            {influencer?.statename}, {influencer?.countryname}
          </div>
        </div>
      </div>

      {/* Languages */}
      {influencer?.contentlanguages?.length > 0 && (
        <div className="text-xs text-gray-400 mb-2 truncate">
          {influencer.contentlanguages.map((lang, idx) => (
            <span key={idx}>
              {lang.languagename}
              {idx < influencer.contentlanguages.length - 1 && ", "}
            </span>
          ))}
        </div>
      )}

      {/* Categories */}
      {influencer?.categories?.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-start mb-3">
          {influencer.categories.map((cat, idx) => (
            <span
              key={idx}
              className="text-[10px] px-3 py-1 rounded-full bg-gray-200 text-gray-800"
            >
              {cat.categoryname}
            </span>
          ))}
        </div>
      )}

      {/* Followers */}
      {influencer?.providers?.some((p) => p.nooffollowers > 0) && (
        <div className="flex justify-start gap-4 mb-4 text-sm text-gray-700">
          {influencer.providers
            .filter((p) => p.nooffollowers > 0)
            .map((p) => (
              <div key={p.providerid} className="flex items-center gap-1">
                <img
                  src={p.iconpath}
                  alt={p.providername}
                  className="w-5 h-5"
                />
                {p.nooffollowers}
              </div>
            ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 w-full mt-auto">
        <Tooltip title="Invite">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInvite(influencer?.id);
            }}
            className="flex items-center gap-2 text-sm text-white px-6 py-2 rounded-full bg-[#141843] hover:bg-[#0e102b] transition min-w-[170px] justify-center"
          >
            <RiUserAddLine size={16} />
            Invite
          </button>
        </Tooltip>

        <Tooltip
          title={influencer?.savedinfluencer ? "Unfavorite" : "Favorite"}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(influencer?.id);
            }}
           className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-[#0e102b]"
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
