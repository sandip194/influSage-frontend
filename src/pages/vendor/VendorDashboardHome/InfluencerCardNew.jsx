import React from "react";
import { useNavigate } from "react-router-dom";
import {
    RiHeartLine,
    RiHeartFill,
    RiUserAddLine,
} from "@remixicon/react";
import { Tooltip } from "antd";

const InfluencerCardNew = ({ influencer, onLike, onInvite }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() =>
                navigate(
                    `/vendor-dashboard/browse-influencers/influencer-details/${influencer?.id}`
                )
            }
            className="relative bg-[#e6eff9] hover:bg-[#d6e4f6] rounded-2xl 
            p-5 border border-gray-200 cursor-pointer shadow-md 
            transition-all duration-300 flex flex-col h-full"
        >
            {/* Heart */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onLike(influencer?.id);
                    }}
                    className="w-9 h-9 rounded-full bg-white border border-gray-300 flex items-center justify-center"
                >
                    {influencer?.savedinfluencer ? (
                        <RiHeartFill size={20} className="text-red-500" />
                    ) : (
                        <RiHeartLine size={20} className="text-gray-700" />
                    )}
                </button>
            </div>

            <div className="flex flex-col gap-2 ">
                {/* Profile */}
                <div className="flex items-center gap-3">
                    <img
                        src={influencer?.photopath || "https://via.placeholder.com/100"}
                        className="w-14 h-14 rounded-full border border-gray-200 object-cover"
                        alt="Profile"
                    />

                    <div className="min-w-0">
                        <p className="text-base font-semibold line-clamp-2">
                            {influencer?.firstname} {influencer?.lastname}
                        </p>

                        <p className="text-sm text-gray-600 truncate">
                            {influencer?.statename}, {influencer?.countryname}
                        </p>
                    </div>
                </div>

                <p className="text-xs text-gray-500 line-clamp-1">
                    {(influencer?.contentlanguages || [])
                        .map((l) => l.languagename)
                        .join(", ")}
                </p>

                <div className="flex flex-wrap gap-1">
                    {influencer.categories.slice(0, 2).map((cat, i) => (
                        <span
                            key={i}
                            className="px-2 py-[2px] text-[10px] bg-blue-200 rounded-lg"
                        >
                            {cat.categoryname}
                        </span>
                    ))}

                    {influencer.categories.length > 2 && (
                        <span className="px-2 py-[2px] text-[10px] bg-gray-300 rounded-lg">
                            +{influencer.categories.length - 2}
                        </span>
                    )}
                </div>

                <p className="text-sm text-gray-900 line-clamp-1">
                    {(influencer?.bio || "N/A")}
                </p>

                <div className="flex gap-4 mt-3">
                    {(influencer?.providers || [])
                        .filter((p) => p.nooffollowers > 0)
                        .slice(0, 3)
                        .map((p) => (
                            <div key={p.providerid} className="flex items-center gap-2">
                                <img src={p.iconpath} className="w-5 h-5" />
                                <span className="text-sm font-semibold">
                                    {p.nooffollowers}
                                </span>
                            </div>
                        ))}
                </div>
            </div>

            {/* <div className="mt-auto pt-3 border-t border-gray-300 flex justify-between gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onInvite(influencer?.id);
                    }}
                    className="flex-1 bg-[#0f1330] text-white py-2 rounded-full text-sm font-semibold"
                >
                    <RiUserAddLine className="inline-block mr-1" size={14} />
                    Invite
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                            `/vendor-dashboard/browse-influencers/influencer-details/${influencer?.id}`
                        );
                    }}
                    className="flex-1 border border-black py-2 rounded-full text-sm font-semibold"
                >
                    View
                </button>
            </div> */}
        </div>
    );
};

export default InfluencerCardNew;
