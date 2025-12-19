import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Table, Skeleton, Empty, Image, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

const PendingUploadContent = () => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [pendingList, setPendingList] = useState([]);
    const [loading, setLoading] = useState(false);

    const getPendingContentList = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('/user/dashboard/pending-content-list', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPendingList(res?.data?.data || []);
        } catch (error) {
            console.error(error);
            setPendingList([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        getPendingContentList();
    }, [getPendingContentList]);

    // Render providers + their content types as tags
    const renderProvidersWithContent = (providers) => {
        if (!providers || providers.length === 0) return 'N/A';

        return (
            <div className="flex flex-col gap-1">
                {providers.map((provider) => (
                    <div key={provider.providerid} className="flex items-start gap-2 flex-wrap">
                        <Image
                            src={provider.iconpath}
                            alt={provider.providername}
                            width={24}
                            height={24}
                            preview={false}
                        />
                        <div className="flex flex-wrap gap-1">
                            {provider.contenttypes?.map((ct) => (
                                <span key={ct.contractcontenttypeid} className='bg-red-100 text-red-900 rounded px-1'>
                                    {ct.contenttypename || 'N/A'}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

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
            title: 'Pending Content',
            dataIndex: 'providercontenttype',
            key: 'providercontenttype',
            render: renderProvidersWithContent,
        },
        {
            title: 'Contract Start',
            dataIndex: 'contractstartdate',
            key: 'contractstartdate',
            render: (date) => date || 'N/A',
        },
        {
            title: 'Contract End',
            dataIndex: 'contractenddate',
            key: 'contractenddate',
            render: (date) => date || 'N/A',
        },

    ];

    return (
        <div className="bg-white p-6 rounded-2xl w-full overflow-x-auto h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Pending Upload Content</h2>
            </div>

            {loading ? (
                <Skeleton active paragraph={{ rows: 5 }} />
            ) : pendingList.length === 0 ? (
                <Empty description="No Pending Content Link Upload Found" />  
            ) : (
                <Table
                    dataSource={pendingList}
                    columns={columns}
                    rowKey="campaignid"
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                    size="small"
                    onRow={(record) => ({
                        onClick: () => {
                            // Redirect to campaign detail page
                            navigate(`/dashboard/my-campaigns/details/${record.campaignid}`);
                        },
                        style: { cursor: 'pointer' }, // show pointer on hover
                    })}
                />
            )}
        </div>
    );
};

export default PendingUploadContent;
