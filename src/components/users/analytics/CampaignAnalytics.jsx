import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Empty, Skeleton } from "antd";


import PerformanceChart from "./PerformanceChart";
import EngagementGauge from "./EngagementGauge";
import TopContentChart from "./TopContentChart";


import {
    RiEyeLine,
    RiHeartLine,
    RiChat1Line,
    RiShareForwardLine,
} from "react-icons/ri";

const KPI_CONFIG = {
    views: {
        icon: RiEyeLine,
        iconColor: "text-blue-600",
        bgColor: "bg-blue-100",
    },
    likes: {
        icon: RiHeartLine,
        iconColor: "text-rose-500",
        bgColor: "bg-rose-100",
    },
    comments: {
        icon: RiChat1Line,
        iconColor: "text-emerald-600",
        bgColor: "bg-emerald-100",
    },
    shares: {
        icon: RiShareForwardLine,
        iconColor: "text-amber-500",
        bgColor: "bg-amber-100",
    },
};


/* ------------------------------------
   Component
------------------------------------- */
const CampaignAnalytics = ({ selectedCampaignId }) => {
    const { token } = useSelector((state) => state.auth);

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);

    /* ------------------------------------
       Fetch Campaign Summary
    ------------------------------------- */
    useEffect(() => {
        if (!selectedCampaignId || !token) return;

        const fetchCampaignSummary = async () => {
            try {
                setLoading(true);

                const res = await axios.get("/user/analytics/campaign-insight", {
                    params: { p_campaignid: selectedCampaignId },
                    headers: { Authorization: `Bearer ${token}` },
                });

                setSummary(res?.data?.data || null);
            } catch (err) {
                console.error("Campaign summary error:", err);
                setSummary(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaignSummary();
    }, [selectedCampaignId, token]);

    /* ------------------------------------
       KPI Config (Memoized)
    ------------------------------------- */
    const kpis = useMemo(() => {
        if (!summary) return [];

        return [
            { key: "views", label: "Total Views", value: summary.totalviews },
            { key: "likes", label: "Likes", value: summary.totallikes },
            { key: "comments", label: "Comments", value: summary.totalcomments },
            { key: "shares", label: "Shares", value: summary.totalshares },
        ];
    }, [summary]);

    /* ------------------------------------
       NO CAMPAIGN SELECTED
    ------------------------------------- */
    if (!selectedCampaignId) {
        return (
            <div className="bg-white rounded-2xl p-10 shadow-sm">
                <Empty
                    description="Please select a campaign to view analytics"
                />
            </div>
        );
    }

    /* ------------------------------------
       LOADING STATE
    ------------------------------------- */
    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <Skeleton active paragraph={{ rows: 6 }} />
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            {/* ---------------- KPI CARDS ---------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi) => (
                    <StatCard
                        key={kpi.key}
                        label={kpi.label}
                        value={kpi.value}
                        iconKey={kpi.key}
                    />
                ))}

            </div>

            {/* ---------------- PERFORMANCE CHART ---------------- */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">

                <div className="w-full h-64 sm:h-72 md:h-80">
                    <PerformanceChart campaignId={selectedCampaignId} />
                </div>
            </div>

            {/* ---------------- ENGAGEMENT + TOP CONTENT ---------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <EngagementGauge campaignId={selectedCampaignId} />
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <TopContentChart campaignId={selectedCampaignId} />
                </div>
            </div>
        </div>
    );
};

export default CampaignAnalytics;

/* ------------------------------------
   Stat Card (Safe Icon Rendering)
------------------------------------- */
const StatCard = ({ label, value, iconKey }) => {
    const config = KPI_CONFIG[iconKey];
    const Icon = config?.icon;

    return (
        <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${config?.bgColor || "bg-gray-100"
                    }`}
            >
                {Icon ? (
                    <Icon
                        size={20}
                        className={config?.iconColor || "text-gray-500"}
                    />
                ) : null}
            </div>

            <div>
                <p className="text-gray-500 text-xs">{label}</p>
                <p className="text-lg font-bold text-[#0D132D]">
                    {typeof value === "number" ? value.toLocaleString() : 0}
                </p>
            </div>
        </div>
    );
};

