import {
  RiCheckLine,
  RiExchange2Line,
  RiStackLine,
  RiArrowUpLine,
  RiArrowDownLine,
} from "@remixicon/react";

import PerformanceChart from "./PerformanceChart";
import ImpressionInsights from "./ImpressionInsights";
import EngagementGauge from "./EngagementGauge";
import TopContentChart from "./TopContentChart";
import CampaignAnalytics from "./CampaignAnalytics";
import Audience from "./Audience";
import Table from "./Table";
import { PlatformBreakdown } from "./PlatformBreakdown";
import { CampaignContribution } from "./CampaignContribution";

const AnalyticsLayout = () => {
  /** -------------------------
   * STATIC KPI + CHART DATA
   --------------------------*/
  const globalStats = [
    {
      label: "Total Views",
      value: "152,930",
      change: "12%",
      isPositive: true,
      icon: <RiStackLine size={20} />,
    },
    {
      label: "Total Likes",
      value: "12,483",
      change: "5%",
      isPositive: true,
      icon: <RiExchange2Line size={20} />,
    },
    {
      label: "Total Comments",
      value: "1,394",
      change: "2%",
      isPositive: false,
      icon: <RiCheckLine size={20} />,
    },
    {
      label: "Total Shares",
      value: "832",
      change: "4%",
      isPositive: true,
      icon: <RiStackLine size={20} />,
    },
    {
      label: "Content Pieces",
      value: "14",
      change: "25%",
      isPositive: true,
      icon: <RiCheckLine size={20} />,
    },
    {
      label: "Avg Engagement Rate",
      value: "4.3%",
      change: "1.8%",
      isPositive: true,
      icon: <RiExchange2Line size={20} />,
    },
  ];



  const campaignList = [
    "GlowSkincare Launch",
    "FitPro Campaign",
    "Clothify Drops",
  ];

  const contentList = [
    {
      platform: "Instagram",
      type: "Reel",
      date: "12 Feb 2025",
      caption: "Trying the new Glow Serum…",
      views: 12593,
      likes: 1204,
      comments: 82,
      thumbnail:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    },
    {
      platform: "TikTok",
      type: "Video",
      date: "8 Feb 2025",
      caption: "Unboxing the new FitPro pack!",
      views: 30021,
      likes: 3100,
      comments: 210,
      thumbnail:
        "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
    },
  ];

  return (
    <div className="w-full text-sm overflow-x-hidden">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">
        Analytics Dashboard
      </h2>
      <p className="mb-6 text-gray-600 text-sm">
        View your overall performance and content insights.
      </p>

      {/* 🌟 GLOBAL KPIs ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {globalStats.map(({ label, value, change, isPositive, icon }, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl shadow-sm  flex items-center space-x-4"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0D132D] text-white">
              {icon}
            </div>

            <div className="flex flex-col">
              <p className="text-xs text-gray-500">{label}</p>

              <div className="flex items-center space-x-2">
                <p className="text-lg font-bold text-[#0D132D]">{value}</p>
                <span
                  className={`flex items-center text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"
                    }`}
                >
                  {isPositive ? (
                    <RiArrowUpLine size={14} />
                  ) : (
                    <RiArrowDownLine size={14} />
                  )}
                  {change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <PlatformBreakdown />
        <CampaignContribution />
      </div>


      {/* 📊 CHARTS (Line + Bar + Gauge) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-5">
        {/* Performance Line Chart */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-2xl p-5 shadow-sm ">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Performance Over Time
          </h2>
          <PerformanceChart />
        </div>

        {/* Gauge Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-center">
          <EngagementGauge
            views={152930}
            likes={12483}
            comments={1394}
            shares={832}
          />
        </div>

        {/* Impression Chart */}
        <div className="col-span-1 md:col-span-3 bg-white rounded-2xl p-5 mt-4 shadow-sm ">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Impression Insights
          </h2>
          <ImpressionInsights />
        </div>
      </div>

      {/* 🎯 CAMPAIGN INSIGHTS */}
      <div className="bg-white rounded-2xl p-5 w-full shadow-sm mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Campaign Insights</h2>

          <select className=" rounded-full px-3 py-1.5 text-sm text-gray-600 focus:outline-none">
            {campaignList.map((item, i) => (
              <option key={i}>{item}</option>
            ))}
          </select>
        </div>

        <div className="mt-5">
          <CampaignAnalytics />
        </div>
      </div>

      

      {/* 🔥 Top Content (Replaced with Chart) */}
      <div className="bg-white p-5 rounded-2xl shadow-sm mt-6">
        <TopContentChart />
      </div>

      {/* 🖼 Content Cards */}
      <div className="bg-white rounded-2xl p-5 w-full shadow-sm mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Content</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {contentList.map((post, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <img
                src={post.thumbnail}
                alt="Thumbnail"
                className="w-full h-40 object-cover rounded-lg mb-3"
              />

              <p className="text-xs text-gray-500">
                {post.platform} • {post.type}
              </p>

              <p className="text-sm font-semibold text-gray-800">
                Posted on {post.date}
              </p>

              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {post.caption}
              </p>

              <div className="flex justify-between mt-3 text-sm font-medium text-gray-800">
                <p>👁 {post.views.toLocaleString()}</p>
                <p>❤️ {post.likes.toLocaleString()}</p>
                <p>💬 {post.comments.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
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
