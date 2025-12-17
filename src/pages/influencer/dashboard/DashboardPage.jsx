import React from 'react'
import ProfileComplation from '../../../components/users/InfluencerDashboardHome/ProfileComplation'
import CampaignStats from '../../../components/users/InfluencerDashboardHome/CampaignStats'
import EarningsSummarySection from '../../../components/users/InfluencerDashboardHome/EarningsSummarySection'
import PerformanceCard from '../../../components/users/InfluencerDashboardHome/PerformanceCard'
import TodoListCard from '../../../components/users/InfluencerDashboardHome/TodoListCard'
import FeedbackCard from '../../../components/users/InfluencerDashboardHome/FeedbackCard'
import CampaignCarousel from '../../../components/users/InfluencerDashboardHome/CampaignCarousel'

const DashboardPage = () => {
  return (
    <div className="">
      {/* Top cards */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <ProfileComplation />
        </div>
        <div className="flex-1">
          <CampaignStats />
        </div>
      </div>

      {/* Carousel */}
      <div className="mb-6">
        <CampaignCarousel />
      </div>

      {/* Earnings Summary */}
      <div className="mb-6">
        <EarningsSummarySection />
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

      {/* Feedback */}
      <FeedbackCard />
    </div>
  );
};

export default DashboardPage;