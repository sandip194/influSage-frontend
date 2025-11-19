import React from 'react'
import ProfileComplationVendor from '../VendorDashboardHome/ProfileComplationVendor'
import CampaignCards from '../VendorDashboardHome/CampaignCards'
import EarningsSummarySectionVendor from '../VendorDashboardHome/EarningsSummarySectionVendor'
import ActiveCampaign from '../VendorDashboardHome/ActiveCampaign'
import Campaign from '../VendorDashboardHome/Campaign'

const VenderDashboardPage = () => {
    return (
        <div>
            <div className="header mb-4">
                <h3 className='text-2xl text-[#0D132D] font-bold mb-2'>Welcome Back</h3>
                <p className='text-base text-[#0D132D]'>Track Your Campaign & Earning Progress</p>
            </div>
            <div className="mian-box">
                <ProfileComplationVendor />
                <CampaignCards />
                <Campaign />
                <EarningsSummarySectionVendor />
                <ActiveCampaign />

            </div>
        </div>
    )
}

export default VenderDashboardPage