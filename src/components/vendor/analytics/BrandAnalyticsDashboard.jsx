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


// -------------------------
// Brand Dashboard Component
// -------------------------
const BrandAnalyticsDashboard = () => {

    const { token } = useSelector((state) => state.auth);

    const [campaignFilter, setCampaignFilter] = useState("month");
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [summaryFilter, setSummaryFilter] = useState("month");

    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [platforms, setPlatforms] = useState([]);

    const [kpis, setKpis] = useState([]);
    const [recentContent, setRecentContent] = useState([]);
    const [campaigns, setCampaigns] = useState([]);

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
            { label: "Total Impressions", value: data.totalimpression, icon: <RiEyeLine size={28} /> },
            { label: "Engagement Rate", value: `${data.engagementrate}%`, icon: <RiHeartLine size={28} /> },
            { label: "Total Content Pieces", value: data.totalcontentpieces, icon: <RiImage2Line size={28} /> },
            { label: "Avg Engagement / Influencer", value: Math.round(data.averageengagementperinfluencer), icon: <RiStarLine size={28} /> },
        ]);

        setRecentContent(data.recentcontents || []);
    };

    useEffect(() => {
        fetchAnalyticsSummary();
    }, [summaryFilter, year, month]);

    const fetchPlatformBreakdown = async () => {
        try {
            const res = await axios.get("vendor/analytics/platform-breakdown", {
                params: {
                    p_year: selectedYear,
                    p_month: selectedMonth,
                },
                headers: { Authorization: `Bearer ${token}` },
            });

            const apiData = res.data?.data || [];

            setPlatforms(
                apiData.map(item => ({
                    platform: item.providername,
                    views: item.totallikes,
                    percentage: item.percentage,
                    icon: item.providericonpath,
                    color: "#0D132D",
                }))
            );
        } catch (err) {
            console.error("Platform breakdown error:", err);
        }
    };

    useEffect(() => {
        fetchPlatformBreakdown();
    }, [selectedMonth, selectedYear]);

    const fetchCampaignOverview = async () => {
        const res = await axios.get("vendor/analytics/campaign-overview", {
            params: { p_filtertype: campaignFilter },
            headers: { Authorization: `Bearer ${token}` },
        });

        setCampaigns(res.data?.data || []);
    };

    useEffect(() => {
        fetchCampaignOverview();
    }, [campaignFilter]);


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
                    <div key={idx} className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
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
            <div className="bg-white rounded-2xl p-5 shadow-sm overflow-x-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Campaign Overview</h2>

                    <div className="flex items-center gap-2">

                        <Select value={campaignFilter} onChange={setCampaignFilter}>
                            <Option value="week">Week</Option>
                            <Option value="month">Month</Option>
                            <Option value="year">Year</Option>
                        </Select>

                    </div>
                </div>
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
                        {campaigns.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-4 text-center text-gray-500">
                                    No campaigns found
                                </td>
                            </tr>
                        ) : (
                            campaigns.map((c) => (
                                <tr
                                    key={c.campaignid}
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    {/* Campaign Name */}
                                    <td className="py-2 px-3 font-medium text-[#0D132D]">
                                        {c.campaignname}
                                    </td>

                                    {/* Platforms (from providers array) */}
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
                        )}
                    </tbody>
                </table>
            </div>

            {/* ------------------------- */}
            {/* Charts */}
            {/* ------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Performance Chart */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <PerformanceChart />
                </div>

                {/* Top Content */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
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
                    {recentContent.map((c, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl p-4 shadow-sm">
                            <p className="text-xs text-gray-500">
                                {c.providername} • {c.contenttypname}
                            </p>

                            <p className="text-sm font-semibold text-gray-800">
                                Posted on {c.postdate}
                            </p>

                            {(c.title || c.caption) && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {c.title || c.caption}
                                </p>
                            )}

                            <div className="flex justify-between mt-3 text-sm font-medium text-gray-800">
                                <p>👁 {c.views.toLocaleString()}</p>
                                <p>❤️ {c.likes.toLocaleString()}</p>
                                <p>💬 {c.comments.toLocaleString()}</p>
                                <p>🔁 {c.shares.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrandAnalyticsDashboard;
