import { Empty, Pagination, Skeleton, Input } from 'antd';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { SearchOutlined } from "@ant-design/icons";
import { useSelector } from 'react-redux';
import InfluencerDetailsModal from '../../vendor/offers/InfluencerDetailsModal';

const CampaignInvitationTab = ({ campaignData }) => {
    const [loading, setLoading] = useState(false)
    
    const [pagenumber, setPageNumber] = useState(1);
    const [pagesize, setPageSize] = useState(10); // or any default
    const [invitations, setInvitations] = useState([])
    const [totalInvites, setTotalInvites] = useState(0);
    const [showInfluencerModal, setShowInfluencerModal] = useState(false);
    const [selectedInfluencerId, setSelectedInfluencerId] = useState(null);

    const { token } = useSelector((state) => state.auth);


    const handleViewProfile = (offer) => {
        setSelectedInfluencerId(offer.influencerid);
        setShowInfluencerModal(true);
    };

    const getInvitations = useCallback(async () => {
        try {
            setLoading(true)

            const res = await axios.get(`/vendor/mycampaign/invitationlist`, {
                params: {
                    p_campaignid: campaignData?.id,
                    p_offset: pagenumber,
                    p_limit: pagesize,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const { records, totalcount } = res.data.data;
            // console.log(records)
            setInvitations(records)
            setTotalInvites(totalcount)

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [pagenumber, pagesize, token, campaignData?.id])

    useEffect(() => {
        getInvitations()
    }, [getInvitations])

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case "selected":
                return "bg-green-50 text-green-700 border-green-200";
            case "viewed":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "offered":
                return "bg-purple-50 text-purple-700 border-purple-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };


    return (
        <div className="text-sm ">

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:items-center justify-between mb-4">
                <h2 className="text-xl font-bold">All Invitation</h2>
            </div>


            {/* Table */}
            <div className="bg-white rounded-xl overflow-auto">
                <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-gray-100 text-gray-900 text-sm">
                        <tr>
                            <th className="p-4">Influencer</th>
                            
                            <th className="p-4">Invited On</th>

                            <th className="p-4">Status</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm text-gray-700">

                        {loading ? (
                            <>
                                {[...Array(5)].map((_, index) => (
                                    <tr key={index} className="border-t border-gray-200">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Skeleton.Avatar active size="large" shape="circle" />
                                                <div className="flex-1">
                                                    <Skeleton.Input style={{ width: 120 }} active size="small" />
                                                    <Skeleton.Input style={{ width: 100, marginTop: 4 }} active size="small" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Skeleton.Input style={{ width: 80 }} active size="small" />
                                        </td>
                                        <td className="p-4">
                                            <Skeleton.Input style={{ width: 60 }} active size="small" />
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )
                            : invitations.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        <Empty
                                            description="No invitations found."
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        />
                                    </td>
                                </tr>
                            ) : (
                                invitations?.map((offer) => (
                                    <tr
                                        key={offer.applicationid}
                                        className="border-t border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                                        onClick={() => handleViewProfile(offer)}

                                    >

                                        <td className="px-4 py-2 flex gap-3 items-center">
                                            <img
                                                src={offer.influencerpohoto}
                                                alt={offer.influencername}
                                                loading='lazy'
                                                className="w-10 h-10 rounded-full object-cover"
                                                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                            />
                                            <p className="font-medium">{offer.influencername} </p>

                                        </td>

                                        {/* Created Date */}
                                        <td className="px-4 py-2 text-gray-600">
                                            {new Date(offer.createddate).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-2">
                                            <span
                                                className={`px-3 py-1 rounded-full border text-sm font-medium
                                                  ${getStatusStyles(offer.statusname)}`}
                                            >
                                                {offer.statusname}
                                            </span>
                                        </td>

                                        {/* Action */}
                                        {/* <td className="p-4">
                                            <button
                                                onClick={() => handleViewProfile(offer)}
                                                className="text-blue-600 hover:underline text-sm font-medium"
                                            >
                                                View
                                            </button>
                                        </td> */}

                                    </tr>
                                ))
                            )

                        }

                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end mt-6">
                <Pagination
                    current={pagenumber}
                    pageSize={pagesize}
                    total={totalInvites}
                    onChange={(page, pageSize) => {
                        setPageNumber(page);
                        setPageSize(pageSize);
                    }}
                    showSizeChanger
                    pageSizeOptions={['10', '15', '25', '50']}
                />
            </div>


            <InfluencerDetailsModal
                visible={showInfluencerModal}
                influencerId={selectedInfluencerId}
                onClose={() => {
                    setShowInfluencerModal(false);
                    setSelectedInfluencerId(null);
                }}
            />



        </div>
    )
}

export default CampaignInvitationTab