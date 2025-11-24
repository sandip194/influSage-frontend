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
  Empty,
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
  RiProhibitedLine,
  RiCloseFill,
  RiFilterLine,
  RiEraserLine,
  RiEqualizerFill
} from "react-icons/ri";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { safeText, safeArray, safeNumber } from "../../../App/safeAccess";

const { RangePicker } = DatePicker;


const sortOptions = [
  { value: "createddate_desc", label: "Newest" },
  { value: "createddate_asc", label: "Oldest" },
  { value: "estimatedbudget_desc", label: "Budget: High to Low" },
  { value: "estimatedbudget_asc", label: "Budget: Low to High" },
];

const CampaignTableLayout = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 🧩 State Management
  const [statusList, setStatusList] = useState([]);
  const [activeStatusId, setActiveStatusId] = useState();
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

  // New states for reject modal
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false)

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
        p_statuslabelid: activeStatusId,
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
    const init = async () => {
      await fetchStatusList();
      await fetchPlatforms();
    };
    init();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");

    // if status exists in URL → open its tab
    if (status && statusList.length > 0) {
      const matched = statusList.find(s =>
        s.name.toLowerCase().includes(status.toLowerCase())
      );
      if (matched) {
        setActiveStatusId(String(matched.id));
        return;
      }
    }

    // else → open first tab
    if (statusList.length > 0 && !activeStatusId) {
      setActiveStatusId(String(statusList[0].id));
    }
  }, [location.search, statusList]);


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

    if (type === 'Rejected') {
      setIsRejectModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };



  const activeStatusName = statusList.find(s => String(s.id) === String(activeStatusId))?.name;


  // New function for reject with reason
  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }

    try {
      setRejectLoading(true)
      const res = await axios.post('/admin/dashboard/reject/profile-or-campaign', {
        p_campaignid: currentCampaignId,
        p_text: rejectReason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        fetchCampaigns();
        toast.success(res.data?.message || "Campaign rejected successfully");
        setIsRejectModalOpen(false);
        setRejectReason("");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to reject Campaign");
    } finally {
      setRejectLoading(false)
    }
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
      <div className="flex flex-wrap gap-2 mb-4 bg-white p-3 rounded-lg">
        {statusList.map((status) => (
          <button
            key={status.id}
            onClick={() => {
              setActiveStatusId(String(status.id));
              setPage(1);
            }}
            className={`px-4 py-2 rounded-md border border-gray-300 transition
              ${String(activeStatusId) === String(status.id)
                ? "bg-[#0f122f] text-white"
                : "bg-white text-[#141843] hover:bg-gray-100"
              }
            `}
          >
            {status.name}
          </button>
        ))}
      </div>

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

        {/* SORT + FILTER — footer only on mobile */}
        <div
          className="
            flex gap-2
            w-full
            sm:w-auto sm:static sm:gap-2
            fixed bottom-0 left-0 bg-white p-3 shadow-md justify-center z-30
            sm:shadow-none sm:bg-transparent sm:p-0
          "
        >
          <Select
            size="large"
            value={`${filters.sortBy}_${filters.sortOrder}`}
            onChange={handleSortChange}
            className="w-full sm:w-48"
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
            onClick={() => setShowFilters(true)}
            className="w-full sm:w-auto font-semibold"
          >
            Filters <RiEqualizerFill size={16} />
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
        ) : campaignList?.length > 0 ? (
          <table className="min-w-[1100px] w-full text-left text-sm">
            {/* Table Header */}
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-4 min-w-[300px]">Campaign</th>
                <th className="p-4 min-w-[100px]">Vendor</th>
                <th className="p-4 min-w-[150px]">Categories</th>
                <th className="p-4 min-w-[150px]">Platforms</th>
                <th className="p-4 min-w-[100px]">Budget</th>
                <th className="p-4 whitespace-nowrap min-w-[100px]">Campaign Start Date</th>
                <th className="p-4 whitespace-nowrap min-w-[100px]">Campaign End Date</th>

                {/* ✅ Show Status column only for "Approved" tab */}
                {activeStatusName === "Approved" && <th className="p-4 min-w-[150px]">Campaign Status</th>}

                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>


            <tbody>
              {campaignList?.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/admin-dashboard/campaigns/details/${c.id}`)}
                  className="border-t border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                >
                  {/* Campaign */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {c.photopath ? (
                        <img
                          src={c.photopath}
                          alt={safeText(c.name)}
                          className="w-12 h-12 object-cover rounded-full border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{safeText(c.name)}</div>
                      </div>
                    </div>
                  </td>

                  {/* Vendor */}
                  <td className="p-4">{safeText(c.firstname)}</td>

                  {/* Categories */}
                  <td className="p-4">
                    {safeArray(c.campaigncategories).length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {c.campaigncategories.map((cat) => (
                          <span
                            key={cat.id}
                            className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-100"
                          >
                            {safeText(cat.categoryname)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No categories</span>
                    )}
                  </td>

                  {/* Platforms */}
                  <td className="p-4">
                    {safeArray(c.providercontenttype).length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {c.providercontenttype.map((p, i) => (
                          <span
                            key={i}
                            className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-full border border-purple-100"
                          >
                            {`${safeText(p.providername)} (${safeText(p.contenttypename)})`}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No platforms</span>
                    )}
                  </td>

                  {/* Budget */}
                  <td className="p-4">
                    ₹ {safeNumber(c.estimatedbudget).toLocaleString()}
                  </td>

                  {/* Start Date */}
                  <td className="p-4 whitespace-nowrap">
                    {safeText(c.campaignstartdate)}
                  </td>

                  {/* End Date */}
                  <td className="p-4 whitespace-nowrap">
                    {safeText(c.campaignenddate)}
                  </td>

                  {/* Status */}
                  {activeStatusName === "Approved" && (
                    <td className="p-4">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.status === "Approved"
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : c.status === "Rejected"
                              ? "bg-red-50 text-red-700 border border-red-100"
                              : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                          }`}
                      >
                        {safeText(c.status)}
                      </span>
                    </td>
                  )}


                  {/* Actions */}
                  <td className="p-4 text-right space-x-2">
                    <div
                      className="flex justify-end items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >

                      {/* Conditional buttons based on activeStatusName */}
                      {activeStatusName === "ApprovalPending" && (
                        <>
                          <Tooltip title="Approve">
                            <button
                              onClick={() => openConfirmationModal(c, 'Approved')}
                              className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-full hover:bg-green-50 text-green-600 hover:text-green-700 transition"
                            >
                              <RiCheckLine size={18} />
                            </button>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <button
                              onClick={() => openConfirmationModal(c, 'Rejected')}
                              className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 text-red-600 hover:text-red-700 transition"
                            >
                              <RiCloseLine size={18} />
                            </button>
                          </Tooltip>

                        </>
                      )}

                      {activeStatusName === "Approved" && (
                        <Tooltip title="Block">
                          <button
                            onClick={() => openConfirmationModal(c, 'Blocked')}
                            className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 text-red-600 hover:text-red-700 transition"
                          >
                            <RiProhibitedLine size={18} />
                          </button>
                        </Tooltip>
                      )}

                      {activeStatusName === "Rejected" && (
                        <Tooltip title="Approve">
                          <button
                            onClick={() => openConfirmationModal(c, 'Approved')}
                            className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-full hover:bg-green-50 text-green-600 hover:text-green-700 transition"
                          >
                            <RiCheckLine size={18} />
                          </button>
                        </Tooltip>
                      )}


                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // 🪶 Empty state
          <div className="py-16 flex justify-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span className="text-gray-500">No Campaign found for this status.</span>}
            />
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
          Are you sure you want to <strong>{actionType.toLowerCase()}</strong> Campaign{" "}
          <span className="font-bold text-gray-800">
            {currentCampaign?.name}
          </span>
          ?
        </p>
      </Modal>

      {/* Reject Reason Modal */}
      <Modal
        title={`Reject :- ${currentCampaign?.name}`}
        open={isRejectModalOpen}
        onOk={handleRejectSubmit}
        onCancel={() => {
          setIsRejectModalOpen(false);
          setRejectReason("");
        }}
        okText="Confirm Reject"
        okButtonProps={{
          danger: true,
          className: "bg-red-600 hover:bg-red-700 text-white mt-4",
          disabled: rejectLoading,
        }}
        cancelButtonProps={{
          disabled: rejectLoading,
        }}
      >
        <p className="mb-4 text-gray-700">
          Please provide a reason for rejecting this Campaign:
        </p>
        <Input.TextArea
          placeholder="Enter rejection reason..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={4}
          maxLength={250}
          showCount={{ formatter: ({ count, maxLength }) => `${count} / ${maxLength}` }}
        />
      </Modal>

      {/* Filters Drawer */}
      <Drawer
        closeIcon={false}
        title={
          <div className="flex justify-between items-center w-full">
            <span className="font-semibold">Filter Campaigns</span>

            <div className="flex items-center gap-2">
              <Tooltip title="Clear Filters">
                <button
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
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  <RiEraserLine size={18} />
                </button>
              </Tooltip>
              <Tooltip title="Apply Filters">
                <button
                  onClick={handleFilterApply}
                  className="p-2 rounded-full bg-[#0f122f] text-white hover:bg-[#23265a] transition"
                >
                  <RiFilterLine size={18} />
                </button>
              </Tooltip>
              <Tooltip title="Close">
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <RiCloseFill size={20} />
                </button>
              </Tooltip>
            </div>
          </div>
        }
        placement="right"
        width={300}
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
      </Drawer>
    </div>
  );
};

export default CampaignTableLayout;
