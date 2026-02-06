import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Table, Tooltip, Select, Empty } from "antd";
import { RiAddLine } from "react-icons/ri";
import api from "../../../api/axios";
import { useSelector } from "react-redux";
import AnalyticsFormModal from "./AnalyticsFormModal";

const { Option } = Select;

const SAFE_IMG =
    "Brocken-Default-Img.jpg"; // fallback image


const CustomEmpty = () => (
    <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
            <span className="text-gray-500">
                No new content found
            </span>
        }
    />
);



const NewContent = () => {
    const { token } = useSelector((state) => state.auth);

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("recent");
    const [platformFilter, setPlatformFilter] = useState(null);
    const [contentType, setContentType] = useState(null);

    const [allPlatform, setAllPlatform] = useState([]);
    const [allContentType, setAllContentType] = useState([]);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedContent, setSelectedContent] = useState(null);



    // Safe date formatting
    const formatDate = useCallback((isoString) => {
        if (!isoString) return "N/A";
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            day: "numeric",
            month: "short",
        });
    }, []);

    // MAIN FETCH — now null-safe
    const fetchNewContents = useCallback(
        async (params = {}) => {
            try {
                setLoading(true);

                const query = {
                    p_search: (params.search ?? search) || null,
                    p_providers: params.platformFilter
                        ? JSON.stringify([params.platformFilter])
                        : null,
                    p_contenttype: params.contentType
                        ? JSON.stringify([params.contentType])
                        : null,
                    p_sortorder: ((params.sortBy ?? sortBy) === "recent" ? "DESC" : "ASC"),
                    p_pagenumber: params.page || pagination.current,
                    p_pagesize: params.pageSize || pagination.pageSize,
                };

                const res = await api.get("/admin/analytics/new-contents", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: query,
                });

                const responseData = res?.data?.data ?? {};

                const records = Array.isArray(responseData.records)
                    ? responseData.records
                    : [];

                const formatted = records.map((item = {}) => {
                    const linkUrl =
                        typeof item.link === "string" && item.link.length > 2
                            ? item.link.startsWith("http")
                                ? item.link
                                : `https://${item.link}`
                            : "#";

                    return {
                        key: item.contractcontentlinkid || Math.random(),
                        influencer: item.influencername ?? "Unknown",
                        influencerphoto: item.influencerphoto ?? SAFE_IMG,
                        campaign: item.campaignname ?? "N/A",
                        platform: item.providername ?? "N/A",
                        link: linkUrl,
                        contentType: item.contenttype ?? "N/A",
                        submitted: formatDate(item.createddate),
                        raw: item,
                    };
                });

                setTableData(formatted);
                setPagination((prev) => ({
                    ...prev,
                    total: responseData.totalcount || 0,
                }));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        },
        [
            pagination.current,
            pagination.pageSize,
            token,
            formatDate,
        ]
    );

    const handleSearch = () => {
        fetchNewContents({ search, page: 1 });
    };

    const handleApply = () => {
        fetchNewContents({
            sortBy,
            platformFilter,
            contentType,
            page: 1,
            pageSize: pagination.pageSize,
        });
    };

    const handleTableChange = (p) => {
        setPagination(p);
        fetchNewContents({
            page: p.current,
            pageSize: p.pageSize,
        });
    };

    // Fetch providers/content types safely
    useEffect(() => {
        const loadFilters = async () => {
            try {
                const [pRes, cRes] = await Promise.all([
                    api.get("/providers", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    api.get("/content-type", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setAllPlatform(Array.isArray(pRes?.data?.data) ? pRes.data.data : []);
                setAllContentType(
                    Array.isArray(cRes?.data?.contentType)
                        ? cRes.data.contentType
                        : []
                );
            } catch (err) {
                console.error(err);
            }
        };

        loadFilters();
    }, [token]);

    useEffect(() => {
        fetchNewContents();
    }, [fetchNewContents]);

    const handleClearFilters = () => {
        setSearch("");
        setSortBy("recent");
        setPlatformFilter(null);
        setContentType(null);

        // Reset pagination to page 1
        setPagination((prev) => ({
            ...prev,
            current: 1,
        }));

        // Fetch fresh list without filters
        fetchNewContents({
            search: "",
            sortBy: "recent",
            platformFilter: null,
            contentType: null,
            page: 1,
            pageSize: pagination.pageSize,
        });
    };

    const columns = useMemo(
        () => [
            {
                title: "Influencer",
                dataIndex: "influencer",
                 width: 220,
                ellipsis: true,
                render: (_, record) => (
                    <div className="flex items-center gap-2">
                        <img
                            src={record.influencerphoto || SAFE_IMG}
                            onError={(e) => (e.target.src = SAFE_IMG)}
                            alt={record.influencer}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                        <span>{record.influencer}</span>
                    </div>
                ),
            },
            {
                title: "Campaign",
                dataIndex: "campaign",
                 width: 220,
                ellipsis: true,
                render: (value) => value || "N/A",
            },
            {
                title: "Platform",
                width: 100,
                dataIndex: "platform",
                render: (value) => value || "N/A",
            },
            {
                title: "Content Type",
                width: 130,
                dataIndex: "contentType",
                render: (value) => (
                    <span className="px-2 py-1 text-xs rounded bg-gray-100 border border-gray-200">
                        {value || "N/A"}
                    </span>
                ),
            },
            {
                title: "Link",
                dataIndex: "link",
                 width: 200,
                render: (link) =>
                    link && link !== "#" ? (
                        <Tooltip title={link}>
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate max-w-[150px] inline-block"
                            >
                                {link}
                            </a>
                        </Tooltip>
                    ) : (
                        <span className="text-gray-400">No Link</span>
                    ),
            },
            {
                title: "Submitted",
                width: 150,
                dataIndex: "submitted",
                render: (val) => val ?? "N/A",
            },
            {
                title: "Action",
                width: 100,
                render: (_, record) => (
                    <button
                        className="flex items-center bg-[#0D132D] hover:bg-[#1b2250] text-white px-4 py-1 rounded-2xl"
                        onClick={() => {
                            setSelectedContent({
                                contractcontentlinkid: record.raw.contractcontentlinkid,
                                platform: record.platform,
                                contentType: record.contentType,
                                influencer: record.influencer,
                                influencerid: record.raw.influencerid,
                                campaignid: record.raw.campaignid,
                                link: record.link,
                            });
                            setIsModalVisible(true);
                        }}
                    >
                        <RiAddLine className="mr-2" />
                        Add
                    </button>
                ),
            }


        ],
    );

    return (
        <div className="my-2">
            <h1 className="text-lg my-4">New Contents Uploaded by Influencers</h1>

            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4 sm:items-center">

                {/* Search */}
                <div className="flex w-full gap-2">
                    <input
                        type="text"
                        placeholder="Search influencer or campaign"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white px-4 py-2 border border-gray-200 rounded-lg"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-[#0D132D] text-white px-4 py-2 rounded-2xl"
                    >
                        Search
                    </button>
                </div>

                {/* Platform */}
                <Select
                    placeholder="Platform"
                    allowClear
                    value={platformFilter}
                    onChange={setPlatformFilter}
                    className="w-[150px]"
                    size="large"
                >
                    {allPlatform.map((p) => (
                        <Option key={p.id} value={p.id}>
                            <div className="flex items-center gap-2">
                                <img
                                    src={p.iconpath || SAFE_IMG}
                                    onError={(e) => (e.target.src = SAFE_IMG)}
                                    alt={p.name}
                                    className="w-5 h-5 object-contain"
                                />
                                <span>{p.name || "N/A"}</span>
                            </div>
                        </Option>
                    ))}
                </Select>

                {/* Content Types */}
                <Select
                    placeholder="Content Type"
                    allowClear
                    value={contentType}
                    onChange={setContentType}
                    className="w-[160px]"
                    size="large"
                >
                    {allContentType.map((t) => (
                        <Option key={t.id} value={t.id}>
                            {t.name || "Unnamed"}
                        </Option>
                    ))}
                </Select>

                {/* Sort */}
                <Select
                    value={sortBy}
                    onChange={setSortBy}
                    className="w-[160px]"
                    size="large"
                >
                    <Option value="recent">Sort by: Recent</Option>
                    <Option value="oldest">Sort by: Oldest</Option>
                </Select>

                <button
                    onClick={handleApply}
                    className="bg-[#0D132D] text-white px-4 py-2 rounded-2xl"
                >
                    Apply
                </button>
                <button
                    onClick={handleClearFilters}
                    className="bg-[#0D132D] text-white px-4 py-2 rounded-2xl"
                >
                    Clear
                </button>
            </div>

            <Table
                loading={{
                    spinning: loading,

                }}
                dataSource={tableData}
                columns={columns}
                pagination={pagination}
                onChange={handleTableChange}
               scroll={{ x: "max-content" }}

                rowKey="key"
                className="rounded-lg shadow-sm"
                locale={{
                    emptyText: <CustomEmpty />     // CUSTOM EMPTY STATE
                }}
            />

            <AnalyticsFormModal
                key={selectedContent?.contractcontentlinkid}
                visible={isModalVisible}
                contentData={selectedContent}
                onClose={() => {
                    setIsModalVisible(false);
                    setSelectedContent(null);
                }}
                onSuccess={() => {
                    setIsModalVisible(false);
                    setSelectedContent(null);
                    fetchNewContents({ page: pagination.current });
                }}
            />


        </div>
    );
};

export default NewContent;
