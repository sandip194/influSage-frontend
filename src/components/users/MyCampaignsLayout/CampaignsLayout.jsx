

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  Input,
  Select,
  Tooltip,
  Skeleton,
  Empty,
  Checkbox,
  DatePicker,
} from "antd";
import { SearchOutlined, CloseCircleFilled } from "@ant-design/icons";
import api from "../../../api/axios";import { useSelector } from "react-redux";
import {
  RiArrowDownSLine,
  RiCloseFill,
  RiFilterLine,
  RiEraserLine,
} from "react-icons/ri";
import { RiEqualizerFill } from "@remixicon/react";

const { Option } = Select;
const { RangePicker } = DatePicker;

const statusStyles = {
  "in progress": "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",

  published: "bg-blue-100 text-blue-700",
  blocked: "bg-gray-100 text-gray-700",
  pending: "bg-orange-100 text-orange-700",
  rejected: "bg-pink-100 text-pink-700",
  accepted: "bg-blue-100 text-blue-700",
};

const statusLabels = {
  inprogress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",

  published: "Published",
  blocked: "Blocked",
  pending: "Pending",
  rejected: "Rejected",
  accepted: "Accepted", // ✅ added
};



const sortOptions = [
  { value: "createddate_desc", label: "Newest" },
  { value: "createddate_asc", label: "Oldest" },
  { value: "paymentamount_desc", label: "Budget: High to Low" },
  { value: "paymentamount_asc", label: "Budget: Low to High" },
];

const getImageUrl = (path) => path || "/placeholder.jpg";


const InfluencerCampaigns = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    statusId: null,
    sortby: "createddate",
    sortorder: "desc",
    pagenumber: 1,
    pagesize: 10,
    search: "",
    providers: [],
    clients: [],
    minbudget: null,
    maxbudget: null,
    startdate: null,
    enddate: null,
  });

  const [tempFilters, setTempFilters] = useState({
    providers: [],
    clients: [],
    minbudget: null,
    maxbudget: null,
    startdate: null,
    enddate: null,
  });

  const [campaigns, setCampaigns] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [clients, setClients] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  /* ================= FETCH CAMPAIGNS ================= */
  const fetchCampaigns = useCallback(
    async (signal) => {
      try {
        setLoading(true);

        const params = {
          p_statuslabelid: filters.statusId ?? undefined,
          p_sortby: filters.sortby,
          p_sortorder: filters.sortorder,
          p_pagenumber: filters.pagenumber,
          p_pagesize: filters.pagesize,
          p_search: filters.search?.trim() || undefined,
          p_providers: filters.providers.length
            ? JSON.stringify(filters.providers)
            : undefined,
          p_clients: filters.clients.length
            ? JSON.stringify(filters.clients)
            : undefined,
          p_minbudget: filters.minbudget ?? undefined,
          p_maxbudget: filters.maxbudget ?? undefined,
          p_startdate: filters.startdate ?? undefined,
          p_enddate: filters.enddate ?? undefined,
        };

        const cleanParams = Object.fromEntries(
          Object.entries(params).filter(([, v]) => v != null && v !== "")
        );

        const res = await api.get("/user/influencer-contract", {
          params: cleanParams,
          signal,
          headers: { Authorization: `Bearer ${token}` },
        });

        setCampaigns(res?.data?.data?.records ?? []);
        setTotalCount(res?.data?.data?.totalcount ?? 0);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Error fetching campaigns", err);
        }
      } finally {
        setLoading(false);
      }
    },
    [filters, token]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchCampaigns(controller.signal);
    return () => controller.abort();
  }, [fetchCampaigns]);

  /* ================= STATIC DATA ================= */
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    api.get("providers", { headers }).then((r) =>
      setPlatforms(r?.data?.data ?? [])
    );
    api.get("user/client-list", { headers }).then((r) =>
      setClients(r?.data?.data ?? [])
    );
    api      .get("user/contract/status", { headers })
      .then((r) => setStatuses(r?.data?.data ?? []));
  }, [token]);

  /* ================= HANDLERS ================= */
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setFilters((p) => ({
        ...p,
        search: searchInput.trim(),
        pagenumber: 1,
      }));
    }
  };

  const handleSortChange = (value) => {
    const [sortby, sortorder] = value.split("_");
    setFilters((p) => ({ ...p, sortby, sortorder, pagenumber: 1 }));
  };

  const handlePaginationChange = (page, pageSize) => {
    setFilters((p) => ({ ...p, pagenumber: page, pagesize: pageSize }));
  };

  const handleStatusFilter = (statusId) => {
    setFilters((p) => ({ ...p, statusId, pagenumber: 1 }));
  };

  // TEMP FILTER HANDLERS (DO NOT TRIGGER API)
  const handleProviderChange = (id) => {
    setTempFilters((prev) => ({
      ...prev,
      providers: prev.providers.includes(id)
        ? prev.providers.filter((p) => p !== id)
        : [...prev.providers, id],
    }));
  };

  const handleClientChange = (id) => {
    setTempFilters((prev) => ({
      ...prev,
      clients: prev.clients.includes(id)
        ? prev.clients.filter((c) => c !== id)
        : [...prev.clients, id],
    }));
  };

  const handleBudgetChange = (field, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [field]: value === "" ? null : Number(value),
    }));
  };

  const handleDateChange = (dates) => {
    setTempFilters((prev) => ({
      ...prev,
      startdate: dates?.[0]?.format("YYYY-MM-DD") ?? null,
      enddate: dates?.[1]?.format("YYYY-MM-DD") ?? null,
    }));
  };


  const applyFilters = () => {
    setFilters((p) => ({ ...p, ...tempFilters, pagenumber: 1 }));
    setShowFilter(false);
  };

  const clearFilters = () => {
    const reset = {
      providers: [],
      clients: [],
      minbudget: null,
      maxbudget: null,
      startdate: null,
      enddate: null,
    };
    setTempFilters(reset);
    setFilters((p) => ({ ...p, ...reset, pagenumber: 1 }));
    setShowFilter(false);
  };

  useEffect(() => {
    if (showFilter) {
      setTempFilters({
        providers: filters.providers,
        clients: filters.clients,
        minbudget: filters.minbudget,
        maxbudget: filters.maxbudget,
        startdate: filters.startdate,
        enddate: filters.enddate,
      });
    }
  }, [showFilter, filters]);


  return (
    <div className="w-full text-sm  pb-16 sm:pb-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">My Contracts</h2>
      </div>

      {/* Status Tabs */}
      <div className="bg-white p-3 rounded-lg mb-4">
        <div className="flex gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button
            onClick={() => handleStatusFilter(null)}
            className={`px-4 cursor-pointer py-2 rounded-lg border border-gray-200 flex-shrink-0 ${filters.statusId === null
              ? "bg-[#0f122f] text-white"
              : "bg-white text-gray-700"
              }`}
          >
            All
          </button>

          {statuses.map((status) => (
            <button
              key={status.id}
              onClick={() => handleStatusFilter(status.id)}
              className={`px-4 py-2 rounded-lg border border-gray-200 cursor-pointer flex-shrink-0 ${filters.statusId === status.id
                ? "bg-[#0f122f] text-white"
                : "bg-white text-gray-700"
                }`}
            >
              {status.name}
            </button>
          ))}
        </div>
      </div>


      {/* Search, Sort, and Filter Header */}
      <div className="bg-white p-4 rounded-lg mb-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            prefix={<SearchOutlined />}
            size='large'
            placeholder="Search campaigns, Budget, Status..."
            className="w-full sm:w-72"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearch}
            suffix={
              searchInput ? (
                <Tooltip title="Clear search" placement="top">
                  <CloseCircleFilled
                    onClick={() => {
                      setSearchInput("");
                      // setSearchTerm("");
                    }}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              ) : null
            }
          />

          {!showFilter && (
            <div className="sm:static fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200 flex gap-2 justify-between sm:flex-row sm:w-auto sm:border-none sm:p-0 z-30">
              <Select
                size="large"
                value={`${filters.sortby}_${filters.sortorder}`}
                onChange={handleSortChange}
                className="flex-1 sm:w-48"
                placeholder="Sort By"
                suffixIcon={<RiArrowDownSLine size={16} />}
              >
                {sortOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>

              <button
                onClick={() => {
                  setTempFilters(filters);
                  setShowFilter(true);
                }}
                className="flex items-center cursor-pointer justify-center gap-2 border border-gray-200 rounded-md px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 transition flex-1 sm:w-auto"
              >
                Filter
                <RiEqualizerFill size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-white text-gray-700 text-sm tracking-wide">
              <tr>
                <th className="p-4">Campaign</th>
                <th className="p-4 w-[160px]">Payment Amount</th>
                <th className="p-4 w-[160px]">Contract Start</th>
                <th className="p-4 w-[160px]">Contract End</th>
                <th className="p-4 w-[180px]">Contract Status</th>
                <th className="p-4 w-[180px]">Campaign Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {loading ? (
                [...Array(5)].map((_, idx) => (
                  <tr key={idx} className="border-t border-gray-200">
                    <td className="p-4">
                      <Skeleton.Input active size="small" style={{ width: 100 }} />
                    </td>
                    <td className="p-4">
                      <Skeleton.Input active size="small" style={{ width: 60 }} />
                    </td>
                    <td className="p-4">
                      <Skeleton.Input active size="small" style={{ width: 80 }} />
                    </td>
                    <td className="p-4">
                      <Skeleton.Input active size="small" style={{ width: 80 }} />
                    </td>
                    <td className="p-4">
                      <Skeleton.Input active size="small" style={{ width: 100 }} />
                    </td>
                    <td className="p-4">
                      <Skeleton.Input active size="small" style={{ width: 100 }} />
                    </td>
                  </tr>
                ))
              ) : campaigns.length > 0 ? (
                campaigns.map((row) => (
                  <tr
                    key={row.contractid}
                    onClick={() => navigate(`/dashboard/my-contract/details/${row.campaignid}`)}
                    className="border-t border-gray-200 hover:bg-gray-200 transition cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3 max-w-[260px]">
                        <img
                          src={getImageUrl(row.photopath)}
                          alt={row.name}
                          onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                          className="w-9 h-9 rounded-full object-cover border border-gray-200 flex-shrink-0"
                        />

                        <span
                          className="font-medium truncate block"
                          title={row.name}
                        >
                          {row.name}
                        </span>
                      </div>

                    </td>
                    <td className="p-4 font-medium text-sm">
                      ₹{Number(row.paymentamount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="p-4">{row.contractstartdate}</td>
                    <td className="p-4">{row.contractenddate}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[row.contractstatus.toLowerCase()] ||
                          "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {statusLabels[row.contractstatus.toLowerCase()] || row.contractstatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[row.campaignstatus.toLowerCase()] ||
                          "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {statusLabels[row.campaignstatus.toLowerCase()] || row.campaignstatus}
                      </span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10">
                    <Empty description="No campaigns found" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
        <p className="text-sm text-gray-600">
          Showing {campaigns.length} of {totalCount} Results
        </p>
        <Pagination
          current={filters.pagenumber}
          total={totalCount}
          pageSize={filters.pagesize}
          onChange={handlePaginationChange}
          showSizeChanger
          pageSizeOptions={["10", "15", "25", "50"]}
        />
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowFilter(false)}
          />
          <div className="fixed top-0 right-0 w-80 h-full bg-white p-4 z-50 shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filter Options</h3>

              <div className="flex items-center gap-2">
                <Tooltip title="Clear Filters">
                  <button
                    onClick={clearFilters}
                    className="p-2 cursor-pointer rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition"
                  >
                    <RiEraserLine size={18} />
                  </button>
                </Tooltip>

                <Tooltip title="Apply Filters">
                  <button
                    onClick={applyFilters}
                    className="p-2 rounded-full cursor-pointer bg-[#141843] text-white hover:bg-[#1d214f] transition"
                  >
                    <RiFilterLine size={18} />
                  </button>
                </Tooltip>

                <Tooltip title="Close">
                  <button
                    onClick={() => setShowFilter(false)}
                    className="p-2 rounded-full cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
                  >
                    <RiCloseFill size={20} />
                  </button>
                </Tooltip>
              </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Providers/Platforms */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Providers/Platforms</h4>
              {platforms.length === 0 ? (
                <p className="text-sm text-gray-500">No platforms available.</p>
              ) : (
                <div className="space-y-2">
                  {platforms.map((platform) => (
                    <label
                      key={platform.id}
                      className="flex items-center cursor-pointer"
                    >
                      <Checkbox
                        checked={tempFilters.providers.includes(platform.id)}
                        onChange={() => handleProviderChange(platform.id)}
                      />
                      <span className="text-sm text-gray-700 ml-2">
                        {platform.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Clients/ Vendors */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Clients/ Vendors</h4>
              {clients.length === 0 ? (
                <p className="text-sm text-gray-500">No Clients or Vendor Available</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {clients.map((client) => (
                    <label
                      key={client.ownerid}
                      className="flex items-center cursor-pointer"
                    >
                      <Checkbox
                        checked={tempFilters.clients.includes(client.ownerid)}
                        onChange={() => handleClientChange(client.ownerid)}
                      />
                      <span className="text-sm text-gray-700 ml-2">
                        {client.businessname}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>


            {/* Budget */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Budget</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Min Budget"
                  type="number"
                  value={tempFilters.minbudget} // Use tempFilters
                  onChange={(e) => handleBudgetChange("minbudget", e.target.value)} // Updates temp only
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#141843]"
                />
                <Input
                  placeholder="Max Budget"
                  type="number"
                  value={tempFilters.maxbudget} // Use tempFilters
                  onChange={(e) => handleBudgetChange("maxbudget", e.target.value)} // Updates temp only
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#141843]"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Filter campaigns by estimated budget range.</p>
            </div>

            {/* Date Range */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Date Range (Start - End)</h4>
              <RangePicker
                value={[tempFilters.startdate, tempFilters.enddate]} // Use tempFilters
                onChange={handleDateChange} // Updates temp only
                format="YYYY-MM-DD"
                placeholder={["Start Date", "End Date"]}
                className="w-full"
                style={{ padding: '8px 12px' }}
              />
              <p className="text-xs text-gray-500 mt-1">Filter by campaign start and end dates.</p>
            </div>


          </div>
        </>
      )}
    </div>
  );
};

export default InfluencerCampaigns;