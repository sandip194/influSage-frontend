import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RiArrowLeftLine } from "@remixicon/react";
import { Button, Modal, Tooltip, Empty, Skeleton, Input } from "antd";
import { CheckOutlined, CloseOutlined, StopOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const InfluencerDetailView = () => {
    const { userId } = useParams();
    const { token } = useSelector((state) => state.auth);
    // const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [influDetails, setInfluDetails] = useState(null);

    // For approval/rejection modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionType, setActionType] = useState(""); // 'Approved' or 'Rejected'

    // For image modal
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    // For block reason modal
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [blockReasonList, setBlockReasonList] = useState([]);
    const [selectedReason, setSelectedReason] = useState(null);

    // New states for reject modal
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectLoading, setRejectLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);


    const formatPhoneNumber = (phone) => {
        if (!phone) return "No phone";

        const cleaned = phone.replace(/\D/g, "");

        let number = cleaned;
        if (number.startsWith("91")) {
            number = number.slice(2);
        }
        return `+91 ${number.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}`;
    };

    const getInfluencerDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/admin/dashboard/user-detail`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { p_userid: userId }, // sending userId as a query parameter
            });
            console.log(res.data);
            setInfluDetails(res?.data?.userDetails); // Assuming the response structure remains similar; adjust if needed
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBlockReasons = async () => {
        try {
            const res = await axios.get("/admin/dashboard/campaign-block-reason", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBlockReasonList(res?.data?.data || []);
        } catch (error) {
            console.error("Error fetching block reasons:", error);
            toast.error("Failed to load block reasons");
        }
    };


    // ✅ Unified approval/rejection API (same as in UserTableLayout)
    const handleSubmit = async (statusName) => {
        try {
            setActionLoading(true);
            const res = await axios.post(
                "/admin/dashboard/approved-or-rejected",
                { p_userid: userId, p_statusname: statusName },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 200) {
                toast.success(res.data?.message || `User ${statusName.toLowerCase()} successfully!`);
                getInfluencerDetails(); // Refresh details
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Action failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleBlockSubmit = async () => {
        if (!selectedReason) {
            toast.error("Please select a reason to block this user.");
            return;
        }

        try {
            setActionLoading(true);
            const res = await axios.post(
                "/admin/dashboard/profile-block", // ✅ new endpoint
                { p_userid: userId, p_objective: selectedReason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 200) {
                toast.success(res.data?.message || "User blocked successfully!");
                getInfluencerDetails(); // Refresh user details
                setIsBlockModalOpen(false);
                setSelectedReason(null);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to block user");
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
                p_userid: userId,
                p_text: rejectReason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) {
                getInfluencerDetails();
                toast.success(res.data?.message || "User rejected successfully");
                setIsRejectModalOpen(false);
                setRejectReason("");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to reject user");
        } finally {
            setRejectLoading(false);
        }
    };


    const openConfirmationModal = (type) => {
        setActionType(type);
        if (type === "Rejected") {
            setIsRejectModalOpen(true);
        } else if (type === "Blocked") {
            fetchBlockReasons(); // Fetch block reasons dynamically
            setIsBlockModalOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };


    const openImageModal = (imageSrc) => {
        setSelectedImage(imageSrc);
        setIsImageModalOpen(true);
    };

    useEffect(() => {
        getInfluencerDetails();
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <Skeleton active paragraph={{ rows: 10 }} />
            </div>
        );
    }

    if (!influDetails) {
        return (
            <div className="flex justify-center py-10">
                <Empty description={<span className="text-gray-500 text-sm">No influencer details found</span>} />
            </div>
        );
    }

    return (
        <div className="w-full text-sm overflow-x-hidden">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 mb-2"
            >
                <RiArrowLeftLine /> Back
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Influencer Profile</h2>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* Left Side */}
                <div className="flex-1 space-y-4">
                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                        <div className="relative">
                            <img
                                src="https://images.pexels.com/photos/33350497/pexels-photo-33350497.jpeg"
                                alt="Banner"
                                className="w-full h-32 object-cover"
                            />
                            <img
                                src={influDetails?.photopath}
                                alt="Profile"
                                onClick={() => setPreviewImage(influDetails?.photopath)}
                                className="absolute left-6 -bottom-10 w-20 h-20 object-cover rounded-full border-4 bg-gray-200 border-white shadow cursor-pointer"
                            />
                            <div className="relative">
                                <img
                                    src={influDetails?.photopath}
                                    alt="Profile"
                                    onClick={() => setPreviewImage(influDetails?.photopath)}
                                    className="absolute left-6 -bottom-10 w-20 h-20 object-cover rounded-full border-4 bg-gray-200 border-white shadow cursor-pointer"
                                />
                                {previewImage && (
                                    <div
                                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                                    onClick={() => setPreviewImage(null)}
                                    >
                                    <button
                                        onClick={() => setPreviewImage(null)}
                                        className="absolute top-6 right-8 text-white text-3xl font-bold hover:text-gray-300"
                                    >
                                        ×
                                    </button>

                                    <img
                                        src={previewImage}
                                        alt="Profile Preview"
                                        className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
                                        onClick={(e) => e.stopPropagation()} 
                                    />
                                    </div>
                                )}
                                </div>
                        </div>

                        <div className="p-6 pt-14 flex flex-col md:flex-row justify-between items-start">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {influDetails?.firstname} {influDetails?.lastname}
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        {formatPhoneNumber(influDetails?.phonenumber)} <br />
                                        {influDetails?.email || "No email"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 pb-6 flex flex-wrap gap-3">
                            {influDetails?.userstatusname === "ApprovalPending" && (
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
                                        onClick={() => openConfirmationModal("Blocked")}
                                        className="!border !border-gray-600 !text-gray-700 !bg-transparent hover:!bg-gray-800 hover:!text-white font-medium px-5 py-2 rounded-lg transition-all flex items-center gap-2"
                                    >
                                        Block
                                    </Button>
                                </>
                            )}

                            {influDetails?.userstatusname === "Approved" && (
                                <>
                                    {/* 🚫 Block Button */}
                                    <Button
                                        type="text"
                                        icon={<StopOutlined />}
                                        disabled={actionLoading}
                                        onClick={() => openConfirmationModal("Blocked")}
                                        className="!border !border-gray-600 !text-gray-700 !bg-transparent hover:!bg-gray-800 hover:!text-white font-medium px-5 py-2 rounded-lg transition-all flex items-center gap-2"
                                    >
                                        Block
                                    </Button>
                                </>
                            )}

                            {influDetails?.userstatusname === "Rejected" && (
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

                        </div>
                    </div>

                    {/* Bio & Categories */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h2 className="font-bold text-base mb-3">Bio</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">{influDetails?.bio}</p>

                        <hr className="my-4 border-gray-200" />

                        <h2 className="font-bold text-base mb-3">Categories</h2>
                        <div className="flex flex-wrap gap-2">
                            {influDetails?.categories?.flatMap((cat) =>
                                cat.categories.map((sub, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-1.5 text-sm bg-gray-100 rounded-full text-gray-700"
                                    >
                                        {sub.categoryname}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Portfolio */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <h2 className="font-semibold text-base mb-4">Portfolio</h2>

                        {/* 🌐 Portfolio URL */}
                        {influDetails?.portfoliourl && (
                            <div className="mb-4">
                                <p className="font-medium text-gray-900 mb-1">Portfolio URL</p>
                                <a
                                    href={influDetails.portfoliourl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline break-all hover:text-blue-800"
                                >
                                    {influDetails.portfoliourl}
                                </a>
                            </div>
                        )}

                        {/* 🌍 Content Languages */}
                        {Array.isArray(influDetails?.contentlanguages) &&
                            influDetails.contentlanguages.length > 0 && (
                                <div className="mb-4">
                                    <p className="font-medium text-gray-900 mb-1">Content Languages</p>
                                    <div className="flex flex-wrap gap-2">
                                        {influDetails.contentlanguages.map((lang, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                            >
                                                {lang?.languagename || "N/A"}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                        {/* 🖼️ Filepaths / Portfolio Files */}
                        {Array.isArray(influDetails?.filepaths) &&
                            influDetails.filepaths.some((f) => f.filepath) ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {influDetails.filepaths.map((item, index) => {
                                    const file = item?.filepath;
                                    if (!file) return null;

                                    const fileExtension = file.split(".").pop()?.toLowerCase();
                                    const isImage = ["jpg", "jpeg", "png", "gif"].includes(fileExtension);
                                    const isVideo = ["mp4", "mov", "webm"].includes(fileExtension);
                                    const isDoc = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(fileExtension);

                                    return (
                                        <div
                                    key={index}
                                    className="relative group rounded-lg overflow-hidden border border-gray-200"
                                    >
                                    {isImage && (
                                        <img
                                        src={file}
                                        alt="portfolio"
                                        className="w-full h-40 object-cover cursor-pointer"
                                        onClick={() => setPreviewImage(file)}
                                        />
                                    )}

                                    {previewImage && (
                                    <div
                                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                                        onClick={() => setPreviewImage(null)}
                                    >
                                        <button
                                        onClick={() => setPreviewImage(null)}
                                        className="absolute top-6 right-8 text-white text-3xl font-bold hover:text-gray-300"
                                        >
                                        ×
                                        </button>

                                        <img
                                        src={previewImage}
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

                {/* Right Side */}
                <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">
                    {/* Personal Details */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm w-full text-sm">
                        <h3 className="font-semibold text-lg mb-4">Personal Details</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium text-gray-900">Gender</p>
                                <p className="text-gray-500">{influDetails?.genderid === 1 ? "Male" : "Female"}</p>
                            </div>
                            <hr className="my-4 border-gray-200" />
                            <div>
                                <p className="font-medium text-gray-900">Date Of Birth</p>
                                <p className="text-gray-500">{influDetails?.dob}</p>
                            </div>
                            <hr className="my-4 border-gray-200" />
                            <div>
                                <p className="font-medium text-gray-900">Address</p>
                                <p className="text-gray-500">
                                    {influDetails?.address1}, {influDetails?.city}, {influDetails?.statename}, {influDetails?.zip}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm text-sm w-full">
                        <h3 className="font-bold mb-4 text-base">Social Media</h3>
                        <div className="space-y-4">
                            {influDetails?.providers?.map((item, index) => {
                                const handleLink = item.handleslink?.startsWith("http")
                                    ? item.handleslink
                                    : `https://${item.handleslink}`;

                                return (
                                    <div
                                        key={index}
                                        onClick={() =>
                                            window.open(handleLink, "_blank", "noopener,noreferrer")
                                        }
                                        className="flex items-center gap-3 p-2 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
                                    >
                                        <img
                                            src={item.iconpath}
                                            alt="Social"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">{item.providername}</p>
                                            <p
                                                className="text-blue-600 text-xs truncate max-w-[200px] underline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(handleLink, "_blank", "noopener,noreferrer");
                                                }}
                                            >
                                                {item.handleslink}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                Followers: {item.nooffollowers?.toLocaleString() || 0}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                </div>
            </div>

            {/* ✅ Confirmation Modal */}
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
                    <strong>{actionType.toLowerCase()}</strong> user{" "}
                    <span className="font-bold text-gray-800">
                        {influDetails?.firstname} {influDetails?.lastname}
                    </span>
                    ?
                </p>
            </Modal>

            {/* 🧱 Block Reason Modal */}
            <Modal
                title={`Block ${influDetails?.firstname} ${influDetails?.lastname}`}
                open={isBlockModalOpen}
                onOk={handleBlockSubmit}
                onCancel={() => {
                    setIsBlockModalOpen(false);
                    setSelectedReason(null);
                }}
                okText="Confirm Block"
                cancelText="Cancel"
                okButtonProps={{
                    danger: true,
                    className: "bg-red-600 hover:bg-red-700 text-white",
                    loading: actionLoading,
                }}
                cancelButtonProps={{
                    disabled: actionLoading,
                }}
            >
                <p className="mb-4 text-gray-700">
                    Please select a reason for blocking this user:
                </p>

                {blockReasonList?.length > 0 ? (
                    <div className="space-y-3">
                        {blockReasonList.map((reason) => (
                            <label
                                key={reason.id}
                                className="flex items-center gap-2 cursor-pointer text-gray-800"
                            >
                                <input
                                    type="radio"
                                    name="blockReason"
                                    value={reason.id}
                                    checked={selectedReason === reason.id}
                                    onChange={(e) => setSelectedReason(Number(e.target.value))}
                                />
                                <span>{reason.name}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No block reasons available.</p>
                )}
            </Modal>

            {/* Reject Reason Modal */}
            <Modal
                title={`Reject ${influDetails?.firstname} ${influDetails?.lastname}`}
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
                    Please provide a reason for rejecting this user:
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
        </div>
    );
};

export default InfluencerDetailView;
