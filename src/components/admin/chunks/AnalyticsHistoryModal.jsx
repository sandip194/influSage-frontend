import React, { useMemo } from "react";
import { Modal, Table, Spin } from "antd";

const AnalyticsHistoryModal = ({
  visible,
  onClose,
  history = [],
  onLoadMore,
  loading,
}) => {

  const postInfo = history?.[0];

  const analyticsData = useMemo(
    () => postInfo?.analytics || [],
    [postInfo]
  );

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateOnly = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};



  const handleScroll = (e) => {
    const target = e.target;

    // prevent X-scroll triggering API
    if (target.scrollHeight <= target.clientHeight) return;

    const reachedBottom =
      Math.ceil(target.scrollTop + target.clientHeight) >=
      target.scrollHeight - 10;

    if (reachedBottom && !loading) {
      onLoadMore?.();
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "createddate",
      width: 150,
      render: formatDate,
    },
    {
      title: "Views",
      dataIndex: "views",
      width: 120,
    },
    {
      title: "Likes",
      dataIndex: "likes",
      width: 120,
    },
    {
      title: "Comments",
      dataIndex: "comments",
      width: 120,
    },
    {
      title: "Shares",
      dataIndex: "shares",
      width: 120,
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
    >
      {/* Compact Post Info */}
      {postInfo && (
        <div className="mb-3 space-y-1">
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Title:</span> {postInfo.title || "N/A"}
          </div>

          <div className="text-sm text-gray-700">
            <span className="font-semibold">Caption:</span> {postInfo.caption || "N/A"}
          </div>

          <div className="text-sm text-gray-700">
            <span className="font-semibold">Post Date:</span> {formatDateOnly(postInfo.postdate)}
          </div>
        </div>
      )}




      {/* Analytics Table */}
      <div
        style={{ maxHeight: 420, overflowY: "auto" }}
        onScroll={handleScroll}
      >
        <Table
          columns={columns}
          dataSource={analyticsData}
          pagination={false}
          rowKey="userplatformanalyticid"
          scroll={{ x: "max-content" }}
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
