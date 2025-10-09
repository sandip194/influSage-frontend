
import CampaignTable from '../chunks/CampaignTable';
import CampaignTableLayout from '../chunks/CampaignTableLayout';
import InfluencerTable from '../chunks/InfluencerTable';
import StatCard from '../chunks/StatCard';
import UserRequestRow from '../chunks/UserRequestRow';
import UserTableLayout from '../chunks/UserTableLayout';
import AdminDashboardLayout from '../dashboard/AdminDashboardLayout'
import {
    RiUserAddLine,
    // RiUserCheckLine,
    RiTimeLine,
    RiBarChartLine,
} from "react-icons/ri";


const stats = [
    { title: "Pending Users", value: 12, icon: RiUserAddLine, iconColor: "text-blue-500" },
    { title: "Approved Users", value: 248, icon: RiUserAddLine, iconColor: "text-green-500" },
    { title: "Pending Campaigns", value: 8, icon: RiTimeLine, iconColor: "text-yellow-500" },
    { title: "Active Campaigns", value: 34, icon: RiBarChartLine, iconColor: "text-purple-500" },
];

const userRequests = [
    {
        user: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        role: "Content Creator",
        date: "2024-01-15",
        status: "Pending",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        user: "Mike Chen",
        email: "mike.chen@email.com",
        role: "Brand Manager",
        date: "2024-01-14",
        status: "Pending",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
        user: "Emma Davis",
        email: "emma.davis@email.com",
        role: "Influencer",
        date: "2024-01-13",
        status: "Approved",
        avatar: "https://randomuser.me/api/portraits/women/46.jpg",
    },
];

const DashboardHomePage = () => {
    return (
        <AdminDashboardLayout>
            <div className="space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <StatCard key={idx} {...stat} />
                    ))}
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

            <div className="mt-10">

                <UserTableLayout />
            </div>

            <div className="mt-10">

                <CampaignTableLayout />
            </div>
        </AdminDashboardLayout>
    )
}

export default DashboardHomePage