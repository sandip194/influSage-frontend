
import axios from "axios";
import { useEffect, useState } from "react";
import {
    RiMoneyRupeeCircleLine,
    RiTranslate,
    RiMenLine,
    RiCheckLine,
    RiArrowLeftLine,
} from "react-icons/ri";
import { CheckOutlined, CloseOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Modal, Tooltip, Empty, Skeleton, Input, Radio  } from "antd";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { safeText, safeArray, safeNumber } from "../../../App/safeAccess";


const CampaignDetailsView = () => {

    const { campaignId } = useParams();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);

    const [cmapignDetails, setCampaignDetails] = useState(null)
    const [actionLoading, setActionLoading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const openImageModal = (img) => setPreviewImage(img);
    const closeImageModal = () => setPreviewImage(null);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [blockReasons, setBlockReasons] = useState([]);
    const [selectedBlockReason, setSelectedBlockReason] = useState(null);
    const [blockLoading, setBlockLoading] = useState(false);


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
        <div className="w-full text-sm overflow-x-hidden bg-gray-50">
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
                    <div className="bg-white rounded-2xl overflow-hidden">
                        {/* Banner placeholder */}
                        <div className="relative h-40 bg-gray-200">
                            <img
                                src={cmapignDetails?.photopath}
                                alt="Logo"
                                onClick={() => setIsPreviewOpen(true)}
                                className="absolute rounded-full top-14 left-4 w-20 h-20 border-4 border-white object-cover cursor-pointer"
                            />
                            {isPreviewOpen && (
                                <div
                                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                                    onClick={() => setIsPreviewOpen(false)}
                                >
                                    <button
                                        onClick={() => setIsPreviewOpen(false)}
                                        className="absolute top-6 right-8 text-white text-3xl font-bold hover:text-gray-300"
                                    >
                                        ×
                                    </button>
                                    <img
                                        src={cmapignDetails?.photopath}
                                        alt="Logo Preview"
                                        className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            {/* Title + Buttons Row */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                                <div>
                                    {/* Campaign Name and Business */}
                                    <h2 className="font-semibold text-lg">{safeText(cmapignDetails?.name, "no CampaignName")}</h2>
                                    <p className="text-gray-500 text-sm">{safeText(cmapignDetails?.businessname, "no businessName")}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                                    {cmapignDetails?.statusname === "ApprovalPending" && (
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

                                    {cmapignDetails?.statusname !== "ApprovalPending" &&
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
                            </div>

                            {/* Campaign Info Grid */}
                            <div className="flex flex-wrap justify-between gap-6 border border-gray-200 rounded-2xl p-4">
                                <div>
                                    <div className="flex gap-2 items-center text-gray-400 mb-2">
                                        <RiMoneyRupeeCircleLine className="w-5" />
                                        <span>Budget</span>
                                    </div>
                                    <p>₹{safeNumber(cmapignDetails?.estimatedbudget, "-").toLocaleString()}</p>
                                </div>

                                <div>
                                    <div className="flex gap-2 items-center text-gray-400 mb-2">
                                        <RiTranslate className="w-5" />
                                        <span>Languages</span>
                                    </div>
                                    {/* Languages */}
                                    {safeArray(cmapignDetails?.campaignlanguages).length > 0 ? (
                                        cmapignDetails.campaignlanguages.map((lang) => (
                                            <p key={lang.languageid}>{safeText(lang.languagename)}</p>
                                        ))
                                    ) : (
                                        <p> - </p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex gap-2 items-center text-gray-400 mb-2">
                                        <RiMenLine className="w-5" />
                                        <span>Gender</span>
                                    </div>
                                    {/* Genders */}
                                    {safeArray(cmapignDetails?.campaigngenders).length > 0 ? (
                                        cmapignDetails.campaigngenders.map((gender) => (
                                            <p key={gender.genderid}>{safeText(gender.gendername)}</p>
                                        ))
                                    ) : (
                                        <p> - </p>
                                    )}
                                </div>


                            </div>
                        </div>
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
                                <li className="flex items-center gap-2">
                                    <RiCheckLine size={20} className="text-gray-900 flex-shrink-0 border rounded" />
                                    <p>
                                        Application Start Date: <span className="text-gray-500">{safeText(cmapignDetails?.requirements?.applicationstartdate)}</span>
                                    </p>
                                </li>
                                <li className="flex items-center gap-2">
                                    <RiCheckLine size={20} className="text-gray-900 flex-shrink-0 border rounded" />
                                    <p>
                                        Application End Date: <span className="text-gray-500">{safeText(cmapignDetails?.requirements?.applicationenddate)}</span>
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
                        <div className="pt-4 pb-2">
                            <p className="text-sm font-semibold mb-1">Total Budget</p>
                            <p className="text-gray-500">
                                ₹{cmapignDetails?.estimatedbudget?.toLocaleString() || "-"}
                            </p>
                        </div>
                    </div>

                    {/* Vendor Info Card */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <h3 className="font-semibold text-lg">Vendor Details</h3>
                        <hr className="my-2 border-gray-200" />

                        {/* Profile Section */}
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={cmapignDetails?.vendorphoto}
                                alt={cmapignDetails?.name || "Vendor"}
                                className="w-12 h-12 rounded-full object-cover border border-gray-100"
                            />
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
                                <p className="text-gray-500">+{safeText(cmapignDetails?.phonenumber)}</p>
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
                                        key={platform.providercontenttypeid}
                                        className="border-b border-gray-100 pb-3 last:border-none"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-900 font-medium">{platform.providername}</span>
                                            <span className="text-gray-600 text-sm">{platform.contenttypename}</span>
                                        </div>
                                        {platform.caption && (
                                            <p className="text-gray-600 italic text-sm mt-2 border-l-2 border-gray-200 pl-3">
                                                {platform.caption}
                                            </p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No platform content types available.</p>
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




