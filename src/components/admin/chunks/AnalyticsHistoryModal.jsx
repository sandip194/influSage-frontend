import React, { useEffect, useState } from "react";
import { Modal, Table, Spin } from "antd";

const PAGE_SIZE = 10;

const AnalyticsHistoryModal = ({ visible, onClose, history = [] }) => {
  const [visibleData, setVisibleData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!Array.isArray(history)) {
      setVisibleData([]);
      setPage(1);
      return;
    }

    setVisibleData(history.slice(0, PAGE_SIZE));
    setPage(1);
  }, [history]);

  const loadMore = () => {
    if (loading || !Array.isArray(history)) return;

    const start = page * PAGE_SIZE;
    if (start >= history.length) return;

    setLoading(true);

    setTimeout(() => {
      setVisibleData(prev => [
        ...prev,
        ...history.slice(start, start + PAGE_SIZE),
      ]);
      setPage(prev => prev + 1);
      setLoading(false);
    }, 800);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMore();
    }
  };

const columns = [
  {
    title: "Post Date",
    dataIndex: "postdate",
    render: (v) => new Date(v).toLocaleDateString(),
  },
  {
    title: "Title",
    dataIndex: "title",
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
  },
  {
    title: "Likes",
    dataIndex: "likes",
  },
  {
    title: "Comments",
    dataIndex: "comments",
  },
  {
    title: "Shares",
    dataIndex: "shares",
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
          dataSource={visibleData}
          pagination={false}
          rowKey={(r, i) => i}
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
