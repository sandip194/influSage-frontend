import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, Modal, Input, Checkbox, Button, Radio, Tooltip } from "antd";
import InfluencerTable from "./InfluencerTable";
import axios from "axios";
import { useSelector } from "react-redux";
import UpdateAddressModal from "./UpdateAddressModal";

const { TextArea, Search } = Input;

const EditButton = React.memo(({ record, onEdit }) => {
    const handleClick = useCallback(() => onEdit(record), [onEdit, record]);
    return (
        <Button type="primary" size="small" onClick={handleClick}>
            Edit
        </Button>
    );
});


export default function CampaignVendorTable() {
    const { token } = useSelector((state) => state.auth);

    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(false);

    // pagination + search
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [searchText, setSearchText] = useState("");

    const [selectedCampaign, setSelectedCampaign] = useState(null);

    // 🔹 Fetch campaign list
    const getCampaignWiseData = useCallback(async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                "/admin/dashboard/shippingcampaignlist",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        p_pagenumber: pagination.current,
                        p_pagesize: pagination.pageSize,
                        p_search: searchText || null
                    }
                }
            );

            const apiData = res.data.data.records || [];

            setCampaigns(apiData);
            setPagination((prev) => ({
                ...prev,
                total: res.data.data?.totalcount || 0 // if totalcount comes from DB
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [token, pagination.current, pagination.pageSize, searchText]);

    useEffect(() => {
        getCampaignWiseData();
    }, [getCampaignWiseData]);

    // 🔹 Table pagination change
    const handleTableChange = (paginationInfo) => {
        setPagination((prev) => ({
            ...prev,
            current: paginationInfo.current,
            pageSize: paginationInfo.pageSize
        }));
    };

    const handleSaveSuccess = (updatedRecord) => {
        const now = new Date().toISOString(); // current timestamp
        setCampaigns((prev) =>
            prev.map((c) =>
                c.campaignid === updatedRecord.campaignid
                    ? { ...updatedRecord, modifieddate: now } // update modifieddate
                    : c
            )
        );
    };



    const handleEdit = useCallback((record) => {
        setSelectedCampaign(record);
    }, []);



    // 🔹 Columns
    const columns = useMemo(() => [
        {
            title: "Campaign",
            dataIndex: "name",
            width: 200,
            responsive: ["xs", "sm", "md", "lg"],
            render: (text, record) => (
                <div className="flex items-center gap-2">
                    <img
                        src={record.photopath}
                        alt={text}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.png"; // optional fallback
                        }}
                    />
                    <span className="text-sm leading-tight break-words">
                        {text}
                    </span>
                </div>
            )
        },
        {
            title: "Vendor",
            dataIndex: "fullname",
            responsive: ["sm", "md", "lg"]
        },
        {
            title: "Contact",
            render: (_, record) => (
                <div className="flex gap-3 text-lg">
                    <Tooltip title={record.phonenumber || "-"}>
                        <a href={`tel:${record.phonenumber}`} className="text-blue-500 hover:text-blue-700">
                            <i className="ri-phone-line" />
                        </a>
                    </Tooltip>
                    <Tooltip title={record.email || "-"}>
                        <a href={`mailto:${record.email}`} className="text-blue-500 hover:text-blue-700">
                            <i className="ri-mail-line" />
                        </a>
                    </Tooltip>
                </div>
            )
        },
        {
            title: "Current Address",
            dataIndex: "currentaddress",
            width: 140,
            render: (text) => (
                <span title={text}>
                    {text || "-"}
                </span>
            )
        },
        {
            title: "Pickup Address",
            dataIndex: "pickupaddress",
            width: 140,
            render: (text) => (
                <span title={text}>
                    {text || "-"}
                </span>
            )
        },
        {
            title: "Last Update",
            dataIndex: "modifieddate",
            render: (text) => {
                if (!text) return "-"; // show dash if null

                const date = new Date(text);
                // Format: e.g., 12 Jan 2026, 14:44
                const options = {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                };
                return date.toLocaleString("en-IN", options);
            }
        },
        {
            title: "Saved for Future",
            render: (_, record) => (
                <span className={record.isreusable ? "text-green-600" : "text-gray-500"}>
                    {record.isreusable ? "Yes" : "No"}
                </span>
            )
        },
        {
            title: "Action",
            fixed: "right",
            width: 80,
            render: (_, record) => <EditButton record={record} onEdit={handleEdit} />
        }
    ], [handleEdit]);


    return (
        <>
            {/* 🔹 Search Bar */}
            <div className="mb-4 flex justify-start">
                <Search
                    placeholder="Search campaign / vendor"
                    allowClear
                    size="large"
                    onSearch={(value) => {
                        setPagination((prev) => ({ ...prev, current: 1 }));
                        setSearchText(value);
                    }}
                    style={{ width: "100%", maxWidth: 600 }}
                />
            </div>

            <Table
                rowKey="campaignid"
                columns={columns}
                dataSource={campaigns}
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true
                }}
                onChange={handleTableChange}
                scroll={{ x: "max-content" }}
                expandable={{
                    expandedRowRender: (record) => (
                        <InfluencerTable data={record.influencers || []} />
                    )
                }}
            />

            <UpdateAddressModal
                visible={!!selectedCampaign}
                record={selectedCampaign}
                onClose={() => setSelectedCampaign(null)}
                onSaveSuccess={handleSaveSuccess}
            />
        </>
    );
}




