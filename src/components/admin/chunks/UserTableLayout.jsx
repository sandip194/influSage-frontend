import React, { useCallback, useEffect, useState } from "react";
import {
    Tabs,
    Input,
    Drawer,
    Checkbox,
    Button,
    Pagination,
    Tooltip,
    Modal,
} from "antd";
import {
    RiEyeLine,
    RiCheckLine,
    RiCloseLine,
} from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";
import { toast } from 'react-toastify';
import axios from "axios";
import { useSelector } from "react-redux";

const UserTableLayout = () => {
    const { token } = useSelector((state) => state.auth);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [statusList, setStatusList] = useState([]); // Dynamic tabs
    const [activeStatusId, setActiveStatusId] = useState(null);
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
    const [actionType, setActionType] = useState(""); // 'Approved' or 'Rejected'


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
        setIsModalOpen(true);
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



    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    User Management
                </h2>
                <p className="text-gray-600 text-sm">
                    Manage users by their current status
                </p>
            </div>

            {/* Dynamic Tabs */}
            <Tabs
                activeKey={String(activeStatusId)}
                onChange={(key) => {
                    setActiveStatusId(Number(key));
                    setPage(1);
                    setFilters({
                        location: "",
                        platforms: [],
                        followers: [],
                        gender: [],
                    })
                }}
                items={statusList.map((status) => ({
                    key: String(status.id),
                    label: status.name,
                }))}
                className="mb-4"
            />

            {/* Search + Filter */}
            <div className="flex bg-white shadow-sm p-3 rounded-t-2xl flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                <Input
                    prefix={<SearchOutlined />}
                    size="large"
                    placeholder="Search users..."
                    className="w-full sm:w-72"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleSearch}
                />
                <div className="flex gap-2 w-full sm:w-auto">

                    <Button type="default" size="large" onClick={() => setShowFilters(true)}>
                        Filters
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-sm rounded-b-2xl mt-0 border border-gray-100">
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {loading ? (
                        <p className="text-center py-10 text-gray-500">Loading...</p>
                    ) : userList.length > 0 ? (
                        <table className="w-full text-left border-collapse text-sm sm:text-base min-w-[700px] md:min-w-full">
                            <thead className="bg-gray-100 text-gray-700 text-xs sm:text-sm uppercase tracking-wide">
                                <tr>
                                    <th className="px-4 py-3 sm:px-4">User</th>
                                    <th className="px-4 py-3 sm:px-4">Email</th>
                                    <th className="px-4 py-3 sm:px-4">Followers</th>
                                    <th className="px-4 py-3 sm:px-4">Category</th>
                                    <th className="px-4 py-3 sm:px-4">Location</th>
                                    <th className="px-4 py-3 sm:px-4">Applied On</th>
                                    <th className="px-4 py-3 sm:px-4 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm bg-white text-gray-700">
                                {userList.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-t border-gray-200 hover:bg-gray-100 transition"
                                    >
                                        <td className="px-4 py-3 flex items-center space-x-3">
                                            <img
                                                src={`${BASE_URL}/${user.photopath}`}
                                                alt={user.firstname}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <span className="font-medium">
                                                {user.firstname} {user.lastname}
                                            </span>
                                        </td>
                                        <td className="p-4">{user.email}</td>

                                        <td className="p-4">
                                            {user.providers?.map((p) => (
                                                <div key={p.providerid}>
                                                    <span className="font-medium">{p.providername}:</span>{" "}
                                                    {p.nooffollowers?.toLocaleString()}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="p-4">
                                            {user.categories.map((c) => (
                                                <span
                                                    key={c.categoryid}
                                                    className={`inline-block mr-1 mb-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 }`}
                                                >
                                                    {c.categoryname}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="p-4">{user.statename}</td>
                                        <td className="p-4">
                                            {new Date(user.createddate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end items-center gap-1">
                                                <Tooltip title="View">
                                                    <button
                                                        className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-full hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition"
                                                    >
                                                        <RiEyeLine size={18} />
                                                    </button>
                                                </Tooltip>

                                                {user.status === "ApprovalPending" && (
                                                    <>
                                                        <Tooltip title="Approve">
                                                            <button
                                                                onClick={() => openConfirmationModal(user, 'Approved')}  // Added onClick handler
                                                                className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-full hover:bg-green-50 text-green-600 hover:text-green-700 transition"
                                                            >
                                                                <RiCheckLine size={18} />
                                                            </button>
                                                        </Tooltip>

                                                        <Tooltip title="Reject">
                                                            <button
                                                                onClick={() => openConfirmationModal(user, 'Rejected')}  // Added onClick handler
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
                        <p className="text-center py-10 text-gray-500">
                            No users found for this status.
                        </p>
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
                    type: actionType === 'Rejected' ? 'default' : 'primary',
                    danger: actionType === 'Rejected',
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


            {/* Filter Drawer */}
            <Drawer
                title="Filter Users"
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

                <div className="flex justify-between items-center mt-6">
                    <Button
                        type="link"
                        onClick={() =>
                            setFilters({
                                location: "",
                                platforms: [],
                                followers: [],
                                gender: [],
                            })
                        }
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

export default UserTableLayout;