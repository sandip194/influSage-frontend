import React from 'react'
import ProfileComplation from '../../../components/users/InfluencerDashboardHome/ProfileComplation'

const VenderDashboardPage = () => {
    return (
        <div>
            <div className="header mb-4">
                <h3 className='text-2xl text-[#0D132D] font-bold mb-2'>Welcome Back</h3>
                <p className='text-base text-[#0D132D]'>Track Your Campaign & Earning Progress</p>
            </div>
            <div className="mian-box">
                <ProfileComplation />
            </div>
        </div>
    )
}

export default VenderDashboardPage