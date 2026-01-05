import React from "react";
import { useNavigate } from "react-router-dom";
import {
    RiHeartLine,
    RiHeartFill,
    RiGlobalLine,
} from "@remixicon/react";
import { Tooltip } from "antd";

// Helper function to format numbers
const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
};


const InfluencerCardNew = ({ influencer, onLike }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() =>
            navigate(
                `/vendor-dashboard/browse-influencers/influencer-details/${influencer?.id}`
            )
            }
            className="
            relative
            bg-[#F6F8FF]
            border border-[#DDE3FF]
            rounded-2xl
            p-4
            cursor-pointer
            hover:shadow-md
            transition-all
            flex flex-col
            h-full
            "
        >
            {/* Like Button */}
            <button
            onClick={(e) => {
                e.stopPropagation();
                onLike(influencer?.id);
            }}
            className="
                absolute top-4 right-4
                w-9 h-9
                rounded-full
                bg-white
                border border-[#0D132D26]
                flex items-center justify-center
            "
            >
            {influencer?.savedinfluencer ? (
                <RiHeartFill className="text-red-500" size={18} />
            ) : (
                <RiHeartLine className="text-gray-600" size={18} />
            )}
            </button>

            {/* ===== Profile Header ===== */}
            <div className="flex items-center gap-3">
            <img
                src={influencer?.photopath || "/Brocken-Defualt-Img.jpg"}
                alt="profile"
                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />

            <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                {influencer?.firstname} {influencer?.lastname}
                </p>
                <p className="text-xs text-gray-500 truncate">
                {influencer?.statename}, {influencer?.countryname}
                </p>
            </div>
            </div>

            {/* ===== Categories ===== */}
            <div className="flex gap-2 mt-3 flex-nowrap overflow-visible min-w-0">
                {influencer?.categories?.slice(0, 2).map((cat, i) => (
                    <span
                    key={i}
                    className="
                        px-2 py-1
                        rounded-full
                        text-xs font-medium
                        border border-[#0D132D26]
                        whitespace-nowrap
                        overflow-hidden
                        text-ellipsis
                        min-w-0
                        max-w-full
                    "
                    title={cat.categoryname}
                    >
                    {cat.categoryname}
                    </span>
                ))}

                {/* + more */}
                {influencer?.categories?.length > 2 && (
                    <span
                    className="
                        px-2 py-1
                        rounded-full
                        text-xs font-medium
                        border border-[#0D132D26]
                        bg-gray-300
                        whitespace-nowrap
                        flex-shrink-0
                    "
                    title={influencer.categories
                        .slice(2)
                        .map((c) => c.categoryname)
                        .join(", ")}
                    >
                    +{influencer.categories.length - 2}
                    </span>
                )}
            </div>


            {/* ===== Bio ===== */}
            <p className="text-sm text-gray-500 line-clamp-2 h-[40px] mt-3">
                {influencer?.bio || "No bio available"}
            </p>

            {/* ===== Languages ===== */}
            {influencer?.contentlanguages?.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                    {/* Icon box */}
                    <span className="w-5 h-5 flex items-center justify-center">
                    <RiGlobalLine size={14} className="text-[#0D132D]" />
                    </span>

                    {/* Text */}
                    <p className="text-sm text-gray-700 font-medium truncate">
                    {(influencer.contentlanguages || [])
                        .map((l) => l.languagename)
                        .join(", ")}
                    </p>
                </div>
            )}

            <div className="border-t border border-[#0D132D26] my-3" />

            {/* ===== Social Stats Footer ===== */}
            <div className="flex items-center gap-6">
                {(influencer?.providers || [])
                    .filter((p) => p.nooffollowers > 0)
                    .slice(0, 4)
                    .map((p) => (
                    <div
                        key={p.providerid}
                        className="flex items-center gap-1 text-sm font-medium text-gray-700"
                    >
                        <img src={p.iconpath} alt="" className="w-5 h-5" />
                        {formatNumber(p.nooffollowers)}
                    </div>
                    ))}
            </div>
        </div>
        );
};

export default InfluencerCardNew;
