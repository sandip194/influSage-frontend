import React, { useEffect, useState } from "react";
import { Tabs, Input, Tooltip, Select, Drawer, Checkbox, Radio, Button } from "antd";
import {
    RiEyeLine,
    RiCheckLine,
    RiCloseLine,
    RiArrowDownSLine,
} from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";

// Mock data
const mockUsers = [
    {
        id: 1,
        name: "Jane Fitness",
        email: "jane.fitness@email.com",
        avatar: "https://i.pravatar.cc/100?img=1",
        date: "2025-10-06",
        status: "Pending",
        platforms: ["IG", "TikTok"],
        followers: { IG: "45K", TikTok: "120K" },
        category: "Fitness",
        location: "Los Angeles, USA",
    },
    {
        id: 2,
        name: "Alex Tech",
        email: "alex.tech@email.com",
        avatar: "https://i.pravatar.cc/100?img=2",
        date: "2025-10-07",
        status: "Approved",
        platforms: ["YouTube"],
        followers: { YouTube: "80K" },
        category: "Tech",
        location: "New York, USA",
    },
    {
        id: 3,
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        avatar: "https://i.pravatar.cc/100?img=3",
        date: "2025-10-09",
        status: "Pending",
        platforms: ["IG"],
        followers: { IG: "22K" },
        category: "Food",
        location: "Mumbai, India",
    },
    {
        id: 4,
        name: "Liam Travel",
        email: "liam.travel@email.com",
        avatar: "https://i.pravatar.cc/100?img=4",
        date: "2025-10-08",
        status: "Rejected",
        platforms: ["TikTok"],
        followers: { TikTok: "200K" },
        category: "Travel",
        location: "Sydney, Australia",
    },
    {
        id: 5,
        name: "Sophia Beauty",
        email: "sophia.beauty@email.com",
        avatar: "https://i.pravatar.cc/100?img=5",
        date: "2025-10-05",
        status: "Approved",
        platforms: ["IG", "YouTube"],
        followers: { IG: "60K", YouTube: "100K" },
        category: "Beauty",
        location: "London, UK",
    },
    {
        id: 6,
        name: "Carlos Gamer",
        email: "carlos.gamer@email.com",
        avatar: "https://i.pravatar.cc/100?img=6",
        date: "2025-10-04",
        status: "Pending",
        platforms: ["YouTube", "TikTok"],
        followers: { YouTube: "150K", TikTok: "300K" },
        category: "Gaming",
        location: "Madrid, Spain",
    },
    {
        id: 7,
        name: "Emily DIY",
        email: "emily.diy@email.com",
        avatar: "https://i.pravatar.cc/100?img=7",
        date: "2025-10-03",
        status: "Approved",
        platforms: ["IG"],
        followers: { IG: "38K" },
        category: "DIY",
        location: "Toronto, Canada",
    },
    {
        id: 8,
        name: "Mohammed Tech",
        email: "mohammed.tech@email.com",
        avatar: "https://i.pravatar.cc/100?img=8",
        date: "2025-10-02",
        status: "Rejected",
        platforms: ["YouTube"],
        followers: { YouTube: "95K" },
        category: "Tech",
        location: "Dubai, UAE",
    },
    {
        id: 9,
        name: "Linda Cook",
        email: "linda.cook@email.com",
        avatar: "https://i.pravatar.cc/100?img=9",
        date: "2025-10-01",
        status: "Approved",
        platforms: ["IG", "TikTok"],
        followers: { IG: "70K", TikTok: "90K" },
        category: "Food",
        location: "Berlin, Germany",
    },
    {
        id: 10,
        name: "David Green",
        email: "david.green@email.com",
        avatar: "https://i.pravatar.cc/100?img=10",
        date: "2025-09-30",
        status: "Pending",
        platforms: ["Facebook"],
        followers: { Facebook: "25K" },
        category: "Environment",
        location: "Cape Town, South Africa",
    },
    {
        id: 11,
        name: "Zara Fashion",
        email: "zara.fashion@email.com",
        avatar: "https://i.pravatar.cc/100?img=11",
        date: "2025-09-29",
        status: "Approved",
        platforms: ["IG"],
        followers: { IG: "88K" },
        category: "Fashion",
        location: "Paris, France",
    },
    {
        id: 12,
        name: "Kenji Art",
        email: "kenji.art@email.com",
        avatar: "https://i.pravatar.cc/100?img=12",
        date: "2025-09-28",
        status: "Rejected",
        platforms: ["YouTube", "IG"],
        followers: { YouTube: "60K", IG: "35K" },
        category: "Art",
        location: "Tokyo, Japan",
    },
    {
        id: 13,
        name: "Fatima Wellness",
        email: "fatima.wellness@email.com",
        avatar: "https://i.pravatar.cc/100?img=13",
        date: "2025-09-27",
        status: "Pending",
        platforms: ["IG", "Facebook"],
        followers: { IG: "42K", Facebook: "30K" },
        category: "Wellness",
        location: "Casablanca, Morocco",
    },
    {
        id: 14,
        name: "Noah Books",
        email: "noah.books@email.com",
        avatar: "https://i.pravatar.cc/100?img=14",
        date: "2025-09-26",
        status: "Approved",
        platforms: ["YouTube"],
        followers: { YouTube: "55K" },
        category: "Books",
        location: "Dublin, Ireland",
    },
    {
        id: 15,
        name: "Chloe Dance",
        email: "chloe.dance@email.com",
        avatar: "https://i.pravatar.cc/100?img=15",
        date: "2025-09-25",
        status: "Rejected",
        platforms: ["TikTok"],
        followers: { TikTok: "180K" },
        category: "Dance",
        location: "Rio de Janeiro, Brazil",
    },
];


const platformColors = {
    IG: "bg-pink-200 text-pink-700",
    TikTok: "bg-black text-white",
    YouTube: "bg-red-200 text-red-700",
};

const categoryColors = {
    Fitness: "bg-orange-100 text-orange-600",
    Tech: "bg-blue-100 text-blue-600",
    Food: "bg-yellow-100 text-yellow-600",
};


const UserTableLayout = () => {
    const [activeTab, setActiveTab] = useState("Approved");
    const [statusList, setStatusList] = useState([])
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    // const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState({
        location: "",
        platforms: [],
        followers: "all",
        ratings: [],
        gender: "all",
        language: "all",
    });

    const { token } = useSelector(state => state.auth);

    // Filtered users (basic name/email search + status tab)
    const filteredUsers = mockUsers.filter(
        (user) =>
            user.status === activeTab &&
            (user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()))
    );

    //fetch status list 
    const fetchAllStatus = async () => {
        try {
            const res = await axios.get('/admin/dashboard/user-status', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(res.status === 200) setStatusList(res.data.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchAllStatus()
    }, [])

    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h2>
                <p className="text-gray-600 text-sm">Manage users based on their status</p>
            </div>

            {/* Tabs */}
            <Tabs
                defaultActiveKey="Approved"
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)}
                items={["Approved", "Pending", "Rejected"].map((tab) => ({
                    key: tab,
                    label: tab,
                }))}
                className="mb-4"
            />

            {/* Controls */}
            <div className="flex bg-white shadow-sm p-3 rounded-t-2xl flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                <Input
                    size="large"
                    prefix={<SearchOutlined />}
                    placeholder="Search users"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-1/3"
                />

                <div className="flex gap-2 w-full sm:w-auto">
                    <Select
                        size="large"
                        defaultValue="created_desc"
                        className="w-full sm:w-48"
                        suffixIcon={<RiArrowDownSLine size={16} />}
                    >
                        <Select.Option value="created_desc">Newest</Select.Option>
                        <Select.Option value="created_asc">Oldest</Select.Option>
                    </Select>

                    <Button
                        type="default"
                        size="large"
                        onClick={() => setShowFilters(true)}
                        className="w-full sm:w-auto"
                    >
                        Filters
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-sm rounded-b-2xl overflow-hidden mt-0">
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-white text-gray-700 text-sm tracking-wide">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Platforms</th>
                                <th className="p-4">Followers</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Applied On</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm text-gray-700">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-t border-gray-200 hover:bg-gray-50 transition"
                                    >
                                        {/* Avatar + Name */}
                                        <td className="px-4 py-3 flex items-center space-x-3">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <span className="font-medium">{user.name}</span>
                                        </td>

                                        {/* Email */}
                                        <td className="p-4">{user.email}</td>

                                        {/* Platforms */}
                                        <td className="p-4 space-x-1">
                                            {user.platforms.map((platform) => (
                                                <span
                                                    key={platform}
                                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${platformColors[platform]}`}
                                                >
                                                    {platform}
                                                </span>
                                            ))}
                                        </td>

                                        {/* Followers */}
                                        <td className="p-4">
                                            {Object.entries(user.followers).map(([platform, count]) => (
                                                <div key={platform}>
                                                    <span className="font-medium">{platform}:</span> {count}
                                                </div>
                                            ))}
                                        </td>

                                        {/* Category */}
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[user.category]}`}
                                            >
                                                {user.category}
                                            </span>
                                        </td>

                                        {/* Location */}
                                        <td className="p-4">{user.location}</td>

                                        {/* Date */}
                                        <td className="p-4">{user.date}</td>

                                        {/* Actions */}
                                        <td className="p-4 text-right space-x-3">
                                            <Tooltip title="View Details">
                                                <button className="text-gray-500 hover:text-blue-600 transition">
                                                    <RiEyeLine size={18} />
                                                </button>
                                            </Tooltip>

                                            {user.status === "Pending" && (
                                                <>
                                                    <Tooltip title="Approve">
                                                        <button className="text-green-600 hover:text-green-700 transition">
                                                            <RiCheckLine size={18} />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Reject">
                                                        <button className="text-red-600 hover:text-red-700 transition">
                                                            <RiCloseLine size={18} />
                                                        </button>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-10 text-gray-500">
                                        No users found in this category.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* Filter Drawer */}
            <Drawer
                title="Filter Users"
                placement="right"
                width={300}
                onClose={() => setShowFilters(false)}
                open={showFilters}
            >
                {/* Location */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Location</h4>
                    <Input
                        placeholder="Enter location"
                        value={filters.location}
                        onChange={(e) =>
                            setFilters((prev) => ({ ...prev, location: e.target.value }))
                        }
                    />
                </div>

                {/* Platforms */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Platform</h4>
                    <Checkbox.Group
                        options={["Instagram", "YouTube", "Facebook", "TikTok"]}
                        value={filters.platforms}
                        onChange={(checked) =>
                            setFilters((prev) => ({ ...prev, platforms: checked }))
                        }
                    />
                </div>

                {/* Followers */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Followers</h4>
                    <Radio.Group
                        value={filters.followers}
                        onChange={(e) =>
                            setFilters((prev) => ({ ...prev, followers: e.target.value }))
                        }
                    >
                        <Radio value="all">All</Radio>
                        <Radio value="nano">Nano</Radio>
                        <Radio value="micro">Micro</Radio>
                        <Radio value="macro">Macro</Radio>
                        <Radio value="mega">Mega</Radio>
                    </Radio.Group>
                </div>

                {/* Ratings */}
                {/* <div className="mb-6">
          <h4 className="font-semibold mb-2">Ratings</h4>
          {[5, 4, 3, 2, 1].map((star) => (
            <Checkbox
              key={star}
              checked={filters.ratings.includes(star)}
              onChange={() =>
                setFilters((prev) => ({
                  ...prev,
                  ratings: prev.ratings.includes(star)
                    ? prev.ratings.filter((s) => s !== star)
                    : [...prev.ratings, star],
                }))
              }
            >
              {Array.from({ length: star }).map((_, i) => "⭐")}
            </Checkbox>
          ))}
        </div> */}

                {/* Gender */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Gender</h4>
                    <Radio.Group
                        value={filters.gender}
                        onChange={(e) =>
                            setFilters((prev) => ({ ...prev, gender: e.target.value }))
                        }
                    >
                        <Radio value="all">All</Radio>
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                    </Radio.Group>
                </div>

                {/* Language */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Language</h4>
                    <Checkbox.Group
                        options={["English", "Hindi", "Gujarati"]}
                        value={filters.language === "all" ? [] : [filters.language]}
                        onChange={(checked) =>
                            setFilters((prev) => ({
                                ...prev,
                                language: checked.length === 0 ? "all" : checked[0],
                            }))
                        }
                    />
                </div>

                <div className="flex justify-between items-center mt-6">
                    <Button
                        type="link"
                        onClick={() =>
                            setFilters({
                                location: "",
                                platforms: [],
                                followers: "all",
                                ratings: [],
                                gender: "all",
                                language: "all",
                            })
                        }
                    >
                        Clear Filters
                    </Button>
                    <Button type="primary" onClick={() => setShowFilters(false)}>
                        Apply
                    </Button>
                </div>
            </Drawer>
        </div>
    );
};

export default UserTableLayout;
