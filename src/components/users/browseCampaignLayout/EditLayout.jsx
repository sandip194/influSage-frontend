import {
  RiMenLine,
  RiMoneyRupeeCircleLine,
  RiStackLine,
  RiTranslate,
  RiArrowLeftSLine,
  RiCalendarLine,
  RiCheckLine,
} from "@remixicon/react";
import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";


const SimilarCampaigns = [
  {
    name: "Instagram Campaign",
    brand: "Tiktokstar",
    image: "https://cdn-icons-png.flaticon.com/512/1384/1384063.png",
  },
  {
    name: "Tiktok Campaign",
    brand: "Tiktokstar",
    image: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
  },
  {
    name: "Youtube Campaign",
    brand: "Tiktokstar",
    image: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
  },
  {
    name: "Facebook Campaign",
    brand: "Tiktokstar",
    image: "https://cdn-icons-png.flaticon.com/512/1384/1384053.png",
  },
];

const EditLayout = () => {

  const [campaignDetails, setCampaignDetails] = useState(null)
  const [appliedDetails, setAppliedDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [showFullBrandDesc, setShowFullBrandDesc] = useState(false);



  const { token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { campaignId } = useParams();

  const requirements = useMemo(() => {
    if (!campaignDetails) return [];
    return [
      {
        label: "Start Date: ",
        value: campaignDetails.requirements.startdate,
      },
      {
        label: "End Date: ",
        value: campaignDetails.requirements.enddate,
      },
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
        value: campaignDetails.requirements?.isincludevendorprofilelink ? "Yes" : "No",
      },
    ];
  }, [campaignDetails]);

  const fetchCampaignDetails = useCallback(async () => {
    if (!campaignId || !token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`user/applied-campaign-details/${campaignId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const campaignData = res.data.data.campaignDetails[0];
      const appliedData = res.data.data.appliedDetails

      setCampaignDetails(campaignData);
      setAppliedDetails(appliedData)

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



  if (loading)
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        Loading...
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
    return <div className="text-center py-10 text-gray-500">No campaign details found.</div>;



  return (
    <div className="w-full max-w-7xl mx-auto text-sm overflow-x-hidden">
      <button
        onClick={handleBack}
        className="text-gray-600 flex items-center gap-2 hover:text-gray-900 transition"
      >
        <RiArrowLeftSLine /> Back
      </button>
      <h1 className="text-2xl font-semibold mb-4">Campaign Details</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Side */}
        <div className="flex-1 space-y-4">
          {/* Banner */}
          <div className="bg-white rounded-2xl overflow-hidden ">
            <div className="relative h-40 bg-gray-300">
              <img
                src={`${BASE_URL}/${campaignDetails?.photopath}`}
                alt="Campaign"
                className="absolute top-10 left-6 w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                loading="lazy"
              />
            </div>

            <div className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row justify-between items-start mb-5">
                <div>
                  <h2 className="font-semibold text-lg">{campaignDetails?.name}</h2>
                  <p className="text-gray-500 text-sm">{campaignDetails?.businessname}</p>
                  <div className="mt-2 flex-call flex-wrap gap-4 text-xs text-gray-500 font-medium">
                    <div>
                      <span className="font-semibold text-gray-700">Apply Before:</span>{" "}
                      {campaignDetails?.requirements.applicationenddate || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Campaign Start:</span>{" "}
                      {campaignDetails?.requirements.startdate || "N/A"}
                    </div>

                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    aria-label="Stack"
                    className="p-2 rounded-full border border-gray-300 text-gray-500 hover:text-black hover:border-gray-500 transition"
                  >
                    <RiStackLine size={16} />
                  </button>
                  <button
                    aria-label="Men"
                    className="p-2 rounded-full border border-gray-300 text-gray-500 hover:text-black hover:border-gray-500 transition"
                  >
                    <RiMenLine size={16} />
                  </button>
                  <Link to={`/dashboard/browse/apply-now/${campaignId}`} className="flex-1">
                    <button className="w-full px-6 py-2 rounded-3xl bg-[#0f122f] cursor-pointer text-white font-semibold hover:bg-[#23265a] transition">
                      Edit Application
                    </button>
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap md:justify-around gap-6 border border-gray-200 rounded-2xl p-5">
                <div className="min-w-[120px] text-center">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiStackLine size={20} />
                    <span>Platform</span>
                  </div>
                  {campaignDetails.providercontenttype?.map(({ providername, contenttypename }, i) => (
                    <p key={`${providername}-${contenttypename}-${i}`} className="text-sm">
                      {providername} - {contenttypename}
                    </p>
                  ))}
                </div>
                <div className="min-w-[120px] text-center">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiMoneyRupeeCircleLine size={20} />
                    <span>Budget</span>
                  </div>
                  <p className="text-sm font-medium">₹{campaignDetails.estimatedbudget}</p>
                </div>
                <div className="min-w-[120px] text-center">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiTranslate size={20} />
                    <span>Language</span>
                  </div>
                  {campaignDetails.campaignlanguages?.map(({ languagename }, i) => (
                    <p key={`${languagename}-${i}`} className="text-sm">
                      {languagename}
                    </p>
                  ))}
                </div>
                <div className="min-w-[120px] text-center">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiMenLine size={20} />
                    <span>Gender</span>
                  </div>
                  {campaignDetails.campaigngenders?.map(({ gendername }, i) => (
                    <p key={`${gendername || "any"}-${i}`} className="text-sm">
                      {gendername || "Any"}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>


          {/* Description & Requirements */}
          <div className="bg-white p-6 rounded-2xl">
            <div className="pb-6 border-b border-gray-200">
              <h3 className="font-semibold text-lg mb-3">Campaign Description</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {campaignDetails.description || "No description available."}
              </p>

              {!showFullDetails && (
                <button
                  onClick={() => setShowFullDetails(true)}
                  className="text-blue-600 cursor-pointer font-medium hover:underline text-sm"
                >
                  View More
                </button>
              )}
            </div>
            {showFullDetails && (
              <>

                <div className="flex gap-2 items-center justify-start mb-2 text-gray-400">
                  <span>Categories</span>
                </div>
                {campaignDetails.campaigncategories?.map(({ categoryname, categoryid }) => (
                  <p key={categoryid || categoryname} className="text-sm">
                    {categoryname}
                  </p>
                ))}
                <div className="pt-6 border-b border-gray-200">
                  <h3 className="font-semibold text-lg mb-4">Requirements</h3>
                  <ul className="space-y-3 text-gray-700">
                    {requirements.map(({ label, value }, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <RiCheckLine size={16} className="text-gray-500 flex-shrink-0 border rounded" />
                        <span>
                          {label} <strong>{value}</strong>
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
                  <h3 className="font-semibold text-lg mb-4">References & Additional Info</h3>

                  {/* Campaign Files */}
                  {campaignDetails.campaignfiles?.length > 0 && (
                    <div className="mb-1">
                      <div className="flex flex-wrap gap-4">
                        {campaignDetails.campaignfiles.map(({ filepath }, i) => {
                          const fileUrl = `${BASE_URL}/${filepath}`;
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
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                                  <img
                                    src={fileUrl}
                                    alt={`Campaign file ${i + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </a>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6m-6 4h10M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H9l-4 4v10a2 2 0 002 2z" />
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
                        })}
                      </div>
                    </div>
                  )}

                </div>
              </>
            )}

          </div>

          <div className="bg-white p-4 rounded-2xl">
            {/* Proposed Terms */}
            <div>
              <h4 className="font-bold text-base mb-2">Your proposed terms</h4>
              <div className="flex flex-wrap md:justify-around mt-3 gap-6 border border-gray-200 rounded-2xl p-4">
                {/* Platforms */}
                <div className="flex-row items-center gap-2">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiStackLine className="w-5" />
                    <span>Platform</span>
                  </div>
                  {appliedDetails?.providercontenttype?.length > 0 ? (
                    appliedDetails.providercontenttype.map(({ providername, contenttypename }, i) => (
                      <p key={`${providername}-${i}`}>
                        {providername} - {contenttypename}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500">N/A</p>
                  )}
                </div>

                {/* Budget */}
                <div className="flex-row items-center justify-center gap-2">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiMoneyRupeeCircleLine className="w-5" />
                    <span>Budget</span>
                  </div>
                  <p>₹{appliedDetails?.budget || "N/A"}</p>
                </div>

                {/* Deadline (Optional - You may remove this if backend doesn't provide) */}
                {/* <div className="flex-row items-center justify-center gap-2">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiCalendarLine className="w-5" />
                    <span>Deadline</span>
                  </div>
                  <p className="text-gray-500">Not specified</p>
                </div> */}
              </div>
            </div>

            {/* Description */}
            {appliedDetails?.description && (
              <div className="mt-4">
                <h3 className="font-semibold text-base mb-2">Description</h3>
                <p className="text-gray-600">{appliedDetails.description}</p>
              </div>
            )}

            {/* Files */}
            {appliedDetails?.filepaths?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-base mb-2">Attached Files</h3>
                <div className="flex gap-3 flex-wrap">
                  {appliedDetails.filepaths.map(({ filepath }, index) => {
                    const fileUrl = `${BASE_URL}/src${filepath}`;
                    const extension = filepath.split(".").pop().toLowerCase();

                    const isImage = /\.(png|jpe?g|gif|svg|webp)$/i.test(filepath);
                    const isVideo = /\.(mp4|webm|ogg)$/i.test(filepath);
                    const isPdf = extension === "pdf";
                    const isDoc = ["doc", "docx", "txt"].includes(extension);

                    return (
                      <div
                        key={index}
                        className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-300 hover:shadow-lg transition flex items-center justify-center bg-gray-100"
                        title="Open file in new tab"
                      >
                        {isImage ? (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-full block"
                          >
                            <img
                              src={fileUrl}
                              alt={`File ${index + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </a>
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
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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
                            className="flex items-center justify-center text-gray-500 text-xs w-full h-full px-2 text-center"
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
        </div>

        {/* Right Side */}
        <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">
          <div className="bg-white rounded-2xl p-4 w-full text-sm">
            <h3 className="font-semibold text-lg mb-4">About Brand</h3>

            <div className="space-y-3">
              {/* Brand Description (Paragraph with toggle) */}
              <div>
                <p className="text-gray-500">Brand Name</p>
                <p
                  className={`font-medium text-gray-900 whitespace-pre-line ${showFullBrandDesc ? "" : "line-clamp-2"
                    }`}
                >
                  {campaignDetails.branddetails?.aboutbrand || "N/A"}
                </p>
                {campaignDetails.branddetails?.aboutbrand &&
                  campaignDetails.branddetails.aboutbrand.length > 100 && (
                    <button
                      onClick={() => setShowFullBrandDesc((prev) => !prev)}
                      className="text-blue-600 text-xs font-semibold mt-1 hover:underline"
                    >
                      {showFullBrandDesc ? "View Less" : "View More"}
                    </button>
                  )}
              </div>

              <hr className="border-gray-200" />

              {/* Location */}
              <div>
                <p className="text-gray-500">Location</p>
                <p className="font-medium text-gray-900">
                  {campaignDetails.branddetails?.location || "N/A"}
                </p>
              </div>

              <hr className="border-gray-200" />

              {/* Industry */}
              <div>
                <p className="text-gray-500">Industry</p>
                <p className="font-medium text-gray-900">
                  {campaignDetails.branddetails?.Industry || "N/A"}
                </p>
              </div>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
};

export default EditLayout;
