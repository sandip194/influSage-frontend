import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import PerformanceChart from "../../users/analytics/PerformanceChart";
import TopContentChart from "../../users/analytics/TopContentChart";
import CampaignAnalytics from "../../users/analytics/CampaignAnalytics";
import { Tooltip, Select, Skeleton, Empty } from "antd";

import {
    RiBriefcaseLine,
    RiGroupLine,
    RiEyeLine,
    RiHeartLine,
    RiImage2Line,
    RiStarLine,
    RiHeart3Line,
    RiChat3Line,
    RiShareForwardLine,
    RiCalendar2Line
} from "@remixicon/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";


const { Option } = Select;

const EMPTY_PLATFORMS = [
    { platform: "Instagram", views: 0, percentage: 0, color: "#E5E7EB" },
    { platform: "Facebook", views: 0, percentage: 0, color: "#E5E7EB" },
    { platform: "YouTube", views: 0, percentage: 0, color: "#E5E7EB" },
];

// -------------------------
// Brand Dashboard Component
// -------------------------
const BrandAnalyticsDashboard = () => {

    const { token } = useSelector((state) => state.auth);

    const [campaignFilter, setCampaignFilter] = useState("year");
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [summaryFilter, setSummaryFilter] = useState("year");

    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);


    const [kpis, setKpis] = useState([]);
    const [recentContent, setRecentContent] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [campaignList, setCampaignList] = useState([])
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);
    const [campaignLoading, setCampaignLoading] = useState(false);


    const [platforms, setPlatforms] = useState([]);
    const [platformLoading, setPlatformLoading] = useState(false);


    const currentYear = new Date().getFullYear();

    const yearOptions = Array.from(
        { length: 5 },
        (_, i) => currentYear - 2 + i
    );

    const fetchAnalyticsSummary = async () => {
        const res = await axios.get("vendor/analytics/summary", {
            params: {
                p_year: year,
                p_month: summaryFilter === "month" ? month : null,
            },
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.data;
        if (!data) return;

        setKpis([
            { label: "Total Campaigns", value: data.totalcampaigncount, icon: <RiBriefcaseLine size={24} /> },
            { label: "Active Influencers", value: data.totalactiveinfluencercount, icon: <RiGroupLine size={24} /> },
            { label: "Estimated Impressions", value: data.estimatedimpression, icon: <RiEyeLine size={24} /> },
            { label: "Estimated Engagement Score", value: data.engagementscore, icon: <RiHeartLine size={24} /> },
            { label: "Total Content Pieces", value: data.totalcontentpieces, icon: <RiImage2Line size={24} /> },
            { label: "Avg Engagement / Influencer", value: Math.round(data.averageengagementperinfluencer), icon: <RiStarLine size={24} /> },
        ].filter(kpi => Number(kpi.value) > 0));

        setRecentContent(data.recentcontents || []);
    };

    useEffect(() => {
        fetchAnalyticsSummary();
    }, [summaryFilter, year, month]);

    const fetchPlatformBreakdown = async () => {
        setPlatformLoading(true);

        try {
            const res = await axios.get("vendor/analytics/platform-breakdown", {
                params: {
                    p_year: selectedYear,
                    p_month: selectedMonth,
                },
                headers: { Authorization: `Bearer ${token}` },
            });

            const apiData = res?.data?.data || [];

            setPlatforms(
                apiData.map(item => ({
                    platform: item?.providername ?? "Unknown",
                    views: Number(item?.totallikes) || 0,
                    percentage: Number(item?.percentage) || 0,
                    icon: item?.providericonpath ?? "",
                    color: "#0D132D",
                }))
            );
        } catch (err) {
            console.error("Platform breakdown error:", err);
            setPlatforms([]);
        } finally {
            setPlatformLoading(false);
        }
    };

    useEffect(() => {
        fetchPlatformBreakdown();
    }, [selectedMonth, selectedYear]);

    const fetchCampaignOverview = async () => {
        setCampaignLoading(true);

        try {
            const res = await axios.get("vendor/analytics/campaign-overview", {
                params: { p_filtertype: campaignFilter },
                headers: { Authorization: `Bearer ${token}` },
            });

            setCampaigns(res.data?.data || []);
        } catch (err) {
            console.error(err);
            setCampaigns([]);
        } finally {
            setCampaignLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaignOverview();
    }, [campaignFilter]);


    const fetchCampaignList = async () => {
        try {
            const res = await axios.get("/vendor/analytics/campaign-list", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const campaigns = res?.data?.data || [];
            setCampaignList(campaigns);

            // ✅ Auto-select first campaign if none selected
            if (campaigns.length > 0 && !selectedCampaignId) {
                setSelectedCampaignId(campaigns[0].campaignid);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCampaignList();
    }, [token]);


    const hasPlatformData = platforms.length > 0;
    const displayPlatforms = hasPlatformData ? platforms : EMPTY_PLATFORMS;

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
                    <div key={idx} className="bg-white rounded-2xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0B132B]">
                            <div className="text-white">{kpi.icon}</div>
                        </div>

                        <div>
                            <p className="text-gray-500 font-semibold">{kpi.label}</p>
                            <p className="text-[#0D132D] font-bold text-xl">
                                {typeof kpi.value === "number"
                                    ? kpi.value.toLocaleString()
                                    : kpi.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ------------------------- */}
            {/* Campaign Table */}
            {/* ------------------------- */}
            <div className="bg-white rounded-2xl p-5  overflow-x-auto ">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 w-full">
                    {/* Heading */}
                    <h2 className="text-xl font-bold">Campaign Overview</h2>

                    {/* Filter */}
                    <div className="flex justify-end w-full sm:w-auto">
                        <Select value={campaignFilter} onChange={setCampaignFilter} style={{ width: 120 }}>
                            <Option value="week">Week</Option>
                            <Option value="month">Month</Option>
                            <Option value="year">Year</Option>
                        </Select>
                    </div>
                </div>

                <table className="min-w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-300">
                            <th className="py-2 px-3 text-gray-900 text-md">Campaign</th>
                            <th className="py-2 px-3 text-gray-900 text-md">Platform</th>
                            <th className="py-2 px-3 text-gray-900 text-md">Views</th>
                            <th className="py-2 px-3 text-gray-900 text-md">Engagement</th>
                            <th className="py-2 px-3 text-gray-900 text-md">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 🔄 Loading State */}
                        {campaignLoading && (
                            [...Array(5)].map((_, idx) => (
                                <tr key={idx} className="border-b border-gray-200">
                                    <td colSpan={5} className="py-3 px-3">
                                        <Skeleton
                                            active
                                            paragraph={{ rows: 1 }}
                                            title={false}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}

                        {/* 📭 Empty State */}
                        {!campaignLoading && campaigns.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-12">
                                    <div className="flex justify-center w-full">
                                        <Empty
                                            description="No campaigns found"
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        />
                                    </div>
                                </td>

                            </tr>
                        )}


                        {/* ✅ Data State */}
                        {!campaignLoading && campaigns.length > 0 &&
                            campaigns.map((c) => (
                                <tr
                                    key={c.campaignid}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                    {/* Campaign Name */}
                                    <td className="py-2 px-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {/* Campaign Image */}
                                            {c.campaignphoto ? (
                                                <img
                                                    src={c.campaignphoto}
                                                    alt={c.campaignname}
                                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                                                    onError={(e) => {
                                                        e.target.src = "/Brocken-Defualt-Img.jpg";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                                                    N/A
                                                </div>
                                            )}

                                            {/* Campaign Name */}
                                            <span
                                                className="
                text-[#0D132D] font-medium
                truncate sm:whitespace-normal
                max-w-[140px] sm:max-w-none
            "
                                            >
                                                {c.campaignname}
                                            </span>
                                        </div>
                                    </td>



                                    {/* Platforms */}
                                    <td className="py-2 px-3">
                                        {c.providers?.length
                                            ? c.providers.map(p => p.providername).join(", ")
                                            : "-"}
                                    </td>

                                    {/* Views */}
                                    <td className="py-2 px-3">
                                        {c.totalviews?.toLocaleString()}
                                    </td>

                                    {/* Engagement */}
                                    <td className="py-2 px-3">
                                        {c.totalengagement?.toLocaleString()}
                                    </td>

                                    {/* Status */}
                                    <td className="py-2 px-3 whitespace-nowrap">
                                        <span
                                            className={`
            inline-flex items-center justify-center
            px-2 py-1 rounded-full text-xs font-medium
            max-w-[90px] sm:max-w-none truncate
            ${c.statusname === "Published"
                                                    ? "bg-green-100 text-green-700"
                                                    : c.statusname === "In Progress"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-gray-100 text-gray-600"
                                                }
        `}
                                            title={c.statusname}
                                        >
                                            {c.statusname}
                                        </span>
                                    </td>

                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {/* ------------------------- */}
            {/* Charts */}
            {/* ------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Performance Chart */}
                <div className="bg-white rounded-2xl p-5 ">
                    <PerformanceChart />
                </div>

                {/* Top Content */}
                <div className="bg-white rounded-2xl p-5 ">
                    <TopContentChart />
                </div>
            </div>

            {/* ------------------------- */}
            {/* Platform Breakdown */}
            {/* ------------------------- */}
            <div className="bg-white rounded-2xl p-5 ">

                {/* HEADER ROW */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                    <h2 className="text-lg font-bold">Platform Breakdown</h2>

                    <div className="flex justify-end gap-2 w-full sm:w-auto">
                        {/* Month Dropdown */}
                        <Select
                            value={selectedMonth}
                            onChange={setSelectedMonth}
                            className="w-32"
                            size="large"
                        >
                            <Option value={1}>January</Option>
                            <Option value={2}>February</Option>
                            <Option value={3}>March</Option>
                            <Option value={4}>April</Option>
                            <Option value={5}>May</Option>
                            <Option value={6}>June</Option>
                            <Option value={7}>July</Option>
                            <Option value={8}>August</Option>
                            <Option value={9}>September</Option>
                            <Option value={10}>October</Option>
                            <Option value={11}>November</Option>
                            <Option value={12}>December</Option>
                        </Select>

                        {/* Year Dropdown */}
                        <Select
                            value={selectedYear}
                            onChange={setSelectedYear}
                            className="w-24"
                            size="large"
                        >
                            {yearOptions.map((y) => (
                                <Option key={y} value={y}>
                                    {y}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* PLATFORM BARS */}
                <div className="space-y-4">

                    {/* Loading State */}
                    {platformLoading && (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <Skeleton
                                    key={i}
                                    active
                                    paragraph={{ rows: 1 }}
                                />
                            ))}
                        </div>
                    )}
                    {/* Data State */}
                    {!platformLoading && (() => {
                        const maxViews = Math.max(
                            ...displayPlatforms.map(p => p.views || 0),
                            1
                        );

                        return displayPlatforms.map((p, idx) => (
                            <div key={idx} className="flex items-center space-x-3">

                                {/* Icon */}
                                {p.icon ? (
                                    <img
                                        src={p.icon}
                                        alt={p.platform}
                                        className="w-6 h-6"
                                        onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                    />
                                ) : (
                                    <div className="w-6 h-6 bg-gray-300 rounded-full" />
                                )}

                                {/* Name */}
                                <p className="w-20 text-sm text-gray-700 truncate">
                                    {p.platform}
                                </p>

                                {/* Bar */}
                                <div
                                    className={`flex-1 h-3 rounded-full relative ${hasPlatformData ? "bg-transparent" : "bg-gray-200"
                                        }`}
                                >
                                    <Tooltip
                                        placement="top"
                                        title={
                                            <div className="text-sm">
                                                <p><strong>{p.platform}</strong></p>
                                                <p>Likes: {p.views.toLocaleString()}</p>
                                                <p>Percentage: {p.percentage.toFixed(2)}%</p>
                                            </div>
                                        }
                                    >
                                        <div
                                            className="h-3 rounded-full transition-all"
                                            style={{
                                                width: `${(p.views / maxViews) * 100}%`,
                                                backgroundColor: hasPlatformData ? p.color : "#fff",
                                            }}
                                        />
                                    </Tooltip>
                                </div>

                                {/* Value */}
                                <p className="w-16 text-sm font-bold text-gray-800 text-right">
                                    {p.views >= 1000
                                        ? `${(p.views / 1000).toFixed(1)}k`
                                        : p.views}
                                </p>
                            </div>
                        ));
                    })()}


                </div>

            </div>

            {/* ------------------------- */}
            {/* Campaign Wise Analytics */}
            {/* ------------------------- */}
            <div className="bg-white rounded-2xl p-5 w-full  mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                    {/* Heading */}
                    <h2 className="text-lg font-bold text-gray-900">Campaign Insights</h2>

                    {/* Select */}
                    <div className="flex justify-end w-full sm:w-auto">
                        <Select
                            className="w-64"
                            placeholder="Select Campaign"
                            value={selectedCampaignId}
                            onChange={(value) => setSelectedCampaignId(value)}
                        >
                            {campaignList.map((campaign) => (
                                <Option key={campaign.campaignid} value={campaign.campaignid}>
                                    {campaign.campaignname}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>


                <div className="mt-5">
                    <CampaignAnalytics selectedCampaignId={selectedCampaignId} />
                </div>
            </div>

            {/* ------------------------- */}
            {/* Recent Content */}
            {/* ------------------------- */}
            <div className="bg-white rounded-2xl p-5">
                <h2 className="text-lg font-bold mb-4">Recent Content</h2>

                {recentContent.length === 0 ? (
                    <div className="py-10">
                        <Empty
                            description="No recent content available"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </div>
                ) : (

                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={20}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        style={{
                            paddingBottom: "32px",                 // space for bullets
                            "--swiper-pagination-bottom": "0px",   // push bullets down
                        }}
                        breakpoints={{
                            320: {
                                slidesPerView: 1,
                            },
                            640: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                            1280: {
                                slidesPerView: 4,
                            },
                        }}
                    >
                        {recentContent.map((c) => (
                            <SwiperSlide key={c.userplatformanalyticid}>
                                <div
                                    role={c.link ? "button" : undefined}
                                    tabIndex={c.link ? 0 : -1}
                                    onClick={() =>
                                        c.link && window.open(c.link, "_blank", "noopener,noreferrer")
                                    }
                                    onKeyDown={(e) => {
                                        if (c.link && (e.key === "Enter" || e.key === " ")) {
                                            window.open(c.link, "_blank", "noopener,noreferrer");
                                        }
                                    }}
                                    className={`group bg-[#335CFF0D] border border-[#335CFF26] rounded-2xl p-4 flex flex-col h-full transition-shadow duration-200
          ${c.link ? "cursor-pointer hover:shadow-md" : "cursor-default"}`}
                                >
                                    {/* Top row */}
                                    <div className="flex items-center justify-between mb-2 gap-2">
                                        <span className="text-xs font-semibold px-2 py-1 rounded-full border border-gray-300 whitespace-nowrap truncate max-w-[70%]">
                                            {c.providername ?? "Unknown"} / {c.contenttypname ?? "-"}
                                        </span>

                                        <span className="flex items-center gap-1 text-xs text-[#335CFF] whitespace-nowrap">
                                            <RiCalendar2Line size={14} />
                                            {c.postdate ?? "-"}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <p className="text-sm text-gray-800 my-3 line-clamp-2 min-h-[3rem]">
                                        {c.title || c.caption || "No caption available"}
                                    </p>

                                    <div className="mt-auto">
                                        {/* Views */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <RiEyeLine className="text-gray-700" size={18} />
                                            <span className="text-lg font-bold text-gray-900">
                                                {(c.views ?? 0).toLocaleString()}
                                            </span>
                                            <span className="text-sm text-gray-500">views</span>
                                        </div>

                                        {/* Engagement */}
                                        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <RiHeart3Line className="text-red-500" size={14} />
                                                {(c.likes ?? 0).toLocaleString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <RiChat3Line className="text-blue-500" size={14} />
                                                {(c.comments ?? 0).toLocaleString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <RiShareForwardLine className="text-green-500" size={14} />
                                                {(c.shares ?? 0).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                )}
            </div>

        </div>
    );
};

export default BrandAnalyticsDashboard;
