import React from "react";
import { Table, Button, Tooltip } from "antd";
import { RiEyeLine } from "react-icons/ri";

const allContentData = [
  {
    key: 1,
    influencer: "@ritesh",
    platform: "Instagram",
    link: "https://instagram.com/reel/xyz",
    firstAdded: "10:00 AM",
    lastUpdated: "01:00 PM",
    views: 12300,
    likes: 800,
    comments: 23,
    history: [
      { time: "10:00 AM", views: 10000, likes: 500 },
      { time: "01:00 PM", views: 12300, likes: 800 },
    ],
  },
  {
    key: 2,
    influencer: "@sana_art",
    platform: "TikTok",
    link: "https://tiktok.com/video/abc",
    firstAdded: "09:30 AM",
    lastUpdated: "12:15 PM",
    views: 9800,
    likes: 640,
    comments: 45,
    history: [
      { time: "09:30 AM", views: 7000, likes: 400 },
      { time: "12:15 PM", views: 9800, likes: 640 },
    ],
  },
  {
    key: 3,
    influencer: "@travelwithraj",
    platform: "YouTube",
    link: "https://youtube.com/watch/123",
    firstAdded: "08:00 AM",
    lastUpdated: "02:00 PM",
    views: 50200,
    likes: 3200,
    comments: 180,
    history: [
      { time: "08:00 AM", views: 40000, likes: 2500 },
      { time: "02:00 PM", views: 50200, likes: 3200 },
    ],
  },
  {
    key: 4,
    influencer: "@neha_vlog",
    platform: "Instagram",
    link: "https://instagram.com/reel/pqr",
    firstAdded: "11:00 AM",
    lastUpdated: "03:00 PM",
    views: 22000,
    likes: 1500,
    comments: 78,
    history: [
      { time: "11:00 AM", views: 15000, likes: 900 },
      { time: "03:00 PM", views: 22000, likes: 1500 },
    ],
  },
  {
    key: 5,
    influencer: "@gamezone",
    platform: "YouTube",
    link: "https://youtube.com/watch/789",
    firstAdded: "07:30 AM",
    lastUpdated: "11:45 AM",
    views: 75000,
    likes: 5200,
    comments: 300,
    history: [
      { time: "07:30 AM", views: 55000, likes: 3500 },
      { time: "11:45 AM", views: 75000, likes: 5200 },
    ],
  },
  {
    key: 6,
    influencer: "@fashion_beauty",
    platform: "Instagram",
    link: "https://instagram.com/reel/aaa",
    firstAdded: "01:00 PM",
    lastUpdated: "05:30 PM",
    views: 34000,
    likes: 2100,
    comments: 120,
    history: [
      { time: "01:00 PM", views: 26000, likes: 1500 },
      { time: "05:30 PM", views: 34000, likes: 2100 },
    ],
  },
  {
    key: 7,
    influencer: "@techguru",
    platform: "YouTube",
    link: "https://youtube.com/watch/tech",
    firstAdded: "06:00 AM",
    lastUpdated: "10:00 AM",
    views: 88000,
    likes: 6500,
    comments: 420,
    history: [
      { time: "06:00 AM", views: 70000, likes: 5000 },
      { time: "10:00 AM", views: 88000, likes: 6500 },
    ],
  },
  {
    key: 8,
    influencer: "@cookwithme",
    platform: "TikTok",
    link: "https://tiktok.com/video/food123",
    firstAdded: "02:00 PM",
    lastUpdated: "06:45 PM",
    views: 41000,
    likes: 3100,
    comments: 160,
    history: [
      { time: "02:00 PM", views: 30000, likes: 2000 },
      { time: "06:45 PM", views: 41000, likes: 3100 },
    ],
  },
  {
    key: 9,
    influencer: "@daily_fitness",
    platform: "Instagram",
    link: "https://instagram.com/reel/fit111",
    firstAdded: "04:00 PM",
    lastUpdated: "08:30 PM",
    views: 29000,
    likes: 1700,
    comments: 95,
    history: [
      { time: "04:00 PM", views: 21000, likes: 1200 },
      { time: "08:30 PM", views: 29000, likes: 1700 },
    ],
  },
  {
    key: 10,
    influencer: "@cryptoAlerts",
    platform: "YouTube",
    link: "https://youtube.com/watch/crypto77",
    firstAdded: "05:00 AM",
    lastUpdated: "09:20 AM",
    views: 102000,
    likes: 7800,
    comments: 500,
    history: [
      { time: "05:00 AM", views: 85000, likes: 6000 },
      { time: "09:20 AM", views: 102000, likes: 7800 },
    ],
  },
];


const AllContent = ({ onViewHistory }) => {
  const columns = [
    {
      title: "Influencer",
      dataIndex: "influencer",
      ellipsis: true,
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Platform",
      dataIndex: "platform",
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Link",
      dataIndex: "link",
      responsive: ["xs", "sm", "md", "lg"],
      render: (link) => (
        <Tooltip title={link}>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate max-w-[120px] inline-block"
          >
            {link}
          </a>
        </Tooltip>
      ),
    },
    {
      title: "First Added",
      dataIndex: "firstAdded",
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Views",
      dataIndex: "views",
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "",
      fixed: "right",
      width: 100,
      responsive: ["xs", "sm", "md", "lg"],
      render: (_, record) => (
        <Button
          icon={<RiEyeLine />}
          className="border-[#0D132D] text-[#0D132D] hover:bg-[#0D132D] hover:text-white px-4"
          onClick={() => onViewHistory(record.history)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="my-2">
      <h1 className="text-lg my-4">All Content (History Overview)</h1>

      <Table
        dataSource={allContentData}
        columns={columns}
        bordered={false}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total) => `Total ${total} items`,
        }}
        className="rounded-lg shadow-sm"
        scroll={{ x: "max-content" }}
        rowClassName={() =>
          "hover:bg-gray-50 transition-colors border-b last:border-b-0"
        }
      />
    </div>
  );
};

export default AllContent;
