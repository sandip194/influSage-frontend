import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../api/axios';
import { Table, Skeleton, Empty, Image } from 'antd';
import { useNavigate } from 'react-router-dom';

const ActiveCampaignList = () => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [campaignList, setCampaignList] = useState([]);
    const [loading, setLoading] = useState(false);
    const formatDateDDMMYYYY = (dateStr) => {
        if (!dateStr) return "N/A";

        if (typeof dateStr === "string" && dateStr.includes("-")) {
            const parts = dateStr.split("-");
            if (parts.length === 3) {
            const [dd, mm, yyyy] = parts;
            return `${dd}/${mm}/${yyyy}`;
            }
        }
        const d = new Date(dateStr);
        if (isNaN(d)) return "N/A";

        return `${String(d.getDate()).padStart(2, "0")}/${String(
            d.getMonth() + 1
        ).padStart(2, "0")}/${d.getFullYear()}`;
    };

    // Fetch campaigns
    const getActiveCampaignList = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/user/dashboard/active-campaign-list', {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Safe check in case API returns null
            setCampaignList(res?.data?.data || []);
        } catch (error) {
            console.error(error);
            setCampaignList([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        getActiveCampaignList();
    }, [getActiveCampaignList]);

    // Table columns
    const columns = [
        {
            title: 'Campaign',
            key: 'campaign', // no dataIndex since we're customizing render
            render: (record) => (
                <div className="flex items-center gap-3">
                    {/* Rounded campaign photo */}
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            overflow: 'hidden',
                            flexShrink: 0,
                        }}
                    >
                        {record.campaignphoto ? (
                            <img
                                src={record.campaignphoto}
                                alt="Campaign"
                                 onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: '#f0f0f0',
                                }}
                            />
                        )}
                    </div>

                    {/* Campaign name */}
                    <span style={{ fontWeight: 500, whiteSpace: 'normal' }}>
                        {record.campaignname || 'N/A'}
                    </span>
                </div>
            ),
            width: 250, // adjust as needed
        },
        {
            title: 'Estimated Budget',
            dataIndex: 'estimatedbudget',
            key: 'estimatedbudget',
            render: (budget) => {
                return budget != null ? `₹ ${budget.toLocaleString()}` : 'N/A';
            },
        },
        {
            title: "Start Date",
            dataIndex: "campaignstartdate",
            key: "campaignstartdate",
            render: (date) => formatDateDDMMYYYY(date),
            },
            {
            title: "End Date",
            dataIndex: "campaignenddate",
            key: "campaignenddate",
            render: (date) => formatDateDDMMYYYY(date),
        },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl w-full overflow-x-auto h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Active Campaign List</h2>
            </div>

            {loading ? (
                <Skeleton active paragraph={{ rows: 5 }} />
            ) : campaignList.length === 0 ? (
                <Empty
                    description="No Active Campaigns"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            ) : (
                <Table
                    dataSource={campaignList}
                    columns={columns}
                    rowKey="campaignid"
                    pagination={{
                        pageSize: 5,          // rows per page
                        showTotal: (total) =>
                            `${total} items`,
                    }}
                    scroll={{ x: 'max-content' }}
                    size="small"
                    onRow={(record) => ({
                        onClick: () => {
                            // Redirect to campaign detail page
                            navigate(`/dashboard/my-contract/details/${record.campaignid}`);
                        },
                        style: { cursor: 'pointer' }, // show pointer on hover
                    })}
                />
            )}
        </div>
    );
};

export default ActiveCampaignList;
