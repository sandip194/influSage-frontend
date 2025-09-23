import { RiArrowLeftLine, RiFile3Line, RiHeart3Fill, RiHeart3Line } from "@remixicon/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";



const InfluencerProfile = () => {
    const [loading, setLoading] = useState(false)
    const [influDetails, setInfluDetails] = useState([])


    const navigate = useNavigate();
    const { userId } = useParams()
    const { token } = useSelector((state) => state.auth);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const formatDOB = (dob) => {
        const date = new Date(dob);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };


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
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getInfluencerDetails();
    }, [])

    return (
        <div className="">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 mb-2"
            >
                <RiArrowLeftLine /> Back
            </button>
            <h2 className="text-2xl text-gray-900 font-semibold mb-6">Influencer Details</h2>
            {/* Top Header */}
            <div className="flex bg-white rounded-2xl p-6 flex-col md:flex-row  md:items-start gap-6  pb-6">
                <img
                    src={`${BASE_URL}/${influDetails?.photopath}`}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
                />

                <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h2 className="text-3xl font-semibold capitalize text-gray-900">
                                {influDetails?.firstname} {influDetails?.lastname}
                            </h2>
                            <p className="text-sm text-gray-900 mt-1">{influDetails?.email}</p>
                            <p className="text-sm text-gray-900 mt-1">
                                {influDetails?.statename}, {influDetails?.countryname}
                            </p>
                        </div>

                        <div className="flex gap-10 mt-4 sm:mt-0 text-center">
                            <div>
                                <p className="text-gray-900 font-bold text-xs uppercase tracking-wide">
                                    Total Campaign
                                </p>
                                <p className="text-lg font-semibold text-gray-900">{influDetails?.totalCampaign}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full">
                            <button className="bg-[#0f122f] text-white px-5 py-2 rounded-full hover:bg-[#23265a] transition w-full sm:w-auto">
                                Send Message
                            </button>
                            <button className="border border-gray-300 text-gray-900 px-5 py-2 rounded-full hover:bg-gray-100 transition w-full sm:w-auto">
                                Invited
                            </button>
                            <button className="border border-gray-300 text-gray-900 rounded-full p-2 hover:bg-gray-100 transition w-full sm:w-auto flex justify-center">
                                {influDetails?.savedinfluencer ? (<RiHeart3Fill className="text-red-700" />): (<RiHeart3Line className="text-gray-700" />)}
                            </button>
                        </div>

                        <span className="sm:ml-auto bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-2 rounded-2xl text-sm font-medium text-center">
                            Invitation Pending
                        </span>
                    </div>

                </div>
            </div>

            {/* Bio & Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 ">
                <div className="bg-white rounded-2xl p-4 md:col-span-2 space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Bio</h3>
                    <p className="text-gray-600 text-sm leading-relaxed italic">
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

                <div className="bg-white rounded-2xl p-4">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">
                        Personal Details
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-3">
                        <li>
                            <strong>Date of Birth:</strong> {formatDOB(influDetails?.dob)}
                        </li>
                        <li>
                            <strong>Address:</strong> {influDetails?.address1}
                        </li>
                        <li>
                            <strong>Gender:</strong> {influDetails?.genderid === 1 ? "Male" : "Female"}
                        </li>
                    </ul>
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
                            {/* No icon as per request */}
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

            {/* Portfolio */}
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
                                            src={`${BASE_URL}/${url}`}
                                            alt={`Portfolio ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-2xl"
                                        />
                                    )}

                                    {isVideo && (
                                        <video
                                            controls
                                            className="w-full h-48 rounded-2xl object-cover"
                                        >
                                            <source src={`${BASE_URL}/${url}`} type={`video/${extension}`} />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}

                                    {isPDF && (
                                        <iframe
                                            src={`${BASE_URL}/${url}`}
                                            className="w-full h-48 rounded-2xl"
                                            title={`PDF ${index + 1}`}
                                        ></iframe>
                                    )}

                                    {(isDoc || (!isImage && !isVideo && !isPDF)) && (
                                        <div className="flex flex-col items-center justify-center text-center gap-2 py-4">
                                            <RiFile3Line className="w-16  h-16 text-gray-500" />
                                            <a
                                                href={`${BASE_URL}/${url}`}
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


        </div>
    );
};

export default InfluencerProfile;
