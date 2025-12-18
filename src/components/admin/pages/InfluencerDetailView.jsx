import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RiArrowLeftLine } from "@remixicon/react";
import { Button, Modal, Empty, Skeleton, Input } from "antd";
import { CheckOutlined, CloseOutlined, StopOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

import { safeText, safeArray, safeNumber } from "../../../App/safeAccess";

const InfluencerDetailView = () => {
    const { userId } = useParams();
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [influDetails, setInfluDetails] = useState(null);

    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionType, setActionType] = useState("");
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [blockReasonList, setBlockReasonList] = useState([]);
    const [selectedReason, setSelectedReason] = useState(null);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectLoading, setRejectLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const formatPhoneNumber = (phone) => {
        phone = safeText(phone, null);
        if (!phone) return "No phone";
        const cleaned = phone.replace(/\D/g, "");
        let number = cleaned.startsWith("91") ? cleaned.slice(2) : cleaned;
        return `+91 ${number.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}`;
    };

    const getInfluencerDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/admin/dashboard/user-detail`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { p_userid: userId },
            });
            setInfluDetails(res?.data?.userDetails ?? null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBlockReasons = async () => {
        try {
            const res = await axios.get("/admin/dashboard/user-block-reason", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBlockReasonList(safeArray(res?.data?.data));
        } catch (error) {
            console.error(error)
            toast.error("Failed to load block reasons");
        }
    };

    const handleSubmit = async (statusName) => {
        try {
            setActionLoading(true);
            const res = await axios.post(
                "/admin/dashboard/approved-or-rejected",
                { p_userid: userId},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(res.data?.message ?? `User ${statusName} successfully`);
            getInfluencerDetails();
        } catch (error) {
            toast.error(error.response?.data?.message ?? "Action failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleBlockSubmit = async () => {
        if (!selectedReason) return toast.error("Please select a reason");

        try {
            setActionLoading(true);
            const res = await axios.post(
                "/admin/dashboard/profile-campaign-block",
                { p_userid: userId, p_objective: selectedReason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(res?.data?.message ?? "User blocked");
            getInfluencerDetails();
            setIsBlockModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message ?? "Failed to block");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) {
            toast.error("Please enter a reason");
            return;
        }

        try {
            setRejectLoading(true);
            const res = await axios.post(
                "/admin/dashboard/reject/profile-or-campaign",
                { p_userid: userId, p_text: rejectReason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(res.data?.message ?? "User rejected");
            getInfluencerDetails();
            setIsRejectModalOpen(false);
        } catch (e) {
            toast.error(e.response?.data?.message ?? "Rejection failed");
        } finally {
            setRejectLoading(false);
        }
    };

    const openConfirmationModal = (type) => {
        setActionType(type);
        if (type === "Rejected") setIsRejectModalOpen(true);
        else if (type === "Blocked") {
            fetchBlockReasons();
            setIsBlockModalOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };

    useEffect(() => {
        getInfluencerDetails();
    }, []);

    if (loading)
        return (
            <div className="p-6">
                <Skeleton active paragraph={{ rows: 10 }} />
            </div>
        );

    if (!influDetails)
        return (
            <div className="flex justify-center py-10">
                <Empty description={<span>No influencer details found</span>} />
            </div>
        );

    return (
        <div className="w-full text-sm">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-2">
                <RiArrowLeftLine /> Back
            </button>

            <h2 className="text-2xl font-bold mb-4">Influencer Profile</h2>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* LEFT SIDE */}
                <div className="flex-1 space-y-4">
                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                        <div className="relative">
                            <img
                                src="https://images.pexels.com/photos/33350497/pexels-photo-33350497.jpeg"
                                alt="Banner"
                                className="w-full h-32 object-cover"
                            />

                            {/* ONE Profile Picture */}
                            <img
                                src={safeText(influDetails?.photopath)}
                                alt="Profile"
                                onClick={() => setPreviewImage(influDetails.photopath)}
                                onError={(e) => (e.target.src = "/fallback-avatar.png")}
                                className="absolute left-6 -bottom-10 w-20 h-20 rounded-full border-4 border-white shadow cursor-pointer object-cover bg-gray-200"
                            />

                            {/* Image Preview Modal */}
                            {previewImage && (
                                <div
                                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                                    onClick={() => setPreviewImage(null)}
                                >
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="p-6 pt-14">
                            <h2 className="text-lg font-semibold">
                                {safeText(influDetails.firstname)} {safeText(influDetails.lastname)}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                {formatPhoneNumber(influDetails.phonenumber)} <br />
                                {safeText(influDetails.email)}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="px-6 pb-6 flex flex-wrap gap-3">
                            {influDetails?.userstatusname === "ApprovalPending" && (
                                <>
                                    <Button
                                        icon={<CheckOutlined />}
                                        className="!border !border-green-600 !text-green-600"
                                        onClick={() => openConfirmationModal("Approved")}
                                    >
                                        Approve
                                    </Button>

                                    <Button
                                        icon={<CloseOutlined />}
                                        className="!border !border-red-600 !text-red-600"
                                        onClick={() => openConfirmationModal("Rejected")}
                                    >
                                        Reject
                                    </Button>

                                    <Button
                                        icon={<StopOutlined />}
                                        className="!border !border-gray-600 !text-gray-700"
                                        onClick={() => openConfirmationModal("Blocked")}
                                    >
                                        Block
                                    </Button>
                                </>
                            )}

                            {influDetails?.userstatusname === "Approved" && (
                                <Button
                                    icon={<StopOutlined />}
                                    className="!border !border-gray-600 !text-gray-700"
                                    onClick={() => openConfirmationModal("Blocked")}
                                >
                                    Block
                                </Button>
                            )}

                            {influDetails?.userstatusname === "Rejected" && (
                                <Button
                                    icon={<CheckOutlined />}
                                    className="!border !border-green-600 !text-green-600"
                                    onClick={() => openConfirmationModal("Approved")}
                                >
                                    Approve
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* BIO + CATEGORIES */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h2 className="font-bold text-base mb-3">Bio</h2>
                        <p className="text-gray-600 text-sm">{safeText(influDetails.bio, "No bio available")}</p>

                        <hr className="my-4 text-gray-300" />

                        <h2 className="font-bold text-base mb-3">Categories</h2>
                        <div className="flex flex-wrap gap-2">
                            {safeArray(influDetails.categories).flatMap((cat) =>
                                safeArray(cat.categories).map((sub, i) => (
                                    <span
                                        key={i}
                                        className="px-4 py-1 bg-gray-100 rounded-full text-gray-700 text-sm"
                                    >
                                        {safeText(sub.categoryname)}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    {/* PORTFOLIO */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <h2 className="font-semibold text-base mb-4">Portfolio</h2>

                        {/* URL */}
                        {safeText(influDetails.portfoliourl, null) && (
                            <div className="mb-4">
                                <p className="font-medium">Portfolio URL</p>
                                <a
                                    href={influDetails.portfoliourl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline break-all"
                                >
                                    {influDetails.portfoliourl}
                                </a>
                            </div>
                        )}

                        {/* Languages */}
                        {safeArray(influDetails.contentlanguages).length > 0 && (
                            <div className="mb-4">
                                <p className="font-medium">Content Languages</p>
                                <div className="flex flex-wrap gap-2">
                                    {safeArray(influDetails.contentlanguages).map((lang, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-gray-100 rounded-full text-xs"
                                        >
                                            {safeText(lang.languagename)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Files */}
                        {safeArray(influDetails.filepaths).some((f) => safeText(f.filepath, null)) ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {safeArray(influDetails.filepaths).map((item, i) => {
                                    const file = safeText(item.filepath, null);
                                    if (!file) return null;

                                    const ext = file.split(".").pop().toLowerCase();
                                    const isImage = ["jpg", "jpeg", "png", "gif"].includes(ext);
                                    const isVideo = ["mp4", "mov", "webm"].includes(ext);

                                    return (
                                        <div key={i} className="border border-gray-200 rounded overflow-hidden">
                                            {isImage && (
                                                <img
                                                    src={file}
                                                    className="w-full h-40 object-cover cursor-pointer"
                                                    onClick={() => setPreviewImage(file)}
                                                    onError={(e) => (e.target.src = "/fallback-image.png")}
                                                />
                                            )}

                                            {isVideo && (
                                                <video className="w-full h-40 object-cover" controls>
                                                    <source src={file} type="video/mp4" />
                                                </video>
                                            )}

                                            {!isImage && !isVideo && (
                                                <a
                                                    href={file}
                                                    target="_blank"
                                                    className="w-full h-40 flex items-center justify-center bg-gray-200 text-xs"
                                                >
                                                    {file.split("/").pop()}
                                                </a>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex justify-center py-6">
                                <Empty description="No portfolio files" />
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="w-full md:w-[300px] space-y-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <h3 className="font-semibold mb-4">Personal Details</h3>

                        <p><strong>Gender:</strong> {influDetails.genderid === 1 ? "Male" : "Female"}</p>
                        <hr className="my-2 text-gray-300" />
                        <p><strong>Date of Birth:</strong> {safeText(influDetails.dob)}</p>
                        <hr className="my-2 text-gray-300" />
                        <p><strong>Address:</strong></p>
                        <p className="text-gray-600">
                            {[
                                safeText(influDetails.address1, ""),
                                safeText(influDetails.city, ""),
                                safeText(influDetails.statename, ""),
                                safeText(influDetails.zip, "")
                            ].filter(Boolean).join(", ")}
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <h3 className="font-semibold mb-4">Social Media</h3>

                        {safeArray(influDetails.providers).map((item, i) => {
                            const url = item.handleslink?.startsWith("http")
                                ? item.handleslink
                                : `https://${item.handleslink}`;

                            return (
                                <div
                                    key={i}
                                    onClick={() => window.open(url, "_blank")}
                                    className="flex items-center gap-3 p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                                >
                                    <img
                                        src={safeText(item.iconpath, "/fallback-icon.png")}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />

                                    <div>
                                        <p className="font-medium">{safeText(item.providername)}</p>

                                        <p className="text-blue-600 text-xs underline truncate max-w-[180px]">
                                            {safeText(item.handleslink)}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            Followers: {safeNumber(item.nooffollowers).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* CONFIRM ACTION MODAL */}
            <Modal
                title={`Confirm ${actionType}`}
                open={isModalOpen}
                onOk={() => {
                    handleSubmit(actionType);
                    setIsModalOpen(false);
                }}
                onCancel={() => setIsModalOpen(false)}
            >
                Are you sure you want to {actionType.toLowerCase()} this user?
            </Modal>

            {/* BLOCK Modal */}
            <Modal
                title="Block User"
                open={isBlockModalOpen}
                onOk={handleBlockSubmit}
                onCancel={() => setIsBlockModalOpen(false)}
                okButtonProps={{ loading: actionLoading }}
            >
                <p>Select a reason:</p>

                {safeArray(blockReasonList).map((reason) => (
                    <label key={reason.id} className="block mt-2">
                        <input
                            type="radio"
                            name="blockreason"
                            value={reason.id}
                            checked={selectedReason === reason.id}
                            onChange={() => setSelectedReason(reason.id)}
                        />
                        <span className="ml-2">{safeText(reason.name)}</span>
                    </label>
                ))}
            </Modal>

            {/* REJECT Modal */}
            <Modal
                title={`Are you sure you want to Reject User  ${safeText(influDetails.firstname)}  ${safeText(influDetails.lastname)} ?`}
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
                <p>Please provide a rejection reason:</p>
                <Input.TextArea
                    rows={4}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default InfluencerDetailView;
