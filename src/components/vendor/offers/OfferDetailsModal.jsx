import React, { useEffect, useState } from "react";
import { Modal, Skeleton, Tooltip } from "antd";
import { RiMessage2Line, RiEyeLine, RiStarFill } from "@remixicon/react";
import { FaInstagram, FaYoutube, FaFacebook, FaTiktok } from "react-icons/fa";
import { useNavigate, } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import AcceptOfferModal from "./models/AcceptOfferModal";

const OfferDetailsModal = ({ visible, onClose, id, onStatusChange, hasSelectedApplication }) => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [offerDetails, setOfferDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);


    const fetchOffer = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`vendor/offer-detail/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOfferDetails(res.data.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load offer details.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (visible) fetchOffer();
    }, [visible, id, token]);

    // const handleViewProfile = (userId) =>
    //     navigate(`/vendor-dashboard/applications/influencer-details/${userId}`);

    const handleMessageClick = () => {
        navigate("/vendor-dashboard/messages", {
            state: {
                selectChatFromOutside: {
                    influencerid: offerDetails.influencerid,
                    conversationid: offerDetails.conversationid || null,
                    campaignid: offerDetails.campaignid,
                },
            },
        });
    };

    const handleConfirmAccept = async () => {
        if (!offerDetails?.applicationid) {
            toast.error("Missing Application ID");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
            "/chat/startconversation",
            { p_campaignapplicationid: Number(offerDetails.applicationid) },
            { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data?.status === true) {
            toast.success(res.data.message || "Conversation started");

            if (onStatusChange) onStatusChange();
            fetchOffer();
            } else {
            toast.error(res.data?.message || "Failed to start conversation");
            }

        } catch (error) {
            toast.error(
            error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
            setIsAcceptModalOpen(false);
        }
        };

    const followers = {};
    offerDetails?.providers?.forEach((p) => {
        followers[p.providername.toLowerCase()] = p.nooffollowers?.toLocaleString("en-IN");
    });

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={700}
            centered
            style={{ padding: 0 }}
            bodyStyle={{ padding: 0, backgroundColor: "#f9fafb", borderRadius: 16 }}
            title={`Application Details`}
        >
            {loading ? (
                <div className="p-8">
                    <Skeleton active avatar paragraph={{ rows: 6 }} />
                </div>
            ) : offerDetails ? (
                < div className="bg-white py-4 px-2 rounded-2xl relative overflow-hidden">
                    {/* Influencer Header (same as before) */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between bg-gray-50 p-4 sm:p-6 rounded-xl mb-3 gap-4 sm:gap-6">
                        {/* Left: Photo + Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-grow text-center sm:text-left">
                            <img
                                src={offerDetails.photopath}
                                alt="influencer"
                                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 mx-auto sm:mx-0 cursor-pointer hover:opacity-80 transition"
                                onClick={() => setIsPreviewOpen(true)}
                            />
                            {isPreviewOpen && (
                                <div
                                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
                                    onClick={() => setIsPreviewOpen(false)}
                                >
                                    <button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="absolute top-5 right-6 text-white text-3xl font-bold hover:text-gray-300"
                                    >
                                    &times;
                                    </button>

                                    <img
                                    src={offerDetails.photopath}
                                    alt="Preview"
                                    className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
                                    onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                )}
                            <div>
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 capitalize">
                                    {offerDetails.firstname} {offerDetails.lastname}
                                </h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    {offerDetails.statename}, {offerDetails.countryname}
                                </p> 
                                {Number(offerDetails?.ratingcount) > 0 && (
                                <div className="flex items-center gap-1 mt-1 justify-center sm:justify-start">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                    <RiStarFill
                                        key={i}
                                        size={14}
                                        className={i <= Math.round(offerDetails.ratingcount)
                                        ? "text-yellow-400"
                                        : "text-gray-300"}
                                        style={{ stroke: "#000", strokeWidth: 0.6 }}
                                    />
                                    ))}
                                    <span className="ml-1 text-xs font-semibold text-gray-700">
                                    {Number(offerDetails.ratingcount).toFixed(1)}
                                    </span>
                                </div>
                                )}
                                <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                                    {offerDetails.categories?.slice(0, 3).map((cat, idx) => (
                                        <span
                                            key={cat.categoryid || idx}
                                            className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full"
                                        >
                                            {cat.categoryname}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Buttons */}
                        <div className="flex flex-wrap flex-col justify-center sm:justify-end gap-1 sm:gap-1 mt-0 sm:mt-0 flex-shrink-0">
                                                    {offerDetails?.ismessaged && (
                                                        <Tooltip title="Message">
                                                            <button
                                                                onClick={handleMessageClick}
                                                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0f122f] text-white hover:bg-[#23265a] text-sm w-full sm:w-auto justify-center"
                                                            >
                                                                <RiMessage2Line size={16} /> Message
                                                            </button>
                                                        </Tooltip>
                                                    )}
                                                </div>
                    </div>

                    {/* Desktop layout flex */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Left Column: 75% width */}
                        <div className="sm:w-3/4 flex flex-col gap-4">
                            {/* Proposed Budget */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-600 text-sm font-medium mb-1">Proposed Budget</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ₹{Number(offerDetails.budget || 0).toLocaleString("en-IN")}
                                </p>
                            </div>

                            {/* Campaign Description */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-2">Campaign Description</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {offerDetails.description || "No campaign description provided."}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-start gap-3 mt-4">
                                {!offerDetails?.ismessaged && (
                                    <button
                                        onClick={() => setIsAcceptModalOpen(true)}
                                        className="bg-[#0D132D] text-white font-medium py-2 px-6 min-w-48 rounded-lg hover:bg-[#0D132Ded] transition"
                                    >
                                        Accept Application
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right Column: 25% width */}
                        <div className="sm:w-1/4 flex flex-col gap-4">
                            {/* Sample Work / Portfolio */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-3">Sample Work</h3>
                                {offerDetails.filepaths?.length ? (
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
                                        {offerDetails.filepaths.map((file, i) => {
                                            const url = file.filepath;
                                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                                            return (
                                            <div
                                                key={i}
                                                className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200 hover:shadow-md transition"
                                            >
                                                {isImage ? (
                                                <img
                                                    src={url}
                                                    alt="portfolio"
                                                    className="w-full h-28 object-cover cursor-pointer hover:opacity-80 transition"
                                                    onClick={() => setPreviewImage(url)}
                                                />
                                                ) : (
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex flex-col items-center justify-center h-28 text-xs text-gray-500 hover:text-gray-700"
                                                >
                                                    Download File
                                                </a>
                                                )}
                                            </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No sample work uploaded.</p>
                                )}
                                {previewImage && (
                                    <div
                                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
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
                        </div>
                    </div>


                </div>

            ) : (
                <div className="p-8 text-center text-gray-500">No offer details found.</div>
            )
            }


            {/* Accept Offer Modal */}
            <AcceptOfferModal
                open={isAcceptModalOpen}
                onCancel={() => setIsAcceptModalOpen(false)}
                onConfirm={handleConfirmAccept}
                offer={{
                    name: `${offerDetails?.firstname} ${offerDetails?.lastname}`,
                    applicationid: offerDetails?.applicationid,
                }}
                hasSelectedApplication={hasSelectedApplication}
            />
        </Modal >
    );
};

export default OfferDetailsModal;
