import { Empty, Table } from 'antd';
import api from '../../../api/axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux';

const CustomEmpty = () => (
    <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
            <span className="text-gray-500">
                No Improper Massage Found
            </span>
        }
    />
);

const AdminImproperMsg = () => {
    const { token } = useSelector((state) => state.auth);

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    // MAIN FETCH
    const fetchMsgList = useCallback(
        async (params = {}) => {
            try {
                setLoading(true);

                const query = {
                    p_search: (params.search ?? search) || null,
                    p_pagenumber: params.page || pagination.current,
                    p_pagesize: params.pageSize || pagination.pageSize,
                };

                const res = await api.get("/admin/dashboard/message/management", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: query,
                });

                const apidata = res?.data?.data ?? {};

                const records = Array.isArray(apidata.records)
                    ? apidata.records
                    : [];


                setTableData(records);
                setPagination((prev) => ({
                    ...prev,
                    total: apidata.totalcount || 0,
                }));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        },
        [
            pagination.current,
            pagination.pageSize,
            token,
        ]
    );

    const handleSearch = () => {
        fetchMsgList({ search, page: 1 });
    };

     const handleTableChange = (p) => {
        setPagination(p);
        fetchMsgList({
            page: p.current,
            pageSize: p.pageSize,
        });
    };

    useEffect(() => {
        fetchMsgList()
    }, [fetchMsgList])

    const columns = useMemo(
        () => [
            {
                title: "Sender",
                width: 100,
                dataIndex: "senderrole",
                render: (val) => val ?? "N/A",
            },
            {
                title: "Message",
                dataIndex: "message",
                width: 220,
                ellipsis: true,
                render: (value) => value || "N/A",
            },
            {
                title: "Reason",
                dataIndex: "reason",
                width: 220,
                render: (value) => value || "N/A",
            },
            {
                title: "Sendername",
                width: 130,
                dataIndex: "sendername",
                render: (value) => value || "N/A",
            },
            {
                title: "Recievername",
                width: 130,
                dataIndex: "receivername",
                render: (value) => value || "N/A",
            },
        ],
    );
    return (
        <div className="my-2">
            <h1 className="text-lg my-4">Unauthorized Contact Messages</h1>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4 sm:items-center">
                {/* Search */}
                <div className="flex w-full gap-2">
                    <input
                        type="text"
                        placeholder="Search "
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white px-4 py-2 border border-gray-200 rounded-lg"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-[#0D132D] text-white px-4 py-2 rounded-2xl"
                    >
                        Search
                    </button>
                </div>
            </div>

            <Table
                loading={{
                    spinning: loading,
                }}
                dataSource={tableData}
                columns={columns}
                pagination={pagination}
                onChange={handleTableChange}
                scroll={{ x: "max-content" }}

                rowKey="key"
                className="rounded-lg shadow-sm"
                locale={{
                    emptyText: <CustomEmpty />     // CUSTOM EMPTY STATE
                }}
            />
        </div>
    )
}

export default AdminImproperMsg