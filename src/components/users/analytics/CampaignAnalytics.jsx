import TopContentChart from "./TopContentChart";
import PerformanceChart from "./PerformanceChart";
import EngagementGauge from "./EngagementGauge";
import { RiChat1Line, RiEyeLine, RiHeartLine, RiShareForwardLine } from "react-icons/ri";

const CampaignAnalytics = () => {
    const campaign = {
        name: "Summer Glow Skincare Campaign",
        platforms: ["Instagram", "TikTok"],
        totalViews: 82000,
        totalLikes: 12500,
        totalComments: 2150,
        totalShares: 980,
    };

    return (
        <div className="w-full space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0D132D]">{campaign.name}</h2>
                <p className="text-gray-500 text-sm sm:text-base">Campaign performance summary</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard
                    label="Total Views"
                    value={campaign.totalViews.toLocaleString()}
                    icon={<RiEyeLine size={20} className="text-[#335CFF]" />}
                />
                <StatCard
                    label="Likes"
                    value={campaign.totalLikes.toLocaleString()}
                    icon={<RiHeartLine size={20} className="text-[#FF5C5C]" />}
                />
                <StatCard
                    label="Comments"
                    value={campaign.totalComments.toLocaleString()}
                    icon={<RiChat1Line size={20} className="text-[#22C55E]" />}
                />
                <StatCard
                    label="Shares"
                    value={campaign.totalShares.toLocaleString()}
                    icon={<RiShareForwardLine size={20} className="text-[#F59E0B]" />}
                />
            </div>

            {/* Performance Chart */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm w-full">
                <h2 className="text-lg sm:text-xl font-bold mb-4">Performance Over Time</h2>
                <div className="w-full h-64 sm:h-72 md:h-80 lg:h-96">
                    <PerformanceChart />
                </div>
            </div>

            {/* Engagement & Top Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Engagement Gauge */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm w-full">
                    <EngagementGauge
                        views={campaign.totalViews}
                        likes={campaign.totalLikes}
                        comments={campaign.totalComments}
                        shares={campaign.totalShares}
                    />
                </div>

                {/* Top Performing Content */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm w-full">
                    <h2 className="text-lg sm:text-xl font-bold mb-4">Top Performing Content</h2>

                    <TopContentChart />
                </div>
            </div>
        </div>
    );
};

export default CampaignAnalytics;

// Mini Overview Card
const StatCard = ({ label, value, icon }) => (
    <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-3">
        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
            {icon}
        </div>
        <div className="flex flex-col">
            <p className="text-gray-500 text-xs sm:text-sm">{label}</p>
            <p className="text-lg sm:text-xl font-bold text-[#0D132D] mt-1 sm:mt-2">{value}</p>
        </div>
    </div>
);
