import { RiArrowLeftLine, RiFile3Line, RiHeartFill, RiHeart3Line, RiMessage2Line } from "@remixicon/react";
import api from "../../../api/axios";import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip, Skeleton } from "antd";
import InviteModal from "../../users/browseInfluencers/InviteModal";
import { toast } from "react-toastify";
import { RiUserAddLine, RiStarFill, RiStarHalfFill, RiStarLine, RiArrowDownSLine, RiArrowUpSLine, RiHeart3Fill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import MediaPreviewModal from "../../../pages/commonPages/MediaPreviewModal";

const HeartParticle = ({ x, y, delay, size = 12 }) => (
  <motion.div
    className="absolute"
    style={{ width: size, height: size, backgroundColor: "transparent" }}
    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
    animate={{ scale: [0, 1, 0], x, y, opacity: [1, 1, 0] }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    <svg viewBox="0 0 20 20" fill="#ff3b6b" className="w-6 h-6">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
      4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
      14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
      6.86-8.55 11.54L12 21.35z"/>
    </svg>
  </motion.div>
);

// Function to render star ratings
const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            // Full star
            stars.push(<RiStarFill key={i} size={24} className="text-yellow-400" />);
        } else if (rating >= i - 0.75) {
            // Half star
            stars.push(<RiStarHalfFill key={i} size={24} className="text-yellow-400" />);
        } else {
            // Empty star
            stars.push(<RiStarLine key={i} size={24} className="text-gray-300" />);
        }
    }
    return stars;
};


const InfluencerProfile = () => {
    const [loading, setLoading] = useState(false)
    const [influDetails, setInfluDetails] = useState([])
    const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
    const [selectedInfluencer, setSelectedInfluencer] = useState(null);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [previewType, setPreviewType] = useState("");

    const navigate = useNavigate();
    const { userId } = useParams()
    const { token } = useSelector((state) => state.auth);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const rawRating = Number(influDetails?.ratingcount || 0);
    const displayRating = rawRating.toFixed(1);


    const [feedbacks, setFeedbacks] = useState([]);
    const [page, setPage] = useState(0);
    const limit = 3
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [showAnimation, setShowAnimation] = useState(false);

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diff = (now - date) / 1000;

        if (diff < 60) return "Just now";
        if (diff < 3600) return Math.floor(diff / 60) + " mins ago";
        if (diff < 86400) return Math.floor(diff / 3600) + " hours ago";

        const days = Math.floor(diff / 86400);
        if (days === 1) return "Yesterday";
        if (days < 7) return days + " days ago";

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };


    const getInfluencerDetails = async () => {
        try {
            setLoading(true)
            const res = await api.get(`vendor/influencer-detail/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (res.status === 200) setInfluDetails(res?.data?.result)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getInfluencerDetails();
    }, [])

    const handleMessageClick = () => {
    const campaignId = influDetails?.invitedcampaigns?.[0]?.campaignid;
        navigate("/vendor-dashboard/messages", {
            state: {
                influencerId: influDetails.id,
                influencerName: `${influDetails.firstname} ${influDetails.lastname}`,
                influencerPhoto: influDetails.photopath
                    ? influDetails.photopath
                    : null,
                conversationId: influDetails.conversationid || null,
                selectChatFromOutside: {
                    influencerid: influDetails.id,
                    influencerName: `${influDetails.firstname} ${influDetails.lastname}`,
                    influencerPhoto: influDetails.photopath
                        ? influDetails.photopath
                        : null,
                    campaignid: campaignId,
                },
            },
        });
    };

    const handleInvite = () => {
        if (!userId) return toast.error("User not logged in");

        setSelectedInfluencer(influDetails.id);
        setIsInviteModalVisible(true);
    };

    const handleLike = async () => {
        if (!userId) {
            toast.error("User not logged in");
            return;
        }

        try {
            const response = await api.post(
                "/vendor/addfavourite/influencer",
                {
                    p_userId: userId,
                    p_influencerId: influDetails.id,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {

                // Show toast for success
                toast.success(response?.data?.message);
                // Update the local state to reflect the new favourite status
                setInfluDetails((prev) => ({
                    ...prev,
                    savedinfluencer: !prev.savedinfluencer,
                }));

            } else {
                toast.error(response.data.message || "Failed to update favourite");
            }

        } catch (err) {
            console.error(err)
            toast.error("Something went wrong");
        }
    };

    const fetchInfluencerFeedbacks = async (pageToLoad = 0, append = false) => {
        try {
            setLoadingMore(true);

            const res = await api.get("/vendor/influencer/feedback-list", {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    p_influencerid: influDetails?.id,
                    p_limit: limit,
                    p_offset: pageToLoad + 1,
                },
            });

            const records = res.data?.data?.records || [];
            const total = res.data?.data?.totalcount || 0;

            setTotalCount(total);

            setFeedbacks((prev) =>
                append ? [...prev, ...records] : records
            );

            setHasMore(total > limit && (pageToLoad + 1) * limit < total);

        } catch (error) {
            console.error("Feedback fetch error:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (influDetails?.id) {
            setPage(0);
            fetchInfluencerFeedbacks(0, false);
        }
    }, [influDetails?.id]);

    const handleViewMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchInfluencerFeedbacks(nextPage, true);
    };

    const handleViewLess = () => {
        setPage(0);
        fetchInfluencerFeedbacks(0, false);
    };
    return (
        <div className="">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center cursor-pointer gap-2 text-gray-600 mb-2"
            >
                <RiArrowLeftLine /> Back
            </button>
            {/* <h2 className="text-2xl text-gray-900 font-semibold mb-6">Influencer Details</h2> */}

            {loading ? (
                <>
                    {/* Skeleton for top header */}
                    <div className="bg-white rounded-2xl p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <Skeleton.Avatar active size={112} shape="circle" />
                            <div className="flex-1 space-y-4">
                                <Skeleton.Input active size="large" style={{ width: 200 }} />
                                <Skeleton.Input active style={{ width: 250 }} />
                                <Skeleton.Input active style={{ width: 150 }} />
                                <div className="flex gap-4 mt-4">
                                    <Skeleton.Button active shape="round" />
                                    <Skeleton.Button active shape="round" />
                                    <Skeleton.Button active shape="round" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skeleton for bio & categories */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-white rounded-2xl p-4 md:col-span-2 space-y-4">
                            <Skeleton active paragraph={{ rows: 4 }} />
                            <Skeleton.Input active style={{ width: 100 }} />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {[...Array(3)].map((_, idx) => (
                                    <Skeleton.Button key={idx} active size="small" style={{ width: 80 }} />
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4">
                            <Skeleton active paragraph={{ rows: 4 }} />
                        </div>
                    </div>

                    {/* Skeleton for social media */}
                    <div className="mt-4 bg-white rounded-2xl p-4">
                        <Skeleton active title paragraph={{ rows: 3 }} />
                    </div>

                    {/* Skeleton for portfolio */}
                    <div className="mt-4 bg-white rounded-2xl p-4">
                        <Skeleton active title paragraph={{ rows: 1 }} />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {[...Array(4)].map((_, idx) => (
                                <Skeleton.Input key={idx} active style={{ height: 192 }} />
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Actual content goes here (your current JSX remains unchanged) */}
                    {/* Top Header */}
                    <div className="flex bg-white rounded-2xl p-6 flex-col md:flex-row md:items-start gap-6 pb-6 relative">
                        {/* MOBILE LIKE BUTTON – TOP RIGHT OF CARD */}
                        <div className="absolute top-3 right-3 sm:hidden z-10">
                           <Tooltip
                            title={influDetails?.savedinfluencer ? "Remove from Favorites" : "Add to Favorites"}
                            >
                            <button
                                onClick={handleLike}
                                className={`relative cursor-pointer flex items-center justify-center sm:justify-start gap-2 px-4 py-1 rounded-full text-sm font-medium border transition ${influDetails?.savedinfluencer
                                ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                                }`}
                            >
                                <div className="relative flex items-center justify-center w-8 h-8">
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
                                <AnimatePresence>
                                    {showAnimation &&
                                    [
                                        { x: -20, y: -10, delay: 0 },
                                        { x: 15, y: -20, delay: 0.05 },
                                        { x: -15, y: 15, delay: 0.3 },
                                        { x: 20, y: 10, delay: 0.25 },
                                        { x: 0, y: -25, delay: 0.4 },
                                    ].map((p, idx) => (
                                        <HeartParticle key={idx} {...p} />
                                    ))}
                                </AnimatePresence>
                                </div>
                            </button>
                            </Tooltip>
                        </div>

                        {/* IMAGE */}
                        <div className="relative flex justify-center sm:justify-start">
                            <img
                                src={influDetails?.photopath}
                                alt="Profile"
                                className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 cursor-pointer"
                                onClick={() => {
                                    setPreviewUrl(influDetails?.photopath);
                                    setPreviewType("image");
                                    setPreviewOpen(true);
                                }}
                                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                            />
                        </div>

                        <div className="flex-1 w-full">
                            {/* Header Section */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative">

                                {/* Influencer Info */}
                                <div className="w-full text-center sm:text-left break-words">
                                    <h2
                                        className="text-2xl sm:text-3xl font-semibold capitalize text-gray-900 leading-tight break-words"
                                    >
                                        {influDetails?.influencername}
                                    </h2>

                                    <p className="text-sm text-gray-900 mt-1 break-all">
                                        {influDetails?.email}
                                    </p>

                                    <p className="text-sm text-gray-900 mt-1">
                                        {influDetails?.genderid === 1 ? "Male" : "Female"}
                                    </p>

                                    <p className="text-sm text-gray-900 mt-1">
                                        {influDetails?.statename}, {influDetails?.countryname}
                                    </p>

                                    {rawRating > 0 && (
                                        <div className="flex items-center justify-center sm:justify-start mt-2">
                                            {renderStars(rawRating)}
                                            <span className="ml-2 text-md font-medium text-gray-700">
                                            {displayRating}
                                            </span>
                                        </div>
                                    )}

                                    {influDetails?.providers?.length > 0 && (
                                    <div className="mt-2">
                                        <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                                        {influDetails.providers.map((provider, idx) => {
                                            const followers = provider.nooffollowers || 0;

                                            const formatFollowers = (num) => {
                                            if (num >= 1_000_000)
                                                return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
                                            if (num >= 1_000)
                                                return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
                                            return num;
                                            };

                                            return (
                                            <Tooltip key={idx} title={provider.providername}>
                                                <a
                                                href={provider.handleslink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="
                                                    flex items-center gap-2
                                                    px-3 py-1.5
                                                    bg-white
                                                    border border-gray-200
                                                    rounded-full
                                                    hover:border-gray-300
                                                    hover:shadow-sm
                                                    transition-all
                                                "
                                                >
                                                <img
                                                    src={provider.iconpath}
                                                    alt={provider.providername}
                                                    className="w-6 h-6 rounded-full object-contain"
                                                    onError={(e) => (e.target.src = '/Brocken-Defualt-Img.jpg')}
                                                />

                                                <span className="text-xs font-medium text-gray-700">
                                                    {formatFollowers(followers)}
                                                </span>
                                                </a>
                                            </Tooltip>
                                            );
                                        })}
                                        </div>
                                    </div>
                                    )}
                                </div>

                                {/* Total Campaign */}
                                <div className="
                                        mt-4 sm:mt-0
                                        mx-auto max-w-sm
                                        grid grid-cols-2 gap-3 text-center
                                        md:max-w-none md:mx-0 md:grid-cols-3
                                        lg:flex lg:gap-6 lg:items-center
                                    "
                                    >
                                    {/* Completed Campaigns */}
                                    <div className="w-full rounded-2xl bg-gray-50 border border-gray-200 px-4 py-4">
                                        <p className="uppercase font-semibold tracking-wide text-gray-500 text-[10px] md:text-[11px] leading-tight">
                                            Completed Campaigns
                                        </p>
                                        <p className="mt-1 font-bold text-lg md:text-lg lg:text-lg text-gray-900">
                                        {typeof influDetails?.completedcampaigncount === "number"
                                            ? influDetails.completedcampaigncount
                                            : 0}
                                        </p>
                                    </div>

                                    {/* Total Campaigns */}
                                    <div className="w-full rounded-2xl bg-gray-50 border border-gray-200 px-4 py-4">
                                        <p className="uppercase font-semibold tracking-wide text-gray-500 text-[10px] md:text-[11px] leading-tight">
                                        Total Campaigns
                                        </p>
                                        <p className="mt-1 font-bold text-lg md:text-lg lg:text-lg text-gray-900">
                                        {typeof influDetails?.totalcampaigncount === "number"
                                            ? influDetails.totalcampaigncount
                                            : 0}
                                        </p>
                                    </div>

                                    {/* Completion Rate */}
                                    <div className="w-full rounded-2xl bg-gray-50 border border-gray-200 px-4 py-4
                                                    col-span-2 md:col-span-1">
                                        <p className="uppercase font-semibold tracking-wide text-gray-500 text-[10px] md:text-[11px] leading-tight">
                                        Completion Rate
                                        </p>
                                        <p className="mt-1 font-bold text-lg md:text-lg lg:text-lg text-gray-900">
                                        {typeof influDetails?.completionrate === "number"
                                            ? `${influDetails.completionrate}%`
                                            : "0%"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons Section */}
                            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full">
                                    {influDetails?.ismessaged === true && (
                                        <Tooltip title="Message">
                                            <button
                                                onClick={handleMessageClick}
                                                className="flex items-center cursor-pointer justify-center gap-2 bg-[#0f122f] text-white px-4 py-2 rounded-3xl hover:bg-[#23265a]"
                                            >
                                                <RiMessage2Line size={18} /> Send Message
                                            </button>
                                        </Tooltip>
                                    )}

                                    <button
                                        onClick={handleInvite}
                                        className="cursor-pointer text-white bg-[#0f122f] text-gray-900 px-5 py-2 rounded-full
             hover:bg-[#1f2357] transition w-full sm:w-auto 
             flex items-center justify-center gap-2"
                                    >
                                        <RiUserAddLine size={18} />
                                        <span>Invite</span>
                                    </button>


                                    {/* Desktop Like Button (hidden on mobile) */}
                                    <Tooltip
                                        title={influDetails?.savedinfluencer ? "Remove from Favorites" : "Add to Favorites"}
                                    >
                                    <button
                                        onClick={handleLike}
                                        className={`hidden sm:flex relative cursor-pointer items-center justify-start gap-2 
                                        px-4 py-1 rounded-full text-sm font-medium border transition
                                        ${influDetails?.savedinfluencer
                                            ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                                        }`}
                                    >
                                        <div className="relative flex items-center justify-center w-8 h-8">
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
                                        </div>
                                    </button>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Bio & Personal Details */}
                    <div className="mt-4 bg-white rounded-2xl p-4">
                        <div className="bg-white rounded-2xl p-4 md:col-span-2 space-y-4">
                            <h3 className="text-xl font-semibold text-gray-900">Bio</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {influDetails?.bio || "No bio available."}
                            </p>
                    <hr className="my-4 border-gray-200" />

                            <h4 className="text-lg font-semibold mt-4 mb-3 text-gray-900">Categories</h4>
                            <div className="flex flex-wrap gap-3">
                                {influDetails?.categories?.map((cat) => (
                                    <span
                                        key={cat.categoryid}
                                        className="bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full"
                                    >
                                        {cat.categoryname}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                    {/* Portfolio Files */}
                    <div className="mt-4 bg-white rounded-2xl p-4">
                        <h3 className="text-xl font-semibold mb-5 text-gray-900">Portfolio</h3>

                        {influDetails?.portfoliofiles?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {influDetails?.portfoliofiles?.map((file, index) => {

                                    const url = file.filepath;
                                    const extension = url && url.split('.').pop().toLowerCase();

                                    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
                                    const isVideo = ['mp4', 'mov', 'webm', 'ogg'].includes(extension);
                                    const isPDF = extension === 'pdf';
                                    const isDoc = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension);

                                    return (
                                        <div
                                            key={index}
                                            className="border border-gray-200 items-center justify-center rounded-2xl flex flex-col gap-2 bg-gray-50 cursor-pointer"
                                            onClick={() => {
                                                setPreviewOpen(true);
                                                setPreviewUrl(url);
                                                if (isImage) setPreviewType("image");
                                                else if (isVideo) setPreviewType("video");
                                                else if (isPDF) setPreviewType("pdf");
                                                else setPreviewType("doc");
                                            }}
                                        >

                                            {isImage && (
                                                <img
                                                    src={url}
                                                    alt=""
                                                    className="w-full h-48 object-cover rounded-2xl"
                                                    onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                                />
                                            )}

                                            {isVideo && (
                                                <video className="w-full h-48 rounded-2xl object-cover">
                                                    <source src={url} type={`video/${extension}`} />
                                                </video>
                                            )}

                                            {isPDF && (
                                                <div className="w-full h-48 rounded-2xl flex flex-col items-center justify-center gap-2 p-4 bg-white">
                                                    <iframe
                                                        src={url}
                                                        className="w-full h-full rounded-xl"
                                                        title=""
                                                    ></iframe>

                                                    <a
                                                        href={url}
                                                        download
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-blue-600 underline text-sm"
                                                    >
                                                        Download PDF
                                                    </a>
                                                </div>
                                            )}

                                            {(isDoc || (!isImage && !isVideo && !isPDF)) && (
                                                <div className="flex flex-col items-center justify-center text-center gap-2 py-4">
                                                    <RiFile3Line className="w-16 h-16 text-gray-500" />
                                                    <p className="text-gray-800 text-sm break-all px-2">
                                                        {url?.split("/").pop()}
                                                    </p>
                                                </div>
                                            )}

                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No portfolio file uploaded.</p>
                        )}
                    </div>

                    {/* Feedbacks */}
                    {feedbacks?.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 mt-4">

                            {/* Header */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-5">
                                Feedbacks
                            </h3>

                            {/* Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {feedbacks.map((fb) => (
                                    <div
                                        key={fb.feedbackid}
                                        className="bg-[#335CFF0D] border border-[#335CFF26] rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col h-full"
                                    >
                                        {/* Header */}
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={fb.campaignpohoto}
                                                alt={fb.campaignname}
                                                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />

                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {fb.campaignname}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatTime(fb.createddate)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Stars */}
                                        <div className="flex mb-2 gap-1 mt-3">
                                            {renderStars(fb.rating || 0).map((star, idx) =>
                                                React.cloneElement(star, { size: 20 }) // Adjust size if needed
                                            )}
                                        </div>


                                        {/* Text */}
                                        <p className="text-sm text-gray-700 line-clamp-2">
                                            {fb.text || "-"}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Buttons */}
                            <div className="flex justify-center gap-4 mt-6">
                                {totalCount > limit && hasMore && (
                                    <button
                                        onClick={handleViewMore}
                                        disabled={loadingMore}
                                        className="flex items-center cursor-pointer gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline"
                                    >
                                        View More
                                        <RiArrowDownSLine />
                                    </button>
                                )}

                                {page > 0 && (
                                    <button
                                        onClick={handleViewLess}
                                        className="flex items-center cursor-pointer gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline"
                                    >
                                        View Less
                                        <RiArrowUpSLine />
                                    </button>
                                )}
                            </div>                          
                        </div>
                    )}
                </>
            )}
            <MediaPreviewModal
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                src={previewUrl}
                type={previewType}
            />   
            <InviteModal
                visible={isInviteModalVisible}
                influencerId={selectedInfluencer}
                userId={userId}
                token={token}
                onClose={() => {
                    setIsInviteModalVisible(false);
                    setSelectedInfluencer(null);
                }}
            />

        </div>
    );
};

export default InfluencerProfile;
