import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiEyeLine, RiAddFill, RiEqualizerFill, RiCloseFill, RiArrowDownSLine, RiEraserLine, RiFilterLine
} from "@remixicon/react";
import { SearchOutlined, CloseCircleFilled } from "@ant-design/icons";
import api from "../../../api/axios";import { useSelector } from "react-redux";
import {
  Pagination, Skeleton, Empty, Select, Input, DatePicker, Checkbox, Tooltip
} from "antd";
import { toast } from "react-toastify"; // Optional: for error notifications; install if not present

const { RangePicker } = DatePicker;
const { Option } = Select;


function debounce(func, delay) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}


const statusStyles = {
  draft: "bg-gray-100 text-gray-700",
  published: "bg-blue-100 text-blue-700",
  underreview: "bg-purple-100 text-purple-700",
  inprogress: "bg-yellow-100 text-yellow-700",
  complete: "bg-green-100 text-green-700",
  canceled: "bg-red-100 text-red-700",
  paused: "bg-orange-100 text-orange-700",
  rejected: "bg-red-100 text-red-700",
  approved: "bg-green-100 text-green-700",
};

const statusLabels = {
  draft: "Draft",
  published: "Published",
  underreview: "Under Review",
  inprogress: "In Progress",
  complete: "Completed",
  canceled: "Cancelled",
  paused: "Paused",
};

const sortOptions = [
  { value: "createddate_desc", label: "Newest" },
  { value: "createddate_asc", label: "Oldest" },
  { value: "estimatedbudget_desc", label: "Budget: High to Low" },
  { value: "estimatedbudget_asc", label: "Budget: Low to High" },
];

const getStatusKey = (status) => {
  if (!status) return "";
  if (typeof status === "string") return status.toLowerCase();
  if (typeof status === "object") {
    if (status.status) return String(status.status).toLowerCase();
    if (status.name) return String(status.name).toLowerCase();
  }
  return String(status).toLowerCase();
};

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getImageUrl = (path) => {
  if (!path) return "/placeholder.jpg";
  return path;
};

const VendorCampaignsLayout = () => {
  const [showFilter, setShowFilter] = useState(false);
  // const [statusFilter, setStatusFilter] = useState("all");
  //const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState(""); // For controlled input
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [statusList, setStatusList] = useState([]);
  const [platforms, setPlatforms] = useState([]); // For provider filters

  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  // Filters state (server-side)
  const [filters, setFilters] = useState({
    status: "all", // Maps to p_status
    providers: [], // Maps to p_providers (JSON stringified)
    minbudget: "",
    maxbudget: "",
    startdate: null, // Maps to p_startdate (YYYY-MM-DD)
    enddate: null, // Maps to p_enddate (YYYY-MM-DD)
    sortby: "createddate",
    sortorder: "desc",
    pagenumber: 1,
    pagesize: 10,
    search: "", // Maps to p_search
  });

  const [tempFilters, setTempFilters] = useState(filters); // Initialize same as filters

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        p_statuslabelid: filters.status !== "all" ? filters.status : undefined,
        p_providers: filters.providers.length
          ? JSON.stringify(filters.providers)
          : undefined,
        p_minbudget:
          filters.minbudget !== "" ? Number(filters.minbudget) : undefined,
        p_maxbudget:
          filters.maxbudget !== "" ? Number(filters.maxbudget) : undefined,
        p_startdate: filters.startdate
          ? filters.startdate.format("YYYY-MM-DD")
          : undefined,
        p_enddate: filters.enddate
          ? filters.enddate.format("YYYY-MM-DD")
          : undefined,
        p_sortby: filters.sortby || undefined,
        p_sortorder: filters.sortorder || undefined,
        p_pagenumber: filters.pagenumber || 1,
        p_pagesize: filters.pagesize || 10,
        p_search: filters.search.trim() || undefined,
      };

      // Clean undefined params
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
      );

      const res = await api.get("vendor/allcampaign", {
        params: cleanParams,
        headers: { Authorization: `Bearer ${token}` },
      });

      setCampaigns(res?.data?.data?.records || []);
      setTotalCampaigns(res?.data?.data?.totalcount || 0);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  }, [filters, token]);

  const fetchStatuses = async () => {
    try {
      const res = await api.get("vendor/campaignstatus", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statusData = res?.data?.data || [];
      setStatusList(["All", ...statusData]);
    } catch (error) {
      console.error("Error fetching status list:", error);
    }
  };

  const getAllPlatforms = async () => {
    try {
      const res = await api.get("providers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlatforms(res.data.data || []);
    } catch (error) {
      console.error("Error fetching platforms:", error);
    }
  };

  // Handle status tab click (updates filters with ID and refetches)
  // const handleStatusFilter = useCallback((statusItem) => {
  //   if (statusItem === "All") {
  //     // For "All", clear statuslabelid
  //     setStatusFilter("all");
  //     setFilters((prev) => ({ ...prev, status: null, pagenumber: 1 }));
  //   } else {
  //     // Assume statusItem is an object with 'id' and 'name'
  //     const statusId = statusItem.id; // Adjust if property is different, e.g., statusItem.statuslabelid
  //     const statusKey = getStatusKey(statusItem); // For UI highlighting
  //     setStatusFilter(statusKey);
  //     setFilters((prev) => ({ ...prev, status: statusId, pagenumber: 1 }));
  //   }
  // }, []);

  // Handle search (on Enter)
  const handleSearch = useCallback(
    (e) => {
      if (e.key === "Enter") {
        const trimmed = searchInput.trim();
        setFilters((prev) => ({ ...prev, search: trimmed, pagenumber: 1 }));
        // setSearchText(trimmed);
      }
    },
    [searchInput]
  );

  // Handle sort change
  const handleSortChange = useCallback((value) => {
    const [sortby, sortorder] = value.split("_");
    setFilters((prev) => ({ ...prev, sortby, sortorder, pagenumber: 1 }));
  }, []);

  // Handle checkbox change for providers (modal-only)
  const handleProviderChange = useCallback((id) => {
    setTempFilters((prev) => {
      const updated = prev.providers.includes(id)
        ? prev.providers.filter((v) => v !== id)
        : [...prev.providers, id];
      return { ...prev, providers: updated };
    });
  }, []);
  // Handle budget change (modal-only)
  const handleBudgetChange = useCallback((type, value) => {
    setTempFilters((prev) => ({ ...prev, [type]: value }));
  }, []);
  // Handle date range change (modal-only)
  const handleDateChange = useCallback((dates) => {
    if (dates) {
      setTempFilters((prev) => ({
        ...prev,
        startdate: dates[0],
        enddate: dates[1],
      }));
    } else {
      setTempFilters((prev) => ({ ...prev, startdate: null, enddate: null }));
    }
  }, []);

  // Handle pagination change
  const handlePaginationChange = useCallback((pageNumber, size) => {
    setFilters((prev) => ({ ...prev, pagenumber: pageNumber, pagesize: size }));
  }, []);

  // Clear all filters (resets both temp and main, refetches)
  const clearFilters = useCallback(() => {
    const resetFilters = {
      status: "all",
      providers: [],
      minbudget: "",
      maxbudget: "",
      startdate: null,
      enddate: null,
      sortby: "createddate",
      sortorder: "desc",
      pagenumber: 1,
      pagesize: 10,
      search: "",
    };
    setFilters(resetFilters);
    setTempFilters(resetFilters);
    //setStatusFilter("all");
    // setSearchText("");
    setSearchInput("");
    fetchCampaigns(); // Refetch with reset
    setShowFilter(false);
  }, [fetchCampaigns]);

  // Apply filters (merges temp to main, refetches, closes modal)
  const applyFilters = useCallback(() => {
    setFilters(tempFilters);
    fetchCampaigns(); // Only now refetch
    setShowFilter(false);
  }, [tempFilters, fetchCampaigns]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    fetchStatuses();
    getAllPlatforms();
  }, [token]);

  // Reset page size on resize (like in Browse)
  useEffect(() => {
    const handleResize = () => {
      const newPageSize = window.innerWidth < 640 ? 10 : 15;

      setFilters((prev) => {
        // Only update if the pageSize actually changes to avoid unnecessary fetch
        if (prev.pagesize !== newPageSize) {
          return {
            ...prev,
            pagesize: newPageSize,
            pagenumber: 1,
          };
        }
        return prev;
      });
    };

    // Debounce resize to 300ms
    const debouncedResize = debounce(handleResize, 300);

    window.addEventListener("resize", debouncedResize);

    return () => window.removeEventListener("resize", debouncedResize);
  }, []);


  const paginatedData = useMemo(() => campaigns, [campaigns]); // Server-side pagination, so full campaigns are the "paginated" data

  return (
    <div className="w-full text-sm pb-24 sm:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            My Campaigns
          </h2>
          <p className="text-gray-600 text-sm">Your Campaigns Overview</p>
        </div>
        <button
          onClick={() =>
            navigate("/vendor-dashboard/vendor-campaign/my-campaigns")
          }
          className="flex cursor-pointer items-center justify-center gap-2 px-5 py-2 rounded-full bg-[#141843] text-white font-medium hover:bg-[#1d214f] transition-all duration-200"
        >
          <RiAddFill />
          Add Campaign
        </button>
      </div>
      {/* Status Tabs
      <div className="bg-white p-3 sm:p-4 rounded-lg mb-6 overflow-x-auto">
        <div className="flex gap-3 flex-nowrap">
          {statusList.map((statusItem) => {
            const id = getStatusKey(statusItem);
            const label =
              typeof statusItem === "string"
                ? statusItem
                : statusLabels[getStatusKey(statusItem.name)] || statusItem.name;

            const uniqueKey =
              typeof statusItem === "object" && statusItem.id
                ? statusItem.id
                : id;

            return (
              <button
                key={uniqueKey}
                onClick={() => handleStatusFilter(statusItem)}
                className={`px-3 sm:px-4 py-2 rounded-lg border transition font-medium ${statusFilter === id
                  ? "bg-[#141843] text-white border-[#141843]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div> */}


      {/* Search, Sort, and Filter Header */}
      <div className="bg-white p-4 rounded-lg mb-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            prefix={<SearchOutlined />}
            size="large"
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

          {/* Status Dropdown */}
          <div className="flex-shrink-0 w-full sm:w-38">
            <Select
              size="large"
              value={filters.status || "all"}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value === "all" ? null : value,
                  pagenumber: 1,
                }))
              }
              placeholder="Status"
              className="w-full"
            >
              {statusList.map((statusItem) => {
                const key =
                  typeof statusItem === "object" && statusItem.id
                    ? statusItem.id
                    : getStatusKey(statusItem);
                const label =
                  typeof statusItem === "string"
                    ? statusItem
                    : statusLabels[getStatusKey(statusItem.name)] || statusItem.name;
                return (
                  <Option key={key} value={key}>
                    {label}
                  </Option>
                );
              })}
            </Select>
          </div>


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
                className="flex cursor-pointer items-center justify-center gap-2 border border-gray-200 rounded-md px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 transition flex-1 sm:w-auto"
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
          <table className="w-full text-left min-w-[750px]">
            <thead className="bg-white text-gray-700 text-sm tracking-wide">
              <tr>
                <th className="p-4">Campaign Name</th>
                <th className="p-4 min-w-[100px]">Budget</th>
                <th className="p-4 min-w-[100px]">Total Proposal</th>
                <th className="p-4 min-w-[80px]"> Campaign Start</th>
                <th className="p-4 min-w-[80px]"> Campaign End</th>
                <th className="p-4 min-w-40">Status</th>
                {/* <th className="p-4">Action</th> */}
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {loading ? (
                [...Array(6)].map((_, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td colSpan="6" className="p-4">
                      <Skeleton active paragraph={{ rows: 1 }} />
                    </td>
                  </tr>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-gray-200 hover:bg-gray-200 transition cursor-pointer"
                    onClick={() =>
                      navigate(`/vendor-dashboard/vendor-campaign/campaignDetails/${row.id}`)
                    }
                  >
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={getImageUrl(row.photopath)}
                        alt={row.name}
                        onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <span>{row.name}</span>
                    </td>
                    <td className="p-4">
                      ₹{Number(row?.estimatedbudget || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="p-4">{row.applicationcount}</td>
                    <td className="p-4">{row.campaignstartdate}</td>
                    <td className="p-4">{row.campaignenddate}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[getStatusKey(row.status)] ||
                          "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {statusLabels[getStatusKey(row.status)] || row.status}
                      </span>
                    </td>

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
          Showing {campaigns.length} of {totalCampaigns} Results
        </p>
        <Pagination
          current={filters.pagenumber}
          total={totalCampaigns}
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
            className="fixed inset-0 bg-black/30 z-40 cursor-pointer"
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
                    className="p-2 cursor-pointer rounded-full bg-[#141843] text-white hover:bg-[#1d214f] transition"
                  >
                    <RiFilterLine size={18} />
                  </button>
                </Tooltip>

                <Tooltip title="Close">
                  <button
                    onClick={() => setShowFilter(false)}
                    className="p-2 cursor-pointer rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
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
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {platforms.map((platform) => (
                    <label
                      key={platform.id}
                      className="flex items-center cursor-pointer"
                    >
                      <Checkbox
                        checked={tempFilters.providers.includes(platform.id)} // Use tempFilters
                        onChange={() => handleProviderChange(platform.id)} // Updates temp only
                      />
                      <span className="text-sm text-gray-700 ml-2">
                        {platform.name}
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
                  onChange={(e) =>
                    handleBudgetChange("minbudget", e.target.value)
                  } // Updates temp only
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#141843]"
                />
                <Input
                  placeholder="Max Budget"
                  type="number"
                  value={tempFilters.maxbudget} // Use tempFilters
                  onChange={(e) =>
                    handleBudgetChange("maxbudget", e.target.value)
                  } // Updates temp only
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#141843]"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Filter campaigns by estimated budget range.
              </p>
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
                style={{ padding: "8px 12px" }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Filter by campaign start and end dates.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VendorCampaignsLayout;












{/* Search, Status, Sort, and Filter Header */ }
// <div className="bg-white p-4 rounded-lg mb-4">
//   <div className="flex flex-wrap items-center gap-3">
//     {/* Search Input */}
//     <div className="flex-grow min-w-[200px]">
//       <Input
//         prefix={<SearchOutlined />}
//         size="large"
//         placeholder="Search campaigns, Budget, Status..."
//         value={searchInput}
//         onChange={(e) => setSearchInput(e.target.value)}
//         onKeyDown={handleSearch}
//         suffix={
//           searchInput && (
//             <Tooltip title="Clear search" placement="top">
//               <CloseCircleFilled
//                 onClick={() => {
//                   setSearchInput("");
//                   setFilters((prev) => ({ ...prev, search: "" }));
//                 }}
//                 className="text-gray-400 hover:text-gray-600 cursor-pointer"
//               />
//             </Tooltip>
//           )
//         }
//       />
//     </div>

//     {/* Status Dropdown */}
//     <div className="flex-shrink-0 w-full sm:w-48">
//       <Select
//         size="large"
//         value={filters.status || "all"}
//         onChange={(value) =>
//           setFilters((prev) => ({
//             ...prev,
//             status: value === "all" ? null : value,
//             pagenumber: 1,
//           }))
//         }
//         placeholder="Status"
//         className="w-full"
//       >
//         {statusList.map((statusItem) => {
//           const key =
//             typeof statusItem === "object" && statusItem.id
//               ? statusItem.id
//               : getStatusKey(statusItem);
//           const label =
//             typeof statusItem === "string"
//               ? statusItem
//               : statusLabels[getStatusKey(statusItem.name)] || statusItem.name;
//           return (
//             <Option key={key} value={key}>
//               {label}
//             </Option>
//           );
//         })}
//       </Select>
//     </div>

//     {/* Sort Dropdown */}
//     <div className="flex-shrink-0 w-full sm:w-48">
//       <Select
//         size="large"
//         value={`${filters.sortby}_${filters.sortorder}`}
//         onChange={handleSortChange}
//         placeholder="Sort By"
//         className="w-full"
//         suffixIcon={<RiArrowDownSLine size={16} />}
//       >
//         {sortOptions.map((option) => (
//           <Option key={option.value} value={option.value}>
//             {option.label}
//           </Option>
//         ))}
//       </Select>
//     </div>

//     {/* Filter Button */}
//     <div className="flex-shrink-0 w-full sm:w-auto">
//       <button
//         onClick={() => {
//           setTempFilters(filters);
//           setShowFilter(true);
//         }}
//         className="flex items-center justify-center gap-2 border border-gray-200 rounded-md px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 transition w-full sm:w-auto"
//       >
//         Filter
//         <RiEqualizerFill size={16} />
//       </button>
//     </div>
//   </div>
// </div>