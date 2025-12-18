import { useEffect, useMemo, useCallback, useState } from "react";
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

/* ------------------------------------
   KPI CONFIG
------------------------------------- */
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
   ROLE BASED ENDPOINTS
------------------------------------- */
const ENDPOINT_BY_ROLE = {
  2: "/vendor/analytics/campaign-insight",
  1: "/user/analytics/campaign-insight",
};

/* ------------------------------------
   HELPERS
------------------------------------- */
const toNumber = (val) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : 0;
};

/* ------------------------------------
   COMPONENT
------------------------------------- */
const CampaignAnalytics = ({ selectedCampaignId }) => {
  const { token, role } = useSelector((state) => state.auth);

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ------------------------------------
     Resolve Endpoint
  ------------------------------------- */
  const getEndpoint = useCallback(() => {
    return ENDPOINT_BY_ROLE[role];
  }, [role]);

  /* ------------------------------------
     Fetch Campaign Summary
  ------------------------------------- */
  const fetchCampaignSummary = useCallback(async () => {
    if (!selectedCampaignId || !token || !role) {
      setSummary(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    try {
      const endpoint = getEndpoint();
      if (!endpoint) return;

      const res = await axios.get(endpoint, {
        params: { p_campaignid: selectedCampaignId },
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });

      setSummary(res?.data?.data ?? null);
    } catch (err) {
      if (err.name !== "CanceledError") {
        console.error("Campaign summary error:", err);
        setSummary(null);
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [selectedCampaignId, token, role, getEndpoint]);

  useEffect(() => {
    fetchCampaignSummary();
  }, [fetchCampaignSummary]);

  /* ------------------------------------
     KPI DATA (MEMOIZED)
  ------------------------------------- */
  const kpis = useMemo(() => {
    if (!summary) return [];

    return [
      { key: "views", label: "Total Views", value: toNumber(summary.totalviews) },
      { key: "likes", label: "Likes", value: toNumber(summary.totallikes) },
      {
        key: "comments",
        label: "Comments",
        value: toNumber(summary.totalcomments),
      },
      {
        key: "shares",
        label: "Shares",
        value: toNumber(summary.totalshares),
      },
    ];
  }, [summary]);

  const isEmpty = !loading && !summary;

  /* ------------------------------------
     NO CAMPAIGN SELECTED
  ------------------------------------- */
  if (!selectedCampaignId) {
    return (
      <div className="bg-white rounded-2xl p-10 shadow-sm">
        <Empty description="Please select a campaign to view analytics" />
      </div>
    );
  }

  /* ------------------------------------
     LOADING
  ------------------------------------- */
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  /* ------------------------------------
     EMPTY
  ------------------------------------- */
  if (isEmpty) {
    return (
      <div className="bg-white rounded-2xl p-10 shadow-sm">
        <Empty description="No analytics available for this campaign" />
      </div>
    );
  }

  /* ------------------------------------
     RENDER
  ------------------------------------- */
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
   STAT CARD
------------------------------------- */
const StatCard = ({ label, value, iconKey }) => {
  const config = KPI_CONFIG[iconKey];
  const Icon = config?.icon;

  return (
    <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full ${
          config?.bgColor || "bg-gray-100"
        }`}
      >
        {Icon && (
          <Icon
            size={20}
            className={config?.iconColor || "text-gray-500"}
          />
        )}
      </div>

      <div>
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="text-lg font-bold text-[#0D132D]">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
};
