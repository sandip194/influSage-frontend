
import axios from "axios";
import { useEffect, useState } from "react";
import {
    RiMoneyRupeeCircleLine,
    RiTranslate,
    RiMenLine,
    RiCheckLine,
    RiArrowLeftLine,
    RiForbidLine,
} from "react-icons/ri";
import { CheckOutlined, CloseOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Modal, Tooltip, Empty, Skeleton, Input, Radio } from "antd";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { safeText, safeArray, safeNumber } from "../../../App/safeAccess";
import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";


const CampaignDetailsView = () => {

    const { campaignId } = useParams();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);

    const [cmapignDetails, setCampaignDetails] = useState(null)
    const [actionLoading, setActionLoading] = useState(false);
    // const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const openImageModal = (img) => setPreviewImage(img);
    const closeImageModal = () => setPreviewImage(null);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [blockReasons, setBlockReasons] = useState([]);
    const [selectedBlockReason, setSelectedBlockReason] = useState(null);
    const [blockLoading, setBlockLoading] = useState(false);

    const [showHistory, setShowHistory] = useState(false);


    // For approval
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionType, setActionType] = useState(""); // 'Approved' or 'Rejected'


    // New states for reject modal
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectLoading, setRejectLoading] = useState(false);


    const [loading, setLoading] = useState(false)


    const getCamapignDetails = async () => {
        try {
            setLoading(true)
            const res = await axios.get("/admin/dashboard/campaign-detail", {
                headers: { Authorization: `Bearer ${token}` },
                params: { p_campaignid: campaignId },
            });

            if (res.status === 200) setCampaignDetails(res.data.campaignDetails)

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }


    const openConfirmationModal = (type) => {
        setActionType(type);
        if (type === "Rejected") {
            setIsRejectModalOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };

    // const openImageModal = (imageSrc) => {
    //     setSelectedImage(imageSrc);
    //     setIsImageModalOpen(true);
    // };



    const handleSubmit = async (statusName) => {
        try {
            setActionLoading(true);
            const res = await axios.post(
                "/admin/dashboard/approved-or-rejected",
                { p_campaignid: campaignId, p_statusname: statusName },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 200) {
                toast.success(res.data?.message);
                getCamapignDetails(); // Refresh details
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Action failed");
        } finally {
            setActionLoading(false);
        }
    };


    // New function for reject with reason (same API as in UserTableLayout)
    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) {
            toast.error("Please provide a reason for rejection.");
            return;
        }

        try {
            setRejectLoading(true);
            const res = await axios.post('/admin/dashboard/reject/profile-or-campaign', {
                p_campaignid: campaignId,
                p_text: rejectReason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) {
                getCamapignDetails();
                toast.success(res.data?.message || "Campaign rejected successfully");
                setIsRejectModalOpen(false);
                setRejectReason("");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to reject Campaign");
        } finally {
            setRejectLoading(false);
        }
    };

    const fetchBlockReasons = async () => {
        try {
            setBlockLoading(true);
            const res = await axios.get(
                "/admin/dashboard/campaign-block-reason",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 200) {
                setBlockReasons(res.data?.data || []);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load block reasons");
        } finally {
            setBlockLoading(false);
        }
    };

    const handleBlockSubmit = async () => {
        if (!selectedBlockReason) {
            toast.error("Please select a block reason");
            return;
        }

        try {
            setActionLoading(true);

            const res = await axios.post(
                "admin/dashboard/profile-campaign-block",
                {
                    p_campaignid: campaignId,
                    p_objective: selectedBlockReason,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.status === 200) {
                toast.success(res.data?.message || "Campaign blocked successfully");
                setIsBlockModalOpen(false);
                setSelectedBlockReason(null);
                getCamapignDetails();
            }

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to block campaign");
        } finally {
            setActionLoading(false);
        }
    };

    useEffect(() => {
        getCamapignDetails()
    }, [])


    if (loading) {
        return (
            <div className="p-6">
                <Skeleton active paragraph={{ rows: 10 }} />
            </div>
        );
    }

    if (!cmapignDetails) {
        return (
            <div className="flex justify-center py-10">
                <Empty description={<span className="text-gray-500 text-sm">No Campaign details found</span>} />
            </div>
        );
    }


    return (
        <div className="w-full text-sm overflow-x-hidden ">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 mb-2"
            >
                <RiArrowLeftLine /> Back
            </button>

            <h1 className="text-2xl font-semibold mb-4">View Campaign Details</h1>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* LEFT SIDE */}
                <div className="flex-1 space-y-4">
                    {/* Campaign Header */}
                    <div className="bg-white rounded-2xl overflow-hidden p-4">
                        {/* Banner placeholder */}
                        <div className="grid grid-cols-2 sm:grid-cols-[auto_1fr_auto] gap-4 items-start ">

                            {/* Campaign Image */}
                            <img
                                src={cmapignDetails?.photopath}
                                alt="Logo"
                                onClick={() => setPreviewImage(cmapignDetails?.photopath)}
                                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                className="
            w-20 h-20 rounded-full border-2 border-gray-200 object-cover cursor-pointer
            row-span-1 sm:row-span-1
        "
                            />

                            {/* Status Pill */}
                            <div
                                className={`
            justify-self-end px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap border border-gray-200
            order-2 sm:order-3
            col-span-1 sm:col-span-1
            ${cmapignDetails?.statusname === "Approved" ? "bg-green-50 text-green-700 border-green-200" : ""}
            ${cmapignDetails?.statusname === "Rejected" ? "bg-red-50 text-red-700 border-red-200" : ""}
            ${cmapignDetails?.statusname === "Blocked" ? "bg-gray-100 text-gray-700 border-gray-300" : ""}
            ${cmapignDetails?.statusname === "Approval Pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
        `}
                            >
                                {cmapignDetails?.statusname}
                            </div>

                            {/* Campaign Name + Business */}
                            <div className="col-span-2 sm:col-span-1 sm:col-start-2 order-3 sm:order-2 min-w-0">
                                <h2 className="font-semibold text-lg truncate">
                                    {safeText(cmapignDetails?.name, "No Campaign Name")}
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    {safeText(cmapignDetails?.businessname, "No Business Name")}
                                </p>
                            </div>


                            {/* Image Preview Modal */}
                            {previewImage && (
                                <div
                                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                                    onClick={() => setPreviewImage(null)}
                                >
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        onError={(e) => (e.target.src = "/default.jpg")}
                                        className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}
                        </div>


                        <div className="mt-4">
                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                                {cmapignDetails?.statusname === "Approval Pending" && (
                                    <>
                                        {/* ✅ Approve Button */}
                                        <Button
                                            type="text"
                                            icon={<CheckOutlined />}
                                            disabled={actionLoading}
                                            onClick={() => openConfirmationModal("Approved")}
                                            className="!border !border-green-600 !text-green-600 !bg-transparent hover:!bg-green-600 hover:!text-white font-medium px-5 py-2 rounded-lg transition-all flex items-center gap-2"
                                        >
                                            Approve
                                        </Button>

                                        {/* ❌ Reject Button */}
                                        <Button
                                            type="text"
                                            icon={<CloseOutlined />}
                                            disabled={actionLoading}
                                            onClick={() => openConfirmationModal("Rejected")}
                                            className="!border !border-red-600 !text-red-600 !bg-transparent hover:!bg-red-600 hover:!text-white font-medium px-5 py-2 rounded-lg transition-all flex items-center gap-2"
                                        >
                                            Reject
                                        </Button>

                                        {/* 🚫 Block Button */}
                                        <Button
                                            type="text"
                                            icon={<StopOutlined />}
                                            disabled={actionLoading}
                                            onClick={() => {
                                                setIsBlockModalOpen(true);
                                                fetchBlockReasons();
                                            }}
                                            className="!border !border-gray-600 !text-gray-700 !bg-transparent hover:!bg-gray-800 hover:!text-white font-medium px-5 py-2 rounded-lg transition-all flex items-center gap-2"
                                        >
                                            Block
                                        </Button>
                                    </>
                                )}

                                {cmapignDetails?.statusname === "Rejected" && (
                                    <>
                                        {/* ✅ Approve Button */}
                                        <Button
                                            type="text"
                                            icon={<CheckOutlined />}
                                            disabled={actionLoading}
                                            onClick={() => openConfirmationModal("Approved")}
                                            className="!border !border-green-600 !text-green-600 !bg-transparent hover:!bg-green-600 hover:!text-white font-medium px-5 py-2 rounded-lg transition-all flex items-center gap-2"
                                        >
                                            Approve
                                        </Button>
                                    </>
                                )}

                                {cmapignDetails?.statusname === "Blocked" && null}

                                {cmapignDetails?.statusname !== "Approval Pending" &&
                                    cmapignDetails?.statusname !== "Rejected" &&
                                    cmapignDetails?.statusname !== "Blocked" && (
                                        <>
                                            {/* 🚫 Block Button */}
                                            <Button
                                                type="text"
                                                icon={<StopOutlined />}
                                                disabled={actionLoading}
                                                onClick={() => {
                                                    setIsBlockModalOpen(true);
                                                    fetchBlockReasons();
                                                }}
                                                className="!border !border-gray-600 !text-gray-700 !bg-transparent hover:!bg-gray-800 hover:!text-white font-medium px-5 py-2 rounded-lg transition-all flex items-center gap-2"
                                            >
                                                Block
                                            </Button>
                                        </>
                                    )}

                            </div>

                            {/* Campaign Info Grid */}
                            <div className="flex flex-wrap justify-between gap-6 border border-gray-200 rounded-2xl p-4 my-4">
                                <div className="min-w-[140px]">
                                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                                        <RiMoneyRupeeCircleLine className="w-5 h-5" />
                                        <span className="text-sm">Budget</span>
                                    </div>
                                    <p className="text-[#0D132D] font-bold text-xl">
                                        ₹{safeNumber(cmapignDetails?.estimatedbudget, 0).toLocaleString()}
                                    </p>
                                </div>

                                {/* Languages */}
                                <div className="min-w-[180px]">
                                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                                        <RiTranslate className="w-5 h-5" />
                                        <span className="text-sm">Language</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {safeArray(cmapignDetails?.campaignlanguages).length > 0 ? (
                                            cmapignDetails.campaignlanguages.map((lang) => (
                                                <span
                                                    key={lang.languageid}
                                                    className="px-3 py-1 text-sm rounded-lg bg-indigo-100 text-indigo-700 font-medium"
                                                >
                                                    {safeText(lang.languagename)}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </div>
                                </div>

                                {/* Gender */}
                                <div className="min-w-[140px]">
                                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                                        <RiMenLine className="w-5 h-5" />
                                        <span className="text-sm">Gender</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {safeArray(cmapignDetails?.campaigngenders).length > 0 ? (
                                            cmapignDetails.campaigngenders.map((gender) => (
                                                <span
                                                    key={gender.genderid}
                                                    className="px-3 py-1 text-sm rounded-lg bg-pink-100 text-pink-700 font-medium"
                                                >
                                                    {safeText(gender.gendername)}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </div>
                                </div>


                            </div>
                        </div>

                        {/* Show/Hide History */}
                        {(
                            cmapignDetails["Approved On"] ||
                            cmapignDetails["Rejected On"] ||
                            cmapignDetails["Blocked On"]
                        ) && (
                                <button
                                    onClick={() => setShowHistory(!showHistory)}
                                    className="inline-flex items-center w-30 rounded-sm bg-blue-50 text-blue-600 font-medium text-sm gap-1 mt-1 cursor-pointer"
                                >
                                    {showHistory ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                                    {showHistory ? "Hide History" : "Show History"}
                                </button>

                            )}

                        {/* History Timeline */}
                        {showHistory && (
                            <div className="border-l-2 border-gray-200 pl-4 ml-2 flex flex-col gap-2 mt-2">
                                {cmapignDetails["Approved On"] && (
                                    <div className="flex flex-col">
                                        <span className="inline-flex items-center gap-1 py-1 text-sm text-green-600 font-medium"><RiCheckLine /> Approved</span>
                                        <span className="text-gray-500 text-sm">
                                            by {safeText(cmapignDetails["Approved By"])} —{" "}
                                            {new Date(cmapignDetails["Approved On"]).toLocaleString("en-GB", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                        </span>
                                    </div>
                                )}
                                {cmapignDetails["Rejected On"] && (
                                    <div className="flex flex-col">
                                        <span className="inline-flex items-center gap-1 py-1 text-sm text-red-600 font-medium"><RiCloseLine /> Rejected</span>
                                        <span className="text-gray-500 text-sm">
                                            by {safeText(cmapignDetails["Rejected By"])} —{" "}
                                            {new Date(cmapignDetails["Rejected On"]).toLocaleString("en-GB", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                        </span>
                                        <span className="text-gray-600 text-sm font-semibold">
                                            Reason: {safeText(cmapignDetails["Reject Reason"], "N/A")}
                                        </span>
                                    </div>
                                )}
                                {cmapignDetails["Blocked On"] && (
                                    <div className="flex flex-col">
                                        <span className="inline-flex items-center gap-1 py-1 text-sm text-gray-600 font-medium"><RiForbidLine /> Blocked</span>
                                        <span className="text-gray-500 text-sm">
                                            by {safeText(cmapignDetails["Blocked By"])} —{" "}
                                            {new Date(cmapignDetails["Blocked On"]).toLocaleString("en-GB", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                        </span>
                                        <span className="text-gray-600 text-sm font-semibold">
                                            Reason: {safeText(cmapignDetails["Block Reason"], "N/A")}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}


                    </div>

                    {/* Description + Requirements */}
                    <div className="bg-white p-4 rounded-2xl">
                        {/* Categories */}
                        <div className="py-4 border-b border-gray-200">
                            <p className="font-semibold text-lg mb-2">Categories</p>
                            <div className="flex flex-wrap gap-2 my-2">
                                {cmapignDetails?.campaigncategories?.length > 0 ? (
                                    cmapignDetails.campaigncategories.map((cat) => (
                                        <span
                                            key={cat.categoryid}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                        >
                                            {cat.categoryname}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm">No categories</span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="campaign-description py-4 border-b border-gray-200">
                            <h3 className="font-semibold text-lg mb-2">Campaign Description</h3>
                            <p className="text-gray-700 leading-relaxed text-justify">
                                {cmapignDetails?.description || "No description available."}
                            </p>
                        </div>

                        {/* Hashtags */}
                        <div className="py-4 border-b border-gray-200">
                            <h3 className="font-semibold text-lg mb-2">Hashtags</h3>
                            <div className="flex flex-wrap gap-2">
                                {cmapignDetails?.hashtags?.length > 0 ? (
                                    cmapignDetails.hashtags.map((item, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                        >
                                            {item.hashtag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm">No hashtags</span>
                                )}
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className="requirements py-4 border-b border-gray-200">
                            <h3 className="font-semibold text-lg mb-4">Requirements</h3>
                            <ul className="space-y-2 font-semibold">
                                <li className="flex items-center gap-2">
                                    <RiCheckLine size={20} className="text-gray-900 flex-shrink-0 border rounded" />
                                    <p>
                                        Objective: <span className="text-gray-500">{safeText(cmapignDetails?.requirements?.objectivename, "-")}</span>
                                    </p>
                                </li>
                                <li className="flex items-center gap-2">
                                    <RiCheckLine size={20} className="text-gray-900 flex-shrink-0 border rounded" />
                                    <p>
                                        Post Duration: <span className="text-gray-500">{safeText(cmapignDetails?.requirements?.postdurationdays ? `${cmapignDetails.requirements.postdurationdays} days` : "-", "-")}</span>
                                    </p>
                                </li>
                                <li className="flex items-center gap-2">
                                    <RiCheckLine size={20} className="text-gray-900 flex-shrink-0 border rounded" />
                                    <p>
                                        Include Vendor Profile Link: <span className="text-gray-500">{cmapignDetails?.requirements?.isincludevendorprofilelink ? "Yes" : "No"}</span>
                                    </p>
                                </li>
                                <li className="flex items-center gap-2">
                                    <RiCheckLine size={20} className="text-gray-900 flex-shrink-0 border rounded" />
                                    <p>
                                        Product Shipping: <span className="text-gray-500">{cmapignDetails?.requirements?.isproductshipping ? "Yes" : "No"}</span>
                                    </p>
                                </li>
                            </ul>
                        </div>

                        {/* Influencer Tiers */}
                        <div className="py-4 border-b border-gray-200">
                            <h3 className="font-semibold text-lg mb-2">Influencer Tiers</h3>
                            <div className="flex flex-wrap gap-2">
                                {cmapignDetails?.campaigninfluencertiers?.length > 0 ? (
                                    cmapignDetails.campaigninfluencertiers.map((tier) => (
                                        <span
                                            key={tier.influencertierid}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                        >
                                            {tier.influencertiername}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm">No influencer tiers available</span>
                                )}
                            </div>
                        </div>

                        <div className="py-4 border-b border-gray-200">
                            <h3 className="font-semibold text-lg mb-4">References</h3>

                            {Array.isArray(cmapignDetails?.campaignfiles) &&
                                cmapignDetails.campaignfiles.some((f) => f.filepath) ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {cmapignDetails.campaignfiles.map((item, index) => {
                                        const file = item?.filepath;
                                        if (!file) return null;

                                        const fileExtension = file.split(".").pop()?.toLowerCase();
                                        const isImage = ["jpg", "jpeg", "png", "gif"].includes(fileExtension);
                                        const isVideo = ["mp4", "mov", "webm"].includes(fileExtension);
                                        const isDoc = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(fileExtension);

                                        return (
                                            <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200">

                                                {isImage && (
                                                    <img
                                                        src={file}
                                                        alt="portfolio"
                                                        onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                                        className="w-full h-40 object-cover cursor-pointer"
                                                        onClick={() => openImageModal(file)}
                                                    />
                                                )}
                                                {previewImage && (
                                                    <div
                                                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                                                        onClick={closeImageModal}
                                                    >
                                                        <button
                                                            onClick={closeImageModal}
                                                            className="absolute top-6 right-8 text-white text-3xl font-bold hover:text-gray-300"
                                                        >
                                                            ×
                                                        </button>
                                                        <img
                                                            src={previewImage}
                                                            onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                                            alt="Preview"
                                                            className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </div>
                                                )}
                                                {isVideo && (
                                                    <video className="w-full h-40 object-cover" controls>
                                                        <source src={file} type="video/mp4" />
                                                    </video>
                                                )}

                                                {isDoc && (
                                                    <a
                                                        href={file}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex flex-col items-center justify-center w-full h-40 bg-gray-100 text-gray-700 p-2"
                                                    >
                                                        <span className="text-xs text-center truncate">{file.split("/").pop()}</span>
                                                    </a>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex justify-center py-6">
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description={<span className="text-gray-500 text-sm">No portfolio files</span>}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* RIGHT SIDE */}
                <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">

                    {/* Campaign Info */}
                    <div className="bg-white p-4 rounded-2xl">
                        <h3 className="font-semibold text-lg">Campaign Details</h3>
                        <hr className="my-2 border-gray-200" />
                        <div className="py-2 border-b border-gray-200">
                            <p className="text-sm mb-1 font-semibold">Campaign Number</p>
                            <p className="text-gray-500">
                                {cmapignDetails?.branddetails?.campaignnumber || "-"}
                            </p>
                        </div>
                        <div className="py-2 border-b border-gray-200">
                            <p className="text-sm mb-1 font-semibold">Campaign Dates</p>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm font-semibold mb-1 my-2">Start Date</p>
                                    <p className="text-gray-500">
                                        {cmapignDetails?.requirements?.campaignstartdate || "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold mb-1 my-2">End Date</p>
                                    <p className="text-gray-500">
                                        {cmapignDetails?.requirements?.campaignenddate || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="py-2 border-b border-gray-200">
                            <p className="text-sm mb-1 font-semibold">Application Dates</p>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm font-semibold mb-1 my-2">Start Date</p>
                                    <p className="text-gray-500">
                                        {cmapignDetails?.requirements?.applicationstartdate || "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold mb-1 my-2">End Date</p>
                                    <p className="text-gray-500">
                                        {cmapignDetails?.requirements?.applicationenddate || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Vendor Info Card */}
                    <div className="bg-white p-4 rounded-2xl ">
                        <h3 className="font-semibold text-lg">Vendor Details</h3>
                        <hr className="my-2 border-gray-200" />

                        {/* Profile Section */}
                        <div className="flex items-center gap-3 mb-4">
                            {/* <img
                                src={cmapignDetails?.vendorphoto}
                                alt={cmapignDetails?.name || "Vendor"}
                                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                className="w-12 h-12 rounded-full object-cover border border-gray-100"
                            /> */}
                            <div>
                                <p className="text-base font-semibold">{safeText(cmapignDetails?.businessname)}</p>
                                <p className="text-sm text-gray-500">{safeText(cmapignDetails?.fullname)}</p>
                            </div>
                        </div>

                        <div className="space-y-3">


                            <div>
                                <p className="text-sm font-semibold">Email</p>
                                <p className="text-gray-500 break-words">{safeText(cmapignDetails?.email)}</p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold">Phone</p>
                                <p className="text-gray-500">
                                    {cmapignDetails?.phonenumber
                                        ? `+${cmapignDetails.phonenumber.slice(0, 2)} ${cmapignDetails.phonenumber.slice(2)}`
                                        : ""}
                                </p>
                            </div>


                            <div className="pt-2 border-t border-gray-200">
                                <p className="text-sm font-semibold">Total Campaigns</p>
                                <p className="text-gray-500">{safeNumber(cmapignDetails?.totalcampaign)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl">
                        <h3 className="font-semibold text-lg mb-4">Platform Content Types</h3>

                        <div className="space-y-4">
                            {cmapignDetails?.providercontenttype?.length > 0 ? (
                                cmapignDetails.providercontenttype.map((platform) => (
                                    <div
                                        key={platform.providerid}
                                        className="border-b border-gray-100 pb-3 last:border-none"
                                    >
                                        {/* Provider Header */}
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-1">
                                                {/* Provider Icon */}
                                                {platform.iconpath && (
                                                    <img
                                                        src={platform.iconpath}
                                                        alt={platform.providername}
                                                        className="w-6 h-6 rounded-full object-contain"
                                                    />
                                                )}

                                                {/* Provider Name */}
                                                <span className="text-gray-900 font-medium">
                                                    {platform.providername}
                                                </span>
                                            </div>

                                            {/* Content Types */}
                                            <div className="flex flex-wrap gap-1">
                                                {platform.contenttypes?.map((type) => (
                                                    <span
                                                        key={type.providercontenttypeid}
                                                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full border border-gray-200"
                                                    >
                                                        {type.contenttypename}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Caption */}
                                        {platform.caption && (
                                            <p className="text-gray-600 italic text-sm mt-2 border-l-2 border-gray-200 pl-3 ">
                                                {platform.caption}
                                            </p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    No platform content types available.
                                </p>
                            )}
                        </div>
                    </div>

                </div>

            </div>



            <Modal
                title={`Confirm ${actionType}`}
                open={isModalOpen}
                onOk={() => {
                    handleSubmit(actionType); // Call the API with the action type
                    setIsModalOpen(false);
                }}
                onCancel={() => setIsModalOpen(false)}
                okText={`Yes, ${actionType}`}
                cancelText="Cancel"
                okButtonProps={{
                    type: actionType === "Rejected" ? "default" : "primary",
                    danger: actionType === "Rejected",
                    className:
                        actionType === "Approved"
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : actionType === "Blocked"
                                ? "bg-gray-600 hover:bg-gray-700 text-white"
                                : "",
                }}
            >
                <p>
                    Are you sure you want to{" "}
                    <strong>{actionType.toLowerCase()}</strong> Campaign{" "}
                    <span className="font-bold text-gray-800">
                        {cmapignDetails?.name}
                    </span>
                    ?
                </p>
            </Modal>

            {/* Reject Reason Modal */}
            <Modal
                title={`Reject :-  ${cmapignDetails?.name} `}
                open={isRejectModalOpen}
                onOk={handleRejectSubmit}
                onCancel={() => {
                    setIsRejectModalOpen(false);
                    setRejectReason("");
                }}
                okText="Confirm Reject"
                okButtonProps={{
                    danger: true,
                    className: "bg-red-600 hover:bg-red-700 text-white mt-4",
                    disabled: rejectLoading,
                }}
                cancelButtonProps={{
                    disabled: rejectLoading,
                }}
            >
                <p className="mb-4 text-gray-700">
                    Please provide a reason for rejecting this Campaign:
                </p>
                <Input.TextArea
                    placeholder="Enter rejection reason..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={4}
                    maxLength={250}
                    showCount={{ formatter: ({ count, maxLength }) => `${count} / ${maxLength}` }}
                />
            </Modal>

            {/* Block Campaign Modal */}
            <Modal
                title={
                    <>
                        Block Campaign :
                    </>
                }
                open={isBlockModalOpen}
                onCancel={() => {
                    setIsBlockModalOpen(false);
                    setSelectedBlockReason(null);
                }}
                onOk={handleBlockSubmit}
                okText="Confirm Block"
                okButtonProps={{
                    danger: true,
                    loading: actionLoading,
                    disabled: !selectedBlockReason,
                }}
            >
                <p className="mb-4 text-gray-600">
                    Please select a reason to block this campaign:
                </p>

                {blockLoading ? (
                    <Skeleton active paragraph={{ rows: 6 }} />
                ) : blockReasons?.length > 0 ? (
                    <Radio.Group
                        value={selectedBlockReason}
                        onChange={(e) => setSelectedBlockReason(e.target.value)}
                        className="flex flex-col"
                    >
                        {blockReasons.map((reason) => (
                            <div key={reason.id} className="mb-4">
                                <Radio
                                    value={reason.id}
                                    className="block w-full text-gray-800"
                                >
                                    {reason.name}
                                </Radio>
                            </div>
                        ))}
                    </Radio.Group>
                ) : (
                    <Empty description="No block reasons available" />
                )}
            </Modal>
        </div >
    );
}

export default CampaignDetailsView




