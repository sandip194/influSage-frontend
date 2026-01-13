// components/CampaignShipments/InfluencerTable.jsx
import React, { useMemo, useState } from "react";
import { Table, Modal, Input, Checkbox, Button, Radio, Tooltip } from "antd";
import UpdateAddressModal from "./UpdateAddressModal";

const { TextArea } = Input;

export default React.memo(function InfluencerTable({ data }) {
    const [influencers, setInfluencers] = useState(data || []);
    const [selectedInfluencer, setSelectedInfluencer] = useState(null);



    const columns = useMemo(() => [
        {
            title: "Influencer",
            dataIndex: "influencername",
            render: (text, record) => (
                <div className="flex items-center gap-2">
                    <img
                        src={record.influencerphoto}
                        alt={text}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.png";
                        }}
                    />
                    <span className="text-sm">{text}</span>
                </div>
            )
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
            width: 200,
            render: (text) => <span className="text-gray-600">{text}</span>
        },
        {
            title: "Delivery Address",
            dataIndex: "deliveryaddress",
            width: 200,
            render: (text) => <span className="text-gray-600">{text}</span>
        },
        {
            title: "Last Update",
            dataIndex: "modifieddate",
            render: (text) =>
                text ? new Date(text).toLocaleString("en-IN") : "-"
        },
        {
            title: "Saved for Future",
            render: (_, record) => (
                <span className={`font-medium ${record.isreusable ? "text-green-600" : "text-gray-500"}`}>
                    {record.isreusable ? "Yes" : "No"}
                </span>
            )
        },
        {
            title: "Action",
            render: (_, record) => (
                <Button type="primary" size="small" onClick={() => setSelectedInfluencer(record)}>
                    Edit
                </Button>

            )
        }
    ], []);

    return (
        <>
            <Table
                columns={columns}
                dataSource={influencers}
                pagination={false}
                size="small"
                rowKey="influencerid"
                scroll={{ x: "max-content" }}
                className="shadow-sm border border-gray-200"
            />

            <UpdateAddressModal
                visible={!!selectedInfluencer}
                record={selectedInfluencer}
                onClose={() => setSelectedInfluencer(null)}
                onSaveSuccess={(updatedRecord) => {
                    const now = new Date().toISOString(); // current timestamp
                    const updated = influencers.map((inf) =>
                        inf.influencerid === updatedRecord.influencerid
                            ? { ...updatedRecord, modifieddate: now } // add modifieddate
                            : inf
                    );
                    setInfluencers(updated);
                    setSelectedInfluencer(null);
                }}
            />


        </>
    );
})
