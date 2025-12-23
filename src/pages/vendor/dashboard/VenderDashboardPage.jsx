import React from 'react'
import ProfileComplationVendor from '../VendorDashboardHome/ProfileComplationVendor'
import CampaignCards from '../VendorDashboardHome/CampaignCards'
import EarningsSummarySectionVendor from '../VendorDashboardHome/EarningsSummarySectionVendor'
import ActiveCampaign from '../VendorDashboardHome/ActiveCampaign'
import Campaign from '../VendorDashboardHome/Campaign'
import CampaignOverview from '../VendorDashboardHome/CampaignOverview'
import PendingContentList from '../VendorDashboardHome/PendingContentList'

const VenderDashboardPage = () => {
    return (
        <div>
            {/* <div className="header mb-4">
                <h3 className='text-2xl text-[#0D132D] font-bold mb-2'>Welcome Back</h3>
                <p className='text-base text-[#0D132D]'>Track Your Campaign & Earning Progress</p>
            </div> */}
            <div className="">
                {/* <ProfileComplationVendor />
                <CampaignCards /> */}

                {/* Top cards */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                {/* Left */}
                    <div className="w-full lg:w-2/2 order-1">
                    <CampaignCards />
                    </div>

                    {/* Right */}
                    <div className="w-full lg:w-2/3 order-2">
                    <ProfileComplationVendor />
                    </div>
                </div>
                <Campaign />
                <div className="flex flex-col md:flex-row gap-4 mb-6">

                    {/* Smaller */}
                    <div className="w-full md:flex-[2] overflow-x-auto">
                        <CampaignOverview />
                    </div>

                    {/* Wider */}
                    <div className="w-full md:flex-[4] overflow-x-auto">
                        <PendingContentList />
                    </div>

                </div>
                
                
                <EarningsSummarySectionVendor />
                <ActiveCampaign />

            </div>
        </div>
    )
}

export default VenderDashboardPage