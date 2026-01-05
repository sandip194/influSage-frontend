import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    RiArrowLeftLine,
    RiPlayCircleLine,
    RiMessage2Line,
    RiEyeLine,
} from "@remixicon/react";
import AcceptOfferModal from "./models/AcceptOfferModal";
import { Tooltip, Skeleton } from "antd";
import {
    FaFacebook,
    FaInstagram,
    FaTiktok,
    FaYoutube,
} from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const OfferDetails = () => {
    const [offerDetails, setOfferDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useSelector((state) => state.auth);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const handleMessageClick = () => {
        navigate("/vendor-dashboard/messages", {
            state: {
            influencerId: offerDetails.influencerid,
            influencerName: `${offerDetails.firstname} ${offerDetails.lastname}`,
            influencerPhoto: offerDetails.photopath
                ? offerDetails.photopath
                : null,
            conversationId: offerDetails.conversationid || null,


            selectChatFromOutside: {
                influencerid: offerDetails.influencerid,
                influencerName: `${offerDetails.firstname} ${offerDetails.lastname}`,
                influencerPhoto: offerDetails.photopath
                ? offerDetails.photopath
                : null,
                conversationId: offerDetails.conversationid || null,
            },
            },
        });
    };

    useEffect(() => {
        const getApplicationDetails = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`vendor/offer-detail/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOfferDetails(res.data.data);
            } catch (error) {
                console.error("Failed to fetch offer details:", error);
            } finally {
                setLoading(false);
            }
        };

        getApplicationDetails();
    }, [id, token]);

    if (loading || !offerDetails) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Right Section Skeleton */}
            <div className="order-1 md:order-2 bg-white p-6 rounded-2xl space-y-4 self-start">
                <Skeleton.Avatar active size="large" />
                <Skeleton active paragraph={{ rows: 2 }} />
                <Skeleton.Input style={{ width: 150 }} active />
                <Skeleton.Input style={{ width: 150 }} active />
                <Skeleton.Button active />
            </div>

            {/* Left Section Skeleton */}
            <div className="order-2 md:order-1 md:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl">
                    <Skeleton active title paragraph={{ rows: 3 }} />
                </div>
                <div className="bg-white p-6 rounded-2xl">
                    <Skeleton active title paragraph={{ rows: 1 }} />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {[...Array(4)].map((_, idx) => (
                            <Skeleton.Input
                                key={idx}
                                style={{ width: "100%", height: "7rem", borderRadius: "0.75rem" }}
                                active
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


    const followers = {};
    offerDetails.providers?.forEach((p) => {
        const key = p.providername.toLowerCase();
        followers[key] = p.nooffollowers?.toLocaleString("en-IN");
    });

    const profileImage = offerDetails?.photopath;
    const influencerName = `${offerDetails?.firstname || ""} ${offerDetails?.lastname || ""}`;
    const location = `${offerDetails?.statename || ""}, ${offerDetails?.countryname || ""}`;


    const handleAcceptApplication = async () => {
  if (!offerDetails?.applicationid) {
    toast.error("Application ID missing. Cannot accept offer.");
    return;
  }

  try {
    setLoading(true);
    const res = await axios.post(
      `/chat/startconversation`,
      {
        p_campaignapplicationid: Number(offerDetails.applicationid),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.data.p_status) {
      toast.success(res.data.message || "Conversation started successfully");
    } else {
      toast.error(res.data.message || "Failed to start conversation");
    }
  } catch (error) {
    console.error("Error starting conversation:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

// Accept modal confirm handler
const handleConfirmAccept = () => {
  handleAcceptApplication();
  setIsAcceptModalOpen(false);
};


    const handleViewProfile = (userId) => {
    navigate(`/vendor-dashboard/applications/influencer-details/${userId}`);
  };

    return (
        <div>
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 mb-4"
            >
                <RiArrowLeftLine /> Back
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Right Section */}
                <div className="order-1 md:order-2 bg-white p-6 rounded-2xl space-y-4 self-start">
                    <div key={offerDetails?.applicationid} className="flex flex-col">
                        {/* Profile */}
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src={profileImage}
                                alt={influencerName}
                                loading="lazy"
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                            />
                            <div>
                                <div className="font-semibold text-gray-900">
                                    {influencerName}
                                </div>
                                <div className="text-xs text-gray-500">{location}</div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {offerDetails?.categories?.map((cat) => (
                                <span
                                    key={cat.categoryid}
                                    className="px-2 py-1 bg-gray-100 rounded-xl text-xs text-gray-700"
                                >
                                    {cat.categoryname}
                                </span>
                            ))}
                        </div>

                        <hr className="my-2 border-gray-200" />

                        {/* Social Followers */}
                        <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
                            {followers.instagram && (
                                <span className="flex items-center gap-1 text-pink-600">
                                    <FaInstagram className="text-xl" /> {followers.instagram}
                                </span>
                            )}
                            {followers.youtube && (
                                <span className="flex items-center gap-1 text-red-600">
                                    <FaYoutube className="text-xl" /> {followers.youtube}
                                </span>
                            )}
                            {followers.facebook && (
                                <span className="flex items-center gap-1 text-blue-600">
                                    <FaFacebook className="text-xl" /> {followers.facebook}
                                </span>
                            )}
                            {followers.tiktok && (
                                <span className="flex items-center gap-1 text-black">
                                    <FaTiktok className="text-xl" /> {followers.tiktok}
                                </span>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                            <button 
                            onClick={() => handleViewProfile(offerDetails.influencerid)}
                            className="w-full sm:w-auto flex-1 py-2 flex items-center justify-center gap-2 
                rounded-3xl border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                <RiEyeLine size={18} /> View Profile
                            </button>

                            <Tooltip
                                title={
                                    offerDetails?.ismessaged
                                    ? "Message"
                                    : "Messaging disabled for this campaign"
                                }
                                >
                                <button
                                    onClick={
                                    offerDetails?.ismessaged ? handleMessageClick : undefined
                                    }
                                    disabled={!offerDetails?.ismessaged}
                                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-3xl font-medium transition
                                    ${
                                        offerDetails?.ismessaged
                                        ? "bg-[#0f122f] text-white hover:bg-[#23265a] cursor-pointer"
                                        : "bg-[#9d9d9d] text-white cursor-not-allowed opacity-80"
                                    }`}
                                >
                                    <RiMessage2Line size={18} />
                                    Message
                                </button>
                                </Tooltip>
                        </div>
                    </div>
                </div>

                {/* Left Section */}
                <div className="order-2 md:order-1 md:col-span-2 space-y-6">
                    {/* Proposed Terms */}
                    <div className="bg-white p-6 rounded-2xl">
                        <h2 className="text-lg font-semibold mb-4">Your proposed terms</h2>
                        <div className="flex gap-6 mb-4">
                            <div className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-2">Budget</span>
                                <span className="font-medium">
                                    ₹{Number(offerDetails?.budget || 0).toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-gray-700 font-medium mb-2">Description</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {offerDetails?.description}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setIsAcceptModalOpen(true)}
                                className="bg-[#0D132D] text-white px-6 py-2 rounded-full hover:bg-[#0D132Ded]"
                            >
                                Accept Applications
                            </button>
                        </div>
                    </div>

                    {/* Portfolio */}
                    <div className="bg-white p-6 rounded-2xl">
                        <h2 className="text-lg font-semibold mb-4">Portfolio</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {offerDetails?.filepaths?.map((file, idx) => {
                                const fileUrl = file.filepath;
                                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);

                                return (
                                    <div key={idx} className="relative group">
                                        {isImage ? (
                                            <img
                                                src={fileUrl}
                                                alt={`portfolio-${idx}`}
                                                className="rounded-xl w-full h-28 object-cover"
                                                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                            />
                                        ) : (
                                            <a
                                                href={fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block bg-gray-100 p-4 rounded-xl text-center text-sm text-blue-600 underline"
                                            >
                                                Download File
                                            </a>
                                        )}
                                        {isImage && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                <RiPlayCircleLine className="text-white text-3xl drop-shadow-lg" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {offerDetails?.filepaths?.length > 4 && (
                            <button className="mt-4 text-blue-600 text-sm">View More</button>
                        )}
                    </div>
                </div>
            </div>

            {/* Accept Modal */}
            <AcceptOfferModal
                open={isAcceptModalOpen}
                onCancel={() => setIsAcceptModalOpen(false)}
                onConfirm={handleConfirmAccept}
                offer={{
                    name: influencerName,
                    applicationid: offerDetails?.applicationid,
                }}
            />
        </div>
    );
};

export default OfferDetails;
