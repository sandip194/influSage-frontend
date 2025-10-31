import {
  RiMenLine,
  RiMoneyRupeeCircleLine,
  RiStackLine,
  RiTranslate,
  RiArrowLeftSLine,
  RiCheckLine,
} from '@remixicon/react';
import axios from 'axios';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {Skeleton } from 'antd';

const DescriptionLayout = () => {
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { campaignId } = useParams();

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
  }, [campaignId, token, BASE_URL]);

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
                    <Skeleton.Input active size="small" style={{ width: 100 }} />
                    <Skeleton.Input active size="small" style={{ width: 80 }} />
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
                  <Skeleton.Input active size="small" style={{ width: 200 }} />
                </li>
              ))}
            </ul>

            <div>
              <Skeleton.Input active size="default" style={{ width: 150 }} />
              <div className="flex gap-2 flex-wrap mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton.Button key={i} active shape="round" size="small" />
                ))}
              </div>
            </div>

            <div>
              <Skeleton.Input active size="default" style={{ width: 220 }} />
              <div className="flex gap-4 mt-4 flex-wrap">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton.Image key={i} active style={{ width: 96, height: 96 }} />
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
    return <div className="text-center py-10 text-gray-900">No campaign details found.</div>;

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
          <div className="bg-white rounded-2xl overflow-hidden ">
            <div className="relative h-40 bg-gray-300">
              <img
                src={campaignDetails?.photopath}
                alt="Campaign"
                className="absolute top-10 left-6 w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                loading="lazy"
              />
            </div>

            <div className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row justify-between items-start mb-5">
                <div>
                  <h2 className="font-semibold text-lg">{campaignDetails?.name}</h2>
                  <p className="text-gray-900 text-sm">{campaignDetails?.businessname}</p>
                  <div className="mt-2 flex-call flex-wrap gap-4 text-xs text-gray-900 font-medium">
                    <div className='text-sm text-gray-700'>
                      <span className="font-semibold text-gray-900">Apply Before:</span>{" "}
                      {campaignDetails.requirements.applicationenddate || "N/A"}
                    </div>
                    <div className='text-sm text-gray-700 '>
                      <span className="font-semibold text-gray-900">Campaign Start:</span>{" "}
                      {campaignDetails.requirements.startdate || "N/A"}
                    </div>

                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    aria-label="Stack"
                    className="p-2 rounded-full border border-gray-300 text-gray-900 hover:text-black hover:border-gray-500 transition"
                  >
                    <RiStackLine size={16} />
                  </button>
                  <button
                    aria-label="Men"
                    className="p-2 rounded-full border border-gray-300 text-gray-900 hover:text-black hover:border-gray-500 transition"
                  >
                    <RiMenLine size={16} />
                  </button>
                  {campaignDetails?.campaignapplied ? (
                    <button className="flex-1 px-6 py-2 rounded-3xl bg-[#9d9d9d] cursor-not-allowed text-white font-semibold transition min-w-0 truncate">
                      Applied
                    </button>
                  ) : (
                    <Link to={`/dashboard/browse/apply-now/${campaignId}`} className="flex-1 min-w-0">
                      <button className="w-full px-6 py-2 rounded-3xl bg-[#0f122f] cursor-pointer text-white font-semibold hover:bg-[#23265a] transition truncate">
                        Apply Now
                      </button>
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap md:justify-around gap-6 border border-gray-200 rounded-2xl p-5">
                <div className="min-w-[120px] text-center">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-900 font-semibold">
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
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-900 font-semibold">
                    <RiMoneyRupeeCircleLine size={20} />
                    <span>Budget</span>
                  </div>
                  <p className="text-sm ">₹{campaignDetails.estimatedbudget}</p>
                </div>
                <div className="min-w-[120px] text-center">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-900 font-semibold">
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
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-900 font-semibold">
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
          <div className="bg-white p-6 rounded-2xl ">
            <div className="pb-6 border-b border-gray-200">
              <h3 className="font-semibold text-lg mb-3">Campaign Description</h3>
              <p className="text-gray-900 leading-relaxed mb-6">
                {campaignDetails.description || "No description available."}
              </p>

              <h3 className="text-lg font-semibold mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                   {campaignDetails.campaigncategories?.map(({ categoryname, categoryid }) => (
                    <span
                      key={categoryid || categoryname}
                      className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                    >
                       {categoryname}
                    </span>
                  ))}
                </div>
      
            </div>

            <div className="pt-6 border-b border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Requirements</h3>
              <ul className="space-y-3 text-gray-900">
                {requirements.map(({ label, value }, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <RiCheckLine size={16} className="text-gray-900 flex-shrink-0 border rounded" />
                    <span>
                     <strong>{label}</strong>  {value}
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
              <h3 className="font-semibold text-lg mb-4">References & Additional Info</h3>

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
          </div>

        </div>

        {/* Right Side */}
        <aside className="w-full md:w-[300px] space-y-6 flex-shrink-0">
          <div className="bg-white rounded-2xl p-6 w-full text-sm   ">
            <h3 className="font-semibold text-lg mb-5">About Brand</h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-900">Brand Name</p>
                <p className=" text-gray-900">{campaignDetails.branddetails?.aboutbrand || "N/A"}</p>
              </div>
              <hr className="border-gray-200" />
              <div>
                <p className="font-medium text-gray-900">Location</p>
                <p className=" text-gray-900">{campaignDetails.branddetails?.location || "N/A"}</p>
              </div>
              <hr className="border-gray-200" />
              <div>
                <p className="font-medium text-gray-900">Industry</p>
                <p className=" text-gray-900">{campaignDetails.branddetails?.Industry || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Provider Content Types with optional captions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Platform Content Types</h3>

            <div className="space-y-4">
              {campaignDetails?.providercontenttype?.length > 0 ? (
                campaignDetails.providercontenttype.map((platform) => (
                  <div
                    key={platform.providercontenttypeid}
                    className="border-b border-gray-100 pb-3 last:border-none"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-medium">
                          {platform.providername}
                        </span>
                      </div>

                      <span className="text-gray-600 text-sm font-normal">
                        {platform.contenttypename}
                      </span>
                    </div>

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
    </div>
  );
};

export default DescriptionLayout;