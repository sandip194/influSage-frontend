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
            className="relative bg-[#e6eff9] hover:bg-[#d6e4f6] rounded-2xl p-5 border border-gray-200 cursor-pointer 
      shadow-xl/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between "
        >
            {/* Heart Icon */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onLike(influencer?.id);
                    }}
                    className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center"
                >
                    {influencer?.savedinfluencer ? (
                        <RiHeartFill size={22} className="text-red-500" />
                    ) : (
                        <RiHeartLine size={22} className="text-gray-700" />
                    )}
                </button>
            </div>

            {/* Top Section */}
            <div>
                <div className="flex items-center gap-3">
                    <img
                        src={influencer?.photopath || "https://via.placeholder.com/100"}
                        className="w-14 h-14 rounded-full border border-gray-200"
                        alt="Profile"
                    />
                    <div>
                        <p className="text-lg font-semibold text-gray-900">
                            {influencer?.firstname} {influencer?.lastname}
                        </p>
                        <p className="text-sm text-gray-600">
                            {influencer?.statename}, {influencer?.countryname}
                        </p>
                    </div>
                </div>

                {/* Languages */}
                <p className="text-xs text-gray-500 mt-1">
                    {(influencer?.contentlanguages || [])
                        .map((l) => l.languagename)
                        .join(", ")}
                </p>

                <div className="flex flex-wrap gap-1 mt-3 items-center">
                    {influencer.categories.slice(0, 2).map((cat, i) => (
                        <span className="px-2 py-[2px] text-[10px] bg-blue-200 rounded-lg" key={i}>
                            {cat.categoryname}
                        </span>
                    ))}

                    {influencer.categories.length > 2 && (
                        <span className="px-2 py-[2px] text-[10px] bg-gray-300 rounded-lg">
                            +{influencer.categories.length - 2}
                        </span>
                    )}
                </div>



                {/* Followers - Larger */}
                <div className="flex gap-5 items-center mt-3 mb-2">
                    {(influencer?.providers || [])
                        .filter((p) => p.nooffollowers > 0)
                        .map((p) => (
                            <div key={p.providerid} className="flex items-center gap-2">
                                <img src={p.iconpath} className="w-6 h-6" alt="icon" />
                                <span className="font-semibold text-sm text-gray-800">
                                    {p.nooffollowers}
                                </span>
                            </div>
                        ))}
                </div>
            </div>

            {/* Bottom Button Section - Always aligned */}
            <div className="mt-auto pt-2 border-t border-gray-300 flex items-center justify-between">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onInvite(influencer?.id);
                    }}
                    className="bg-[#0f1330] text-white px-5 py-2 rounded-full text-sm font-semibold 
          hover:bg-[#1a214a] transition"
                >
                    <RiUserAddLine className="inline-block mr-1" size={16} />
                    Invite
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                            `/vendor-dashboard/browse-influencers/influencer-details/${influencer?.id}`
                        );
                    }}
                    className="border border-black px-5 py-2 rounded-full text-sm font-semibold 
          hover:bg-gray-100 transition"
                >
                    View 
                </button>
            </div>
        </div>
    );
};

export default InfluencerCardNew;
