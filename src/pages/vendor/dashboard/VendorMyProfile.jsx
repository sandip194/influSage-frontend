import {
    RiStarLine,
    RiPlayCircleFill,
    RiArrowDownSLine,
    RiStarFill,
    RiArrowUpSLine,
} from '@remixicon/react';
import axios from 'axios';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const workHistoryData = [
    {
        id: 1,
        title: "Instagram Campaign for reels",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        user: "Cameron Williamson",
        date: "11 Nov 2024",
        avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
        rating: 4,
    },
    {
        id: 2,
        title: "Instagram Campaign for reels",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        user: "Ralph Edwards",
        date: "11 Nov 2024",
        avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
        rating: 5,
    },
    {
        id: 3,
        title: "Instagram Campaign for reels",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        user: "Jenny Wilson",
        date: "11 Nov 2024",
        avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
        rating: 3,
    },
];
const formatPhoneNumber = (phone) => {
    if (!phone) return "No phone";

    const cleaned = phone.replace(/\D/g, "");

    let number = cleaned;
    if (number.startsWith("91")) {
        number = number.slice(2);
    }
    return `+91 ${number.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}`;
};
const VendorMyProfile = () => {
    const [showAllHistory, setShowAllHistory] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);

    const [loading, setLoading] = useState(false)

    const visibleData = showAllHistory
        ? workHistoryData
        : workHistoryData.slice(0, 2);

    const { token, userId } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const getMyProfileData = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`vendor/profile/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 200) {
                const data = res?.data?.profileParts;
                setProfileData(data);
            }

        } catch (error) {
            console.error("❌ Error fetching profile data:", error);
        } finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        getMyProfileData();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="w-full text-sm overflow-x-hidden">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Profile</h2>
            <p className="mb-6 text-gray-700 text-sm">
                You can view or edit your profile from here
            </p>
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Left Side */}
                <div className="flex-1 space-y-4">
                    <div className="bg-white object-cover rounded-2xl overflow-hidden shadow-sm">
                        {/* Banner */}
                        <div className="relative">
                            <img
                                src="https://images.pexels.com/photos/33350497/pexels-photo-33350497.jpeg"
                                alt="Banner"
                                className="w-full h-32 object-cover"
                            />
                            {/* Profile Image */}
                            <img
                                src={profileData?.p_profile?.photopath}
                                alt="Profile"
                                onClick={() => setIsPreviewOpen(true)}
                                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                className="absolute left-6 -bottom-10 w-20 h-20 object-cover rounded-full border-4 border-white shadow cursor-pointer"
                            />

                            {isPreviewOpen && (
                                <div
                                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                                    onClick={() => setIsPreviewOpen(false)}
                                >
                                    <button
                                        onClick={() => setIsPreviewOpen(false)}
                                        className="absolute top-5 right-6 text-white text-3xl font-bold hover:text-gray-300"
                                    >
                                        &times;
                                    </button>
                                    <img
                                        src={profileData?.p_profile?.photopath}
                                        alt="Profile Preview"
                                        onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                        className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="p-6 pt-14 flex flex-col md:flex-row justify-between items-start">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {profileData?.p_profile?.firstname} {profileData?.p_profile?.lastname}
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        {formatPhoneNumber(profileData?.p_profile?.phonenumber)}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {profileData?.p_profile?.email}
                                    </p>

                                </div>
                            </div>
                            <div className="flex gap-10 text-center mt-4 md:mt-0">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Campaign</p>
                                    <p className="font-semibold text-lg">{profileData?.p_profile?.totalcampaign || 0}</p>

                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Total Spending</p>
                                    <p className="font-semibold text-lg">0</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 pb-6">
                            <button
                                onClick={() => navigate("/vendor-dashboard/edit-profile")}
                                className="bg-[#0f122f] cursor-pointer text-white px-5 py-2 rounded-full font-medium hover:bg-[#23265a] transition inline-block"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        {/* Bio Section */}
                        <div className="mb-6">
                            <h2 className="font-bold text-base mb-3">Bio</h2>
                            <p className="text-gray-600 text-sm leading-relaxed mb-3 justify-content">
                                {profileData?.p_profile?.bio}
                            </p>

                        </div>

                        <hr className="my-4 border-gray-200" />

                        {/* Categories Section */}
                        <div>
                            <h2 className="font-bold text-base mb-3">Categories</h2>
                            <div className="flex flex-wrap gap-2">
                                {(Array.isArray(profileData?.p_categories)
                                    ? profileData.p_categories
                                    : []
                                ).flatMap(p =>
                                    p.categories.map(cat => (
                                        <span

                                            key={cat.categoryid}
                                            className="px-4 py-1.5 text-sm bg-gray-100 rounded-full text-gray-700"
                                        >
                                            {cat.categoryname}
                                        </span>
                                    ))
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Objective Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h2 className="font-bold text-base mb-4">Objective</h2>
                        {Array.isArray(profileData?.p_objectives) && profileData.p_objectives.length > 0 ? (
                            profileData.p_objectives.map(obj => (
                                <div key={obj.objectiveid}>
                                    <h3 className="font-semibold text-sm">{obj.name}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{obj.description}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-sm leading-relaxed">
                                No objectives available.
                            </p>
                        )}

                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <h2 className="font-bold text-base mb-4">Work History</h2>
                        <div className="space-y-6">
                            {visibleData.map((item) => (
                                <div
                                    key={item.id}
                                    className="border-b border-gray-400 pb-4 last:border-none"
                                >
                                    <h3 className="font-semibold text-sm">{item.title}</h3>
                                    <p className="text-gray-600 text-sm my-2">
                                        {item.description}
                                    </p>

                                    <div className="items-center justify-between mt-2">
                                        {/* Left: User Info */}
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={item.avatar}
                                                alt={item.user}
                                                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                {item.user}
                                            </span>
                                        </div>

                                        {/* Rating + Date */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) =>
                                                    i < item.rating ? (
                                                        <RiStarFill
                                                            key={i}
                                                            className="text-yellow-400 w-4 h-4"
                                                        />
                                                    ) : (
                                                        <RiStarLine
                                                            key={i}
                                                            className="text-gray-300 w-4 h-4"
                                                        />
                                                    )
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500">{item.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {workHistoryData.length > 2 && (
                            <div className="text-center mt-4">
                                <button
                                    className="flex items-center mx-auto gap-1 text-sm font-medium text-gray-600 hover:text-black"
                                    onClick={() => setShowAllHistory(!showAllHistory)}
                                >
                                    {showAllHistory ? "View Less" : "View More"}
                                    {showAllHistory ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">
                    <div className="bg-white rounded-2xl p-4 shadow-sm w-full text-sm">
                        <h3 className="font-semibold text-lg mb-4">Business Details</h3>

                        <div className="space-y-4">
                            <div>
                                <p className="font-medium text-gray-900">Business Name</p>
                                <p className="text-gray-500">{profileData?.p_profile?.businessname}</p>
                            </div>

                            <hr className="my-4 border-gray-200" />
                            <div>
                                <p className="font-medium text-gray-900">How large is your company?</p>
                                <p className="text-gray-500">
                                    {profileData?.p_profile?.companysizename}{" "}
                                    {profileData?.p_profile?.minemployees && profileData?.p_profile?.maxemployees
                                        ? `(${profileData.p_profile.minemployees} - ${profileData.p_profile.maxemployees} Employees)`
                                        : ""}
                                </p>
                            </div>


                            <hr className="my-4 border-gray-200" />

                            <div>
                                <p className="font-medium text-gray-900">Address</p>
                                <p className="text-gray-500">
                                    {profileData?.p_profile?.address1}, {profileData?.p_profile?.city}, {profileData?.p_profile?.statename}, {profileData?.p_profile?.countryname} - {profileData?.p_profile?.zip}
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 text-sm w-full">
                        <h3 className="font-bold mb-4 text-base">Platforms</h3>
                        <div className="flex flex-col gap-3">
                            {Array.isArray(profileData?.p_providers) && profileData.p_providers.length > 0 ? (
                                profileData.p_providers.map(provider => (
                                    <a
                                        key={provider.providerid}
                                        href={provider.handleslink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 border border-gray-200 p-4 rounded-lg hover:shadow-md transition"
                                    >
                                        {provider.iconpath ? (
                                            <img
                                                src={provider.iconpath}
                                                alt={provider.name}
                                                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                                className="w-10 h-10 object-contain rounded-full"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                                ?
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-base">{provider.name}</p>
                                        </div>
                                    </a>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No platforms available.</p>
                            )}

                        </div>
                    </div>

                    {/* <div className="bg-white rounded-2xl p-4 text-sm w-full">
                        <h3 className="font-bold mb-4 text-base">Target Influencer</h3>
                        <div className="flex flex-col gap-1 mt-2">
                            <span className="text-xs text-gray-700">• Nano Influencer (5k - 10k Followers)</span>
                            <span className="text-xs text-gray-700">• Micro Influencer (10k - 100k Followers)</span>
                            <span className="text-xs text-gray-700">• Macro Influencer (100k - 1M Followers)</span>
                        </div>
                    </div> */}

                    {/* Payment Details */}
                    {/* <div className="bg-white rounded-2xl p-4 text-sm w-full">
                        <h3 className="font-bold mb-4 text-base">Payment Details</h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-500 text-xs">Country</p>
                                <p className="text-gray-900 font-medium">India</p>
                            </div>
                            <hr className="my-4 border-gray-200" />

                            <div>
                                <p className="text-gray-500 text-xs">Bank</p>
                                <p className="text-gray-900 font-medium">State Bank Of India</p>
                            </div>
                            <hr className="my-4 border-gray-200" />

                            <div>
                                <p className="text-gray-500 text-xs">Account Holder’s Name</p>
                                <p className="text-gray-900 font-medium">Sean Smith</p>
                            </div>
                            <hr className="my-4 border-gray-200" />

                            <div>
                                <p className="text-gray-500 text-xs">Account Number</p>
                                <p className="text-gray-900 font-medium">32800 **** **** ****</p>
                            </div>
                            <hr className="my-4 border-gray-200" />

                            <div>
                                <p className="text-gray-500 text-xs">IFSC Code</p>
                                <p className="text-gray-900 font-medium">SBIN0010000</p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default VendorMyProfile;
