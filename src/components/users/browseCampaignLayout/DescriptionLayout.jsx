import {
  RiMenLine,
  RiMoneyRupeeCircleLine,
  RiStackLine,
  RiTranslate,
  RiArrowLeftSLine,
  RiCheckLine,
  RiAppsLine,
  RiMapPinLine,
  RiBriefcase4Line,
} from "@remixicon/react";
import axios from "axios";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Skeleton } from "antd";
import ApplyNowModal from "./ApplyNowModal";

const DescriptionLayout = () => {
  const [showFullBrandDesc, setShowFullBrandDesc] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  const { token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { campaignId } = useParams();
  const [isCampaignPreviewOpen, setIsCampaignPreviewOpen] = useState(false);

  const [previewFile, setPreviewFile] = useState(null);
  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return "N/A";

    if (typeof dateStr === "string" && dateStr.includes("-")) {
      const [dd, mm, yyyy] = dateStr.split("-");
      return `${dd}/${mm}/${yyyy}`;
    }
    const d = new Date(dateStr);
    if (isNaN(d)) return "N/A";

    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const fetchCampaignDetails = useCallback(async () => {
    if (!campaignId || !token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`/user/campaign-details/${campaignId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.data[0];
      setCampaignDetails(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch campaign details.");
    } finally {
      setLoading(false);
    }
  }, [campaignId, token, BASE_URL, isEditModalOpen]);

  useEffect(() => {
    fetchCampaignDetails();
  }, [fetchCampaignDetails]);

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const requirements = useMemo(() => {
    if (!campaignDetails) return [];
    return [
      {
        label: "Objective: ",
        value: campaignDetails.requirements?.objectivename,
      },
      {
        label: "Ship Products: ",
        value: campaignDetails.requirements?.isproductshipping ? "Yes" : "No",
      },
      {
        label: "Post Duration: ",
        value: `${campaignDetails.requirements?.postdurationdays} days`,
      },
      {
        label: "Include Profile Link: ",
        value: campaignDetails.requirements?.isincludevendorprofilelink
          ? "Yes"
          : "No",
      },
    ];
  }, [campaignDetails]);

  if (loading) {
    return (
      <div className="w-full text-sm overflow-x-hidden space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Skeleton.Button active size="small" shape="circle" />
          <Skeleton.Input active size="small" style={{ width: 100 }} />
        </div>

        <Skeleton.Input active size="default" style={{ width: 200 }} />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side */}
          <div className="flex-1 space-y-6">
            {/* Banner Card */}
            <div className="bg-white w-full rounded-2xl overflow-hidden">
              <div className="p-6 space-y-4">
                <Skeleton.Avatar active size={64} shape="circle" />
                <Skeleton.Input active style={{ width: 200 }} size="small" />
                <Skeleton.Input active style={{ width: 150 }} size="small" />
                <div className="flex gap-4">
                  <Skeleton.Button active />
                  <Skeleton.Button active />
                </div>
                <div className="flex gap-6 flex-wrap mt-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="min-w-[120px] text-center">
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 100 }}
                      />
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 80 }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description & Requirements */}
            <div className="bg-white p-6 rounded-2xl space-y-6">
              <Skeleton.Input active size="default" style={{ width: 200 }} />
              <Skeleton paragraph={{ rows: 3 }} active />

              <Skeleton.Input active size="default" style={{ width: 180 }} />
              <ul className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Skeleton.Avatar size="small" shape="circle" active />
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 200 }}
                    />
                  </li>
                ))}
              </ul>

              <div>
                <Skeleton.Input active size="default" style={{ width: 150 }} />
                <div className="flex gap-2 flex-wrap mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton.Button
                      key={i}
                      active
                      shape="round"
                      size="small"
                    />
                  ))}
                </div>
              </div>

              <div>
                <Skeleton.Input active size="default" style={{ width: 220 }} />
                <div className="flex gap-4 mt-4 flex-wrap">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton.Image
                      key={i}
                      active
                      style={{ width: 96, height: 96 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <aside className="w-full md:w-[300px] space-y-6 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <Skeleton.Input active size="default" style={{ width: 160 }} />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <Skeleton.Input active size="small" style={{ width: 100 }} />
                  <Skeleton.Input active size="small" style={{ width: 200 }} />
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 space-y-4">
              <Skeleton.Input active size="default" style={{ width: 200 }} />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <Skeleton.Input active size="small" style={{ width: 180 }} />
                  <Skeleton.Input active size="small" style={{ width: 140 }} />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="text-red-600 text-center py-10">
        {error}
        <button
          onClick={fetchCampaignDetails}
          className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  if (!campaignDetails)
    return (
      <div className="text-center py-10 text-gray-900">
        No campaign details found.
      </div>
    );

  return (
    <div className="w-full text-sm overflow-x-hidden">
      <button
        onClick={handleBack}
        className="text-gray-900 flex items-center gap-2 hover:text-gray-900 transition mb-4"
        aria-label="Go back"
      >
        <RiArrowLeftSLine size={20} /> Back
      </button>
      <h1 className="text-2xl font-semibold mb-6">Campaign Details</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side */}
        <div className="flex-1 space-y-6">
          {/* Banner */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            {/* Top Section */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-gray-200 pb-4">
              {/* Left Section - Profile + Basic Info */}
              <div className="flex items-start gap-4">
                <img
                  src={campaignDetails?.photopath}
                  alt="Campaign"
                  className="w-16 h-16 rounded-full object-cover cursor-pointer shadow"
                  onClick={() => setIsCampaignPreviewOpen(true)}
                />

                <div className="w-full">
                  {/* Campaign Title */}
                  <h2 className="font-semibold text-lg text-gray-900 leading-tight">
                    {campaignDetails?.name || "Campaign Name"}
                  </h2>

                  {/* Application Window */}
                  <p
                    className="
                        text-xs mt-1 
                        flex flex-col sm:flex-row 
                        sm:items-center 
                        gap-[2px] sm:gap-1 
                        leading-tight
                      "
                  >
                    <span className="font-semibold text-indigo-600 whitespace-nowrap">
                      Application Window:
                    </span>

                   <span className="text-gray-800 whitespace-nowrap">
                      {formatDateDDMMYYYY(
                        campaignDetails?.requirements?.applicationstartdate
                      )}
                      {" "}<b>-</b>{" "}
                      {formatDateDDMMYYYY(
                        campaignDetails?.requirements?.applicationenddate
                      )}
                    </span>
                  </p>

                  {/* Total Application */}
                  <p className="text-xs mt-1">
                    <span className="font-semibold text-indigo-600">
                      Total Application:
                    </span>{" "}
                    <span className="text-gray-800">
                      {campaignDetails?.appliedinfluencercount ?? "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Side Buttons */}
              <div className="flex gap-2 items-start">
                {campaignDetails?.isapplied ? (
                  <button className="px-4 py-1.5 cursor-pointer bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed">
                    Applied
                  </button>
                ) : campaignDetails?.campaignapplied ? (
                  <button
                    onClick={() => {
                      setSelectedApplicationId(campaignDetails?.id);
                      setSelectedCampaignId(campaignId); // you already have this in props
                      setEditModalOpen(true);
                    }}
                    className="px-6 py-2 bg-[#0F122F] cursor-pointer text-white rounded-full font-medium hover:bg-gray-800 transition"
                  >
                    Apply Now
                  </button>
                ) : (
                  <button className="px-4 py-1.5 bg-gray-400 cursor-pointer text-white rounded-lg font-medium cursor-not-allowed">
                    Not Eligible
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Grid Section */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              {/* Budget */}
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <RiMoneyRupeeCircleLine className="w-5 h-5" />
                  <span>Budget</span>
                </div>
                <p className="text-[#0D132D] font-semibold text-lg">
                  ₹{campaignDetails?.estimatedbudget}
                </p>
              </div>

              {/* Language */}
              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <RiTranslate className="w-5 h-5" />
                  <span>Language</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {campaignDetails?.campaignlanguages?.map((lang) => (
                    <span
                      key={lang.languageid}
                      className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md text-sm font-medium"
                    >
                      {lang.languagename}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <RiMenLine className="w-5 h-5" />
                  <span>Gender</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {campaignDetails?.campaigngenders?.map((gender) => (
                    <span
                      key={gender.genderid}
                      className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded-md text-sm font-medium"
                    >
                      {gender.gendername}
                    </span>
                  ))}
                </div>
              </div>

              {/* Platforms */}
              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <RiStackLine className="w-5 h-5" />
                  <span>Platform</span>
                </div>

                {campaignDetails?.providercontenttype?.length > 0 ? (
                  campaignDetails.providercontenttype.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1">
                      {p.iconpath && (
                        <img
                          src={p.iconpath}
                          className="w-5 h-5 object-contain"
                        />
                      )}
                      <p className="text-md text-gray-800 font-medium">
                        {p.contenttypes
                          ?.map((c) => c.contenttypename)
                          .join(", ")}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No Platform Data</p>
                )}
              </div>
            </div>

            {/* Image Modal */}
            {isCampaignPreviewOpen && (
              <div
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                onClick={() => setIsCampaignPreviewOpen(false)}
              >
                <img
                  src={campaignDetails?.photopath}
                  className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>

          {/* Description & Requirements */}
          <div className="bg-white p-6 rounded-2xl ">
            <div className="pb-6 border-b border-gray-200">
              <h3 className="font-semibold text-lg mb-3">
                Campaign Description
              </h3>
              <p className="text-gray-900 leading-relaxed mb-6">
                {campaignDetails.description || "No description available."}
              </p>

              <h3 className="text-lg font-semibold mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {campaignDetails.campaigncategories?.map(
                  ({ categoryname, categoryid }) => (
                    <span
                      key={categoryid || categoryname}
                      className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                    >
                      {categoryname}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="pt-6 border-b border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Requirements</h3>
              <ul className="space-y-3 text-gray-900">
                {requirements.map(({ label, value }, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <RiCheckLine
                      size={16}
                      className="text-gray-900 flex-shrink-0 border rounded"
                    />
                    <span>
                      <strong>{label}</strong> {value}
                    </span>
                  </li>
                ))}
              </ul>
              {/* Hashtags */}
              {campaignDetails.hashtags?.length > 0 && (
                <div className="my-6">
                  <h4 className="font-medium mb-2 text-gray-900">Hashtags</h4>
                  <div className="flex flex-wrap gap-2">
                    {campaignDetails.hashtags.map(({ hashtag }, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-xs font-semibold"
                      >
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-b border-gray-200 ">
              <h3 className="font-semibold text-lg mb-4">
                References & Additional Info
              </h3>

              {/* Campaign Files */}
              {campaignDetails.campaignfiles?.length > 0 && (
                <div className="mb-1">
                  <div className="flex flex-wrap gap-4">
                    {campaignDetails.campaignfiles.map(({ filepath }, i) => {
                      const fileUrl = filepath;
                      const extension = filepath.split(".").pop().toLowerCase();

                      const isImage = /\.(png|jpe?g|gif|svg)$/i.test(filepath);
                      const isVideo = /\.(mp4|webm|ogg)$/i.test(filepath);
                      const isPdf = extension === "pdf";
                      const isDoc = ["doc", "docx", "txt"].includes(extension);

                      return (
                        <div
                          key={i}
                          className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-300 hover:shadow-lg transition flex items-center justify-center bg-gray-100"
                          title="Open file in new tab"
                        >
                          {isImage ? (
                            <div
                              onClick={() => setPreviewFile(fileUrl)}
                              className="cursor-pointer w-full h-full"
                            >
                              <img
                                src={fileUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : isVideo ? (
                            <video
                              src={fileUrl}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                              controls
                            />
                          ) : isPdf ? (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col items-center justify-center text-red-600 text-xs font-semibold w-full h-full"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-8 h-8 mb-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              PDF
                            </a>
                          ) : isDoc ? (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col items-center justify-center text-blue-600 text-xs font-semibold w-full h-full"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-8 h-8 mb-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M7 8h10M7 12h6m-6 4h10M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H9l-4 4v10a2 2 0 002 2z"
                                />
                              </svg>
                              DOC
                            </a>
                          ) : (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center text-gray-900 text-xs w-full h-full"
                            >
                              View File
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {previewFile && (
              <div
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                onClick={() => setPreviewFile(null)}
              >
                <button
                  onClick={() => setPreviewFile(null)}
                  className="absolute top-5 right-6 text-white text-3xl font-bold hover:text-gray-300"
                >
                  &times;
                </button>
                {/\.(png|jpe?g|gif|svg)$/i.test(previewFile) && (
                  <img
                    src={previewFile}
                    className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}

                {/\.(mp4|webm|ogg)$/i.test(previewFile) && (
                  <video
                    src={previewFile}
                    controls
                    autoPlay
                    className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                {previewFile.endsWith(".pdf") && (
                  <iframe
                    src={previewFile}
                    className="max-w-[90vw] max-h-[85vh] rounded-xl bg-white shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <aside className="w-full md:w-[300px] space-y-6 flex-shrink-0">
          <div className="bg-white rounded-2xl p-4 w-full text-sm">
            {/* Brand Description */}
            <div className="space-y-4">
              <div>
                <p
                  className={`text-gray-800 whitespace-pre-line ${
                    showFullBrandDesc ? "" : "line-clamp-2"
                  }`}
                >
                  {campaignDetails.branddetails?.aboutbrand || "N/A"}
                </p>

                    {campaignDetails.branddetails?.aboutbrand &&
                      campaignDetails.branddetails.aboutbrand.length > 100 && (
                      <button
                        onClick={() => setShowFullBrandDesc((prev) => !prev)}
                        className="text-blue-600 text-xs font-semibold mt-1 hover:underline cursor-pointer"
                      >
                        {showFullBrandDesc ? "View Less" : "View More"}
                      </button>
                      )}
                    </div>

              <hr className="border-gray-200" />

              {/* Location + Industry (Same Row) */}
              <div className="flex items-center justify-between gap-6 text-sm">
                {/* Location */}
                <div className="flex items-center gap-1 text-gray-700">
                  <RiMapPinLine className="w-4 h-4 text-gray-700" />
                  <span className="truncate">
                    {campaignDetails.branddetails?.location || "N/A"}
                  </span>
                </div>

                {/* Category */}
                <div className="flex items-center gap-1 text-gray-700">
                  <RiAppsLine className="w-4 h-4 text-gray-700" />
                  <span className="truncate">
                    {campaignDetails.branddetails?.Industry || "N/A"}
                  </span>
                </div>
              </div>
              <hr className="border-gray-200" />
              {/* Campaign Dates */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[#0D132D]">
                  Campaign Dates
                </h3>

                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-sm font-semibold mb-1 my-2">Start Date</p>
                    <p className="text-gray-700">
                      {formatDateDDMMYYYY(campaignDetails?.requirements?.campaignstartdate)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold mb-1 my-2">End Date</p>
                    <p className="text-gray-700">
                      {formatDateDDMMYYYY(campaignDetails?.requirements?.campaignenddate) || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>  
          </div>
          {/* Provider Content Types with optional captions */}
          <div className="bg-white p-6 rounded-2xl">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">
              Platform & Content Deliverables
            </h3>

            <div className="space-y-4">
                {campaignDetails?.providercontenttype?.length > 0 ? (
                  campaignDetails.providercontenttype.map((platform) => (
                    <div
                      key={platform.providercontenttypeid}
                      className="border-b border-gray-100 pb-3 last:border-none"
                    >
                      {/* header row */}
                      <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {platform.iconpath && (
                        <img
                          src={platform.iconpath}
                          alt={platform.providername}
                          className="w-5 h-5 object-contain"
                        />
                        )}
                        <span className="text-gray-900 font-medium">
                        {platform.providername}
                        </span>
                      </div>

                        {/* Content Types at end */}
                        <span className="text-gray-500 text-sm text-right">
                          {platform.contenttypes && platform.contenttypes.length > 0
                            ? platform.contenttypes
                                .map((ct) => ct.contenttypename)
                                .join(", ")
                            : "No types"}
                        </span>
                      </div>

                      {/* Caption */}
                      {platform.caption && (
                        <p className="text-gray-600 italic mt-2 border-l-2 border-gray-200 pl-3">
                          {platform.caption}
                        </p>
                      )}
                    </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No platform content types available.</p>
                  )}
                  </div>
          </div>
        </aside>
      </div>

      <ApplyNowModal
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        applicationId={selectedApplicationId}
        campaignId={selectedCampaignId}
      />
    </div>
  );
};

export default DescriptionLayout;
