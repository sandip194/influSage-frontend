import { RiArrowLeftLine, RiFile3Line, RiHeartFill, RiHeart3Line, RiMessage2Line } from "@remixicon/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip, Skeleton } from "antd";
import InviteModal from "../../users/browseInfluencers/InviteModal";
import { toast } from "react-toastify";

//  const formatDOB = (dob) => {
//         const date = new Date(dob);
//         return date.toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//         });
//     };

const InfluencerProfile = () => {
    const [loading, setLoading] = useState(false)
    const [influDetails, setInfluDetails] = useState([])
    const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
    const [selectedInfluencer, setSelectedInfluencer] = useState(null);


    const navigate = useNavigate();
    const { userId } = useParams()
    const { token } = useSelector((state) => state.auth);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

   


    const getInfluencerDetails = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`vendor/influencer-detail/${userId}`, {
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
                conversationId: influDetails.conversationid || null,
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
      const response = await axios.post(
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
    return (
        <div className="">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 mb-2"
            >
                <RiArrowLeftLine /> Back
            </button>
            <h2 className="text-2xl text-gray-900 font-semibold mb-6">Influencer Details</h2>

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
            <div className="flex bg-white rounded-2xl p-6 flex-col md:flex-row  md:items-start gap-6  pb-6">
                <div className="relative">
                <img
                    src={influDetails?.photopath}
                    alt="Profile"
                    onClick={() => setIsPreviewOpen(true)}
                    className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 cursor-pointer"
                />

                {isPreviewOpen && (
                    <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setIsPreviewOpen(false)}
                    >
                    <button
                        onClick={() => setIsPreviewOpen(false)}
                        className="absolute top-5 right-6 text-white text-3xl font-bold"
                    >
                        &times;
                    </button>
                    <img
                        src={influDetails?.photopath}
                        alt="Profile Preview"
                        className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
                        onClick={(e) => e.stopPropagation()} 
                    />
                    </div>
                )}
                </div>

                <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h2 className="text-3xl font-semibold capitalize text-gray-900">
                                {influDetails?.firstname} {influDetails?.lastname}
                            </h2>
                            <p className="text-sm text-gray-900 mt-1">{influDetails?.email}</p>
                            <p className="text-sm text-gray-900 mt-1">{influDetails?.genderid === 1 ? "Male" : "Female"}</p>
                            <p className="text-sm text-gray-900 mt-1">
                                {influDetails?.statename}, {influDetails?.countryname}
                            </p>
                        </div>

                        <div className="flex gap-10 mt-4 sm:mt-0 text-center">
                            <div>
                                <p className="text-gray-900 font-bold text-xs uppercase tracking-wide">
                                    Total Campaign
                                </p>
                                 <p className="text-lg font-semibold text-gray-900">
                                    {typeof influDetails?.totalcampaign === "number"? influDetails?.totalcampaign: 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full">
                           {influDetails?.invitedcampaigns !== null && (
                                <Tooltip title="Message">
                                    <button
                                    onClick={handleMessageClick}
                                    className="flex items-center justify-center gap-2 bg-[#0f122f] text-white px-4 py-2 rounded-3xl hover:bg-[#23265a]"
                                    >
                                    <RiMessage2Line size={18} /> Send Message
                                    </button>
                                </Tooltip>
                                )}
                            <button onClick={handleInvite} className="border border-gray-300 text-gray-900 px-5 py-2 rounded-full hover:bg-gray-100 transition w-full sm:w-auto">
                                Invite
                            </button>
                            <Tooltip title={influDetails?.savedinfluencer ? "Unfavorite" : "Favorite"}>
                                <button
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    handleLike();
                                    }}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-[#0e102b]"
                                >
                                    {influDetails?.savedinfluencer ? (
                                    <RiHeartFill size={18} className="text-red-500" />
                                    ) : (
                                    <RiHeart3Line size={18} />
                                    )}
                                </button>
                                </Tooltip>

                        </div>

                        <span className="sm:ml-auto bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-2 rounded-2xl text-sm font-medium text-center">
                            Invitation Pending
                        </span>
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

                    <h4 className="text-lg font-semibold mt-8 mb-3 text-gray-900">Categories</h4>
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

            {/* Social Media */}
            <div className="mt-4 bg-white rounded-2xl p-4">
                <h3 className="text-xl font-semibold mb-5 text-gray-900">Social Media</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {influDetails?.providers?.map((provider, index) => (
                        <a
                            key={index}
                            href={provider.handleslink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 border border-gray-200 p-4 rounded-lg hover:shadow-md transition"
                        >
                            {/* Show icon if iconpath exists */}
                            {provider.iconpath && (
                                <img
                                    src={provider.iconpath}
                                    alt={provider.providername}
                                    className="w-10 h-10 object-contain rounded-full"
                                />
                            )}
                            <div>
                                <p className="font-medium text-base">{provider.providername}</p>
                                <p className="text-sm text-gray-500">
                                    {provider.nooffollowers?.toLocaleString()} followers
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
            <div className="mt-4 bg-white rounded-2xl p-4">
                <h3 className="text-xl font-semibold mb-5 text-gray-900">Portfolio</h3>

                {influDetails?.portfoliofiles?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {influDetails?.portfoliofiles?.map((file, index) => {
                            const url = file.filepath;
                            const extension = url.split('.').pop().toLowerCase();

                            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
                            const isVideo = ['mp4', 'mov', 'webm', 'ogg'].includes(extension);
                            const isPDF = extension === 'pdf';
                            const isDoc = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension);

                            return (
                                <div
                                    key={index}
                                    className="border border-gray-200 items-center justify-center rounded-2xl flex flex-col gap-2 bg-gray-50"
                                >
                                    {isImage && (
                                        <img
                                            src={url}
                                            alt={`Portfolio ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-2xl"
                                        />
                                    )}

                                    {isVideo && (
                                        <video
                                            controls
                                            className="w-full h-48 rounded-2xl object-cover"
                                        >
                                            <source src={url} type={`video/${extension}`} />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}

                                    {isPDF && (
                                        <iframe
                                            src={url}
                                            className="w-full h-48 rounded-2xl"
                                            title={`PDF ${index + 1}`}
                                        ></iframe>
                                    )}

                                    {(isDoc || (!isImage && !isVideo && !isPDF)) && (
                                        <div className="flex flex-col items-center justify-center text-center gap-2 py-4">
                                            <RiFile3Line className="w-16  h-16 text-gray-500" />
                                            <a
                                                href={url}
                                                download
                                                className="text-blue-600 text-sm underline break-all"
                                            >
                                                {url.split("/").pop()}
                                            </a>
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
      </>
    )}
            
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
