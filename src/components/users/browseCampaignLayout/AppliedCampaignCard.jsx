import React from "react";
import { Tooltip, Skeleton, Empty } from "antd";
import { Link } from "react-router-dom";
import { RiDeleteBinLine } from "@remixicon/react";

const AppliedCampaignCard = ({
  campaigns,
  loading,
  handleCardClick,
  setSelectedApplicationId,
  setSelectedCampaignId,
  setWithdrawModalOpen,
  openEditModal,
}) => {
  return (
    <div className="grid gap-6 flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {loading ? (
        Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
            <Skeleton.Avatar active size="large" shape="circle" className="mb-4" />
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
            className="bg-[#ebf1f7] hover:bg-[#d6e4f6] border border-gray-200 rounded-2xl p-6 shadow-xl/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-start mb-3 pb-1">
              <p className="text-xs text-gray-500">
                Applied on {new Date(campaign.createddate).toLocaleDateString()}
              </p>

              <div className="absolute top-3 right-3 z-10">
                <Tooltip title="Withdraw Application">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedApplicationId(campaign.campaignapplicationid);
                      setWithdrawModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-2 py-1 border border-red-300 bg-white text-red-600 rounded-lg text-sm hover:bg-red-50 hover:border-red-500"
                  >
                    <span>Withdraw</span>
                    <RiDeleteBinLine size={16} className="text-red-500" />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <img src={campaign.photopath} className="w-12 h-12 rounded-full object-cover border" />
              <Link
                to={`/dashboard/browse/applied-campaign-details/${campaign.id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-base font-bold hover:underline text-gray-900"
              >
                {campaign.name}
              </Link>
            </div>

            {/* Description */}
            <p
              className="text-gray-700 text-sm mb-4 text-justify overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {campaign.description}
            </p>

            {/* Bottom Section */}
            <div className="mt-auto border-t border-black pt-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  ₹{campaign.estimatedbudget}
                </p>
                <p className="text-xs text-gray-500">Estimated Budget</p>
              </div>

              {campaign.iseditable ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedApplicationId(campaign.campaignapplicationid);
                    setSelectedCampaignId(campaign.id);  // Add this
                    openEditModal();
                  }}
                  className="px-5 py-2 text-sm bg-black text-white rounded-full font-semibold hover:bg-gray-900"
                >
                  Edit Application
                </button>
              ) : (
                <button className="px-5 py-2 text-sm bg-gray-400 text-white rounded-full" disabled>
                  Edit Application
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AppliedCampaignCard;
