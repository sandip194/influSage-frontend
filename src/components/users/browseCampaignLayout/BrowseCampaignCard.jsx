import React, { useState } from "react";
import { Tooltip, Skeleton, Empty } from "antd";
import {
  RiBookmarkLine,
  RiBookmarkFill,
  RiCalendar2Line,
} from "@remixicon/react";
import ApplyNowModal from "./ApplyNowModal";

const CampaignCategories = ({ categories }) => {
  const containerRef = React.useRef(null);
  const [canShowTwo, setCanShowTwo] = React.useState(true);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    setCanShowTwo(el.scrollWidth <= el.clientWidth);
  }, [categories]);

  if (!categories || categories.length === 0) return null;

  const total = categories.length;
  const showCount = total > 2 || (total === 2 && !canShowTwo);

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-hidden whitespace-nowrap"
    >
      {/* First category */}
      <span className="px-2 py-1 rounded-full text-xs font-medium border border-[#0D132D26] whitespace-nowrap flex-shrink-0">
        {categories[0].categoryname}
      </span>

      {/* Second category only if it fits */}
      {categories[1] && canShowTwo && (
        <span className="px-2 py-1 rounded-full text-xs font-medium border border-[#0D132D26] whitespace-nowrap flex-shrink-0">
          {categories[1].categoryname}
        </span>
      )}

      {/* Count pill */}
      {showCount && (
        <span className="px-2 py-1 rounded-full text-xs font-medium border border-[#0D132D26] bg-gray-300 whitespace-nowrap flex-shrink-0">
          +{canShowTwo ? total - 2 : total - 1}
        </span>
      )}
    </div>
  );
};

/* --- Individual Card --- */
const CampaignCard = React.memo(
  ({ campaign, handleCardClick, handleSave, onApply, variant }) => {
    const today = new Date();
    const start =
      variant === "browse" && campaign.applicationstartdate
        ? new Date(campaign.applicationstartdate.split("-").reverse().join("-"))
        : null;
    const formatDateDDMMYY = (dateStr) => {
      if (!dateStr) return "";
      const [dd, mm, yyyy] = dateStr.split("-");
      return `${dd}/${mm}/${yyyy}`;
    };

    return (
      <div
        onClick={() => handleCardClick(campaign.id)}
        className="
          w-full
          max-w-full
          bg-[#335CFF0D]
          border border-[#335CFF26]
          rounded-2xl
          p-4
          flex flex-col
          gap-2
          cursor-pointer
          hover:shadow-md
          transition
          relative
        "
      >
        {/* ===== Header ===== */}
        <div className="flex items-center gap-2">
          <img
            src={campaign.photopath}
            alt={campaign.name}
            onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
            className="w-12 h-12 rounded-full object-cover"
          />

          <div className="min-w-0 flex flex-col">
            {/* Title */}
            <h3 className="text-base font-semibold text-[#0D132D] truncate">
              {campaign.name}
            </h3>

            {/* Date Row */}
            <div className="flex items-center gap-1 text-xs text-[#335CFF] mt-1">
              <RiCalendar2Line size={14} className="shrink-0 text-[#335CFF]" />

              <span className="truncate">
                {variant === "saved"
                  ? `Created on ${formatDateDDMMYY(campaign.campaigncreatedate)}`
                  : today < start
                    ? `Apply From: ${formatDateDDMMYY(campaign.applicationstartdate)}`
                    : `Apply Till: ${formatDateDDMMYY(campaign.applicationenddate)}`}
              </span>
            </div>
          </div>
        </div>

        {/* ===== Platform Pills ===== */}
        <div className="flex gap-1 mt-2 flex-nowrap overflow-visible min-w-0">
          {campaign.providercontenttype?.slice(0, 2).map((provider, idx) => {
            const contentNames =
              provider.contenttypes?.map((ct) => ct.contenttypename) || [];

            const isSinglePill = campaign.providercontenttype.length === 1;

            const visibleContents = isSinglePill
              ? contentNames
              : contentNames.slice(0, 2);

            const remainingCount = contentNames.length - visibleContents.length;

            return (
              <span
                key={idx}
                className="
                  flex items-center gap-1
                  px-2 py-[3px]
                  border border-[#0D132D26]
                  rounded-full
                  text-xs font-medium
                  whitespace-nowrap
                  overflow-hidden
                  text-ellipsis
                  min-w-0
                  flex-shrink
                  max-w-full
                "
                title={contentNames.join(", ")}
              >
                {provider.iconpath && (
                  <img
                    src={provider.iconpath}
                    alt={provider.providername}
                    onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                    className="w-4 h-4 shrink-0"
                  />
                )}

                <span className="overflow-hidden text-ellipsis min-w-0">
                  {visibleContents.join(", ")}
                  {!isSinglePill && remainingCount > 0 && " …"}
                </span>
              </span>
            );
          })}

          {campaign.providercontenttype?.length > 2 && (
            <span
              className="
                flex items-center
                px-2 py-[3px]
                rounded-full
                text-xs font-medium
                border border-[#0D132D26]
                bg-gray-300
                whitespace-nowrap
                flex-shrink-0
              "
              title={campaign.providercontenttype
                .slice(2)
                .map((p) => p.providername)
                .join(", ")}
            >
              +{campaign.providercontenttype.length - 2}
            </span>
          )}
        </div>

        {/* ===== Description ===== */}
        <p className="text-xs text-gray-500 line-clamp-2 leading-snug min-h-[32px] mt-2">
          {campaign.description || ""}
        </p>

        {/* ===== Categories ===== */}
        <CampaignCategories categories={campaign.campaigncategories} />


        <div className="mt-auto">
          <hr className="my-3 border-[#0D132D1A] mt-1" />

          <div className="min-h-[23px] mb-2">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <span className="font-bold text-gray-700">
                {campaign.appliedinfluencercount || 0}
              </span>
              Influencer Applied
            </div>
          </div>
          {/* ===== Budget Section ===== */}
          <div className="min-h-[44px] mb-3">
            {campaign.estimatedbudget && (
              <div
                className="
                bg-white
                border border-[#0D132D26]
                rounded-xl
                px-2 py-2
                flex items-center gap-3
              "
              >
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

          {/* ===== Actions ===== */}
          <div className="flex items-center gap-2">
            {/* Apply Button */}
            {variant === "saved" ? (
              campaign.isapplied ? (
                <button
                  disabled
                  className="flex-1 py-2 rounded-full text-sm font-semibold bg-gray-400 text-white"
                >
                  Applied
                </button>
              ) : campaign.campaignapplied ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply(campaign.id);
                  }}
                  className="flex-1 py-2 rounded-full text-sm font-semibold bg-black text-white"
                >
                  Apply Now
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 py-2 rounded-full text-sm font-semibold bg-gray-400 text-white"
                >
                  Not Eligible
                </button>
              )
            ) : campaign.campaignapplied ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApply(campaign.id);
                }}
                className="flex-1 py-2 rounded-full text-sm font-semibold bg-black text-white"
              >
                Apply Now
              </button>
            ) : (
              <button
                disabled
                className="flex-1 py-2 rounded-full text-sm font-semibold bg-gray-400 text-white"
              >
                Apply Now
              </button>
            )}

            {/* Save Button */}
            <Tooltip
              title={campaign.campaigsaved ? "Unsave" : "Save"}
              placement="top"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave(campaign.id);
                }}
                className="
                  w-9 h-9
                  shrink-0
                  rounded-full
                  bg-white
                  border border-[#0D132D26]
                  flex items-center justify-center
                  hover:bg-gray-50
                "
              >
                {campaign.campaigsaved ? (
                  <RiBookmarkFill size={18} className="text-[#0D132D]" />
                ) : (
                  <RiBookmarkLine size={18} className="text-gray-600" />
                )}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
);

/* --- Grid Component --- */
const CampaignCardGrid = React.memo(
  ({ campaigns, loading, handleCardClick, handleSave, variant, onCampaignApplied }) => {
    const [openApply, setOpenApply] = useState(false);
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);
    const [campaignBudget, setCampaignBudget] = useState(null)
    
    const handleApply = (campaignId) => {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) return;

      setSelectedCampaignId(campaign.id);
      setCampaignBudget(campaign.estimatedbudget);
      setOpenApply(true);
    };


    return (
      <>
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
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                handleCardClick={handleCardClick}
                handleSave={handleSave}
                onApply={handleApply}
                variant={variant}
              />
            ))
          )}
        </div>

        <ApplyNowModal
          open={openApply}
          onClose={() => setOpenApply(false)}
          campaignId={selectedCampaignId}
          campaignBudget={campaignBudget}
          onSuccess={() => {
            setOpenApply(false);
            onCampaignApplied(); // 🔥 REFRESH LIST
          }}
        />
      </>
    );
  }
);

export default CampaignCardGrid;

// import React from "react";
// import { Tooltip, Skeleton, Empty } from "antd";
// import {
//   RiBookmarkLine,
//   RiBookmarkFill,
//   RiArrowRightLine,
// } from "@remixicon/react";
// import { Link } from "react-router-dom";

// const CampaignCardGrid = ({ campaigns, loading, handleCardClick, handleSave }) => {
//   return (
//     <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
//       {/* Loading Skeletons */}
//       {loading ? (
//         Array.from({ length: 6 }).map((_, idx) => (
//           <div
//             key={idx}
//             className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
//           >
//             <Skeleton.Avatar active size="large" shape="circle" className="mb-4" />
//             <Skeleton active paragraph={{ rows: 3 }} />
//           </div>
//         ))
//       ) : campaigns.length === 0 ? (
//         <div className="col-span-full py-10">
//           <Empty description="No campaigns found." />
//         </div>
//       ) : (
//         campaigns.map((campaign) => (
//           <div
//             key={campaign.id}
//             onClick={() => handleCardClick(campaign.id)}
//             className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
//           >
//             {/* Hero Image Section */}
//             <div className="relative h-44 w-full overflow-hidden">
//               <img
//                 src={campaign.photopath}
//                 alt={campaign.name}
//                 className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//               />

//               {/* Gradient Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

//               {/* Save Button */}
//               <div className="absolute top-3 right-3">
//                 <Tooltip title={campaign.campaigsaved ? "Unsave" : "Save"}>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleSave(campaign.id);
//                     }}
//                     className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full shadow-md transition
//                       ${
//                         campaign.campaigsaved
//                           ? "bg-[#0f122f] text-white"
//                           : "bg-white/90 text-gray-800 hover:bg-white"
//                       }`}
//                   >
//                     {campaign.campaigsaved ? (
//                       <>
//                         <RiBookmarkFill size={14} /> Saved
//                       </>
//                     ) : (
//                       <>
//                         <RiBookmarkLine size={14} /> Save
//                       </>
//                     )}
//                   </button>
//                 </Tooltip>
//               </div>
//             </div>

//             {/* Card Content */}
//             <div className="p-5 flex flex-col">
//               {/* Title & Business */}
//               <h3 className="text-lg font-semibold text-gray-900 mb-1">
//                 {campaign.name}
//               </h3>
//               <p className="text-sm text-gray-500 mb-3">
//                 {campaign.businessname}
//               </p>

//               {/* Application Date */}
//               <p className="text-xs text-gray-500 mb-2">
//                 Apply Till:{" "}
//                 <span className="font-medium text-gray-800">
//                   {campaign.applicationenddate}
//                 </span>
//               </p>

//               {/* Tags */}
//               <div className="flex flex-wrap gap-2 mb-3">
//                 {campaign.providercontenttype?.map((item, index) => (
//                   <span
//                     key={index}
//                     className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
//                   >
//                     {item.providername} - {item.contenttypename}
//                   </span>
//                 ))}
//               </div>

//               {/* Description */}
//               <p
//                 className="text-sm text-gray-700 mb-4 line-clamp-2"
//                 style={{
//                   display: "-webkit-box",
//                   WebkitLineClamp: 2,
//                   WebkitBoxOrient: "vertical",
//                 }}
//               >
//                 {campaign.description}
//               </p>

//               {/* Categories */}
//               <div className="flex flex-wrap gap-2 mb-6">
//                 {campaign.campaigncategories?.map((tag, idx) => (
//                   <span
//                     key={idx}
//                     className="text-xs font-medium bg-gray-50 border border-gray-200 text-gray-700 px-2 py-1 rounded-md"
//                   >
//                     {tag.categoryname}
//                   </span>
//                 ))}
//               </div>

//               {/* Footer */}
//               <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
//                 <div>
//                   <p className="text-sm font-semibold text-gray-900">
//                     ₹{campaign.estimatedbudget}
//                   </p>
//                   <p className="text-xs text-gray-500">Estimated Budget</p>
//                 </div>

//                 {campaign.campaignapplied ? (
//                   <button
//                     className="px-5 py-2 text-sm font-medium rounded-full bg-gray-300 text-white cursor-not-allowed"
//                     disabled
//                   >
//                     Applied
//                   </button>
//                 ) : (
//                   <Link
//                     to={`/dashboard/browse/apply-now/${campaign.id}`}
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <button className="flex items-center gap-1 px-5 py-2 text-sm font-semibold rounded-full bg-[#0f122f] text-white hover:bg-[#1c1f40] transition">
//                       Apply Now
//                       <RiArrowRightLine size={14} />
//                     </button>
//                   </Link>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default CampaignCardGrid;

// import React from "react";
// import { Tooltip, Skeleton, Empty } from "antd";
// import {
//   RiBookmarkLine,
//   RiBookmarkFill,
//   RiArrowRightLine,
//   RiMoneyRupeeCircleLine,
//   RiCalendarLine,
// } from "@remixicon/react";
// import { Link } from "react-router-dom";

// const CampaignCardGrid = ({ campaigns, loading, handleCardClick, handleSave }) => {
//   return (
//     <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
//       {loading ? (
//         Array.from({ length: 6 }).map((_, idx) => (
//           <div key={idx} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
//             <Skeleton.Avatar active size="large" shape="circle" className="mb-4" />
//             <Skeleton active paragraph={{ rows: 3 }} />
//           </div>
//         ))
//       ) : campaigns.length === 0 ? (
//         <div className="col-span-full py-10">
//           <Empty description="No campaigns found." />
//         </div>
//       ) : (
//         campaigns.map((campaign) => (
//           <div
//             key={campaign.id}
//             onClick={() => handleCardClick(campaign.id)}
//             className="group bg-white/80 backdrop-blur-lg border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 rounded-3xl transition-all duration-300 overflow-hidden cursor-pointer"
//           >
//             {/* Banner Image */}
//             <div className="relative h-40 overflow-hidden rounded-t-3xl">
//               <img
//                 src={campaign.photopath}
//                 alt={campaign.name}
//                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

//               {/* Save Button */}
//               <div className="absolute top-3 right-3">
//                 <Tooltip title={campaign.campaigsaved ? "Unsave Campaign" : "Save Campaign"}>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleSave(campaign.id);
//                     }}
//                     className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full transition-all shadow-sm
//                       ${
//                         campaign.campaigsaved
//                           ? "bg-white text-[#0f122f]"
//                           : "bg-[#0f122f] text-white hover:bg-[#1b1f44]"
//                       }`}
//                   >
//                     {campaign.campaigsaved ? (
//                       <>
//                         <RiBookmarkFill size={14} /> Saved
//                       </>
//                     ) : (
//                       <>
//                         <RiBookmarkLine size={14} /> Save
//                       </>
//                     )}
//                   </button>
//                 </Tooltip>
//               </div>
//             </div>

//             {/* Card Body */}
//             <div className="p-5 flex flex-col space-y-3">
//               {/* Title and Business */}
//               <div>
//                 <h3 className="text-lg font-bold text-gray-900 leading-snug">
//                   {campaign.name}
//                 </h3>
//                 <p className="text-sm text-gray-500">{campaign.businessname}</p>
//               </div>

//               {/* Date + Budget */}
//               <div className="flex items-center justify-between text-sm text-gray-600">
//                 <div className="flex items-center gap-1">
//                   <RiCalendarLine size={16} className="text-gray-400" />
//                   Apply Till:
//                   <span className="font-medium text-gray-800 ml-1">
//                     {campaign.applicationenddate}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-1 font-semibold text-gray-800">
//                   <RiMoneyRupeeCircleLine size={16} className="text-green-600" />
//                   {campaign.estimatedbudget}
//                 </div>
//               </div>

//               {/* Tags */}
//               <div className="flex flex-wrap gap-2">
//                 {campaign.providercontenttype?.map((item, index) => (
//                   <span
//                     key={index}
//                     className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full border border-gray-200"
//                   >
//                     {item.providername} - {item.contenttypename}
//                   </span>
//                 ))}
//               </div>

//               {/* Description */}
//               <p
//                 className="text-sm text-gray-700 line-clamp-2"
//                 style={{
//                   display: "-webkit-box",
//                   WebkitLineClamp: 2,
//                   WebkitBoxOrient: "vertical",
//                 }}
//               >
//                 {campaign.description}
//               </p>

//               {/* Categories */}
//               <div className="flex flex-wrap gap-2">
//                 {campaign.campaigncategories?.map((tag, idx) => (
//                   <span
//                     key={idx}
//                     className="text-xs font-medium bg-gray-50 border border-gray-200 text-gray-600 px-2 py-1 rounded-md"
//                   >
//                     {tag.categoryname}
//                   </span>
//                 ))}
//               </div>

//               {/* Footer (Apply Button) */}
//               <div className="pt-3 border-t border-gray-100 flex justify-between items-center">

//                 {campaign.campaignapplied ? (
//                   <button
//                     className="px-5 py-2 text-sm font-medium rounded-full bg-gray-300 text-white cursor-not-allowed"
//                     disabled
//                   >
//                     Applied
//                   </button>
//                 ) : (
//                   <Link
//                     to={`/dashboard/browse/apply-now/${campaign.id}`}
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <button className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full bg-[#0f122f] text-white hover:bg-[#1c1f40] transition">
//                       Apply Now <RiArrowRightLine size={16} />
//                     </button>
//                   </Link>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default CampaignCardGrid;
