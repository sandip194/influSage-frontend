import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    RiArrowLeftLine,
    RiStarFill,
    RiPlayCircleLine,
    RiMessage2Line,
    RiEyeLine,
    RiStarLine,
} from "@remixicon/react";
import AcceptOfferModal from "./models/AcceptOfferModal";
import { Tooltip } from "antd";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

// ✅ static data for now
const offerDetails = {
    terms: {
        budget: "12500",
        deadline: "11 Jun, 2025",
    },
    description:
        "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...",
    influencer: {
        name: "Courtney Henry",
        location: "Ahmedabad, India",
        rating: 4.2,
        categories: ["Fashion", "Beauty", "Fitness", "Other"],
        followers: {
            instagram: "11.8k",
            youtube: "2.3k",
            facebook: "5.2k",
            twitter: "2.3k",
        },
        profileImage: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    portfolio: [

        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9",
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1"
    ]


};

const OfferDetails = () => {
    const { terms, description, influencer, portfolio } = offerDetails;
    const navigate = useNavigate();

    // modal states
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);

    // confirm handlers
    const handleConfirmAccept = () => {
        console.log("✅ Offer accepted:", influencer.name, terms);
        setIsAcceptModalOpen(false);
    };

    return (
        <div className="">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 mb-4"
            >
                <RiArrowLeftLine /> Back
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Right Section (Influencer Details) */}
                <div className="order-1 md:order-2 bg-white p-6 rounded-2xl space-y-4 self-start">
                    <div
                        key={influencer.id}
                        className=" transition  border-gray-200 bg-white  flex flex-col"
                    >
                        {/* Profile Section */}
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src={influencer.profileImage}
                                alt={influencer.name}
                                loading="lazy"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="max-w-full">
                                <div className="font-semibold truncate text-gray-900">
                                    {influencer.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {influencer.location}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <RiStarLine size={13} />
                                    <span>
                                        {influencer.rating} ({influencer.reviews})
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {influencer?.categories?.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-gray-100 rounded-xl text-xs text-gray-700"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <hr className="my-2 border-gray-200" />

                        {/* Social Stats */}
                        <div className="flex text-xl flex-wrap justify-between text-xs text-gray-600 mb-4 gap-3">
                            <span className="flex items-center gap-1 text-pink-600">
                                <FaInstagram className="text-xl"/> {influencer.followers?.instagram}
                            </span>
                            <span className="flex items-center gap-1 text-red-600">
                                <FaYoutube className="text-xl"/> {influencer.followers?.youtube}
                            </span>
                            <span className="flex items-center gap-1 text-blue-600">
                                <FaFacebook className="text-xl"/> {influencer.followers?.facebook}
                            </span>
                            <span className="flex items-center gap-1 text-black">
                                <FaTiktok className="text-xl"/> {influencer.followers?.tiktok}
                            </span>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                            {/* View Profile */}
                            <button
                                className="w-full sm:w-auto flex-1 py-2 flex items-center justify-center gap-2 
      rounded-3xl border border-gray-300 cursor-pointer 
      font-medium text-gray-700 hover:bg-gray-100 transition truncate"
                            >
                                <RiEyeLine size={18} /> View Profile
                            </button>

                            {/* Message */}
                            <Tooltip title="Message" className="w-full sm:w-auto">
                                <button
                                    aria-label="Message"
                                    className="w-full sm:w-auto flex-1 py-2 flex items-center justify-center 
        gap-2 rounded-3xl bg-[#0f122f] cursor-pointer text-white 
        hover:bg-[#23265a] transition"
                                >
                                    <RiMessage2Line size={18} /> Message
                                </button>
                            </Tooltip>
                        </div>

                    </div>
                </div>

                {/* Left Section */}
                <div className="order-2 md:order-1 md:col-span-2 space-y-6">
                    {/* Proposed Terms */}
                    <div className="bg-white p-6 rounded-2xl">
                        <h2 className="text-lg font-semibold mb-4">Your proposed terms</h2>
                        <div className="flex gap-6 mb-4">
                            <div className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-2">Budget</span>
                                <span className="font-medium"> ₹{Number(terms.budget).toLocaleString("en-IN")} </span>
                            </div>

                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-gray-700 font-medium mb-2">Description</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {description}
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setIsAcceptModalOpen(true)}
                                className="bg-[#0D132D] cursor-pointer text-white px-6 py-2 rounded-full hover:bg-[#0D132Ded]"
                            >
                                Accept Offer
                            </button>
                            {/* <button
                                onClick={() => setIsRejectModalOpen(true)}
                                className="border border-gray-300 cursor-pointer px-6 py-2 rounded-full text-[#0D132D] hover:bg-gray-100"
                            >
                                Reject Offer
                            </button> */}
                        </div>
                    </div>

                    {/* Portfolio */}
                    <div className="bg-white p-6 rounded-2xl ">
                        <h2 className="text-lg font-semibold mb-4">Portfolio</h2>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                            {portfolio.map((img, idx) => (
                                <div key={idx} className="relative group">
                                    <img
                                        src={img}
                                        alt={`portfolio-${idx}`}
                                        className="rounded-xl w-full h-28 object-cover"
                                    />
                                    {/* Play Icon Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                        <RiPlayCircleLine className="text-white text-3xl drop-shadow-lg" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 text-blue-600 text-sm">View More</button>
                    </div>
                </div>

            </div>

            {/* Modals */}
            <AcceptOfferModal
                open={isAcceptModalOpen}
                onCancel={() => setIsAcceptModalOpen(false)}
                onConfirm={handleConfirmAccept}
                offer={influencer}
            />

        </div>
    );
};

export default OfferDetails;
