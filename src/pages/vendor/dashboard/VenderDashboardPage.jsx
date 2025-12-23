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
                <ProfileComplationVendor />
                <CampaignCards />
                <Campaign />
                <div className="flex flex-col md:flex-row gap-4 mb-6 ">
                    <div className="flex-1 overflow-x-auto">
                        <CampaignOverview />
                    </div>
                    <div className="flex-1 overflow-x-auto">
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