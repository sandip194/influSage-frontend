import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  RiCheckboxCircleFill,
  RiDeleteBin6Line,
  RiFacebookBoxFill,
  RiInstagramFill,
  RiMenLine,
  RiMoneyRupeeCircleLine,
  RiStackLine,
  RiTranslate,
  RiYoutubeFill,
} from "@remixicon/react";

const CampaignReviewStep = ({ campaignData, onEdit }) => {
  const { token } = useSelector((state) => state.auth) || {};

  // API Call
  const handleCreateCampaign = async () => {
    try {
      const authToken = token || localStorage.getItem("token");

      if (!authToken) {
        toast.error("No token found. Please log in again.", { position: "top-right" });
        return;
      }

      const res = await axios.post("/vendor/create-campaign", campaignData, {
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
      });

      toast.success(res.data.message || "Campaign created successfully!", { position: "top-right" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create campaign", { position: "top-right" });
    }
  };

  const profileParts = campaignData?.profileParts || {};

const p_objectivejson = profileParts.p_objectivejson || {};
const p_vendorinfojson = profileParts.p_vendorinfojson || {};
const p_campaignjson = profileParts.p_campaignjson || {};
const p_campaignfilejason = profileParts.p_campaignfilejason || [];
const p_contenttypejson = profileParts.p_contenttypejson || [];

const platforms = p_contenttypejson.map((p) => p.providername) || [];
const languages = p_vendorinfojson.campaignlanguages?.map((l) => l.languagename) || [];
const genders = p_vendorinfojson.genderid === 1 ? ["Male"] : ["Female"];
const references = p_campaignfilejason.map((f) => f.filepath) || [];
const tags = p_campaignjson.hashtags?.map((t) => t.hashtag) || [];

  return (
    <div className="w-full text-sm overflow-x-hidden">
      <h1 className="text-2xl font-semibold mb-4">Review Campaign</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Side */}
        <div className="flex-1 space-y-4">
          {/* Banner */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="relative h-40">
              <img
                src={references[0] || ""}
                alt="Banner"
                className="w-full h-28 object-cover"
              />
              {references[0] && (
                <img
                  src={references[0]}
                  alt="Logo"
                  className="absolute rounded-full top-16 left-4 w-20 h-20 border-2 border-white shadow-md"
                />
              )}
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
                  {platforms.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {/* Budget */}
                <div>
                  <div className="flex gap-2 items-center mb-2 text-gray-400">
                    <RiMoneyRupeeCircleLine className="w-5" />
                    <span> Budget </span>
                  </div>
                  <p>₹{p_campaignjson.estimatedbudget}</p>
                </div>

                {/* Languages */}
                <div>
                  <div className="flex gap-2 items-center mb-2 text-gray-400">
                    <RiTranslate className="w-5" />
                    <span> Language </span>
                  </div>
                  {languages.map((l, i) => (
                    <p key={i}>{l}</p>
                  ))}
                </div>

                {/* Gender */}
                <div>
                  <div className="flex gap-2 items-center mb-2 text-gray-400">
                    <RiMenLine className="w-5" />
                    <span> Gender </span>
                  </div>
                  {genders.map((g, i) => (
                    <p key={i}>{g}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description + Requirements */}
          <div className="bg-white p-4 rounded-2xl">
            <div className="campaign-description py-4 border-b border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Campaign Description</h3>
              <p className="text-gray-700 leading-relaxed">{p_campaignjson.description}</p>
            </div>

            {/* Requirements */}
            <div className="requirements py-4 border-b border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Requirements</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <RiCheckboxCircleFill />
                  <span>
                    Post Duration: <strong>{p_objectivejson.postdurationdays} days</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <RiCheckboxCircleFill />
                  <span>
                    Include Vendor Profile Link:{" "}
                    <strong>{p_objectivejson.isincludevendorprofilelink ? "Yes" : "No"}</strong>
                  </span>
                </li>
              </ul>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* References */}
            <div className="references py-4 border-b border-gray-200">
              <h3 className="font-semibold mb-4 text-lg">References</h3>
              <div className="flex gap-4 flex-wrap">
                {references.map((ref, i) => (
                  <div key={i} className="relative w-48 h-40 rounded-2xl overflow-hidden">
                    <img src={ref} alt="Reference" className="w-full h-full object-cover" />
                    <button className="absolute top-2 right-2 bg-gray-100 bg-opacity-70 text-black p-2 rounded-full">
                      <RiDeleteBin6Line className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">
          <div className="bg-white p-4 rounded-2xl">
            <h3 className="font-semibold text-lg">Campaign Details</h3>
            <div className="py-4 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Campaign Number</p>
              <p>{p_campaignjson.campaignnumber}</p>
            </div>
            <div className="py-4 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-1">About Brand</p>
              <p>{p_campaignjson.branddetail}</p>
            </div>
            <div className="py-4 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Start Date</p>
              <p>{p_campaignjson.startdate}</p>
            </div>
            <div className="py-4 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-1">End Date</p>
              <p>{p_campaignjson.enddate}</p>
            </div>
            <div className="py-4 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Total Budget</p>
              <p>₹{p_campaignjson.estimatedbudget}</p>
            </div>
          </div>

          {/* Platform Info */}
          <div className="bg-white p-4 rounded-2xl">
            <h3 className="font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-3">
              {p_contenttypejson.map((p, i) => (
                <li key={i} className="flex items-center gap-2">
                  {p.providername === "Instagram" && <RiInstagramFill />}
                  {p.providername === "Facebook" && <RiFacebookBoxFill />}
                  {p.providername === "YouTube" && <RiYoutubeFill />}
                  {p.providername} - {p.contenttypes.map((c) => c.contenttypename).join(", ")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex max-w-sm gap-3 mt-3">
        <button
          className="flex-1 bg-white border border-gray-300 text-gray-800 rounded-md py-2 hover:bg-gray-100"
          onClick={onEdit}
        >
          Edit Campaign
        </button>
        <button
          className="flex-1 bg-gray-900 text-white rounded-md py-2 hover:bg-gray-800"
          onClick={handleCreateCampaign}
        >
          Create Campaign
        </button>
      </div>
    </div>
  );
};

export default CampaignReviewStep;
