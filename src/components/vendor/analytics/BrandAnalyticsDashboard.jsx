import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import PerformanceChart from "../../users/analytics/PerformanceChart";
import TopContentChart from "../../users/analytics/TopContentChart";
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
    RiShareForwardLine
} from "@remixicon/react";
import CampaignAnalytics from "../../users/analytics/CampaignAnalytics";

const { Option } = Select;


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
            { label: "Total Campaigns", value: data.totalcampaigncount, icon: <RiBriefcaseLine size={28} /> },
            { label: "Active Influencers", value: data.totalactiveinfluencercount, icon: <RiGroupLine size={28} /> },
            { label: "Estimated Impressions", value: data.estimatedimpression, icon: <RiEyeLine size={28} /> },
            { label: "Estimated Engagement Score", value: data.engagementscore, icon: <RiHeartLine size={28} /> },
            { label: "Total Content Pieces", value: data.totalcontentpieces, icon: <RiImage2Line size={28} /> },
            { label: "Avg Engagement / Influencer", value: Math.round(data.averageengagementperinfluencer), icon: <RiStarLine size={28} /> },
        ]);

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
            setCampaignList(res?.data?.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCampaignList();
    }, [token]);



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
                    <div key={idx} className="bg-white rounded-2xl  p-4 flex items-center gap-4">
                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#0B132B]">
                            <div className="text-white">{kpi.icon}</div>
                        </div>

                        <div>
                            <p className="text-gray-500">{kpi.label}</p>
                            <p className="text-[#0D132D] font-bold text-3xl">
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
            <div className="bg-white rounded-2xl p-5  overflow-x-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Campaign Overview</h2>

                    <Select value={campaignFilter} onChange={setCampaignFilter} style={{ width: 120 }}>
                        <Option value="week">Week</Option>
                        <Option value="month">Month</Option>
                        <Option value="year">Year</Option>
                    </Select>
                </div>
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
                                    <Empty description="No campaigns found" />
                                </div>
                            </td>

                        </tr>
                    )}


                    {/* ✅ Data State */}
                    {!campaignLoading && campaigns.length > 0 &&
                        campaigns.map((c) => (
                            <tr
                                key={c.campaignid}
                                className="border-b border-gray-200 hover:bg-gray-50"
                            >
                                {/* Campaign Name */}
                                <td className="py-2 px-3 font-medium text-[#0D132D]">
                                    {c.campaignname}
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
                                <td className="py-2 px-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium
                        ${c.statusname === "Published"
                                                ? "bg-green-100 text-green-700"
                                                : c.statusname === "InProgress"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {c.statusname}
                                    </span>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>

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
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Platform Breakdown</h2>

                    <div className="flex items-center gap-2">
                        {/* Month Dropdown */}
                        <Select
                            value={selectedMonth}
                            onChange={setSelectedMonth}
                            className="w-[120px]"
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
                            className="w-[100px]"
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

                    {/* Empty State */}
                    {!platformLoading && platforms.length === 0 && (
                        <Empty
                            description="No platform data available"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    )}

                    {/* Data State */}
                    {!platformLoading && platforms.length > 0 && (() => {
                        const maxViews = Math.max(...platforms.map(p => p.views || 0), 1);

                        return platforms.map((p, idx) => (
                            <div key={idx} className="flex items-center space-x-3">

                                {/* Icon */}
                                {p.icon ? (
                                    <img src={p.icon} alt={p.platform} className="w-6 h-6" />
                                ) : (
                                    <div className="w-6 h-6 bg-gray-300 rounded-full" />
                                )}

                                {/* Name */}
                                <p className="w-20 text-sm text-gray-700 truncate">
                                    {p.platform}
                                </p>

                                {/* Bar */}
                                <div className="flex-1 bg-gray-200 h-3 rounded-full relative">
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
                                            className="h-3 rounded-full cursor-pointer transition-all"
                                            style={{
                                                width: `${(p.views / maxViews) * 100}%`,
                                                backgroundColor: p.color,
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
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Campaign Insights</h2>

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

                <div className="mt-5">
                    <CampaignAnalytics selectedCampaignId={selectedCampaignId} />
                </div>
            </div>

            {/* ------------------------- */}
            {/* Recent Content */}
            {/* ------------------------- */}
            <div className="bg-white rounded-2xl p-5 ">
                <h2 className="text-lg font-bold mb-4">Recent Content</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {recentContent.map((c, idx) => (
                        <div
                            key={idx}
                            className="group bg-gray-200 rounded-2xl p-4  hover:shadow-md transition-shadow duration-200"
                        >
                            {/* Top row: Provider + Date */}
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                                    {c.providername}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {c.postdate}
                                </span>
                            </div>

                            {/* Content Type */}
                            <p className="text-xs text-gray-500 mb-2">
                                {c.contenttypname}
                            </p>

                            {/* Title / Caption */}
                            {(c.title || c.caption) && (
                                <p className="text-sm font-semibold text-gray-800 mb-3 
                line-clamp-2 min-h-[2.5rem]">
                                    {c.title || c.caption}
                                </p>
                            )}

                            <div className="mt-auto">
                                {/* Views */}
                                <div className="flex items-center gap-2 mb-2">
                                    <RiEyeLine className="text-gray-700" size={18} />
                                    <span className="text-lg font-bold text-gray-900">
                                        {c.views.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-gray-500">views</span>
                                </div>


                                {/* Engagement */}
                                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                                    <div className="flex items-center gap-1"> <RiHeart3Line className="text-red-500" size={14} /> {c.likes}</div>
                                    <div className="flex items-center gap-1"> <RiChat3Line className="text-blue-500" size={14} /> {c.comments}</div>
                                    <div className="flex items-center gap-1"><RiShareForwardLine className="text-green-500" size={14} /> {c.shares}</div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default BrandAnalyticsDashboard;
