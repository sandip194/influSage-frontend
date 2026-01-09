import React, { useCallback, useEffect, useState } from "react";
import {
    Input,
    Drawer,
    Checkbox,
    Button,
    Pagination,
    Tooltip,
    Modal,
    Skeleton,
    Empty,
} from "antd";
import {
    RiCheckLine,
    RiCloseLine,
    RiProhibitedLine,
    RiCloseFill,
    RiFilterLine,
    RiEraserLine,
    RiEqualizerFill
} from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";
import { toast } from 'react-toastify';
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { safeText, safeArray, safeNumber, safeDate } from "../../../App/safeAccess";


const normalizeStatus = (status = "") =>
    status.replace(/\s+/g, "");

const columnsByStatus = {
    ApprovalPending: ["Influencer", "Email", "Followers", "Category", "Location", "AppliedOn", "Actions"],
    Approved: ["Influencer", "Email", "Approved By", "Approved On", "Actions"],
    Rejected: ["Influencer", "Email", "Rejected By", "Rejected On", "Actions"],
    Blocked: ["Influencer", "Email", "Blocked By", "Blocked On", "Actions"],
};


const UserTableLayout = () => {
    const { token } = useSelector((state) => state.auth);
    // const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const [statusList, setStatusList] = useState([]); // Dynamic tabs
    const [activeStatusId, setActiveStatusId] = useState(null);
    const [blockReasonlist, setBlockReasonList] = useState(null)
    const [userList, setUserList] = useState([]);
    const [platforms, setPlatforms] = useState([]); // Dynamic platforms
    const [genders, setGenders] = useState([]); // Dynamic genders
    const [influencerTiers, setInfluencerTiers] = useState([]); // Dynamic followers tiers
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        location: "",
        platforms: [],  // Array for multiple selections
        followers: [],  // Changed to array for multiple selections
        gender: [],     // Changed to array for multiple selections
    });

    const [currentUser, setCurrentUser] = useState(null); // store full user object
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [actionType, setActionType] = useState(""); // 'Approved', 'Rejected', or 'Blocked'

    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState(null);

    // New states for reject modal
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectLoading, setRejectLoading] = useState(false)
    const location = useLocation();

    const fetchStatusList = async () => {
        try {
            const res = await axios.get("/admin/dashboard/user-status", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 200 && Array.isArray(res.data?.data)) {
                const statuses = res.data.data;
                setStatusList(statuses);
                if (statuses.length > 0 && !activeStatusId) {  // Only set to first if not already set
                    setActiveStatusId(statuses[0].id);
                }
            }
        } catch (err) {
            console.error("Error fetching statuses:", err);
        }
    };

    const fetchUserRequests = async () => {
        try {
            setLoading(true);
            const params = {
                p_statuslabelid: activeStatusId,
                p_location: filters.location || null,
                p_providers: filters.platforms.length > 0 ? JSON.stringify(filters.platforms) : null,
                p_influencertiers: filters.followers.length > 0 ? JSON.stringify(filters.followers) : null,
                p_genders: filters.gender.length > 0 ? JSON.stringify(filters.gender) : null,
                p_pagenumber: page,
                p_pagesize: pageSize,
                p_search: search || null,
            };

            const res = await axios.get("/admin/dashboard/user-requests", {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });

            if (res.status === 200) {
                setUserList(res.data?.data?.records || []);
                setTotalCount(res.data?.data?.totalcount || 0);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBlockResons = async () => {
        try {
            const res = await axios.get("/admin/dashboard/user-block-reason", {
                headers: { Authorization: `Bearer ${token}` },
            })

            setBlockReasonList(res?.data?.data)
        } catch (error) {
            console.error(error)
        }
    }

    const fetchPlatforms = async () => {
        try {
            const res = await axios.get('providers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlatforms(res.data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchGenders = async () => {
        try {
            const res = await axios.get('genders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGenders(res.data.genders || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchInfluFollowers = async () => {
        try {
            const res = await axios.get('influencer-type', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInfluencerTiers(res.data.influencerType || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (userID, statusName) => {
        try {
            const res = await axios.post('/admin/dashboard/approved-or-rejected', { p_userid: userID, p_statusname: statusName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) {
                // Refresh the user list after successful submission
                fetchUserRequests();
                toast.success(res.data?.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Failed to delete reference file"
            );
        }
    };

    const openConfirmationModal = (user, type) => {
        setCurrentUser(user);
        setCurrentUserId(user.id);
        setActionType(type);

        if (type === 'Rejected') {
            setIsRejectModalOpen(true);
        } else if (type === 'Blocked') {
            fetchBlockResons(); // Ensure we have the reasons
            setIsBlockModalOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };

    // Run initial fetches only once on mount
    useEffect(() => {
        fetchPlatforms();
        fetchGenders();
        fetchInfluFollowers();
        fetchStatusList();
    }, []);

    // Fetch user requests when activeStatusId, page, pageSize, or search changes
    useEffect(() => {
        if (activeStatusId) {
            fetchUserRequests();
        }
    }, [activeStatusId, page, pageSize, search]);

    const handleFilterApply = () => {
        setShowFilters(false);
        setPage(1);
        fetchUserRequests();
    };

    const handleProviderChange = useCallback((checkedValues) => {
        setFilters((prev) => ({ ...prev, platforms: checkedValues }));
    }, []);

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            setSearch(searchInput);
            setPage(1);
        }
    };

    const handleBlockSubmit = async () => {
        if (!selectedReason) {
            toast.error("Please select a reason to block this user.");
            return;
        }

        try {
            const res = await axios.post('/admin/dashboard/profile-campaign-block', {
                p_userid: currentUserId,
                p_objective: selectedReason,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 200) {
                toast.success(res.data?.message || "User blocked successfully");
                fetchUserRequests();
                setIsBlockModalOpen(false);
                setSelectedReason(null);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to block user");
        }
    };

    // New function for reject with reason
    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) {
            toast.error("Please provide a reason for rejection.");
            return;
        }

        try {
            setRejectLoading(true)
            const res = await axios.post('/admin/dashboard/reject/profile-or-campaign', {
                p_userid: currentUserId,
                p_text: rejectReason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) {
                fetchUserRequests();
                toast.success(res.data?.message || "User rejected successfully");
                setIsRejectModalOpen(false);
                setRejectReason("");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to reject user");
        } finally {
            setRejectLoading(false)
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get("status");

        if (status && statusList.length > 0) {
            const matched = statusList.find(
                (s) => s.name.toLowerCase().includes(status.toLowerCase())
            );
            if (matched) {
                setActiveStatusId(matched.id);
            }
        }
    }, [location.search, statusList]);

    const activeStatusName = normalizeStatus(
        statusList.find(s => s.id === activeStatusId)?.name
    );

    const activeColumns = columnsByStatus[activeStatusName] || [];


    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Influencer Management
                </h2>
                <p className="text-gray-600 text-sm">
                    Manage Influencers by their current status
                </p>
            </div>

            {/* Dynamic Tabs */}
            <div className="flex flex-wrap gap-2 mb-4 bg-white p-3 rounded-lg">
                {statusList.map((status) => (
                    <button
                        key={status.id}
                        onClick={() => {
                            setActiveStatusId(status.id);
                            setPage(1);
                            setFilters({
                                location: "",
                                platforms: [],
                                followers: [],
                                gender: [],
                            });
                        }}
                        className={`px-4 py-2 rounded-md border border-gray-300 transition
                        ${Number(activeStatusId) === Number(status.id)
                                ? "bg-[#0f122f] text-white"
                                : "bg-white text-[#141843] hover:bg-gray-100"
                            }`}
                    >
                        {status.name}
                    </button>
                ))}
            </div>

            {/* Search + Filter */}
            <div className="flex bg-white shadow-sm p-3 rounded-t-2xl flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                <Input
                    prefix={<SearchOutlined />}
                    size="large"
                    placeholder="Search Influencers..."
                    className="w-full sm:w-72"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleSearch}
                />
                <div
                    className="
                    flex gap-2
                    fixed bottom-0 left-0 w-full bg-white shadow-md p-3 justify-center z-30
                    sm:static sm:bg-transparent sm:shadow-none sm:p-0 sm:w-auto sm:justify-end
                "
                >
                    <Button
                        type="default"
                        size="large"
                        onClick={() => setShowFilters(true)}
                        className="w-full sm:w-auto font-semibold"
                    >
                        Filters <RiEqualizerFill size={16} />
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-sm rounded-b-2xl mt-0 border border-gray-100">
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">

                    {loading ? (
                        /* Skeleton Loader */
                        <table className="w-full text-left border-collapse text-sm sm:text-base min-w-[700px] md:min-w-full">
                            <thead className="bg-gray-100 text-gray-700 text-xs sm:text-sm uppercase tracking-wide">
                                <tr>
                                    <th className="p-4">Influencer</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Followers</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Location</th>
                                    <th className="p-4">Applied On</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm bg-white text-gray-700">
                                {[...Array(6)].map((_, i) => (
                                    <tr key={i} className="border-t border-gray-200 hover:bg-gray-50 transition">
                                        <td className="px-4">
                                            <div className="flex items-center space-x-3">
                                                <Skeleton.Avatar active size="large" shape="circle" />
                                                <Skeleton.Input active size="small" style={{ width: 100 }} />
                                            </div>
                                        </td>

                                        <td className="p-4"><Skeleton.Input active size="small" style={{ width: 160 }} /></td>
                                        <td className="p-4"><Skeleton.Input active size="small" style={{ width: 100 }} /></td>
                                        <td className="p-4"><Skeleton.Input active size="small" style={{ width: 120 }} /></td>
                                        <td className="p-4"><Skeleton.Input active size="small" style={{ width: 90 }} /></td>
                                        <td className="p-4"><Skeleton.Input active size="small" style={{ width: 80 }} /></td>

                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Skeleton.Avatar active size="small" shape="circle" />
                                                <Skeleton.Avatar active size="small" shape="circle" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    ) : safeArray(userList).length > 0 ? (

                        /* Main Table */
                        <table className="w-full text-left border-collapse text-sm sm:text-base min-w-[700px] md:min-w-full">
                            <thead className="bg-gray-100 text-gray-700 text-xs sm:text-sm uppercase tracking-wide">
                                <tr>
                                    {activeColumns.map((col) => (
                                        <th key={col} className="p-3 text-left min-w-[100px]">
                                            {col === "AppliedOn" ? "Applied On" : col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>


                            <tbody className="text-sm bg-white text-gray-700">
                                {safeArray(userList).map((user) => (
                                    <tr
                                        key={user?.id ?? crypto.randomUUID()}
                                        onClick={() => navigate(`/admin-dashboard/influencers/details/${safeText(user?.id, "")}`)}
                                        className="border-t border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                                    >
                                        {activeColumns.map((col) => {
                                            switch (col) {
                                                case "Influencer":
                                                    return (
                                                        <td key="Influencer" className="px-4">
                                                            <div className="flex items-center space-x-3">
                                                                <img
                                                                    src={user?.photopath}
                                                                    alt={safeText(user?.firstname, "Influencer")}
                                                                    onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                                                    className="w-10 h-10 rounded-full object-cover" />
                                                                <span className="font-medium">{safeText(user?.firstname)} {safeText(user?.lastname)}</span>
                                                            </div>
                                                        </td>
                                                    );

                                                case "Email":
                                                    return <td key="Email" className="p-4">{safeText(user?.email)}</td>;

                                                case "Followers":
                                                    return (
                                                        <td key="Followers" className="p-4">
                                                            {safeArray(user?.providers).map((p) => (
                                                                <div key={p?.providerid ?? crypto.randomUUID()}>
                                                                    <span className="font-medium">{safeText(p?.providername, "Unknown")}:</span>{" "}
                                                                    {safeNumber(p?.nooffollowers).toLocaleString()}
                                                                </div>
                                                            ))}
                                                        </td>
                                                    );

                                                case "Category":
                                                    return (
                                                        <td key="Category" className="p-4">
                                                            {safeArray(user?.categories).map((c) => (
                                                                <span key={c?.categoryid ?? crypto.randomUUID()} className="inline-block mr-1 mb-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                                    {safeText(c?.categoryname)}
                                                                </span>
                                                            ))}
                                                        </td>
                                                    );

                                                case "Location":
                                                    return <td key="Location" className="p-4">{safeText(user?.statename)}</td>;

                                                case "AppliedOn":
                                                    return <td key="Applied On" className="p-4">{safeDate(user?.createddate)}</td>;

                                                case "Approved By":
                                                    return (
                                                        <td key="Approved By" className="p-4">
                                                            {safeText(user?.["Approved By"], "—")}
                                                        </td>
                                                    );

                                                case "Approved On":
                                                    return (
                                                        <td key="Approved On" className="p-4">
                                                            {safeDate(user?.["Approved On"])}
                                                        </td>
                                                    );

                                                case "Rejected By":
                                                    return (
                                                        <td key="Rejected By" className="p-4">
                                                            {safeText(user?.["Rejected By"], "—")}
                                                        </td>
                                                    );

                                                case "Rejected On":
                                                    return (
                                                        <td key="Rejected On" className="p-4">
                                                            {safeDate(user?.["Rejected On"])}
                                                        </td>
                                                    );

                                                case "Blocked By":
                                                    return (
                                                        <td key="Blocked By" className="p-4">
                                                            {safeText(user?.["Blocked By"], "—")}
                                                        </td>
                                                    );

                                                case "Blocked On":
                                                    return (
                                                        <td key="Blocked On" className="p-4">
                                                            {safeDate(user?.["Blocked On"])}
                                                        </td>
                                                    );


                                                case "Actions":
                                                    return (
                                                        <td key="Actions" className="px-4 py-3 text-right">
                                                            <div
                                                                className="flex justify-right items-center gap-1"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {normalizeStatus(user?.status) === "ApprovalPending" && (
                                                                    <>
                                                                        <Tooltip title="Approve">
                                                                            <button
                                                                                onClick={() => openConfirmationModal(user, "Approved")}
                                                                                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-green-50 text-green-600 hover:text-green-700 transition"
                                                                            >
                                                                                <RiCheckLine size={18} />
                                                                            </button>
                                                                        </Tooltip>

                                                                        <Tooltip title="Reject">
                                                                            <button
                                                                                onClick={() => openConfirmationModal(user, "Rejected")}
                                                                                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 text-red-600 hover:text-red-700 transition"
                                                                            >
                                                                                <RiCloseLine size={18} />
                                                                            </button>
                                                                        </Tooltip>
                                                                    </>
                                                                )}
                                                                {normalizeStatus(user?.status) === "Approved" && (
                                                                    <Tooltip title="Block">
                                                                        <button
                                                                            onClick={() => openConfirmationModal(user, "Blocked")}
                                                                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 text-red-600 hover:text-red-700 transition"
                                                                        >
                                                                            <RiProhibitedLine size={18} />
                                                                        </button>
                                                                    </Tooltip>
                                                                )}

                                                                {normalizeStatus(user?.status) === "Rejected" && (
                                                                    <Tooltip title="Approve">
                                                                        <button
                                                                            onClick={() => openConfirmationModal(user, "Approved")}
                                                                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-green-50 text-green-600 hover:text-green-700 transition"
                                                                        >
                                                                            <RiCheckLine size={18} />
                                                                        </button>
                                                                    </Tooltip>
                                                                )}
                                                            </div>
                                                        </td>
                                                    );

                                                default:
                                                    return null;
                                            }

                                        })}
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    ) : (

                        /* EMPTY STATE */
                        <div className="py-16 flex justify-center">
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={<span className="text-gray-500">No users found for this status.</span>}
                            />
                        </div>
                    )}
                </div>
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
                    handleSubmit(currentUserId, actionType);
                    setIsModalOpen(false);
                }}
                onCancel={() => setIsModalOpen(false)}
                okText={`Yes, ${actionType}`}
                cancelText="Cancel"
                okButtonProps={{
                    type: actionType === 'Rejected' || actionType === 'Blocked' ? 'default' : 'primary',
                    danger: actionType === 'Rejected' || actionType === 'Blocked',
                    className: actionType === 'Approved' ? 'bg-green-600 hover:bg-green-700 text-white' : '',
                }}
            >
                <p>
                    Are you sure you want to <strong>{actionType.toLowerCase()}</strong> user{" "}
                    <span className="font-bold text-gray-800">
                        {currentUser?.firstname} {currentUser?.lastname}
                    </span>
                    ?
                </p>
            </Modal>

            {/* Reject Reason Modal */}
            <Modal
                title={`Reject ${currentUser?.firstname} ${currentUser?.lastname}`}
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
                    Please provide a reason for rejecting this user:
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

            {/* Block Reason Modal */}
            <Modal
                title={`Block ${currentUser?.firstname} ${currentUser?.lastname}`}
                open={isBlockModalOpen}
                onOk={handleBlockSubmit}
                onCancel={() => {
                    setIsBlockModalOpen(false);
                    setSelectedReason(null);
                }}
                okText="Confirm Block"
                okButtonProps={{
                    danger: true,
                    className: "bg-red-600 hover:bg-red-700 text-white",
                }}
            >
                <p className="mb-4 text-gray-700">
                    Please select a reason for blocking this user:
                </p>

                {blockReasonlist?.length > 0 ? (
                    <div className="space-y-3">
                        {blockReasonlist.map((reason) => (
                            <label
                                key={reason.id}
                                className="flex items-center gap-2 cursor-pointer text-gray-800"
                            >
                                <input
                                    type="radio"
                                    name="blockReason"
                                    value={reason.id}
                                    checked={selectedReason === reason.id}
                                    onChange={(e) => setSelectedReason(Number(e.target.value))}

                                />
                                <span>{reason.name}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No reasons found.</p>
                )}
            </Modal>

            {/* Filter Drawer */}
            <Drawer
                closeIcon={false}
                title={
                    <div className="flex justify-between items-center w-full">
                        <span className="font-semibold">Filter Users</span>

                        <div className="flex items-center gap-2">
                            <Tooltip title="Clear Filters">
                                <button
                                    onClick={() =>
                                        setFilters({
                                            location: "",
                                            platforms: [],
                                            followers: [],
                                            gender: [],
                                        })
                                    }
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
                {/* Providers/Platforms */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-3">Providers/Platforms</h4>
                    {platforms.length === 0 ? (
                        <p className="text-sm text-gray-500">No platforms available.</p>
                    ) : (
                        <Checkbox.Group
                            value={filters.platforms}
                            onChange={handleProviderChange}
                        // className="w-full"
                        >
                            <div className="space-y-2 ">
                                {platforms.map((platform) => (
                                    <label key={platform.id} className="flex items-center cursor-pointer">
                                        <Checkbox value={platform.id} />
                                        <span className="text-sm text-gray-700 ml-2">{platform.name}</span>
                                    </label>
                                ))}
                            </div>
                        </Checkbox.Group>
                    )}
                </div>

                {/* Followers */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Followers</h4>
                    <Checkbox.Group
                        value={filters.followers}
                        onChange={(checkedValues) => setFilters((prev) => ({ ...prev, followers: checkedValues }))}
                    >
                        <div className="space-y-2">
                            {influencerTiers.map((tier) => (
                                <label key={tier.id} className="flex items-center cursor-pointer">
                                    <Checkbox value={tier.id} />
                                    <span className="text-sm text-gray-700 ml-2">
                                        {tier.name} ({tier.minfollowers} - {tier.maxfollowers !== null ? tier.maxfollowers : 'and above'})
                                    </span>
                                </label>
                            ))}
                        </div>
                    </Checkbox.Group>
                </div>


                {/* Gender */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Gender</h4>
                    <Checkbox.Group
                        value={filters.gender}
                        onChange={(checkedValues) => setFilters((prev) => ({ ...prev, gender: checkedValues }))}
                    >
                        <div className="space-y-2">
                            {genders.map((gender) => (
                                <label key={gender.id} className="flex items-center cursor-pointer">
                                    <Checkbox value={gender.id} />
                                    <span className="text-sm text-gray-700 ml-2">{gender.name}</span>
                                </label>
                            ))}
                        </div>
                    </Checkbox.Group>
                </div>


            </Drawer>
        </div>
    );
};

export default UserTableLayout;




