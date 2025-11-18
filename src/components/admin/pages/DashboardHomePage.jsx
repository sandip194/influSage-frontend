
import { useEffect, useState } from 'react';
import StatCard from '../chunks/StatCard';
import {
    RiUserAddLine,
    RiTimeLine,
    RiBarChartLine,
} from "react-icons/ri";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Skeleton } from 'antd';
import { useNavigate } from "react-router-dom";




// const userRequests = [
//     {
//         user: "Sarah Johnson",
//         email: "sarah.johnson@email.com",
//         role: "Content Creator",
//         date: "2024-01-15",
//         status: "Pending",
//         avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//         user: "Mike Chen",
//         email: "mike.chen@email.com",
//         role: "Brand Manager",
//         date: "2024-01-14",
//         status: "Pending",
//         avatar: "https://randomuser.me/api/portraits/men/45.jpg",
//     },
//     {
//         user: "Emma Davis",
//         email: "emma.davis@email.com",
//         role: "Influencer",
//         date: "2024-01-13",
//         status: "Approved",
//         avatar: "https://randomuser.me/api/portraits/women/46.jpg",
//     },
// ];

const DashboardHomePage = () => {
    const [allCounts, setAllCounts] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { token } = useSelector(state => state.auth);

    const fetchCountsValues = async () => {
        try {
            setLoading(true);

            const res = await axios.get('/admin/dashboard', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 200) {
                setAllCounts(res.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCountsValues();
    }, []);

    // Create dynamic stat cards from API data
    const stats = allCounts
    ? [
        { title: "Pending Users", value: allCounts.pendinguser, icon: RiUserAddLine, iconColor: "text-blue-500", redirect: "/admin-dashboard/influencers?status=pending" },
        { title: "Approved Users", value: allCounts.approveduser, icon: RiUserAddLine, iconColor: "text-green-500", redirect: "/admin-dashboard/influencers?status=approved" },
        { title: "Pending Campaigns", value: allCounts.pendingcampaign, icon: RiTimeLine, iconColor: "text-yellow-500", redirect: "/admin-dashboard/campaigns?status=pending" },
        { title: "Active Campaigns", value: allCounts.activecampaign, icon: RiBarChartLine, iconColor: "text-purple-500", redirect: "/admin-dashboard/campaigns?status=approve" },
        ]
    : [];
    return (
        <>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading
                        ? Array.from({ length: 4 }).map((_, idx) => (
                            <div key={idx} className="flex items-center p-4 shadow rounded-lg bg-white">
                                {/* Left icon skeleton */}
                                <Skeleton.Avatar active size="large" shape="circle" className="mr-4" />
                                {/* Right text skeleton */}
                                <div className="flex-1">
                                    <Skeleton.Input active size="small" className="w-24 mb-2" />
                                    <Skeleton.Input active size="default" className="w-16" />
                                </div>
                            </div>
                        ))
                        : stats.map((stat, idx) => (
                        <div key={idx} onClick={() => navigate(stat.redirect)} className="cursor-pointer">
                            <StatCard {...stat} />
                        </div>
                        ))
                    }
                </div>

                {/* User Requests Table */}
                {/* <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">Recent User Requests</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100 text-left text-sm text-gray-600 uppercase">
                                    <th className="px-4 py-2">User</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Role</th>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userRequests.map((req, idx) => (
                                    <UserRequestRow key={idx} {...req} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div> */}
            </div>

            {/* <div className="mt-10">

                <UserTableLayout />
            </div>

            <div className="mt-10">

                <CampaignTableLayout />
            </div> */}

        </>
    )
}

export default DashboardHomePage
