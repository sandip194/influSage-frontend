import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RiArrowLeftLine } from "@remixicon/react";
import { Button, Modal, Tooltip, Empty, Skeleton } from "antd";
import { CheckOutlined, CloseOutlined, StopOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const InfluencerDetailView = () => {
    const { userId } = useParams();
    const { token } = useSelector((state) => state.auth);
   // const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false)
    const [influDetails, setInfluDetails] = useState(null);

    // For approval/rejection modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionType, setActionType] = useState(""); // 'Approved' or 'Rejected'

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
            const res = await axios.get(`/user/profile/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            setInfluDetails(res?.data?.profileParts);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Unified approval/rejection API (same as in UserTableLayout)
    const handleSubmit = async (statusName) => {
        try {
            setActionLoading(true)
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
            setActionLoading(false)
        }
    };

    const openConfirmationModal = (type) => {
        setActionType(type);
        setIsModalOpen(true);
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
                                src={influDetails?.p_profile?.photopath}
                                alt="Profile"
                                className="absolute left-6 -bottom-10 w-20 h-20 object-cover rounded-full border-4 bg-gray-200 border-white shadow"
                            />
                        </div>

                        <div className="p-6 pt-14 flex flex-col md:flex-row justify-between items-center">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {influDetails?.p_profile?.firstname} {influDetails?.p_profile?.lastname}
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        {formatPhoneNumber(influDetails?.p_profile?.phonenumber)} <br />
                                        {influDetails?.p_profile?.email || "No email"}
                                    </p>
                                </div>
                            </div>


                        </div>

                        <div className="px-6 pb-6 flex flex-wrap gap-3">
                            {influDetails?.p_profile?.userstatusname === "ApprovalPending" && (
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
                                </>
                            )}

                            {/* 🚫 Block Button */}
                            <Button
                                type="text"
                                icon={<StopOutlined />}
                                disabled={actionLoading}
                                onClick={() => toast.info('Block API not yet implemented')}
                                className="!border !border-gray-600 !text-gray-700 !bg-transparent hover:!bg-gray-800 hover:!text-white font-medium px-5 py-2 rounded-lg transition-all flex items-center gap-2"
                            >
                                Block
                            </Button>
                        </div>

                    </div>

                    {/* Bio & Categories */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h2 className="font-bold text-base mb-3">Bio</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">{influDetails?.p_profile?.bio}</p>

                        <hr className="my-4 border-gray-200" />

                        <h2 className="font-bold text-base mb-3">Categories</h2>
                        <div className="flex flex-wrap gap-2">
                            {influDetails?.p_categories?.flatMap((cat) =>
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
                        {influDetails?.p_portfolios?.portfoliourl && (
                            <div className="mb-4">
                                <p className="font-medium text-gray-900 mb-1">Portfolio URL</p>
                                <a
                                    href={
                                        influDetails.p_portfolios.portfoliourl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline break-all hover:text-blue-800"
                                >
                                    {influDetails.p_portfolios.portfoliourl}
                                </a>
                            </div>
                        )}

                        {/* 🌍 Content Languages */}
                        {Array.isArray(influDetails?.p_portfolios?.contentlanguages) &&
                            influDetails.p_portfolios.contentlanguages.length > 0 && (
                                <div className="mb-4">
                                    <p className="font-medium text-gray-900 mb-1">Content Languages</p>
                                    <div className="flex flex-wrap gap-2">
                                        {influDetails.p_portfolios.contentlanguages.map((lang, index) => (
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
                        {Array.isArray(influDetails?.p_portfolios?.filepaths) &&
                            influDetails.p_portfolios.filepaths.some((f) => f.filepath) ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {influDetails.p_portfolios.filepaths.map((item, index) => {
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
                                                    className="w-full h-40 object-cover"
                                                />
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
                                <p className="text-gray-500">{influDetails?.p_profile?.genderid === 1 ? "Male" : "Female"}</p>
                            </div>
                            <hr className="my-4 border-gray-200" />
                            <div>
                                <p className="font-medium text-gray-900">Date Of Birth</p>
                                <p className="text-gray-500">{influDetails?.p_profile?.dob}</p>
                            </div>
                            <hr className="my-4 border-gray-200" />
                            <div>
                                <p className="font-medium text-gray-900">Address</p>
                                <p className="text-gray-500">
                                    {influDetails?.p_profile?.address1}, {influDetails?.p_profile?.city}, {influDetails?.p_profile?.statename}, {influDetails?.p_profile?.zip}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm text-sm w-full">
                        <h3 className="font-bold mb-4 text-base">Social Media</h3>
                        <div className="space-y-4">
                            {influDetails?.p_socials?.map((item, index) => {
                                // Normalize link: add https:// if missing
                                const handleLink = item.handleslink

                                return (
                                    <div
                                        key={index}
                                        onClick={() => window.open(handleLink, "_blank", "noopener,noreferrer")}
                                        className="flex items-center gap-3 p-2 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
                                    >
                                        <img
                                            src={item.iconpath}
                                            alt="Social"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-gray-500 text-xs truncate max-w-[250px]">{item.handleslink}</p>
                                            <p className="text-gray-500 text-xs">
                                                Followers: {item.nooffollowers?.toLocaleString() || 0}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>


                    </div>

                    {/* Payment Details */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm text-sm w-full">
                        <h3 className="font-bold mb-4 text-base">Payment Details</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium text-gray-900">Country</p>
                                <p className="text-gray-500">{influDetails?.p_profile?.countryname}</p>
                            </div>
                            <hr className="my-4 border-gray-200" />
                            <div>
                                <p className="font-medium text-gray-900">Bank</p>
                                <p className="text-gray-500">{influDetails?.p_paymentaccounts?.bankname || "N/A"}</p>
                            </div>
                            <hr className="my-4 border-gray-200" />
                            <div>
                                <p className="font-medium text-gray-900">Account Holder’s Name</p>
                                <p className="text-gray-500">{influDetails?.p_paymentaccounts?.accountholdername || "N/A"}</p>
                            </div>
                            <hr className="my-4 border-gray-200" />
                            <div>
                                <p className="font-medium text-gray-900">Account Number</p>
                                <p className="text-gray-500">{influDetails?.p_paymentaccounts?.accountnumber || "N/A"}</p>
                            </div>
                            <hr className="my-4 border-gray-200" />
                            <div>
                                <p className="font-medium text-gray-900">IFSC Code</p>
                                <p className="text-gray-500">{influDetails?.p_paymentaccounts?.bankcode || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Confirmation Modal */}
            <Modal
                title={`Confirm ${actionType}`}
                open={isModalOpen}
                onOk={() => {
                    handleSubmit(actionType);
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
                            : "",
                }}
            >
                <p>
                    Are you sure you want to{" "}
                    <strong>{actionType.toLowerCase()}</strong> user{" "}
                    <span className="font-bold text-gray-800">
                        {influDetails?.p_profile?.firstname}{" "}
                        {influDetails?.p_profile?.lastname}
                    </span>
                    ?
                </p>
            </Modal>
        </div>
    );
};

export default InfluencerDetailView;
