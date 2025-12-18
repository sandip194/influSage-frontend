import React from "react";
import { Tooltip, Skeleton, Empty } from "antd";
import {
  RiExchangeDollarLine,
  RiBookmarkLine,
  RiBookmarkFill,
  RiFileCopyFill,
  RiFileCopyLine,
} from "@remixicon/react";
import { Link } from "react-router-dom";

const SavedCampaignCard = ({
  campaigns,
  loading,
  handleCardClick,
  handleSave,
}) => {
  return (
    <div className="grid gap-6 flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {/* Loading skeletons */}
      {loading ? (
        Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm"
          >
            <Skeleton.Avatar
              active
              size="large"
              shape="circle"
              className="mb-4"
            />
            <Skeleton active paragraph={{ rows: 3 }} title={{ width: "70%" }} />
          </div>
        ))
      ) : campaigns.length === 0 ? (
        <div className="col-span-full py-10">
          <Empty description="No campaigns found." />
        </div>
      ) : (
        campaigns.map((campaign) => (
          <div
            key={campaign.id}
            onClick={() => handleCardClick(campaign.id)}
            className="bg-[#ebf1f7] hover:bg-[#d6e4f6] border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
          >
            {/* --- Top Section (Apply Till + Save Button) --- */}
            <div className="flex justify-between items-start mb-3 pb-2">
              <p className="text-xs text-gray-500 font-medium">
                Created on {campaign.campaigncreatedate}
              </p>

              <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                <Tooltip
                  title={
                    campaign.campaigsaved
                      ? "Unsave Campaign"
                      : "Save Campaign"
                  }
                  placement="left"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave(campaign.id);
                    }}
                    className={`flex items-center gap-1 px-2 py-1 border rounded-lg text-sm font-medium transition 
                      ${
                        campaign.campaigsaved
                          ? "border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-100"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    {campaign.campaigsaved ? (
                      <>
                        <span>Saved</span>
                        <RiBookmarkFill
                          size={16}
                          className="text-green-600"
                        />
                      </>
                    ) : (
                      <>
                        <span>Save</span>
                        <RiBookmarkLine size={16} />
                      </>
                    )}
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* --- Header --- */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={campaign.photopath}
                alt={campaign.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
              <div>
                <Link
                  to={`/dashboard/browse/description/${campaign.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="block text-lg font-bold text-gray-900 hover:underline hover:text-blue-900 transition-colors duration-150"
                >
                  {campaign.name}
                </Link>
                <div className="text-xs text-gray-500">
                  {campaign.businessname}
                </div>
              </div>
            </div>

            {/* --- Tags --- */}
            <div className="flex flex-wrap gap-2 mb-4">
          {campaign.providercontenttype?.map((provider, pIdx) => (
            <div
          key={pIdx}
          className="flex items-center gap-2 px-1 py-1 text-xs text-black rounded-full"
            >
          {provider.iconpath && (
            <img
              loading="lazy"
              src={provider.iconpath}
              alt={provider.providername}
              className="w-6 h-6 object-contain"
            />
          )}
          <div className="flex items-center gap-1">
             <span className="text-xs text-black">
            {provider.contenttypes
              ?.map((ct) => ct.contenttypename)
              .filter(Boolean)
              .join(", ")}
          </span>
          </div>
            </div>
          ))}
        </div>

            {/* --- Description --- */}
            <p
              className="text-gray-800 text-sm mb-4 text-justify overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {campaign.description}
            </p>

            {/* --- Categories --- */}
            <div className="flex flex-wrap gap-2 mb-4">
              {campaign.campaigncategories?.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-200 rounded-xl text-xs text-black"
                >
                  {tag.categoryname}
                </span>
              ))}
            </div>

        {campaign.appliedinfluencercount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1.5 border-2 border-gray-300 bg-gray-300 rounded-lg text-xs text-gray-900 flex items-center gap-2 font-semibold">
          <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-500 text-white rounded-full text-xs">
            {campaign.appliedinfluencercount}
          </span>
          <span className="whitespace-nowrap">
            {campaign.appliedinfluencercount === 1 ? "influencer applied" : "influencers applied"}
          </span>
            </span>
          </div>
        )}
            {/* --- Footer (Budget + Apply Button) --- */}
            <div className="mt-auto flex justify-between items-center border-t border-gray-300 pt-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  ₹{campaign.estimatedbudget}
                </p>
                <p className="text-xs text-gray-500">Estimated Budget</p>
              </div>

              {campaign.isapplied ? (
                <button
                  className="px-5 py-2 text-sm bg-gray-400 text-white rounded-full font-semibold cursor-not-allowed"
                  disabled
                >
                  Applied
                </button>
              ) : campaign.campaignapplied ? (
                <Link
                  to={`/dashboard/browse/apply-now/${campaign.id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="px-5 py-2 text-sm bg-black text-white rounded-full font-semibold hover:bg-gray-900 transition">
                    Apply Now
                  </button>
                </Link>
              ) : (
                <button
                  className="px-5 py-2 text-sm bg-gray-400 text-white rounded-full font-semibold cursor-not-allowed"
                  disabled
                >
                  Not Apply
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedCampaignCard;
