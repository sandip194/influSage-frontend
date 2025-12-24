import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { useParams } from "react-router-dom";
import influencer from '../../../assets/influencer.jpg'
import { Spin } from "antd";

import {
  RiCheckboxCircleFill,
  RiDeleteBin6Line,
  RiMenLine,
  RiMoneyRupeeCircleLine,
  RiStackLine,
  RiTranslate,
  RiCloseLine,
  RiCheckLine,
} from "react-icons/ri";

const CampaignReviewStep = ({ onEdit }) => {
  const { token, userId } = useSelector((state) => state.auth) || {};
  const [campaignData, setCampaignData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [lightboxVideo, setLightboxVideo] = useState({ open: false, src: "" });
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { campaignId } = useParams();
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);



  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        if (!token) {
          toast.error("No token found. Please log in again.");
          return;
        }

        const isEdit = !!campaignId;

        const url = isEdit
          ? `/vendor/campaign/${campaignId}`
          : `/vendor/campaign/01`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCampaignData(res.data?.campaignParts || {});
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to fetch campaign data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [token, userId, campaignId]);

  const handleDeleteReference = async (fileToDelete) => {
    if (!fileToDelete || !fileToDelete.filepath) {
      toast.error("Invalid file selected for deletion.");
      return;
    }

    try {
      const authToken = token || localStorage.getItem("token");
      if (!authToken) {
        toast.error("No token found. Please log in again.");
        return;
      }

      const res = await axios.post(
        "/vendor/campaign/delete-file",
        { campaignId, filepath: fileToDelete.filepath },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (res.data.status) {
        setCampaignData((prev) => ({
          ...prev,
          p_campaignfilejson: prev.p_campaignfilejson.filter(
            (f) => f.filepath !== fileToDelete.filepath
          ),
        }));
        toast.success("Reference file deleted successfully");
      } else {
        toast.error(res.data.message || "Failed to delete reference file");
      }
    } catch (error) {
      console.error("Delete reference file error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete reference file"
      );
    }
  };

  const p_objectivejson = campaignData?.p_objectivejson || {};
  const p_vendorinfojson = campaignData?.p_vendorinfojson || {};
  const p_campaignjson = campaignData?.p_campaignjson || {};
  const p_campaignfilejson = campaignData?.p_campaignfilejson || [];
  const p_contenttypejson = campaignData?.p_contenttypejson || [];

  const platforms =
    p_contenttypejson.flatMap((p) =>
      p.contenttypes?.map((ct) => `${p.providername} - ${ct.contenttypename}`)
    ) || [];

  const languages =
    p_vendorinfojson.campaignlanguages?.map((l) => l.languagename) || [];

  const influencerTiers =
    p_vendorinfojson.campaigninfluencertiers?.map(
      (t) => t.influencertiername
    ) || [];

  const genders = Array.isArray(p_vendorinfojson.genders)
    ? p_vendorinfojson.genders.map((g) => ({
      genderid: g.genderid,
      gendername: g.gendername || "Unspecified",
    }))
    : [];

  const camp_profile = p_campaignjson?.photopath
    ? p_campaignjson?.photopath
    : null;

  const tags = p_campaignjson.hashtags?.map((t) => t.hashtag) || [];

  const handleCreateCampaign = async (status) => {
    try {
      if (status === "Draft") setLoadingDraft(true);
      if (status === "ApprovalPending") setLoadingSend(true);

      const authToken = token || localStorage.getItem("token");
      if (!authToken) {
        toast.error("No token found. Please log in again.");
        return;
      }

      const payload = {
        userid: userId,
        p_campaignid: campaignId || null,
        objective: campaignData?.p_objectivejson || {},
        vendorinfo: { ...p_vendorinfojson, genders },
        campaign: campaignData?.p_campaignjson || {},
        references: campaignData?.p_campaignfilejson || [],
        contenttypes: campaignData?.p_contenttypejson || [],
        p_statusname: status,
      };

      const res = await axios.post("/vendor/finalize-campaign", payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(res.data.message || "Campaign created successfully!");
      navigate("/vendor-dashboard/vendor-campaign");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create campaign");
    } finally {
      setLoadingDraft(false);
      setLoadingSend(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!campaignData) return <p>No campaign data found</p>;



  return (
    <div className="w-full text-sm overflow-x-hidden">
      <h1 className="text-2xl font-semibold mb-4">Review Campaign</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* LEFT SIDE */}
        <div className="flex-1 space-y-4">
          {/* Banner */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="relative h-40">
               <img
                src={influencer}
                alt="Banner"
                className="w-full h-28 object-cover rounded-lg cursor-pointer"
                onClick={() => setPreviewImage(influencer)}
              />
              {/* Campaign Profile */}
              {camp_profile && (
                <img
                  src={camp_profile}
                  alt="Campaign"
                  className="absolute object-cover rounded-full top-18 left-4 w-22 h-22 cursor-pointer"
                  onClick={() => setPreviewImage(camp_profile)}
                />
              )}
              {previewImage && (
                <div
                  className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                  onClick={() => setPreviewImage(null)}
                >
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="absolute top-5 right-6 text-white text-3xl font-bold hover:text-gray-300"
                  >
                    &times;
                  </button>

                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

            </div>
            <div className="p-5">
              {/* Title */}
              <h2 className="font-semibold text-xl text-gray-900 mb-1">
                {p_campaignjson.name}
              </h2>
              <p className="text-gray-500 mb-5">
                {p_campaignjson.branddetail}
              </p>

              {/* Info Card */}
              <div className="
                grid grid-cols-2 
                sm:grid-cols-2 
                md:grid-cols-4 
                gap-6 
                mt-3 
                border border-gray-200 
                rounded-2xl 
                p-4
              ">

                {/* Budget */}
                <div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <RiMoneyRupeeCircleLine className="w-4 h-4" />
                    <span>Budget</span>
                  </div>
                  <p className="text-[#0D132D] font-semibold text-lg">
                    ₹{p_campaignjson.estimatedbudget || 0}
                  </p>
                </div>

                {/* Language */}
                <div className="min-w-[160px]">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <RiTranslate className="w-4 h-4" />
                    <span>Language</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {languages?.length > 0 ? (
                      languages.map((l, i) => (
                        <span
                          key={l + i}
                          className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md text-sm font-medium"
                        >
                          {l}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>
                </div>

                {/* Gender */}
                <div className="min-w-[140px]">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <RiMenLine className="w-4 h-4" />
                    <span>Gender</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {genders?.length > 0 ? (
                      genders.map((g) => (
                        <span
                          key={g.genderid}
                          className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded-md text-sm font-medium"
                        >
                          {g.gendername}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>
                </div>

                {/* Platform */}
                <div className="min-w-[200px]">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <RiStackLine className="w-4 h-4" />
                    <span>Platform</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      {p_contenttypejson?.length > 0 ? (
                        p_contenttypejson.map((p) => (
                          <span
                            key={p.providerid}
                            className="rounded-md bg-blue-100 text-blue-800 px-3 py-1 text-xs font-medium"
                          >
                            {p.providername} - {" "}
                            {p.contenttypes
                              ?.map((ct) => ct.contenttypename)
                              .join(", ")}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description + Requirements */}
          <div className="bg-white p-4 rounded-2xl">


            {/* Categories */}
            <div className="py-4 border-b border-gray-200">
              <p className="font-semibold text-lg mb-2">Categories</p>
              <div className="flex flex-wrap gap-2 my-2">
                {campaignData?.p_campaigncategoyjson?.[0]?.categories?.length > 0 ? (
                  campaignData.p_campaigncategoyjson[0].categories.slice(0, 5).map((subcat) => (
                    <span
                      key={subcat.categoryid}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      {subcat.categoryname}
                    </span>
                  ))
                ) : (
                  <p>—</p>
                )}
              </div>
            </div>


            {/* Description */}
            <div className="campaign-description py-4 border-b border-gray-200">
              <h3 className="font-semibold text-lg mb-2">
                Campaign Description
              </h3>
              <p className="text-gray-700 leading-relaxed text-justify">
                {p_campaignjson.description || "No description provided"}
              </p>
            </div>

            {/* Requirements */}
            <div className="requirements py-4 border-b border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Requirements</h3>
              <ul className="space-y-2 font-semibold">
                <li className="flex items-center gap-2">
                  <RiCheckLine size={20} className="text-gray-900 flex-shrink-0 border rounded" />
                  <span>
                    Post Duration : <span className="text-gray-500">{p_objectivejson.postdurationdays || 0} days</span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <RiCheckLine size={20} className="text-gray-900 flex-shrink-0 border rounded" />
                  <span>
                    Include Vendor Profile Link :{" "}
                    <span className="text-gray-500">
                      {p_objectivejson.isincludevendorprofilelink
                        ? "Yes"
                        : "No"}
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <RiCheckLine size={20} className="text-gray-900 flex-shrink-0 border rounded" />
                  <span>
                    Product Shipping :{" "}
                    <span className="text-gray-500">
                      {p_vendorinfojson.isproductshipping ? "Yes" : "No"}
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <RiCheckLine size={20} className="text-gray-900 flex-shrink-0 border rounded" />
                  <span>
                    Influencer Tiers :{" "}
                    <span className="text-gray-500">
                      {influencerTiers.length > 0
                        ? influencerTiers.join(", ")
                        : "—"}
                    </span>
                  </span>
                </li>
              </ul>

              {/* Tags */}
              <div className="py-4">
                <h3 className="font-semibold text-lg mb-4">HashTags</h3>
                <div className="flex flex-wrap gap-2 my-2">
                  {tags.length > 0
                    ? tags.map((tag, i) => (
                      <span
                        key={tag + i}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))
                    : "No tags"}
                </div>
              </div>
            </div>

            {/* References */}
            <div className="references py-4 border-b border-gray-200">
              <h3 className="font-semibold mb-4 text-lg">References</h3>
              <PhotoProvider>
                <div className="flex gap-4 flex-wrap justify-center">
                  {p_campaignfilejson.length > 0
                    ? p_campaignfilejson.map((file, i) => {
                      const fileUrl = file.filepath;
                      const ext = fileUrl?.split(".").pop().toLowerCase();

                      const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
                      const isVideo = ["mp4", "webm", "ogg", "mov"].includes(ext);
                      const isPdf = ext === "pdf";
                      const isDoc = ["doc", "docx"].includes(ext);

                      return (
                        <div
                          key={file.filepath + i}
                          className="relative w-28 h-28 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center"
                        >
                          {/* Images → open with PhotoView */}
                          {isImage && (
                            <PhotoView src={fileUrl}>
                              <img
                                src={fileUrl}
                                alt="Reference"
                                className="w-full h-full object-cover rounded-2xl cursor-pointer"
                              />
                            </PhotoView>
                          )}

                          {/* Videos → open with <video> in modal */}
                          {isVideo && (
                            <div
                              className="w-full h-full cursor-pointer relative"
                              onClick={() =>
                                setLightboxVideo({ open: true, src: fileUrl })
                              }
                            >
                              <video
                                src={fileUrl}
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover rounded-2xl"
                              />
                            </div>
                          )}

                          {/* PDFs → show download link */}
                          {isPdf && (
                            <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50 p-3 cursor-default">
                              <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-lg mb-2">
                                <span className="text-red-600 text-lg font-bold">PDF</span>
                              </div>
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 text-blue-500 underline text-xs font-medium hover:text-blue-700"
                              >
                                View PDF
                              </a>
                            </div>
                          )}

                          {/* DOC/DOCX → show download link */}
                          {isDoc && (
                            <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50 p-3 cursor-default">
                              <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-lg mb-2">
                                <span className="text-green-600 text-lg font-bold">DOC</span>
                              </div>
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 text-blue-500 underline text-xs font-medium hover:text-blue-700"
                              >
                                View DOC
                              </a>
                            </div>
                          )}

                          {/* Delete Button */}
                          <button
                            className="absolute top-1 right-1 bg-black/60 flex items-center justify-center w-7 h-7 hover:bg-black/80 text-white p-1 rounded-full"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteReference(file);
                            }}
                          >
                            <RiDeleteBin6Line />
                          </button>
                        </div>
                      );
                    })
                    : "No references uploaded"}
                </div>

              </PhotoProvider>

              {/* Custom modal for videos */}
              {lightboxVideo.open && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                  <div className="relative w-[90%] max-w-4xl">
                    <video
                      src={lightboxVideo.src}
                      controls
                      autoPlay
                      className="w-full rounded-lg"
                    />
                    <button
                      className="absolute top-2 right-2 bg-white flex items-center justify-center w-7 h-7 text-black p-1 rounded-full"
                      onClick={() => setLightboxVideo({ open: false, src: "" })}
                    >
                      <RiCloseLine />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">
          <div className="bg-white p-4 rounded-2xl">
            <h3 className="font-semibold text-lg">Campaign Details</h3>
            <hr className="my-2 border-gray-200" />
            {/* <div className="py-4 border-b border-gray-200">
              <p className="text-sm font-semibold mb-1 text-justify">
                About Brand
              </p>
              <p className='text-gray-500'>{p_campaignjson.branddetail || "—"}</p>
            </div> */}
            <div className="py-2 border-b border-gray-200">
              <p className="text-sm mb-1 font-semibold">Campaign Dates</p>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-semibold mb-1 my-2">Start Date</p>
                  <p className='text-gray-500'>{p_campaignjson.campaignstartdate || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1 my-2">End Date</p>
                  <p className='text-gray-500'>{p_campaignjson.campaignenddate || "—"}</p>
                </div>
              </div>
              <hr className="my-4 border-gray-200" />
              <p className="text-sm mb-1 mt-4 font-semibold">Application Dates</p>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-semibold mb-1 my-2">Start Date</p>
                  <p className='text-gray-500'>{p_campaignjson.applicationstartdate || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1 my-2">End Date</p>
                  <p className='text-gray-500'>{p_campaignjson.applicationenddate || "—"}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 pb-2">
              <p className="text-sm font-semibold mb-1">Total Budget</p>
              <p className='text-gray-500'>₹{p_campaignjson.estimatedbudget || "0"}</p>
            </div>
          </div>

          {/* Milestone Info */}
          {/* <div className="bg-white p-4 rounded-2xl">
            <div className="space-y-4">
              {campaignData?.p_campaignjson?.milestones?.length > 0 ? (
                campaignData.p_campaignjson.milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 "
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-sm ">
                        Milestone {index + 1}
                      </h4>
                      <span className="text-xs text-gray-500">{milestone.enddate}</span>
                    </div>
                    <p className="text-sm mb-1">
                      <span className="font-semibold">Description :</span> {milestone.description || "—"}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Amount :</span> ₹{milestone.amount.toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No milestones added.</p>
              )}
            </div>

          </div> */}

          {/* Platform Info */}
          <div className="bg-white p-4 rounded-2xl">
            <h3 className="font-semibold text-lg py-3">Platform</h3>
            <div className="space-y-3">
              {p_contenttypejson.length > 0 ? (
                p_contenttypejson.map((p, i) => (
                  <div key={p.providername + i}>
                    <div className="flex items-center justify-between pb-2">
                      <div className="flex flex-col">
                        <span className="text-gray-700 font-medium">
                          {p.providername}
                        </span>
                        <p className="text-gray-600 italic text-sm mt-2 border-l-2 border-gray-200 pl-3">
                            {p.caption}
                          </p>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {p.contenttypes && p.contenttypes.length > 0
                          ? p.contenttypes.map((ct) => ct.contenttypename).join(", ")
                          : "No types"}
                      </span>
                    </div>
                    {i < p_contenttypejson.length - 1 && (
                      <hr className="my-4 border-gray-200" />
                    )}
                  </div>
                ))
              ) : (
                <p>No platforms selected</p>
              )}
            </div>
          </div>


        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-row max-sm:flex-col w-full max-w-sm gap-3 mt-3">

          <button
            className="flex-1 bg-white border border-gray-300 text-gray-800 py-3 rounded-full disabled:opacity-60"
            onClick={onEdit}
            type="button"
            disabled={loadingDraft || loadingSend}
          >
            Edit Campaign
          </button>

          <button
            className="flex-1 bg-gray-900 text-white py-3 hover:bg-gray-800 rounded-full disabled:opacity-60 flex items-center justify-center gap-2"
            onClick={() => handleCreateCampaign("Draft")}
            type="button"
            disabled={loadingDraft || loadingSend}
          >
            {loadingDraft ? (
              <>
                <Spin size="small" /> <span>Saving...</span>
              </>
            ) : (
              "Save Draft"
            )}
          </button>

          <button
            className="flex-1 bg-gray-900 text-white py-3 hover:bg-gray-800 rounded-full disabled:opacity-60 flex items-center justify-center gap-2"
            onClick={() => handleCreateCampaign("ApprovalPending")}
            type="button"
            disabled={loadingDraft || loadingSend}
          >
            {loadingSend ? (
              <>
                <Spin size="small" /> <span>Sending...</span>
              </>
            ) : (
              "Send For Approcval"
            )}
          </button>

        </div>

    </div>
  );
};

export default CampaignReviewStep;
