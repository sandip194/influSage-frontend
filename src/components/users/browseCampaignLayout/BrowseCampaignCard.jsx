import React, { useState } from "react";
import { Tooltip, Skeleton, Empty } from "antd";
import { RiBookmarkLine, RiBookmarkFill } from "@remixicon/react";
import { Link } from "react-router-dom";
import ApplyNowModal from "./ApplyNowModal";

/* --- Individual Card (Reusable & Memoized) --- */
const CampaignCard = React.memo(
  ({ campaign, handleCardClick, handleSave, onApply, variant }) => {
    const today = new Date();
    const start =
      variant === "browse" && campaign.applicationstartdate
        ? new Date(
          campaign.applicationstartdate.split("-").reverse().join("-")
        )
        : null;


    return (
      <div
        onClick={() => handleCardClick(campaign.id)}
        className="bg-[#ebf1f7] hover:bg-[#d6e4f6] border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-transform duration-200 flex flex-col justify-between cursor-pointer relative"
      >
        {/* --- Top Section --- */}
        <div className="flex justify-between items-start mb-3 pb-2">
          <p className="text-xs text-gray-500 font-medium">
            {variant === "saved"
              ? `Created on ${campaign.campaigncreatedate}`
              : today < start
                ? `Application Starts On ${campaign.applicationstartdate}`
                : `Apply Till ${campaign.applicationenddate}`}
          </p>


          {/* Save Button */}
          <div className="absolute top-3 right-3 z-10">
            <Tooltip
              title={
                campaign.campaigsaved ? "Unsave Campaign" : "Save Campaign"
              }
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave(campaign.id);
                }}
                className={`flex items-center gap-1 px-2 py-1 border rounded-lg text-sm font-medium transition 
                ${campaign.campaigsaved
                    ? "border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-100"
                    : "border-gray-200 text-gray-600 bg-gray-200 hover:bg-gray-50"
                  }`}
              >
                {campaign.campaigsaved ? (
                  <>
                    <span>Saved</span>
                    <RiBookmarkFill size={16} className="text-green-600" />
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
            loading="lazy"
            src={campaign.photopath}
            alt={campaign.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <Link
            to={`/dashboard/browse/description/${campaign.id}`}
            onClick={(e) => e.stopPropagation()}
            className="block text-lg font-bold text-gray-900 hover:underline hover:text-blue-900"
          >
            {campaign.name}
          </Link>
        </div>

        {/* --- Tags --- */}
        <div className="flex flex-wrap gap-2 mb-4">
          {campaign.providercontenttype?.map((provider, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-full text-xs"
            >
              {provider.iconpath && (
                <img
                  src={provider.iconpath}
                  alt={provider.providername}
                  className="w-5 h-5"
                />
              )}
              <span>
                {provider.contenttypes
                  ?.map((ct) => ct.contenttypename)
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          ))}
        </div>

        {/* --- Description --- */}
        {campaign.description && (
          <p
            className="text-sm mb-4 text-justify h-14"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {campaign.description}
          </p>
        )}

        {/* --- Categories --- */}
        <div className="flex flex-wrap gap-1 mb-1">
          {campaign.campaigncategories?.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-gray-50 text-gray-900 rounded-lg text-xs font-semibold"
            >
              {tag.categoryname}
            </span>
          ))}
        </div>

        {/* --- Applied Count --- */}
        {campaign.appliedinfluencercount > 0 && (
          <div className="mb-1">
            <span className="px-3 py-1 bg-gray-200 w-44 rounded-full text-xs font-semibold flex items-center gap-2">
              <span className="w-5 h-5 bg-[#004eff30] text-gray-900 rounded-full flex items-center justify-center text-xs">
                {campaign.appliedinfluencercount}
              </span>
              {campaign.appliedinfluencercount === 1
                ? "influencer applied"
                : "influencers applied"}
            </span>
          </div>
        )}

        {/* --- Footer --- */}
        <div className="mt-auto flex justify-between items-center border-t border-black pt-4">
          <div>
            <p className="text-lg font-bold">
              ₹{campaign.estimatedbudget.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Estimated Budget</p>
          </div>

          {variant === "saved" ? (
            campaign.isapplied ? (
              <button disabled className="px-5 py-2 bg-gray-400 text-white rounded-full">
                Applied
              </button>
            ) : campaign.campaignapplied ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApply(campaign.id);
                }}
                className="px-5 py-2 bg-black text-white rounded-full"
              >
                Apply Now
              </button>
            ) : (
              <button disabled className="px-5 py-2 bg-gray-400 text-white rounded-full">
                Not Apply
              </button>
            )
          ) : (
            campaign.campaignapplied ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApply(campaign.id);
                }}
                className="px-5 py-2 bg-black text-white rounded-full"
              >
                Apply now
              </button>
            ) : (
              <button disabled className="px-5 py-2 bg-gray-400 text-white rounded-full">
                Apply now
              </button>
            )
          )}

        </div>
      </div>
    );
  }
);

/* --- Grid Component --- */
const CampaignCardGrid = React.memo(
  ({ campaigns, loading, handleCardClick, handleSave, variant }) => {
    const [openApply, setOpenApply] = useState(false);
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);

    const handleApply = (campaignId) => {
      setSelectedCampaignId(campaignId);
      setOpenApply(true);
    };

    return (
      <>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
