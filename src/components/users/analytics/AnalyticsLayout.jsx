import {
  RiCheckLine,
  RiExchange2Line,
  RiStackLine,
  RiArrowUpLine,
  RiArrowDownLine,
} from '@remixicon/react';
import EarnChart from './EarnChart';
import ImpressionChart from './ImpressionChart';
import Audience from './Audience';
import TopContent from './TopContent';
import Table from './Table';

const AnalyticsLayout = ({ balance = 22765, thisMonth = 2765 }) => {
  const contentData = [
    { type: "Story", followers: 30, nonFollowers: 21.1 },
    { type: "Reel", followers: 25, nonFollowers: 26.1 },
    { type: "Video", followers: 40, nonFollowers: 11.1 },
    { type: "Short", followers: 10, nonFollowers: 41.1 },
  ];

  const stats = [
    {
      label: "Total Earnings",
      value: "$2,765",
      change: "78.3%",
      isPositive: true,
      icon: <RiStackLine size={20} />,
    },
    {
      label: "Campaigns Completed",
      value: "14",
      change: "25.6%",
      isPositive: false,
      icon: <RiExchange2Line size={20} />,
    },
    {
      label: "Proposals Sent",
      value: "125",
      change: "78.3%",
      isPositive: true,
      icon: <RiCheckLine size={20} />,
    },
  ];

  const followers = [
    {
      platform: "Instagram",
      username: "@instagramusername",
      count: "72.2k",
      icon: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
    },
    {
      platform: "YouTube",
      username: "@youtubeusername",
      count: "21.2k",
      icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
    },
    {
      platform: "Facebook",
      username: "@facebookusername",
      count: "25.2k",
      icon: "https://cdn-icons-png.flaticon.com/512/1384/1384053.png",
    },
    {
      platform: "Tiktok",
      username: "@tiktokusername",
      count: "1.2k",
      icon: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
    },
  ];

  return (
    <div className="w-full text-sm overflow-x-hidden">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h2>
      <p className="mb-6 text-gray-600 text-sm">
        You can view your analytics here
      </p>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, change, isPositive, icon }, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl flex items-center space-x-4"
          >
            {/* Circle Icon */}
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0D132D] text-white flex-shrink-0">
              {icon}
            </div>

            {/* Text Section */}
            <div className="flex flex-col">
              <p className="text-xs sm:text-sm text-gray-500">{label}</p>
              <div className="flex items-center space-x-2">
                <p className="text-lg sm:text-xl font-bold text-[#0D132D]">
                  {value}
                </p>
                <span
                  className={`flex items-center text-xs font-medium ${
                    isPositive ? "text-green-500" : "text-red-500"
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

      {/* Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-3">
        <div className="col-span-1 md:col-span-2">
          <EarnChart />
        </div>

        {/* Followers Section */}
        <div className="bg-white rounded-2xl p-5 w-full">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Followers</h2>
          <div className="space-y-4">
            {followers.map(({ platform, username, count, icon }, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={icon}
                    alt={platform}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-800">
                      {platform}
                    </p>
                    <p className="text-xs text-gray-500">{username}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-[#0D132D]">{count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <ImpressionChart />
        </div>

        <div className="bg-white rounded-2xl p-5 w-full">
          {/* Header */}
          <div className="ustify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              By content type
            </h2>
            <div className="flex space-x-4 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Followers</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-blue-900 rounded-full"></span>
                <span>Non Followers</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {contentData.map(({ type, followers, nonFollowers }, idx) => {
              const total = followers + nonFollowers;
              return (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1 mr-3">
                    <p className="text-sm text-gray-700 mb-1">{type}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 flex">
                      <div
                        className="h-2 rounded-l-full bg-blue-500"
                        style={{ width: `${(followers / total) * 100}%` }}
                      ></div>
                      <div
                        className="h-2 rounded-r-full bg-blue-900"
                        style={{ width: `${(nonFollowers / total) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-gray-800">
                    {total.toFixed(1)}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 my-4">
        <Audience />
      </div>

      <div className="col-span-1 md:col-span-2 my-4">
        <TopContent />
      </div>

      <div className="bg-white rounded-2xl p-4 w-full">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-lg font-bold text-gray-900">
            Content Insight
          </h2>
          <div className="flex flex-wrap gap-2">
            <select className="border rounded-full px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
              <option>Instagram</option>
              <option>Facebook</option>
              <option>TikTok</option>
            </select>
            <select className="border rounded-full px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Yearly</option>
            </select>
          </div>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 my-4">
        <Table />
      </div>
    </div>
  );
};

export default AnalyticsLayout;
