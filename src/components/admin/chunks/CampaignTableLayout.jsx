import React, { useState, useEffect, useCallback } from "react";
import {
  Tabs,
  Input,
  Button,
  Pagination,
  Drawer,
  Checkbox,
  Tooltip,
  Modal,
  Select,
  DatePicker,
  InputNumber,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  RiEyeLine,
  RiCheckLine,
  RiCloseLine,
  RiArrowDownSLine,
} from "react-icons/ri";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const { RangePicker } = DatePicker;


const sortOptions = [
  { value: "createddate_desc", label: "Newest" },
  { value: "createddate_asc", label: "Oldest" },
  { value: "estimatedbudget_desc", label: "Budget: High to Low" },
  { value: "estimatedbudget_asc", label: "Budget: Low to High" },
];

const CampaignTableLayout = () => {
  const { token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 🧩 State Management
  const [statusList, setStatusList] = useState([]);
  const [activeStatusId, setActiveStatusId] = useState("all");
  const [campaignList, setCampaignList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [platforms, setPlatforms] = useState([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    providers: [],
    minBudget: null,
    maxBudget: null,
    startDate: null,
    endDate: null,
    sortBy: "createddate",
    sortOrder: "desc",
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);


  const [showFilters, setShowFilters] = useState(false);

  const [actionType, setActionType] = useState("");
  const [currentCampaign, setCurrentCampaign] = useState(null); // store full Campaign object
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCampaignId, setCurrentCampaignId] = useState(null);

  // 📍 Fetch Status Tabs
  const fetchStatusList = async () => {
    try {
      const res = await axios.get("/admin/dashboard/campaign-status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200 && Array.isArray(res.data?.data)) {
        setStatusList(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching campaign statuses:", error);
    }
  };

  // 📍 Fetch Providers
  const fetchPlatforms = async () => {
    try {
      const res = await axios.get("/providers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlatforms(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching platforms:", error);
    }
  };

  // 📍 Fetch Campaigns
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = {
        p_statuslabelid: activeStatusId === "all" ? null : activeStatusId,
        p_providers:
          appliedFilters.providers.length > 0
            ? JSON.stringify(appliedFilters.providers)
            : null,
        p_minbudget: appliedFilters.minBudget || null,
        p_maxbudget: appliedFilters.maxBudget || null,
        p_startdate: appliedFilters.startDate || null,
        p_enddate: appliedFilters.endDate || null,
        p_sortby: appliedFilters.sortBy,
        p_sortorder: appliedFilters.sortOrder,
        p_pagenumber: page,
        p_pagesize: pageSize,
        p_search: search || null,
      };

      const res = await axios.get("/admin/dashboard/campaign-requests", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      if (res.status === 200) {
        setCampaignList(res.data?.data?.records || []);
        setTotalCount(res.data?.data?.totalcount || 0);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (id, statusName) => {
    try {
      const res = await axios.post('/admin/dashboard/approved-or-rejected', { p_campaignid: id, p_statusname: statusName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        // Refresh the campaigns list after successful submission
        fetchCampaigns();
        toast.success(res.data?.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to delete reference file"
      );
    }
  };
  // 🧠 Hooks
  useEffect(() => {
    fetchStatusList();
    fetchPlatforms();
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [activeStatusId, page, pageSize, search, appliedFilters]);




  // 🔍 Search Handler
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearch(searchInput);
      setPage(1);
    }
  };

  const handleSortChange = useCallback((value) => {
    const [sortBy, sortOrder] = value.split("_");

    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
    setAppliedFilters((prev) => ({ ...prev, sortBy, sortOrder }));

    setPage(1);
  }, []);

  const handleFilterApply = () => {
    setAppliedFilters(filters);
    setShowFilters(false);
    setPage(1);
  };



  const openConfirmationModal = (campaign, type) => {
    setCurrentCampaign(campaign);
    setCurrentCampaignId(campaign.id);
    setActionType(type);
    setIsModalOpen(true);
  };

  // 🧱 UI
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Campaign Management
        </h2>
        <p className="text-sm text-gray-600">
          Manage and moderate campaigns.
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={String(activeStatusId)}
        onChange={(key) => {
          setActiveStatusId(key);
          setPage(1);
        }}
        items={[
          { key: "all", label: "All" },
          ...statusList.map((status) => ({
            key: String(status.id),
            label: status.name,
          })),
        ]}
        className="mb-4"
      />

      {/* Search + Filters + Sort */}
      <div className="flex flex-col mb-2 sm:flex-row sm:items-center sm:justify-between gap-4 bg-white shadow-sm p-3 rounded-t-2xl">
        <Input
          prefix={<SearchOutlined />}
          size="large"
          placeholder="Search campaigns..."
          className="w-full sm:w-72"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearch}
        />

        <div className="flex gap-2">

          <Select
            size="large"
            value={`${filters.sortBy}_${filters.sortOrder}`}
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

          <Button
            size="large"
            icon={<FilterOutlined />}
            onClick={() => setShowFilters(true)}
          >
            Filters
          </Button>
        </div>
      </div>


      {/* Table */}
      <div className="bg-white shadow-sm rounded-b-2xl mt-0 border border-gray-100 overflow-x-auto">
        {loading ? (
          // 🧱 Skeleton Loader
          <div className="p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-100 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                  <div className="space-y-2">
                    <div className="w-40 h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="w-24 h-3 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : campaignList.length > 0 ? (
          <table className="min-w-[1100px] w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-4">Campaign</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Categories</th>
                <th className="p-4">Platforms</th>
                <th className="p-4">Budget</th>
                <th className="p-4 whitespace-nowrap">Start Date</th>
                <th className="p-4 whitespace-nowrap">End Date</th>
                {/* Status column visible only in "All" tab */}
                {activeStatusId === "all" && <th className="p-4">Status</th>}
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {campaignList.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  {/* Campaign */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {c.photopath ? (
                        <img
                          src={`${BASE_URL}/${c.photopath}`}
                          alt={c.name}
                          className="w-12 h-12 object-cover rounded-full border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{c.name}</div>
                      </div>
                    </div>
                  </td>

                  {/* Vendor */}
                  <td className="p-4">{c.firstname || "—"}</td>

                  {/* Categories */}
                  <td className="p-4">
                    {c.campaigncategories?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {c.campaigncategories.map((cat) => (
                          <span
                            key={cat.id}
                            className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-100"
                          >
                            {cat.categoryname}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No categories</span>
                    )}
                  </td>

                  {/* Platforms */}
                  <td className="p-4">
                    {c.providercontenttype?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {c.providercontenttype.map((p, i) => (
                          <span
                            key={i}
                            className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-full border border-purple-100"
                          >
                            {p.providername} ({p.contenttypename})
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No platforms</span>
                    )}
                  </td>

                  {/* Budget */}
                  <td className="p-4">
                    ₹ {c.estimatedbudget?.toLocaleString() || "—"}
                  </td>

                  {/* Start Date */}
                  <td className="p-4 whitespace-nowrap">
                    {c.startdate || "—"}
                  </td>

                  {/* End Date */}
                  <td className="p-4 whitespace-nowrap">
                    {c.enddate || "—"}
                  </td>

                  {/* Status (only in All tab) */}
                  {activeStatusId === "all" && (
                    <td className="p-4">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.status === "Approved"
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : c.status === "Rejected"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                          }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  )}

                  {/* Actions */}
                  <td className="p-4 text-right space-x-2">
                    <div className="flex justify-start items-center gap-1">

                      <Tooltip title="View">
                        <button
                          className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-full hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition"
                        >
                          <RiEyeLine size={18} />
                        </button>
                      </Tooltip>

                      {/* Only show Approve/Reject when NOT in Rejected tab */}
                      {c.status !== "Rejected" && (
                        <>
                          <Tooltip title="Approve">
                            <button
                              onClick={() => openConfirmationModal(c, 'Approved')}  // Added onClick handler
                              className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-full hover:bg-green-50 text-green-600 hover:text-green-700 transition"
                            >
                              <RiCheckLine size={18} />
                            </button>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <button
                              onClick={() => openConfirmationModal(c, 'Rejected')}  // Added onClick handler
                              className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 text-red-600 hover:text-red-700 transition"
                            >
                              <RiCloseLine size={18} />
                            </button>
                          </Tooltip>
                        </>
                      )}

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // 🪶 Empty state
          <div className="text-center py-16 text-gray-500">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="empty"
              className="w-20 h-20 mx-auto mb-3 opacity-60"
            />
            <p className="text-gray-600 font-medium">No campaigns found</p>
          </div>
        )}
      </div>


      {/* Pagination */}
      <div className="flex justify-end py-4">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={totalCount}
          onChange={(p, ps) => {
            setPage(p);
            setPageSize(ps);
          }}
          showSizeChanger
        />
      </div>

      {/* confirmation Modal */}
      <Modal
        title={`Confirm ${actionType}`}
        open={isModalOpen}
        onOk={() => {
          handleSubmit(currentCampaignId, actionType);
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
        okText={`Yes, ${actionType}`}
        cancelText="Cancel"
        okButtonProps={{
          type: actionType === 'Rejected' ? 'default' : 'primary',
          danger: actionType === 'Rejected',
          className: actionType === 'Approved' ? 'bg-green-600 hover:bg-green-700 text-white' : '',
        }}
      >
        <p>
          Are you sure you want to <strong>{actionType.toLowerCase()}</strong> user{" "}
          <span className="font-bold text-gray-800">
            {currentCampaign?.name}
          </span>
          ?
        </p>
      </Modal>

      {/* Filters Drawer */}
      <Drawer
        title="Filter Campaigns"
        placement="right"
        width={320}
        onClose={() => setShowFilters(false)}
        open={showFilters}
      >
        {/* Providers */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Providers/Platforms</h4>
          <Checkbox.Group
            value={filters.providers}
            onChange={(vals) =>
              setFilters((prev) => ({ ...prev, providers: vals }))
            }
          >
            <div className="space-y-2">
              {platforms.map((p) => (
                <label key={p.id} className="flex items-center cursor-pointer">
                  <Checkbox value={p.id} />
                  <span className="ml-2 text-sm text-gray-700">{p.name}</span>
                </label>
              ))}
            </div>
          </Checkbox.Group>
        </div>

        {/* Budget Range */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Budget Range ($)</h4>
          <div className="flex items-center gap-2">
            <InputNumber
              placeholder="Min"
              min={0}
              value={filters.minBudget}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, minBudget: val }))
              }
              className="w-1/2"
            />
            <InputNumber
              placeholder="Max"
              min={0}
              value={filters.maxBudget}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, maxBudget: val }))
              }
              className="w-1/2"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Campaign Duration</h4>
          <RangePicker
            className="w-full"
            onChange={(dates, dateStrings) => {
              setFilters((prev) => ({
                ...prev,
                startDate: dateStrings[0] || null,
                endDate: dateStrings[1] || null,
              }));
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6">
          <Button
            type="link"
            onClick={() => {
              const cleared = {
                providers: [],
                minBudget: null,
                maxBudget: null,
                startDate: null,
                endDate: null,
                sortBy: "createddate",
                sortOrder: "desc",
              };
              setFilters(cleared);
              setAppliedFilters(cleared);
            }}
          >
            Clear Filters
          </Button>

          <Button type="primary" onClick={handleFilterApply}>
            Apply
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default CampaignTableLayout;
