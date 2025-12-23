import React from 'react'
import ProfileComplation from '../../../components/users/InfluencerDashboardHome/ProfileComplation'
import CampaignStats from '../../../components/users/InfluencerDashboardHome/CampaignStats'
import EarningsSummarySection from '../../../components/users/InfluencerDashboardHome/EarningsSummarySection'
import PerformanceCard from '../../../components/users/InfluencerDashboardHome/PerformanceCard'
import TodoListCard from '../../../components/users/InfluencerDashboardHome/TodoListCard'
import FeedbackCard from '../../../components/users/InfluencerDashboardHome/FeedbackCard'
import CampaignCarousel from '../../../components/users/InfluencerDashboardHome/CampaignCarousel'
import ActiveCampaignList from '../../../components/users/InfluencerDashboardHome/ActiveCampaignList'
import PendingUploadContent from '../../../components/users/InfluencerDashboardHome/PendingUploadContent'

const DashboardPage = () => {
  return (
    <div className="">
      {/* Top cards */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
      {/* Left */}
        <div className="w-full lg:w-2/2 order-1">
          <CampaignStats />
        </div>

        {/* Right */}
        <div className="w-full lg:w-2/3 order-2">
          <ProfileComplation />
        </div>
      </div>

      {/* Browse Campaign Carousel */}
      <div className="mb-6">
        <CampaignCarousel />
      </div>

      {/*Active Campaign & Pending Uploads*/}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 overflow-x-auto">
          <PendingUploadContent />
        </div>
        <div className="flex-1 overflow-x-auto">
          <ActiveCampaignList />
        </div>

      </div>



      {/* Performance & Todo */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <div className="flex-1">
          <PerformanceCard />
        </div>
        <div className="flex-1">
          <TodoListCard />
        </div>

      </div>

      {/* Earnings Summary */}
      <div className="mb-6">
        <EarningsSummarySection />
      </div>

      {/* Feedback */}
      <FeedbackCard />
    </div>
  );
};

export default DashboardPage;