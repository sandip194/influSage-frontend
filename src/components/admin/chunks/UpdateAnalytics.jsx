import React, { useState } from "react";
import { Button, Input, Select, Table, Tooltip } from "antd";
import { RiEditLine } from "react-icons/ri";

const updateQueueData = [
    {
        key: 1,
        influencer: "@ritesh",
        platform: "Instagram",
        link: "https://instagram.com/reel/xyz",
        lastUpdated: "3 hrs ago",
        status: "DUE",
        views: 12300,
        likes: 800,
        comments: 23,
    },
    {
        key: 2,
        influencer: "@sana_art",
        platform: "TikTok",
        link: "https://tiktok.com/video/abc",
        lastUpdated: "1 hr ago",
        status: "DUE",
        views: 9800,
        likes: 640,
        comments: 45,
    },
    {
        key: 3,
        influencer: "@travelwithraj",
        platform: "YouTube",
        link: "https://youtube.com/watch/123",
        lastUpdated: "5 hrs ago",
        status: "COMPLETED",
        views: 50200,
        likes: 3200,
        comments: 180,
    },
    {
        key: 4,
        influencer: "@neha_vlog",
        platform: "Instagram",
        link: "https://instagram.com/reel/pqr",
        lastUpdated: "2 hrs ago",
        status: "DUE",
        views: 22000,
        likes: 1500,
        comments: 78,
    },
    {
        key: 5,
        influencer: "@gamezone",
        platform: "YouTube",
        link: "https://youtube.com/watch/789",
        lastUpdated: "7 hrs ago",
        status: "UPDATED",
        views: 75000,
        likes: 5200,
        comments: 300,
    },
    // ... more data
];

const STATUS_COLORS = {
    DUE: "bg-red-50 text-red-600 border-red-200",
    COMPLETED: "bg-green-50 text-green-600 border-green-200",
    UPDATED: "bg-green-50 text-green-600 border-green-200",
};

const StatusBadge = ({ status }) => (
    <span
        className={`px-2 py-1 rounded-full text-sm font-medium border ${STATUS_COLORS[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}
    >
        {status}
    </span>
);

const UpdateAnalytics = ({ onUpdateAnalytics, fetchDataFromAPI }) => {
    // -----------------------
    // Filters / Search / Sort
    // -----------------------
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("recent");
    const [platformFilter, setPlatformFilter] = useState(null);

    const handleApply = () => {
        const params = { search, sortBy, platform: platformFilter };
        fetchDataFromAPI(params);
    };

    // -----------------------
    // Columns
    // -----------------------
    const columns = [
        {
            title: "Influencer",
            dataIndex: "influencer",
            ellipsis: true,
        },
        {
            title: "Platform",
            dataIndex: "platform",
        },
        {
            title: "Link",
            dataIndex: "link",
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
            title: "Last Updated",
            dataIndex: "lastUpdated",
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (status) => <StatusBadge status={status} />,
        },
        {
            title: "",
            width: 100,
            render: (_, record) => (
                <button
                    className="flex items-center bg-[#0D132D] hover:bg-[#1b2250] text-white px-4 py-1 rounded"
                    onClick={() => onUpdateAnalytics({ ...record, isUpdate: true })}
                >
                    <RiEditLine className="mr-2" />
                    Edit
                </button>
            ),
        },
    ];

    return (
        <div className="my-2">
            <h1 className="text-lg my-4">Analytics Pending Updates</h1>

            {/* ----------------------------
          FILTERS / SEARCH BAR
      ----------------------------- */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4 items-start sm:items-center">

                {/* Search Input + Button */}
                <div className="flex w-full sm:w-full gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search influencer or campaign"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-10 py-2 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg
                            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                            />
                        </svg>
                    </div>
                    <button
                        onClick={() => fetchDataFromAPI({ search })}
                        className="bg-[#0D132D] text-white px-4 py-2 rounded hover:bg-[#1b2250] transition-colors flex-shrink-0"
                    >
                        Search
                    </button>
                </div>

                {/* Sort By */}
                <Select
                    value={sortBy}
                    onChange={setSortBy}
                    className="w-full sm:w-[160px]"
                    size="large"
                >
                    <Option value="recent">Sort by: Recent</Option>
                    <Option value="oldest">Sort by: Oldest</Option>
                </Select>

                {/* Platform Filter */}
                <Select
                    placeholder="Platform"
                    allowClear
                    value={platformFilter}
                    onChange={setPlatformFilter}
                    className="w-full sm:w-[150px]"
                    size="large"
                >
                    <Option value="Instagram">Instagram</Option>
                    <Option value="YouTube">YouTube</Option>
                    <Option value="TikTok">TikTok</Option>
                </Select>

                <button
                    onClick={handleApply}
                    className="bg-[#0D132D] text-white hover:bg-[#1b2250] px-4 py-2 rounded transition-colors w-full sm:w-auto"
                >
                    Apply
                </button>
            </div>

            {/* ----------------------------
          TABLE
      ----------------------------- */}
            <Table
                dataSource={updateQueueData}
                columns={columns}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
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

export default UpdateAnalytics;
