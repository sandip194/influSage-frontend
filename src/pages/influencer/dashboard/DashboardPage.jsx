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
        <div>
            <div className="header mb-4">
                <h3 className='text-2xl text-[#0D132D] font-bold mb-2'>Welcome Back</h3>
                <p className='text-base text-[#0D132D]'>Track Your Campaign & Earning Progress</p>
            </div>
            <div className="mian-box">
                <ProfileComplation />
                <CampaignStats />
                <CampaignCarousel />    
                <EarningsSummarySection />
                <div className="flex flex-col md:flex-row gap-4 my-3">
                    <PerformanceCard />
                    <TodoListCard />
                </div>
                <FeedbackCard />
            </div>
        </div>
    )
}

export default DashboardPage