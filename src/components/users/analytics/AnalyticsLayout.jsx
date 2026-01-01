import {
  RiHeart3Line,
  RiChat3Line,
  RiShareForwardLine,
  RiEyeLine,
  RiThumbUpLine,
  RiFileList3Line,
  RiBarChartLine,
} from "@remixicon/react";

import PerformanceChart from "./PerformanceChart";
import ImpressionInsights from "./ImpressionInsights";
import EngagementGauge from "./EngagementGauge";
import TopContentChart from "./TopContentChart";
import CampaignAnalytics from "./CampaignAnalytics";
import Audience from "./Audience";
import Table from "./Table";
import { PlatformBreakdown } from "./PlatformBreakdown";
import CampaignContribution from "./CampaignContribution";
import axios from "axios";
import { useSelector } from "react-redux";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Empty, Select, Skeleton } from "antd";
import { safeNumber } from "../../../App/safeAccess";


const KPISkeleton = memo(() => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, idx) => (
      <div
        key={idx}
        className="bg-white p-5 rounded-2xl shadow-sm flex items-center space-x-4"
      >
        <Skeleton.Avatar active size={48} shape="circle" />
        <div className="flex-1">
          <Skeleton
            active
            title={{ width: "60%" }}
            paragraph={{ rows: 1, width: "40%" }}
          />
        </div>
      </div>
    ))}
  </div>
));

const ContentSkeleton = () => (
  <div className="grid sm:grid-cols-2 gap-4">
    {Array.from({ length: 4 }).map((_, idx) => (
      <div key={idx} className="bg-gray-50 rounded-xl p-4 shadow-sm">
        <Skeleton.Image active className="w-full h-40 mb-3 rounded-lg" />
        <Skeleton active paragraph={{ rows: 2 }} />
      </div>
    ))}
  </div>
);



const AnalyticsLayout = () => {

  const [summary, setSummary] = useState(null);
  const [campaignList, setCampaignList] = useState([])
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  const [contentList, setContentList] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);


  const { token } = useSelector((state) => state.auth);

  const fetchAllCardsData = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get("/user/analytics/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSummary(res?.data?.data ?? {});
    } catch (error) {
      console.error(error);
      setSummary({});
    }
  }, [token]);

  useEffect(() => {
    fetchAllCardsData();
  }, [fetchAllCardsData]);

  const fetchRecentPostedContent = useCallback(async () => {
    if (!token) return;

    setContentLoading(true);
    try {
      const res = await axios.get("/user/analytics/campaign-recents", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setContentList(res?.data?.data || []);
    } catch (error) {
      console.error(error);
      setContentList([]);
    } finally {
      setContentLoading(false);
    }
  }, [token]);


  useEffect(() => {
    fetchRecentPostedContent();
  }, [fetchRecentPostedContent]);

  const globalStats = useMemo(() => {
    if (!summary) return [];

    return [
      {
        label: "Total Views",
        value: safeNumber(summary.totalviews),
        change: "0.0 %",
        isPositive: true,
        icon: <RiEyeLine size={24} />,
      },
      {
        label: "Total Likes",
        value: safeNumber(summary.totallikes),
        change: "0.0 %",
        isPositive: true,
        icon: <RiThumbUpLine size={24} />,
      },
      {
        label: "Total Comments",
        value: safeNumber(summary.totalcomments),
        change: "0.0 %",
        isPositive: true,
        icon: <RiChat3Line size={24} />,
      },
      {
        label: "Total Shares",
        value: safeNumber(summary.totalshares),
        change: "0.0 %",
        isPositive: true,
        icon: <RiShareForwardLine size={24} />,
      },
      {
        label: "Content Pieces",
        value: safeNumber(summary.totalcontentpiecescount),
        change: "0.0 %",
        isPositive: true,
        icon: <RiFileList3Line size={24} />,
      },
      {
        label: "Avg Engagement Rate",
        value: `${safeNumber(summary.avgengagementrate)}%`,
        change: "0.0 %",
        isPositive: true,
        icon: <RiBarChartLine size={24} />,
      },
    ];
  }, [summary]);




  const fetchCampaignList = async () => {
    try {
      const res = await axios.get("/user/analytics/campaign-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const campaigns = res?.data?.data || [];
      setCampaignList(campaigns);

      // ✅ Set default selected campaign
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



  return (
    <div className="w-full text-sm overflow-x-hidden">
      {/* <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Analytics Dashboard
        </h2>
        <p className="mb-6 text-gray-600 text-sm">
          View your overall performance and content insights.
        </p> */}

      {/* 🌟 GLOBAL KPIs ROW */}
      {!summary ? (
        <KPISkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {globalStats.map(({ label, value, change, isPositive, icon }, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl  flex items-center space-x-4"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0D132D] text-white">
                {icon}
              </div>

              <div className="flex flex-col">
                <p className="text-gray-500 font-semibold">{label}</p>

                <div className="flex items-center space-x-2">
                  <p className="text-xl font-bold text-[#0D132D]">{value}</p>
                  <span
                    className={`flex items-center text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}




      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-5">
        {/* PlatformBreakdown Line Chart */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-2xl">
          <PlatformBreakdown />
        </div>

        {/* Gauge Card */}
        <div className="bg-white rounded-2xl flex  justify-center">
          <EngagementGauge />
        </div>
      </div>


      {/* 📊 CHARTS (Line + Bar + Gauge) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-5">
        {/* Performance Line Chart */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-2xl p-5  ">
          <PerformanceChart />
        </div>

        {/* Gauge Card */}
        <div className="bg-white rounded-2xl flex  justify-center">
          <CampaignContribution />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* 🔥 Top Content (Replaced with Chart) */}
        <div className="bg-white p-5 rounded-2xl  ">
          <TopContentChart />
        </div>
        {/* Impression Chart */}
        <div className="bg-white p-5 rounded-2xl  ">
          <ImpressionInsights />
        </div>
      </div>



      {/* 🎯 CAMPAIGN INSIGHTS */}
      <div className="bg-white rounded-2xl p-5 w-full  mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-xl font-bold text-gray-900">Campaign Insights</h2>
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



      {/* 🎯 RECENT CONTENTS */}
      <div className="bg-white rounded-2xl p-5 mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Content</h2>

        {/* 🔄 Loading */}
        {contentLoading && <ContentSkeleton />}

        {/* 📭 Empty */}
        {!contentLoading && contentList.length === 0 && (
          <Empty
            description="No recent content available"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}

        {/* ✅ Data */}
        {!contentLoading && contentList.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {contentList.map((c) => (
              <div
                onClick={() => c.link && window.open(c.link, "_blank")}
                key={c.userplatformanalyticid}
                className="group bg-gray-200 rounded-2xl cursor-pointer p-4 hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                {/* Top row: Provider + Date */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-300 text-gray-700">
                    {c.providername ?? "Unknown"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {c.postdate ?? "-"}
                  </span>
                </div>

                {/* Content Type */}
                <p className="text-xs text-gray-500 mb-2">
                  {c.contenttypname ?? "-"}
                </p>

                {/* Title / Caption */}
                <p className="text-sm font-semibold text-gray-800 mb-3 line-clamp-2 min-h-[2.5rem]">
                  {c.title || c.caption || "No caption available"}
                </p>

                <div className="mt-auto">
                  {/* Views */}
                  <div className="flex items-center gap-2 mb-2">
                    <RiEyeLine className="text-gray-700" size={18} />
                    <span className="text-lg font-bold text-gray-900">
                      {(c.views ?? 0).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">views</span>
                  </div>

                  {/* Engagement */}
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
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
            ))}
          </div>
        )}
      </div>

      {/* 👥 Audience */}
      <div className="my-4">
        <Audience />
      </div>

      {/* Table */}
      <div className="my-6">
        <Table />
      </div>
    </div>
  );
};

export default AnalyticsLayout;
