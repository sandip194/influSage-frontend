import React, { useState } from "react";
import {
    RiYoutubeFill,
    RiInstagramFill,
    RiTiktokFill,
    RiFileCopyLine,
} from "@remixicon/react";
import { message } from "antd";

const PLATFORM_META = {
    instagram: { label: "Instagram", icon: <RiInstagramFill />, color: "#E1306C" },
    tiktok: { label: "TikTok", icon: <RiTiktokFill />, color: "#000000" },
    youtube: { label: "YouTube", icon: <RiYoutubeFill />, color: "#FF0000" },
};

// Example influencer data
const influencers = [
    {
        influencerName: "John Doe",
        platforms: {
            instagram: [
                { title: "Summer Campaign Story", status: "live", link: "https://instagram.com/link1" },
                { title: "August Lookbook Reel", status: "scheduled", link: "https://instagram.com/link2" }
            ],
            youtube: [],
            tiktok: []
        }
    },
    {
        influencerName: "Sarah Kim",
        platforms: {
            instagram: [
                { title: "Summer Campaign Story", status: "live", link: "https://instagram.com/link1" },
                { title: "August Lookbook Reel", status: "scheduled", link: "https://instagram.com/link2" }
            ],
            youtube: [],
            tiktok: [
                { title: "Unboxing Fall Collection", status: "live", link: "https://tiktok.com/abc" },
                { title: "New Product Teaser", status: "needs-review", link: "https://tiktok.com/def" },
                { title: "Day in the life vlog", status: "live", link: "https://tiktok.com/ghi" },
            ]
        }
    },
    {
        influencerName: "Sarah Kim",
        platforms: {
            instagram: [
                { title: "Summer Campaign Story", status: "live", link: "https://instagram.com/link1" },
                { title: "August Lookbook Reel", status: "scheduled", link: "https://instagram.com/link2" }
            ],
            youtube: [],
            tiktok: [
                { title: "Unboxing Fall Collection", status: "live", link: "https://tiktok.com/abc" },
                { title: "New Product Teaser", status: "needs-review", link: "https://tiktok.com/def" },
                { title: "Day in the life vlog", status: "live", link: "https://tiktok.com/ghi" },
            ]
        }
    }
];

// Status badge colors
const STATUS_META = {
    live: { text: "Live", color: "text-green-600", dot: "bg-green-500" },
    scheduled: { text: "Scheduled", color: "text-yellow-600", dot: "bg-yellow-500" },
    "needs-review": { text: "Needs Review", color: "text-red-600", dot: "bg-red-500" }
};

export default function VendorContentLinksTab() {
    const [activePlatform, setActivePlatform] = useState({});

    const copyToClipboard = (link) => {
        navigator.clipboard.writeText(link);
        message.success("Link copied!");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
                Influencer Content Links
            </h2>

            {/* Grid container for influencer cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2  gap-6">
                {influencers.map((inf, idx) => {
                    const platformKeys = Object.keys(inf.platforms).filter(
                        (p) => inf.platforms[p].length > 0
                    );
                    if (platformKeys.length === 0) return null;

                    // Set default active platform per influencer
                    if (!activePlatform[inf.influencerName]) {
                        setActivePlatform((prev) => ({
                            ...prev,
                            [inf.influencerName]: platformKeys[0],
                        }));
                    }

                    return (
                        <div
                            key={idx}
                            className="bg-gray-100 shadow-sm rounded-2xl p-4 space-y-4 border border-gray-100 "
                        >
                            {/* Influencer Header */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gray-200" />
                                <div>
                                    <p className="text-xl font-semibold">{inf.influencerName}</p>
                                </div>
                            </div>

                            {/* Platform Tabs */}
                            <div className="flex gap-4 pb-0 flex-wrap">
                                {platformKeys.map((platform) => (
                                    <button
                                        key={platform}
                                        onClick={() =>
                                            setActivePlatform((prev) => ({
                                                ...prev,
                                                [inf.influencerName]: platform,
                                            }))
                                        }
                                        className={`pb-1 font-medium text-sm ${
                                            activePlatform[inf.influencerName] === platform
                                                ? "border-b-2 border-black"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {PLATFORM_META[platform].label} ({inf.platforms[platform].length})
                                    </button>
                                ))}
                            </div>

                            {/* Content Cards */}
                            <div className="flex flex-wrap gap-1 mt-0">
                                {(inf.platforms[activePlatform[inf.influencerName]] || []).map(
                                    (item, i) => (
                                        <div
                                            key={i}
                                            onClick={() => copyToClipboard(item.link)}
                                            className="w-52 px-3 py-2 rounded-xl border border-gray-200 bg-white 
                                                       hover:bg-gray-50 cursor-pointer transition flex items-center 
                                                       justify-between shadow-sm"
                                        >
                                            <span className="text-gray-700 text-sm truncate">
                                                {item.link}
                                            </span>
                                            <RiFileCopyLine className="text-gray-500" size={18} />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
