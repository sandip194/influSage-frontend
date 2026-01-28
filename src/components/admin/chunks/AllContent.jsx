import React, { useEffect, useState,  useCallback } from "react";
import { Table, Button, Tooltip, Select, Empty } from "antd";
import { RiEyeLine } from "react-icons/ri";
import api from "../../../api/axios";
import { useSelector } from "react-redux";
const { Option } = Select;

const SAFE_IMG = "/default.jpg";

const CustomEmpty = () => (
  <Empty
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    description={<span className="text-gray-500">No data found</span>}
  />
);

const AllContent = ({ onViewHistory }) => {
  const { token, userId } = useSelector((state) => state.auth);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [platformFilter, setPlatformFilter] = useState(null);
  const [contentType, setContentType] = useState(null);

  const [allPlatform, setAllPlatform] = useState([]);
  const [allContentType, setAllContentType] = useState([]);

  const [statusFilter, setStatusFilter] = useState(null);
  const [allStatus, setAllStatus] = useState([]);


  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Safe Date formatting
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

  // Search
  const handleSearch = () => {
    fetchAllContents({ search, page: 1 });
  };

  // Apply filters
  const handleApply = () => {
    fetchAllContents({
      sortBy,
      platformFilter,
      statusFilter,
      contentType,
      page: 1,
      pageSize: pagination.pageSize,
    });
  };

  const fetchAllContents = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);

        const query = {
          p_adminid: userId || null,
          p_statusid: params.statusFilter ?? statusFilter ?? null,

          p_providers: params.platformFilter
            ? JSON.stringify([params.platformFilter])
            : null,

          p_contenttype: params.contentType
            ? JSON.stringify([params.contentType])
            : null,

          p_sortorder: (params.sortBy ?? sortBy) === "recent" ? "DESC" : "ASC",

          p_pagenumber: params.page || pagination.current,
          p_pagesize: params.pageSize || pagination.pageSize,
          p_search: (params.search ?? search) || null,
        };

        const res = await api.get("/admin/analytics/contents-histories", {
          params: query,
          headers: { Authorization: `Bearer ${token}` },
        });

        const api = res?.data?.data || {};
        const records = Array.isArray(api.records) ? api.records : [];

        const formatted = records.map((item = {}) => {
          return {
            key: item.contractcontentlinkid,
            photo: item.userphoto,
            influencer: item.influencername,
            platform: item.providername,
            contentType: item.contenttypname,
            link: item.link,

            postdate: item.postdate
              ? formatDate(item.postdate)
              : "N/A",

            lastUpdated: item.latestcreateddate
              ? formatDate(item.latestcreateddate)
              : "N/A",

            views: item.views,
            raw: item,
          };
        });

        setTableData(formatted);

        setPagination((prev) => ({
          ...prev,
          total: api.totalcount || 0,
        }));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [token, pagination.current, pagination.pageSize, formatDate]
  );

  useEffect(() => {
    fetchAllContents();
  }, [fetchAllContents]);

  //---------------------------------------------
  // Load Filters (Providers + ContentTypes)
  //---------------------------------------------
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [pRes, cRes, sRes] = await Promise.all([
          api.get("/providers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/content-type", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/admin/analytics/status-filters", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAllPlatform(Array.isArray(pRes?.data?.data) ? pRes.data.data : []);
        setAllContentType(
          Array.isArray(cRes?.data?.contentType)
            ? cRes.data.contentType
            : []
        );
        setAllStatus(
          Array.isArray(sRes?.data?.data)
            ? sRes.data.data
            : []
        );
      } catch (err) {
        console.error("Filter loading error:", err);
      }
    };

    loadFilters();
  }, [token]);


  const columns = [
    {
      title: "Influencer",
      dataIndex: "influencer",
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <img
            src={record.photo}
            onError={(e) => (e.target.src = SAFE_IMG)}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <span className="font-medium">{record.influencer}</span>
        </div>
      ),
    },
    {
      title: "Platform",
      dataIndex: "platform",
      width: 120,
    },
    {
      title: "Content Type",
      dataIndex: "contentType",
      width: 100,
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
      title: "Post Date",
      dataIndex: "postdate",
      width: 150,
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      width: 150,
    },
    {
      title: "Views",
      dataIndex: "views",
      width: 100,
    },
    {
      title: "Action",
      width: 80,
      render: (_, record) => (
        <Button
          icon={<RiEyeLine />}
          onClick={() => onViewHistory(record.raw)}
          className="border-[#0D132D] text-[#0D132D]"
        >
          View
        </Button>
      ),
    },
  ];

  // Pagination change
  const handleTableChange = (p) => {
    setPagination(p);
    fetchAllContents({
      page: p.current,
      pageSize: p.pageSize,
    });
  };

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
    setStatusFilter(null);
    fetchAllContents({
      search: "",
      sortBy: "recent",
      platformFilter: null,
      contentType: null,
      statusFilter: null,
      page: 1,
      pageSize: pagination.pageSize,
    });
  };

  return (
    <div className="my-2">
      <h1 className="text-lg my-4">All Content (History Overview)</h1>

      {/* Filters */}
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

        {/* Platform Filter */}
        <Select
          allowClear
          placeholder="Platform"
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
                  className="w-5 h-5 object-contain"
                />
                <span>{p.name}</span>
              </div>
            </Option>
          ))}
        </Select>

        {/* Content Type */}
        <Select
          allowClear
          placeholder="Content Type"
          value={contentType}
          onChange={setContentType}
          className="w-[160px]"
          size="large"
        >
          {allContentType.map((t) => (
            <Option key={t.id} value={t.id}>
              {t.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Campaign Status"
          allowClear
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-[150px]"
          size="large"
        >
          {allStatus.map((s) => (
            <Option key={s.id} value={s.id}>
              {s.name}
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
        loading={{ spinning: loading }}
        dataSource={tableData}
        columns={columns}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: "max-content" }}

        rowKey="key"
        className="rounded-lg shadow-sm"
        locale={{ emptyText: <CustomEmpty /> }}
      />
    </div>
  );
};

export default AllContent;
