import React, { useState } from "react";
import { Table,  Tooltip,  Select } from "antd";
import { RiAddLine } from "react-icons/ri";

const { Option } = Select;

const NewContent = ({ onAddAnalytics, fetchDataFromAPI }) => {

    // -----------------------
    // STATIC TABLE DATA
    // -----------------------
    const [tableData, setTableData] = useState([
        {
            key: 1,
            influencer: "@ritesh",
            campaign: "Puma Summer",
            platform: "Instagram",
            link: "https://instagram.com/reel/xyz",
            submitted: "5 min ago",
        },
        {
            key: 2,
            influencer: "@sana_art",
            campaign: "Nykaa Beauty Fest",
            platform: "TikTok",
            link: "https://tiktok.com/video/beauty222",
            submitted: "12 min ago",
        },
        {
            key: 3,
            influencer: "@travelwithraj",
            campaign: "MakeMyTrip Winter Deals",
            platform: "YouTube",
            link: "https://youtube.com/watch/trv445",
            submitted: "20 min ago",
        },
        {
            key: 4,
            influencer: "@neha_vlog",
            campaign: "MamaEarth Glow",
            platform: "Instagram",
            link: "https://instagram.com/reel/neha777",
            submitted: "30 min ago",
        },
        {
            key: 5,
            influencer: "@gamezone",
            campaign: "ASUS ROG Launch",
            platform: "YouTube",
            link: "https://youtube.com/watch/gamer999",
            submitted: "1 hour ago",
        },
        {
            key: 6,
            influencer: "@fashion_beauty",
            campaign: "Zara Fall Collection",
            platform: "Instagram",
            link: "https://instagram.com/reel/fb554",
            submitted: "1 hr 20 min ago",
        },
        {
            key: 7,
            influencer: "@techguru",
            campaign: "Samsung Galaxy S24",
            platform: "YouTube",
            link: "https://youtube.com/watch/techs24",
            submitted: "2 hrs ago",
        },
        {
            key: 8,
            influencer: "@cookwithme",
            campaign: "Swiggy Food Fest",
            platform: "TikTok",
            link: "https://tiktok.com/video/food445",
            submitted: "2 hrs 10 min ago",
        },
        {
            key: 9,
            influencer: "@daily_fitness",
            campaign: "CultFit New Year Challenge",
            platform: "Instagram",
            link: "https://instagram.com/reel/fit888",
            submitted: "3 hrs ago",
        },
        {
            key: 10,
            influencer: "@cryptoAlerts",
            campaign: "CoinSwitch Trade Smart",
            platform: "YouTube",
            link: "https://youtube.com/watch/crypto101",
            submitted: "4 hrs ago",
        },
    ]);

    // -----------------------
    // FILTER STATES
    // -----------------------
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("recent");
    const [platformFilter, setPlatformFilter] = useState(null);
    const [contentType, setContentType] = useState(null);
    const [viewMode, setViewMode] = useState("influencer");

    // -----------------------
    // APPLY BUTTON → API CALL
    // -----------------------
    const handleApply = () => {
        const params = {
            search,
            sortBy,
            platform: platformFilter,
            contentType,
            viewMode,
        };

        console.log("API Params:", params);

        fetchDataFromAPI(params);
    };

    // -----------------------
    // COLUMNS
    // -----------------------
    const columns = [
        {
            title: "Influencer",
            dataIndex: "influencer",
            ellipsis: true,
        },
        {
            title: "Campaign",
            dataIndex: "campaign",
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
            title: "Submitted",
            dataIndex: "submitted",
        },
        {
            title: "",
            width: 100,
            render: (_, record) => (
                <button
                    className="flex items-center bg-[#0D132D] hover:bg-[#1b2250] text-white px-4 py-1 rounded"
                    onClick={() => onAddAnalytics({ ...record, isUpdate: false })}
                >
                    <RiAddLine className="mr-2" />
                    Add
                </button>

            ),
        },
    ];

    return (
        <div className="my-2">
            <h1 className="text-lg my-4">New Contents Which Influencer Have Uploaded</h1>

            {/* Filters */}
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

                {/* Sort, Platform, Content Type, View Mode */}
                <Select
                    value={sortBy}
                    onChange={setSortBy}
                    className="w-full sm:w-[160px]"
                    size="large"
                >
                    <Option value="recent">Sort by: Recent</Option>
                    <Option value="oldest">Sort by: Oldest</Option>
                </Select>

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

                <Select
                    placeholder="Content Type"
                    allowClear
                    value={contentType}
                    onChange={setContentType}
                    className="w-full sm:w-[160px]"
                    size="large"
                >
                    <Option value="video">Video</Option>
                    <Option value="image">Image</Option>
                    <Option value="shorts">Shorts</Option>
                    <Option value="reel">Reel</Option>
                </Select>

                <Select
                    value={viewMode}
                    onChange={setViewMode}
                    className="w-full sm:w-[180px]"
                    size="large"
                >
                    <Option value="influencer">View: Influencer Wise</Option>
                    <Option value="campaign">View: Campaign Wise</Option>
                </Select>

                <button
                    onClick={handleApply}
                    className="bg-[#0D132D] text-white hover:bg-[#1b2250] px-4 py-2 rounded transition-colors w-full sm:w-auto"
                >
                    Apply
                </button>
            </div>


            <Table
                dataSource={tableData}   // FIXED → now table shows static data
                columns={columns}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                }}
                className="rounded-lg shadow-sm"
            />
        </div>
    );
};

export default NewContent;
