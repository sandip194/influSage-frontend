import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import {
  RiCheckboxCircleFill,
  RiDeleteBin6Line,
  RiMenLine,
  RiMoneyRupeeCircleLine,
  RiStackLine,
  RiTranslate,
} from "react-icons/ri";

const CampaignReviewStep = ({ onEdit }) => {
  const { token, userId } = useSelector((state) => state.auth) || {};
  const [campaignData, setCampaignData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getFullUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http")
      ? path
      : `${BASE_URL}/${path.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const authToken = token || localStorage.getItem("token");
        if (!authToken) {
          toast.error("No token found. Please log in again.");
          return;
        }

        const res = await axios.get(`/vendor/campaign/01`, {
          headers: { Authorization: `Bearer ${authToken}` },
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
  }, [token, userId]);

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
        { filepath: fileToDelete.filepath },
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

  const handleCreateCampaign = async () => {
    try {
      const authToken = token || localStorage.getItem("token");
      if (!authToken) {
        toast.error("No token found. Please log in again.");
        return;
      }

      const payload = {
        userid: userId,
        objective: campaignData?.p_objectivejson || {},
        vendorinfo: campaignData?.p_vendorinfojson || {},
        campaign: campaignData?.p_campaignjson || {},
        references: campaignData?.p_campaignfilejson || [],
        contenttypes: campaignData?.p_contenttypejson || [],
      };

      const res = await axios.post("/vendor/finalize-campaign", payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(res.data.message || "Campaign created successfully!");

      // Redirect after success
      navigate("/vendor-dashboard/vendor-campaign");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create campaign");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!campaignData) return <p>No campaign data found</p>;

  const p_objectivejson = campaignData.p_objectivejson || {};
  const p_vendorinfojson = campaignData.p_vendorinfojson || {};
  const p_campaignjson = campaignData.p_campaignjson || {};
  const p_campaignfilejson = campaignData.p_campaignfilejson || [];
  const p_contenttypejson = campaignData.p_contenttypejson || [];

  const platforms = p_contenttypejson.map((p) => p.providername) || [];
  const languages =
    p_vendorinfojson.campaignlanguages?.map((l) => l.languagename) || [];
  const influencerTiers =
    p_vendorinfojson.campaigninfluencertiers?.map(
      (t) => t.influencertiername
    ) || [];
 const genders =
  Array.isArray(p_vendorinfojson.genderid) && p_vendorinfojson.genderid.length > 0
    ? p_vendorinfojson.genderid.map((id) => {
        switch (id) {
          case 1:
            return "Male";
          case 2:
            return "Female";
          case 3:
            return "Other";
        }
      })
    : ["Unspecified"];

 
  const camp_profile = p_campaignjson?.photopath ? [getFullUrl(p_campaignjson.photopath)] : [];
  const tags = p_campaignjson.hashtags?.map((t) => t.hashtag) || [];

  return (
    <div className="w-full text-sm overflow-x-hidden">
      <h1 className="text-2xl font-semibold mb-4">Review Campaign</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* LEFT SIDE */}
        <div className="flex-1 space-y-4">
          {/* Banner */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="relative h-40">
              <div className="relative h-40">
                {camp_profile[0] && (
                  <img
                    src={camp_profile[0]}
                    alt="Campaign"
                    className="absolute rounded-full top-9 left-4 w-27 h-27 border-2 border-white"
                  />
                )}
              </div>
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-1">{p_campaignjson.name}</h2>
              <p className="text-gray-500">{p_campaignjson.branddetail}</p>

              <div className="flex flex-wrap md:justify-around mt-3 gap-6 border border-gray-200 rounded-2xl p-4">
                {/* Platforms */}
                <div>
                  <div className="flex gap-2 items-center mb-2 text-gray-400">
                    <RiStackLine className="w-5" />
                    <span> Platforms</span>
                  </div>
                  {platforms.length > 0
                    ? platforms.map((p, i) => <p key={p + i}>{p}</p>)
                    : "—"}
                </div>

                {/* Budget */}
                <div>
                  <div className="flex gap-2 items-center mb-2 text-gray-400">
                    <RiMoneyRupeeCircleLine className="w-5" />
                    <span> Budget </span>
                  </div>
                  <p>₹{p_campaignjson.estimatedbudget || "0"}</p>
                </div>

                {/* Languages */}
                <div>
                  <div className="flex gap-2 items-center mb-2 text-gray-400">
                    <RiTranslate className="w-5" />
                    <span> Languages </span>
                  </div>
                  {languages.length > 0
                    ? languages.map((l, i) => <p key={l + i}>{l}</p>)
                    : "—"}
                </div>

                {/* Gender */}
                <div>
                  <div className="flex gap-2 items-center mb-2 text-gray-400">
                    <RiMenLine className="w-5" />
                    <span> Gender </span>
                  </div>
                  {genders.map((g, i) => (
                    <p key={g + i}>{g}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description + Requirements */}
          <div className="bg-white p-4 rounded-2xl">
            {/* Description */}
            <div className="campaign-description py-4 border-b border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Campaign Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {p_campaignjson.description || "No description provided"}
              </p>
            </div>

            {/* Requirements */}
            <div className="requirements py-4 border-b border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Requirements</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <RiCheckboxCircleFill size={20} />
                  <span>
                    Post Duration: <strong>{p_objectivejson.postdurationdays || 0} days</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <RiCheckboxCircleFill size={20} />
                  <span>
                    Include Vendor Profile Link:{" "}
                    <strong>{p_objectivejson.isincludevendorprofilelink ? "Yes" : "No"}</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <RiCheckboxCircleFill size={20} />
                  <span>
                    Product Shipping: <strong>{p_vendorinfojson.isproductshipping ? "Yes" : "No"}</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <RiCheckboxCircleFill size={20} />
                  <span>
                    Influencer Tiers:{" "}
                    <strong>{influencerTiers.length > 0 ? influencerTiers.join(", ") : "—"}</strong>
                  </span>
                </li>
              </ul>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.length > 0
                  ? tags.map((tag, i) => (
                      <span key={tag + i} className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                        {tag}
                      </span>
                    ))
                  : "No tags"}
              </div>
            </div>

            {/* References */}
            <div className="references py-4 border-b border-gray-200">
              <h3 className="font-semibold mb-4 text-lg">References</h3>
              <div className="flex gap-4 flex-wrap">
                {p_campaignfilejson.length > 0
                  ? p_campaignfilejson.map((file, i) => (
                      <div key={file.filepath + i} className="relative w-48 h-40 rounded-2xl overflow-hidden">
                        <img src={getFullUrl(file.filepath)} alt="Reference" className="w-full h-full object-cover" />
                        <button
                          className="absolute top-2 right-2 bg-gray-100 bg-opacity-70 text-black p-2 rounded-full"
                          type="button"
                          onClick={() => handleDeleteReference(file)}
                        >
                          <RiDeleteBin6Line className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  : "No references uploaded"}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">
          <div className="bg-white p-4 rounded-2xl">
            <h3 className="font-semibold text-lg">Campaign Details</h3>
            <div className="py-4 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-1">About Brand</p>
              <p>{p_campaignjson.branddetail || "—"}</p>
            </div>
            <div className="py-4 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Start Date</p>
              <p>{p_campaignjson.startdate || "—"}</p>
            </div>
            <div className="py-4 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-1">End Date</p>
              <p>{p_campaignjson.enddate || "—"}</p>
            </div>
            <div className="py-4 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Total Budget</p>
              <p>₹{p_campaignjson.estimatedbudget || "0"}</p>
            </div>
          </div>

          {/* Platform Info */}
          <div className="bg-white p-4 rounded-2xl">
            <h3 className="font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-3">
              {p_contenttypejson.length > 0 ? (
                p_contenttypejson.map((p, i) => (
                  <li key={p.providername + i} className="flex items-center gap-2">
                    <span>
                      {p.providername} {p.caption ? `- ${p.caption}` : ""}
                    </span>
                  </li>
                ))
              ) : (
                <p>No platforms selected</p>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex max-w-sm gap-3 mt-3">
        <button
          className="flex-1 bg-white border border-gray-300 text-gray-800 rounded-md py-2"
          onClick={onEdit}
          type="button"
        >
          Edit Campaign
        </button>
        <button
          className="flex-1 bg-gray-900 text-white rounded-md py-2 hover:bg-gray-800"
          onClick={handleCreateCampaign}
          type="button"
        >
          Create Campaign
        </button>
      </div>
    </div>
  );
};

export default CampaignReviewStep;
