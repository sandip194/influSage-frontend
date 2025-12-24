import React, { useEffect, useState } from "react";
import { Modal, Table, Spin } from "antd";

const AnalyticsHistoryModal = ({
  visible,
  onClose,
  history = [],
  onLoadMore,
  loading,
}) => {

   const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollTop + clientHeight >= scrollHeight - 20 &&
      !loading
    ) {
      onLoadMore?.();
    }
  };
const columns = [
  {
    title: "Post Date",
    dataIndex: "postdate",
    render: (v) => new Date(v).toLocaleDateString() || "-",
  },
  {
    title: "Title",
    dataIndex: "title",
    render: (v) => v || "-",
    ellipsis: true,
  },
  {
    title: "Caption",
    dataIndex: "caption",
    render: (v) => v || "-",
    ellipsis: true,
  },
  {
    title: "Views",
    dataIndex: "views",
    render: (v) => v || "-",
  },
  {
    title: "Likes",
    dataIndex: "likes",
    render: (v) => v || "-",
  },
  {
    title: "Comments",
    dataIndex: "comments",
    render: (v) => v || "-",
  },
  {
    title: "Shares",
    dataIndex: "shares",
    render: (v) => v || "-",
  },
];


  return (
    <Modal
      title="Analytics History"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      bodyStyle={{ padding: 0 }}
    >
      <div
        style={{ maxHeight: 420, overflowY: "auto" }}
        onScroll={handleScroll}
      >
        <Table
          columns={columns}
          dataSource={history}
          pagination={false}
          rowKey={(r) =>
            r.userplatformanalyticid || r.contractcontentlinkid
          }
          sticky
        />

        {loading && (
          <div className="py-4 text-center">
            <Spin />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AnalyticsHistoryModal;
