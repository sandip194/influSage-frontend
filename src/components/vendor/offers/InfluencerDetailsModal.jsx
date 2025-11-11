import React, { useEffect, useState } from "react";
import { Modal, Tooltip, Skeleton } from "antd";
import {
    RiHeartFill,
    RiHeart3Line,
    RiFile3Line,
    RiHeartLine,
    RiHeart3Fill,
} from "@remixicon/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";


const HeartParticle = ({ x, y, delay, size = 12 }) => (
    <motion.div
        className="absolute"
        style={{
            width: size,
            height: size,
            backgroundColor: "transparent",
        }}
        initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
        animate={{
            scale: [0, 1, 0],
            x,
            y,
            opacity: [1, 1, 0],
        }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
        <svg
            viewBox="0 0 20 20"
            fill="#ff3b6b"
            className="w-6 h-6"
        >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
      4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
      14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
      6.86-8.55 11.54L12 21.35z"/>
        </svg>
    </motion.div>
);


const InfluencerDetailsModal = ({ visible, influencerId, onClose }) => {
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [influDetails, setInfluDetails] = useState(null);
    const [showAnimation, setShowAnimation] = useState(false);

    const getInfluencerDetails = async () => {
        if (!influencerId) return;
        try {
            setLoading(true);
            const res = await axios.get(`/vendor/influencer-detail/${influencerId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setInfluDetails(res.data?.result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (visible) getInfluencerDetails();
    }, [visible, influencerId]);

    const handleLike = async () => {
        try {
            const response = await axios.post(
                "/vendor/addfavourite/influencer",
                { p_influencerId: Number(influencerId) },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                toast.success(response?.data?.message);

                setInfluDetails((prev) => ({
                    ...prev,
                    savedinfluencer: !prev.savedinfluencer,
                }));

                // trigger animation on like
                if (!influDetails?.savedinfluencer) {
                    setShowAnimation(true);
                    setTimeout(() => setShowAnimation(false), 700);
                }
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={720}
            centered
            bodyStyle={{
                padding: "0",
                backgroundColor: "#f9fafb",
                borderRadius: "16px",
            }}
            title={null}
        >
            {loading ? (
                <div className="p-6 sm:p-8">
                    <Skeleton.Avatar active size={80} shape="circle" />
                    <Skeleton active paragraph={{ rows: 5 }} className="mt-4" />
                </div>
            ) : influDetails ? (
                <div className="bg-white relative overflow-hidden p-5 sm:p-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4 pb-4 border-b border-gray-200">
                        {/* Profile Info */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                            <img
                                src={influDetails?.photopath}
                                alt="Profile"
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-sm border-2 border-gray-100"
                            />
                            <div>
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 capitalize">
                                    {influDetails?.firstname} {influDetails?.lastname}
                                </h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    {influDetails?.statename}, {influDetails?.countryname}
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                    Total Campaigns: {influDetails?.totalcampaign ?? 0}
                                </p>
                            </div>
                        </div>

                        {/* Favorite Button */}
                        <Tooltip
                            title={
                                influDetails?.savedinfluencer
                                    ? "Remove from Favorites"
                                    : "Add to Favorites"
                            }
                        >
                            <button
                                onClick={handleLike}
                                className={`relative flex items-center justify-center sm:justify-start gap-2 px-4 py-1 rounded-full text-sm font-medium border transition
${influDetails?.savedinfluencer
                                        ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                                    }`}
                            >
                                <div className="relative flex items-center justify-center w-8 h-8">
                                    {/* Heart Pop */}
                                    <motion.div
                                        key={influDetails?.savedinfluencer ? "fill" : "outline"}
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: showAnimation ? 1.6 : 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 12 }}
                                        className="relative z-10"
                                    >
                                        {influDetails?.savedinfluencer ? (
                                            <RiHeart3Fill size={26} className="text-red-500" />
                                        ) : (
                                            <RiHeart3Line size={26} className="text-gray-700" />
                                        )}
                                    </motion.div>

                                    {/* Heart Burst Particles */}
                                    <AnimatePresence>
                                        {showAnimation &&
                                            [
                                                { x: -20, y: -10, delay: 0 },
                                                { x: 15, y: -20, delay: 0.05 },
                                                { x: -15, y: 15, delay: 0.3 },
                                                { x: 20, y: 10, delay: 0.25 },
                                                { x: 0, y: -25, delay: 0.40 },
                                            ].map((p, idx) => (
                                                <HeartParticle key={idx} {...p} />
                                            ))}
                                    </AnimatePresence>
                                </div>


                                <span className="inline z-10">
                                    {influDetails?.savedinfluencer ? "Favorited" : "Add to Favorite"}
                                </span>
                            </button>
                        </Tooltip>
                    </div>

                    {/* Content Section */}
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        {/* LEFT SIDE */}
                        <div className="md:border-r border-gray-200 md:pr-4">
                            <div className="mb-5">
                                <h3 className="text-gray-900 font-semibold mb-2 text-base">Bio</h3>
                                <p className="text-gray-600 text-sm">
                                    {influDetails?.bio || "No bio available."}
                                </p>
                            </div>

                            <div className="mb-5">
                                <h3 className="text-gray-900 font-semibold mb-2 text-base">
                                    Categories
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {influDetails?.categories?.map((cat) => (
                                        <span
                                            key={cat.categoryid}
                                            className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                                        >
                                            {cat.categoryname}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-gray-900 font-semibold mb-3 text-base">Social Media</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {influDetails?.providers?.map((provider, idx) => {
                                        const followers = provider.nooffollowers || 0;

                                        // Format followers: 1.2K, 3.4M
                                        const formatFollowers = (num) => {
                                            if (num >= 1_000_000)
                                                return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
                                            if (num >= 1_000)
                                                return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
                                            return num.toString();
                                        };

                                        // Subtle accent colors by index (muted and professional)
                                        const accentColors = [
                                            "border-blue-100 hover:bg-blue-50",
                                            "border-pink-100 hover:bg-pink-50",
                                            "border-purple-100 hover:bg-purple-50",
                                            "border-red-100 hover:bg-red-50",
                                            "border-green-100 hover:bg-green-50",
                                        ];

                                        return (
                                            <a
                                                key={idx}
                                                href={provider.handleslink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center gap-3 p-3 bg-white border ${accentColors[idx % 5]} rounded-xl shadow-sm hover:shadow-md transition-all duration-300`}
                                            >
                                                {provider.iconpath && (
                                                    <img
                                                        src={provider.iconpath}
                                                        alt={provider.providername}
                                                        className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                                                    />
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 font-medium text-sm">
                                                        {provider.providername}
                                                    </span>
                                                    <span className="text-gray-500 text-xs">
                                                        {formatFollowers(followers)} followers
                                                    </span>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>


                        </div>

                        {/* RIGHT SIDE — PORTFOLIO */}
                        <div>
                            <h3 className="text-gray-900 font-semibold mb-3 text-base">
                                Portfolio
                            </h3>
                            {influDetails?.portfoliofiles?.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {influDetails?.portfoliofiles?.slice(0, 6).map((file, i) => {
                                        const url = file.filepath;
                                        const ext = url.split(".").pop().toLowerCase();
                                        const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
                                        const isVideo = ["mp4", "mov", "webm", "ogg"].includes(ext);

                                        return (
                                            <div
                                                key={i}
                                                className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200 hover:shadow-md transition"
                                            >
                                                {isImage ? (
                                                    <img
                                                        src={url}
                                                        alt="portfolio"
                                                        className="w-full h-28 object-cover"
                                                    />
                                                ) : isVideo ? (
                                                    <video
                                                        src={url}
                                                        controls
                                                        className="w-full h-28 object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-28 text-center text-xs text-gray-500">
                                                        <RiFile3Line className="text-gray-400 text-3xl mb-1" />
                                                        File
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No portfolio files uploaded.</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-6 text-center text-gray-500">No details found.</div>
            )}


        </Modal>
    );
};

export default InfluencerDetailsModal;
