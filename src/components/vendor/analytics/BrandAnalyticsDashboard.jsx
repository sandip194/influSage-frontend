import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiArrowUpLine, RiArrowDownLine } from "@remixicon/react";
import { useSelector } from "react-redux";
import PerformanceChart from "../../users/analytics/PerformanceChart";
import TopContentChart from "../../users/analytics/TopContentChart";
import { Select } from "antd";

import {
    RiBriefcaseLine,
    RiGroupLine,
    RiEyeLine,
    RiHeartLine,
    RiImage2Line,
    RiStarLine
} from "@remixicon/react";

const { Option } = Select;


// Static KPI Data
const kpis = [
    { label: "Total Campaigns", value: 14, change: 12, positive: true, icon: <RiBriefcaseLine size={28} /> },
    { label: "Active Influencers", value: 8, change: 5, positive: true, icon: <RiGroupLine size={28} /> },
    { label: "Total Impressions", value: 152930, change: 12, positive: true, icon: <RiEyeLine size={28} /> },
    { label: "Engagement Rate", value: "4.3%", change: 1.2, positive: true, icon: <RiHeartLine size={28} /> },
    { label: "Total Content Pieces", value: 48, change: 7, positive: true, icon: <RiImage2Line size={28} /> },
    { label: "Avg Engagement/Influencer", value: "3.8%", change: 0.8, positive: true, icon: <RiStarLine size={28} /> },
];


// Campaign Table
const campaigns = [
    { name: "GlowSkincare Launch", platform: "IG, TikTok", views: 48000, engagement: 8300, status: "Active" },
    { name: "FitPro Campaign", platform: "IG, YT", views: 72000, engagement: 9200, status: "Active" },
    { name: "Clothify Drops", platform: "TikTok", views: 58000, engagement: 6500, status: "Completed" },
];

const providerIcons = {
    YouTube: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
    Facebook: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
    Instagram: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
    TikTok: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
    Twitter: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
};

const providerColors = {
    YouTube: "#FF0000",
    Facebook: "#1877F2",
    Instagram: "#E1306C",
    TikTok: "#000000",
    Twitter: "#1DA1F2",
};


// Recent Content
const contentList = [
    {
        platform: "Instagram",
        type: "Reel",
        date: "12 Feb 2025",
        caption: "Trying the new Glow Serum…",
        views: 12593,
        likes: 1204,
        comments: 82,
        thumbnail: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    },
    {
        platform: "TikTok",
        type: "Video",
        date: "8 Feb 2025",
        caption: "Unboxing the new FitPro pack!",
        views: 30021,
        likes: 3100,
        comments: 210,
        thumbnail: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
    },
];

// -------------------------
// Brand Dashboard Component
// -------------------------
const BrandAnalyticsDashboard = () => {

    const { token, userId } = useSelector((state) => state.auth);

    const [timelineData, setTimelineData] = useState([]);
    const [filterType, setFilterType] = useState("month");
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [platforms, setPlatforms] = useState([]);


    const fetchTimelineData = async () => {
        try {
            const res = await axios.get("vendor/analytics/performance-timeline", {
                params: {
                    p_userid: userId,
                    p_filtertype: filterType
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTimelineData(res.data?.data || []);
        } catch (err) {
            console.error("Timeline fetch error:", err);
        }
    };

    useEffect(() => {
        fetchTimelineData();
    }, [filterType]);

    const fetchPlatformBreakdown = async () => {
    try {
        const res = await axios.get("vendor/analytics/platform-breakdown", {
            params: {
                p_year: year,
                p_month: filterType === "month" ? month : null,
            },
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res?.data?.data) {
            const formatted = res.data.data.map(item => ({
                platform: item.providername,
                views: item.totallikes,
                percentage: item.percentage,
                color: providerColors[item.providername] || "#0D132D",
                icon: providerIcons[item.providername] || "https://cdn-icons-png.flaticon.com/512/565/565547.png",
            }));

            setPlatforms(formatted);
        }
    } catch (err) {
        console.error("Error fetching platform breakdown:", err);
    }
};

    useEffect(() => {
    fetchPlatformBreakdown();
    }, [filterType]);

    return (
        <div className="w-full space-y-6 text-sm">
            {/* ------------------------- */}
            {/* Header */}
            {/* ------------------------- */}
            <div>
                <h2 className="text-2xl font-bold text-[#0D132D]">Brand Analytics Dashboard</h2>
                <p className="text-gray-500 text-sm">Overview of campaigns and influencer performance</p>
            </div>

            {/* ------------------------- */}
            {/* KPI Cards */}
            {/* ------------------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {kpis.map((kpi, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-shadow duration-300"
                    >
                        {/* Icon */}
                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#0B132B]">
                            <div className="text-white text-lg">{kpi.icon}</div>
                        </div>

                        {/* Right Text Area */}
                        <div className="flex flex-col">

                            {/* Label */}
                            <p className="text-gray-500 text-md">{kpi.label}</p>

                            {/* Value + Change */}
                            <div className="flex items-center gap-2">
                                <p className="text-[#0D132D] font-bold text-3xl">
                                    {typeof kpi.value === "number"
                                        ? kpi.value.toLocaleString()
                                        : kpi.value}
                                </p>

                                <span
                                    className={`flex items-center text-xs font-medium ${kpi.positive ? "text-green-700" : "text-red-500"
                                        }`}
                                >
                                    {kpi.positive ? <RiArrowUpLine size={12} /> : <RiArrowDownLine size={12} />}
                                    {kpi.change}%
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>




            {/* ------------------------- */}
            {/* Campaign Table */}
            {/* ------------------------- */}
            <div className="bg-white rounded-2xl p-5 shadow-sm overflow-x-auto">
                <h2 className="text-lg font-bold mb-4">Campaign Overview</h2>
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-300">
                            <th className="py-2 px-3 text-gray-500 text-xs">Campaign</th>
                            <th className="py-2 px-3 text-gray-500 text-xs">Platform</th>
                            <th className="py-2 px-3 text-gray-500 text-xs">Views</th>
                            <th className="py-2 px-3 text-gray-500 text-xs">Engagement</th>
                            <th className="py-2 px-3 text-gray-500 text-xs">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map((c, idx) => (
                            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-2 px-3">{c.name}</td>
                                <td className="py-2 px-3">{c.platform}</td>
                                <td className="py-2 px-3">{c.views.toLocaleString()}</td>
                                <td className="py-2 px-3">{c.engagement.toLocaleString()}</td>
                                <td className="py-2 px-3">{c.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ------------------------- */}
            {/* Charts */}
            {/* ------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Performance Chart */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    {/* Header + Filter same line */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Performance Over Time</h2>

                        <div className="flex items-center gap-2">

                            <Select
                                value={filterType}
                                onChange={setFilterType}
                                className="w-[120px]"
                                size="large"
                            >
                                <Option value="week">Week</Option>
                                <Option value="month">Month</Option>
                                <Option value="year">Year</Option>
                            </Select>
                        </div>
                    </div>

                    <PerformanceChart data={timelineData} filter={filterType} />
                </div>

                {/* Top Content */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <h2 className="text-lg font-bold mb-4">Top Performing Content</h2>
                    <TopContentChart />
                </div>
            </div>

            {/* ------------------------- */}
            {/* Platform Breakdown */}
            {/* ------------------------- */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">

                {/* HEADER ROW */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Platform Breakdown</h2>

                    <Select
                        value={filterType}
                        onChange={setFilterType}
                        className="w-[120px]"
                        size="large"
                    >
                        <Option value="month">Month</Option>
                        <Option value="year">Year</Option>
                    </Select>
                </div>

                {/* PLATFORM BARS */}
                <div className="space-y-4">
                    {platforms.map((p, idx) => {
                        const maxViews = Math.max(...platforms.map(d => d.views));
                        return (
                            <div key={idx} className="flex items-center space-x-3">
                                <img src={p.icon} alt={p.platform} className="w-6 h-6" />
                                <p className="w-20 text-sm text-gray-700">{p.platform}</p>
                                <div className="flex-1 bg-gray-200 h-3 rounded-full">
                                    <div
                                        className="h-3 rounded-full"
                                        style={{
                                            width: `${(p.views / maxViews) * 100}%`,
                                            backgroundColor: p.color
                                        }}
                                    />
                                </div>
                                <p className="w-16 text-sm font-bold text-gray-800 text-right">
                                    {p.views >= 1000 ? `${(p.views / 1000).toFixed(1)}k` : p.views}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ------------------------- */}
            {/* Recent Content */}
            {/* ------------------------- */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="text-lg font-bold mb-4">Recent Content</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contentList.map((c, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl p-4 shadow-sm">
                            <img src={c.thumbnail} alt="Thumbnail" className="w-full h-40 object-cover rounded-lg mb-3" />
                            <p className="text-xs text-gray-500">{c.platform} • {c.type}</p>
                            <p className="text-sm font-semibold text-gray-800">Posted on {c.date}</p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{c.caption}</p>
                            <div className="flex justify-between mt-3 text-sm font-medium text-gray-800">
                                <p>👁 {c.views.toLocaleString()}</p>
                                <p>❤️ {c.likes.toLocaleString()}</p>
                                <p>💬 {c.comments.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrandAnalyticsDashboard;
