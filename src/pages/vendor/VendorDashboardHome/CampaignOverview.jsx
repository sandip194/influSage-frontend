import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Empty, Skeleton } from 'antd';

ChartJS.register(ArcElement, Tooltip, Legend);

const CampaignOverview = () => {
    const { token } = useSelector((state) => state.auth);

    const [campaignData, setCampaignData] = useState(null);
    const [loading, setLoading] = useState(false);

    const getCampaignList = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                '/vendor/dashboard/campaign-status-overview',
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setCampaignData(res?.data?.data || null);
        } catch (error) {
            console.error(error);
            setCampaignData(null);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        getCampaignList();
    }, [getCampaignList]);

    const chartData = useMemo(() => {
        if (!campaignData) return null;

        const {
            underreviewcount = 0,
            inprogresscount = 0,
            completedcount = 0,
            approvedcount = 0,
            publishedcount = 0,
        } = campaignData;

        const values = [
            underreviewcount,
            inprogresscount,
            completedcount,
            approvedcount,
            publishedcount,
        ];

        if (!values.some((v) => v > 0)) return null;

        return {
            labels: [
                'Under Review',
                'In Progress',
                'Completed',
                'Approved',
                'Published',
            ],
            datasets: [
                {
                    data: values,
                    backgroundColor: [

                        '#60A5FA',
                        '#335CFF',
                        '#0F172A',
                        '#3B82F6',
                        '#1E40AF',
                    ],
                    borderWidth: 1,
                    hoverOffset: 6,
                },
            ],
        };
    }, [campaignData]);

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-2xl w-full mt-4">
                <Skeleton
                    active
                    title={{ width: '40%' }}
                    paragraph={false}
                />
                <div className="flex justify-center items-center mt-8">
                    <Skeleton.Avatar
                        active
                        shape="circle"
                        size={256}
                    />
                </div>
            </div>
        );
    }


    if (!chartData) {
        return (
            <div className="bg-white p-6 rounded-2xl w-full mt-4">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                    Campaign Overview
                </h2>

                <div className="flex justify-center items-center py-16">
                    <Empty
                        description="No campaign data available"
                    />
                </div>
            </div>
        );
    }


    return (
        <div className="bg-white p-6 rounded-2xl w-full overflow-x-auto mt-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Campaign Overview</h2>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <div className="h-64 w-64">
                    <Doughnut
                        data={chartData}
                        options={{
                            cutout: '70%',
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        color: '#0F172A',
                                        boxWidth: 14,
                                    },
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => {
                                            const value = context.raw;
                                            const total = context.dataset.data.reduce(
                                                (sum, v) => sum + v,
                                                0
                                            );
                                            const percentage = ((value / total) * 100).toFixed(1);
                                            return `${context.label}: ${value} (${percentage}%)`;
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CampaignOverview;
