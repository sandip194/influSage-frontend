import {
  RiMenLine,
  RiMoneyRupeeCircleLine,
  RiStackLine,
  RiTranslate,
  RiArrowLeftSLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiAppsLine,
  RiMapPinLine,
  RiBriefcase3Line
} from "@remixicon/react";
import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Skeleton, Modal, Tabs, ConfigProvider } from "antd";
import ApplyNowModal from "./ApplyNowModal";
import { toast } from "react-toastify";


const EditLayout = () => {
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [appliedDetails, setAppliedDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [showFullBrandDesc, setShowFullBrandDesc] = useState(false); commented it bcs never used

  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState("");
  const [filePreviewType, setFilePreviewType] = useState("");


  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);


  const { token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isCampaignPreviewOpen, setIsCampaignPreviewOpen] = useState(false);
  const { campaignId } = useParams();

  const [showFullAboutBrand, setShowFullAboutBrand] = useState(false);

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
      {
        label: "Start Date: ",
        value: `${formatDateDDMMYYYY(
          campaignDetails?.requirements?.campaignstartdate
        )}`,
      },
      {
        label: "End Date: ",
        value: `${formatDateDDMMYYYY(
          campaignDetails?.requirements?.campaignenddate
        )}`,
      },
      // {
      //   label: "Campaign Start Date: ",
      //   value: campaignDetails.requirements.campaignstartdate,
      // },
      // {
      //   label: "Campaign End Date: ",
      //   value: campaignDetails.requirements.campaignenddate,
      // },
    ];
  }, [campaignDetails]);

  const fetchCampaignDetails = useCallback(async () => {
    if (!campaignId || !token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        `user/applied-campaign-details/${campaignId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const campaignData = res.data.data.campaignDetails[0];
      const appliedData = res.data.data.appliedDetails;

      setCampaignDetails(campaignData);
      setAppliedDetails(appliedData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch campaign details.");
    } finally {
      setLoading(false);
    }
  }, [campaignId, token, BASE_URL]);

  useEffect(() => {
    fetchCampaignDetails();
  }, [fetchCampaignDetails]);

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleWithdraw = async () => {
    try {

      const res = await axios.post(
        `/user/withdraw-application`,
        {
          p_applicationid: Number(selectedApplicationId),
          p_statusname: "Withdrawn",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data?.message);
      fetchCampaignDetails();
    } catch (error) {
      toast.error(error || "Error withdrawing application");
    }
  };

  if (loading)
    return (
      <div className="w-full max-w-7xl mx-auto">
        <button className="text-gray-600 flex items-center gap-2 mb-4" disabled>
          <Skeleton.Avatar size="small" shape="circle" active />
          <Skeleton.Input style={{ width: 80 }} active size="small" />
        </button>

        <Skeleton active paragraph={{ rows: 0 }} title={{ width: "30%" }} />

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Side Skeleton */}
          <div className="flex-1 space-y-4">
            {/* Campaign Card Skeleton */}
            <div className="bg-white p-6 rounded-2xl">
              <Skeleton.Image style={{ width: 96, height: 96 }} active />
              <Skeleton
                active
                title={{ width: "60%" }}
                paragraph={{ rows: 2, width: ["40%", "80%"] }}
                className="mt-4"
              />
              <Skeleton paragraph={{ rows: 3 }} active className="mt-4" />
            </div>

            {/* Description Skeleton */}
            <div className="bg-white p-6 rounded-2xl">
              <Skeleton
                active
                title={{ width: "30%" }}
                paragraph={{ rows: 4 }}
              />
            </div>

            {/* Terms Skeleton */}
            <div className="bg-white p-6 rounded-2xl">
              <Skeleton
                active
                title={{ width: "40%" }}
                paragraph={{ rows: 3 }}
              />
            </div>
          </div>

          {/* Right Side Skeleton */}
          <div className="w-full md:w-[300px] flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl">
              <Skeleton
                active
                title={{ width: "50%" }}
                paragraph={{ rows: 5 }}
              />
            </div>
          </div>
        </div>
      </div>
    );

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
      <div className="text-center py-10 text-gray-500">
        No campaign details found.
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto text-sm overflow-x-hidden">
      <button
        onClick={handleBack}
        className="text-gray-600 cursor-pointer flex items-center gap-2 hover:text-gray-900 transition"
      >
        <RiArrowLeftSLine /> Back
      </button>
      <h1 className="text-2xl font-semibold mb-4">Campaign Details</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Side */}
        <div className="flex-1 space-y-4">
          {/* Banner */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            {/* Top Section */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-gray-200 pb-4">

              {/* Left Section - Profile + Basic Info */}
              <div className="flex items-start gap-4">
                <img
                  src={campaignDetails?.photopath}
                  onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
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
                      {" "}
                      <b>-</b>
                      {" "}
                      {formatDateDDMMYYYY(
                        campaignDetails?.requirements?.applicationenddate
                      )}
                    </span>
                  </p>

                  {/* Total Application */}
                  <p className="text-xs mt-1">
                    <span className="font-semibold text-indigo-600">Total Application:</span>{" "}
                    <span className="text-gray-800">{campaignDetails?.appliedinfluencercount ?? "N/A"}</span>
                  </p>
                </div>
              </div>

              {/* Right Buttons */}
              <div className="flex gap-2 items-start">

                {/* Edit Button (Conditional) */}
                {campaignDetails?.iseditable && (
                  <button
                    onClick={() => {
                      setSelectedApplicationId(campaignDetails?.applicationid);
                      setSelectedCampaignId(campaignId);
                      setEditModalOpen(true);
                    }}
                    className="px-6 py-2 bg-[#0F122F] cursor-pointer text-white rounded-full font-medium hover:bg-gray-800 transition"
                  >
                    Edit Application
                  </button>
                )}

                {/* Withdraw Button (Conditional) */}
                {campaignDetails?.canwithdraw && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedApplicationId(appliedDetails?.campaignapplicationid);
                      setWithdrawModalOpen(true)
                    }}
                    className="px-4 py-2 flex items-center gap-1 cursor-pointer  border border-red-300 bg-white text-red-600 rounded-full text-sm hover:bg-red-50 hover:border-red-500"
                  ><RiDeleteBinLine size={16} className="text-red-500" />
                    Withdraw
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
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <RiTranslate className="w-5 h-5" />
                  <span>Language</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {campaignDetails?.campaignlanguages?.map((lang, i) => (
                    <span
                      key={i}
                      className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md text-sm font-medium"
                    >
                      {lang.languagename}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <RiMenLine className="w-5 h-5" />
                  <span>Gender</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {campaignDetails?.campaigngenders?.map((gender, i) => (
                    <span
                      key={i}
                      className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded-md text-sm font-medium"
                    >
                      {gender.gendername || "Any"}
                    </span>
                  ))}
                </div>
              </div>

              {/* Platform */}
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">
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
                          alt="platform"
                          onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                        />
                      )}
                      <span className="text-sm text-gray-800 font-medium">
                        {p.contenttypes?.map((c) => c.contenttypename).join(", ")}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No Platform Data</p>
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
                  alt="Campaign Preview"
                  onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                  className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>


          <ConfigProvider
            theme={{
              components: {
                Tabs: {
                  colorBgContainer: "#0f122f",        // Background for tab container
                  itemColor: "#0f122f",            // Text color for inactive tab
                  itemHoverColor: "#0f122f",       // Text color on hover
                  itemSelectedColor: "#fff",       // Text color when active
                  itemActiveColor: "#fff",         // Ensures text stays white
                  itemActiveBg: "#fff",         // ✅ Active tab background
                  itemHoverBg: "#f4f5ff",          // Hover background
                  cardBg: "#fff",                  // Card tab background
                  inkBarColor: "#0f122f",          // Underline indicator (for line type)
                  colorBorderSecondary: "#e5e7eb", // Light border color
                  colorTextDisabled: "#b0b0b0",    // Disabled tab text
                },
              },
            }}
          >
            <Tabs type="card" defaultActiveKey="overview">
              <Tabs.TabPane tab="Campaign Overview" key="overview">
                {/* Description & Requirements */}
                <div className="bg-white p-6 rounded-2xl">
                  <div className="pb-2 border-b border-gray-200">
                    <h3 className="font-semibold text-lg mb-3">
                      Campaign Description
                    </h3>
                    <p
                      className={`text-gray-700 text-justify leading-relaxed mb-4 `}
                    >
                      {campaignDetails.description || "No description available."}
                    </p>


                  </div>

                  <h3 className="text-lg font-semibold my-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {campaignDetails.campaigncategories?.map(
                      ({ categoryname, categoryid }) => (
                        <p
                          key={categoryid || categoryname}
                          className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                        >
                          {categoryname}
                        </p>
                      )
                    )}
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
                            <strong> {label} </strong> {value}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {/* Hashtags */}
                    {campaignDetails.hashtags?.length > 0 && (
                      <div className="my-6">
                        <h4 className="font-medium mb-2 text-gray-900">
                          Hashtags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {campaignDetails.hashtags.map(({ hashtag }, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold"
                            >
                              {hashtag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 ">
                    <h3 className="font-semibold text-lg mb-4">
                      References & Additional Info
                    </h3>

                    {/* Campaign Files */}
                    {campaignDetails.campaignfiles?.length > 0 && (
                      <div className="mb-1">
                        <div className="flex flex-wrap gap-4">
                          {campaignDetails.campaignfiles.map(
                            ({ filepath }, i) => {
                              const fileUrl = filepath;
                              const extension = filepath
                                .split(".")
                                .pop()
                                .toLowerCase();

                              const isImage = /\.(png|jpe?g|gif|svg)$/i.test(
                                filepath
                              );
                              const isVideo = /\.(mp4|webm|ogg)$/i.test(filepath);
                              const isPdf = extension === "pdf";
                              const isDoc = ["doc", "docx", "txt"].includes(
                                extension
                              );

                              return (
                                <div
                                  key={i}
                                  className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-300 hover:shadow-lg transition flex items-center justify-center bg-gray-100"
                                  title="Open file in new tab"
                                >
                                  {isImage ? (
                                    <div
                                      onClick={() => {
                                        setFilePreviewUrl(fileUrl);
                                        setFilePreviewOpen(true);
                                      }}
                                      className="w-full h-full block cursor-pointer"
                                    >
                                      <img
                                        src={fileUrl}
                                        alt={`Campaign file ${i + 1}`}
                                        onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
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
                                      className="flex items-center justify-center text-gray-500 text-xs w-full h-full"
                                    >
                                      View File
                                    </a>
                                  )}
                                </div>

                              );
                            }
                          )}
                        </div>
                        {filePreviewOpen && (
                          <div
                            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                            onClick={() => setFilePreviewOpen(false)}
                          >

                            <button
                              className="absolute top-6 right-6 text-white text-3xl font-bold"
                              onClick={() => setFilePreviewOpen(false)}
                            >
                              &times;
                            </button>

                            <img
                              src={filePreviewUrl}
                              onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                              className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-xl object-contain"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )}

                      </div>
                    )}
                  </div>

                </div>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Your Proposel" key="proposel">
                <div className="bg-white p-6 rounded-2xl">

                  {/* Budget */}
                  <div className="pb-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Proposel Amount</h3>
                    <p className="text-[#0D132D]  ">
                      ₹{appliedDetails?.budget || "N/A"}
                    </p>
                  </div>


                  {/* Description */}
                  {appliedDetails?.description && (
                    <div className=" mt-3 pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-700">
                        {appliedDetails.description}
                      </p>
                    </div>
                  )}



                  {/* Right Column — File Previews */}
                  <div className="flex-1 mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Files</h3>

                    {appliedDetails?.filepaths?.length > 0 ? (
                      <div className="flex gap-3 flex-wrap">
                        {appliedDetails.filepaths.map(({ filepath }, index) => {
                          const fileUrl = filepath;
                          const extension = filepath.split(".").pop().toLowerCase();

                          const isImage = /\.(png|jpe?g|gif|svg|webp)$/i.test(filepath);
                          const isVideo = /\.(mp4|webm|ogg)$/i.test(filepath);
                          const isPdf = extension === "pdf";
                          const isDoc = ["doc", "docx", "txt"].includes(extension);

                          return (
                            <div
                              key={index}
                              className="w-28 h-28 rounded-xl overflow-hidden border border-gray-300 
                          hover:shadow-md transition flex items-center justify-center bg-white"
                            >
                              {isImage ? (
                                <div
                                  onClick={() => {
                                    setFilePreviewUrl(fileUrl);
                                    setFilePreviewType("image");
                                    setFilePreviewOpen(true);
                                  }}
                                  className="w-full h-full cursor-pointer"
                                >
                                  <img
                                    src={fileUrl}
                                    onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                    className="w-full h-full object-cover"
                                    alt="file"
                                  />
                                </div>
                              ) : isVideo ? (
                                <div
                                  onClick={() => {
                                    setFilePreviewUrl(fileUrl);
                                    setFilePreviewType("video");
                                    setFilePreviewOpen(true);
                                  }}
                                  className="w-full h-full cursor-pointer"
                                >
                                  <video src={fileUrl} className="w-full h-full object-cover" muted />
                                </div>
                              ) : isPdf ? (
                                <div
                                  onClick={() => {
                                    setFilePreviewUrl(fileUrl);
                                    setFilePreviewType("pdf");
                                    setFilePreviewOpen(true);
                                  }}
                                  className="flex flex-col items-center justify-center text-red-600 text-xs font-semibold w-full h-full cursor-pointer"
                                >
                                  PDF
                                </div>
                              ) : isDoc ? (
                                <div
                                  onClick={() => {
                                    setFilePreviewUrl(fileUrl);
                                    setFilePreviewType("doc");
                                    setFilePreviewOpen(true);
                                  }}
                                  className="flex flex-col items-center justify-center text-blue-600 text-xs font-semibold w-full h-full cursor-pointer"
                                >
                                  DOC
                                </div>
                              ) : (
                                <div
                                  onClick={() => {
                                    setFilePreviewUrl(fileUrl);
                                    setFilePreviewType("file");
                                    setFilePreviewOpen(true);
                                  }}
                                  className="text-gray-500 text-xs text-center px-2 cursor-pointer"
                                >
                                  View File
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-700">No files uploaded.</p>
                    )}
                  </div>
                  {filePreviewOpen && (
                    <div
                      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                      onClick={() => setFilePreviewOpen(false)}
                    >

                      <button
                        className="absolute top-6 right-6 text-white text-3xl font-bold"
                        onClick={() => setFilePreviewOpen(false)}
                      >
                        &times;
                      </button>

                      <div onClick={(e) => e.stopPropagation()}>
                        {filePreviewType === "image" && (
                          <img
                            src={filePreviewUrl}
                            onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                            className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-xl object-contain"
                          />
                        )}

                        {filePreviewType === "video" && (
                          <video
                            autoPlay
                            controls
                            className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-xl object-contain"
                          >
                            <source src={filePreviewUrl} />
                          </video>
                        )}

                        {filePreviewType === "pdf" && (
                          <iframe
                            src={filePreviewUrl}
                            className="w-[90vw] h-[90vh] rounded-xl bg-white"
                          />
                        )}

                        {filePreviewType === "doc" && (
                          <iframe
                            src={`https://docs.google.com/viewer?url=${filePreviewUrl}&embedded=true`}
                            className="w-[90vw] h-[90vh] rounded-xl bg-white"
                          />
                        )}
                      </div>

                    </div>
                  )}
                </div>
              </Tabs.TabPane>
            </Tabs>

          </ConfigProvider>

        </div>

        {/* Right Side */}
        <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">
          <div className="bg-white rounded-2xl p-4 w-full text-sm">
            <h3 className="font-semibold text-sm text-gray-700 mb-4">
              About Vendor
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-900 font-semibold text-base whitespace-pre-line">
                  {campaignDetails.vendordetails?.businessname || "N/A"}
                </p>
              </div>

              <hr className="border-gray-200" />

              {/* About Brand */}
              <div>
                <p
                  className={`text-gray-800 whitespace-pre-line ${
                    showFullAboutBrand ? "" : "line-clamp-2"
                  }`}
                >
                  {campaignDetails.vendordetails?.aboutbrand || "N/A"}
                </p>

                {campaignDetails.vendordetails?.aboutbrand &&
                  campaignDetails.vendordetails.aboutbrand.length > 100 && (
                    <button
                      onClick={() => setShowFullAboutBrand((prev) => !prev)}
                      className="text-blue-600 text-xs font-semibold mt-1 hover:underline cursor-pointer"
                    >
                      {showFullAboutBrand ? "View Less" : "View More"}
                    </button>
                  )}
              </div>

              <hr className="border-gray-200" />

              {/* Location + Industry */}
              <div className="flex items-center justify-between gap-6 text-sm">
                <div className="flex items-center gap-1 text-gray-700">
                  <RiMapPinLine className="w-4 h-4" />
                  <span className="truncate">
                    {campaignDetails.vendordetails?.location || "N/A"}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-gray-700">
                  <RiAppsLine className="w-4 h-4" />
                  <span className="truncate">
                    {campaignDetails.vendordetails?.parentcategory || "N/A"}
                  </span>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Company Size + Joining Date */}
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Company Size:</span>
                  <span className="text-gray-900">
                    {campaignDetails.vendordetails?.companysizename || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Member Since:</span>
                  <span className="text-gray-900">
                    {campaignDetails.vendordetails?.["Member Since"] || "N/A"}
                  </span>
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
                            onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
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
        </div>
      </div>


      {/* Withdraw Modal */}
      <Modal
        open={isWithdrawModalOpen}
        onCancel={() => setWithdrawModalOpen(false)}
        centered
        footer={null}
      >
        <h2 className="text-xl font-semibold mb-2">Withdraw Application</h2>
        <p className="text-gray-600">
          Are you sure you want to withdraw this application?
        </p>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setWithdrawModalOpen(false)}
            className="px-4 py-2 rounded-full cursor-pointer border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              handleWithdraw(selectedApplicationId);
              setWithdrawModalOpen(false);
            }}
            className="px-6 py-2 rounded-full cursor-pointer bg-[#0f122f] text-white"
          >
            Withdraw
          </button>
        </div>
      </Modal>


      <ApplyNowModal
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        applicationId={selectedApplicationId}
        campaignId={selectedCampaignId}
        campaignBudget={campaignDetails.estimatedbudget} 
        onSuccess ={() => setEditModalOpen(false)}
      />

    </div>
  );
};

export default EditLayout;
