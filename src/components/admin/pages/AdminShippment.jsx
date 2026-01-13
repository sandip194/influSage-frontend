import React from 'react'
import CampaignVendorTable from '../CampaignShipments/CampaignVendorTable';

export const AdminShippment = () => {
    return (
        <div className=" min-h-screen">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Campaign Shipments Management
                </h1>
                <p className="text-gray-600 mt-1">
                    Confirm vendor and influencer addresses for product shipments
                </p>
            </div>

            {/* Main Table */}
            <div className="p-0">
                <CampaignVendorTable />
            </div>
        </div>
    );
}
