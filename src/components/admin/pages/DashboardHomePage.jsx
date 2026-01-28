
import { useEffect, useState } from 'react';
import StatCard from '../chunks/StatCard';
import {
    RiUserAddLine,
    RiTimeLine,
    RiBarChartLine,
} from "react-icons/ri";
import api from '../../../api/axios';
import { useSelector } from 'react-redux';
import { Skeleton } from 'antd';
import { useNavigate } from "react-router-dom";


const DashboardHomePage = () => {
    const [allCounts, setAllCounts] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { token } = useSelector(state => state.auth);

    const fetchCountsValues = async () => {
        try {
            setLoading(true);

            const res = await api.get('/admin/dashboard', {
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
        { title: "Pending Influencers", value: allCounts.pendinguser, icon: RiUserAddLine, iconColor: "text-blue-500", redirect: "/admin-dashboard/influencers?status=pending" },
        { title: "Approved Influencers", value: allCounts.approveduser, icon: RiUserAddLine, iconColor: "text-green-500", redirect: "/admin-dashboard/influencers?status=approved" },
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

            </div>

        </>
    )
}

export default DashboardHomePage
