import React from "react";
import { Tooltip, Skeleton, Empty } from "antd";
import { Link } from "react-router-dom";
import {
  RiDeleteBinLine,
  RiCalendar2Line,
} from "@remixicon/react";

const formatDateDDMMYYYY = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
};

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
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {loading ? (
        Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm"
          >
            <Skeleton.Avatar active size="large" />
            <Skeleton active paragraph={{ rows: 3 }} />
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
            className="
              w-full
              rounded-2xl
              bg-[#335CFF0D]
              border border-[#335CFF26]
              hover:shadow-md
              transition
              flex flex-col
              cursor-pointer
              relative
            "
          >

            {/* Content */}
            <div className="p-4 flex flex-col gap-3 flex-1">
              {/* Header */}
              <div className="flex items-center gap-3">
                <img
                  src={campaign.photopath}
                  alt={campaign.name}
                  onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div className="min-w-0">
                  <Link
                    to={`/dashboard/browse/applied-campaign-details/${campaign.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm font-semibold text-[#0D132D] truncate block"
                  >
                    {campaign.name}
                  </Link>

                  <div className="flex items-center gap-1 text-xs text-[#335CFF] mt-0.5">
                    <RiCalendar2Line size={14} className="text-[#335CFF]" />
                    <span>
                      Applied on{" "}
                      {formatDateDDMMYYYY(campaign.createddate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 line-clamp-2 leading-snug min-h-[32px] mt-2">
                {campaign.description || ""}
              </p>

              {/* Budget */}
              <div className="min-h-[44px]">
            {campaign.estimatedbudget && (
              <div className=" border border-[#0D132D26] bg-white rounded-xl px-3 py-2 text-xs" >
              <div className="flex items-center w-full text-sm">
                <span className="text-xs text-gray-400">
                  Estimated Budget:
                </span>

                <span className="ml-auto font-semibold text-[#0D132D]">
                  ₹ {campaign.estimatedbudget.toLocaleString("en-IN")}
                </span>
              </div>
              </div>
            )}
          </div>

              {/* Footer */}
              <div className="flex items-center gap-2 pt-2">
                {/* Edit Application */}
                {campaign.iseditable ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedApplicationId(campaign.campaignapplicationid);
                      setSelectedCampaignId(campaign.id);
                      openEditModal();
                    }}
                    className="
                      flex-1
                      bg-black
                      text-white
                      rounded-full
                      py-2
                      text-sm
                      font-semibold
                      hover:bg-gray-900
                    "
                  >
                    Edit Application
                  </button>
                ) : (
                  <button
                    disabled
                    className="
                      flex-1
                      bg-gray-300
                      text-white
                      rounded-full
                      py-2
                      text-sm
                      font-semibold
                      cursor-not-allowed
                    "
                  >
                    Edit Application
                  </button>
                )}

                {/* Withdraw */}
                {campaign.canwithdraw && (
                  <Tooltip title="Withdraw Application">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApplicationId(campaign.campaignapplicationid);
                        setWithdrawModalOpen(true);
                      }}
                      className="
                        w-10 h-10
                        rounded-full
                        border border-red-300
                        flex items-center justify-center
                        text-red-500
                        hover:bg-red-50
                        shrink-0
                      "
                    >
                      <RiDeleteBinLine size={16} />
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AppliedCampaignCard;
