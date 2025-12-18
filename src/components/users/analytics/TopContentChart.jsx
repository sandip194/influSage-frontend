import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector } from "react-redux";
import { Skeleton, Empty, Select } from "antd";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
const { Option } = Select;

// Endpoints by role
const ENDPOINT_BY_ROLE = {
  2: "/vendor/analytics/top-performing-content",
  1: "/user/analytics/top-performing-content",
};

// Campaign endpoints by role
const CAMPAIGN_ENDPOINT_BY_ROLE = {
  2: "/vendor/analytics/campaign-top-performing-content",
  1: "/user/analytics/campaign-topperformingcontent",
};

const TopContentChart = ({ campaignId }) => {
  const { token, role } = useSelector((state) => state.auth);

  const [filterType, setFilterType] = useState("month");
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getEndpoint = useCallback(() => {
    if (!role) return "";
    return campaignId ? CAMPAIGN_ENDPOINT_BY_ROLE[role] : ENDPOINT_BY_ROLE[role];
  }, [role, campaignId]);

  const fetchTopContent = useCallback(async () => {
    const endpoint = getEndpoint();
    if (!token || !endpoint) return;

    const controller = new AbortController();
    setLoading(true);

    try {
      const params = campaignId ? { p_campaignid: campaignId, p_filtertype: filterType } : { p_filtertype: filterType };
      const res = await axios.get(endpoint, {
        params,
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });

      const apiData = res.data?.data || [];
      setDataList(Array.isArray(apiData) ? apiData : []);
    } catch (err) {
      if (err.name !== "CanceledError") {
        console.error("Top content fetch error:", err);
        setDataList([]);
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [filterType, token, getEndpoint, campaignId]);

  useEffect(() => {
    const controller = new AbortController();
    fetchTopContent();
    return () => controller.abort();
  }, [fetchTopContent]);

  const chartData = useMemo(() => {
    if (!dataList.length) return { labels: [], datasets: [] };

    const labels = [];
    const values = [];

    dataList.forEach((item) => {
      labels.push(`${item.contenttypename || "Unknown"} • ${item.campaignname || "N/A"}`);
      values.push(item.totalengagement || 0);
    });

    return {
      labels,
      datasets: [
        {
          label: "Engagement",
          data: values,
          backgroundColor: "#335CFF",
          borderRadius: 8,
          barThickness: 8,
        },
      ],
    };
  }, [dataList]);

  const options = useMemo(
    () => ({
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.raw.toLocaleString()} Engagement`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            callback: (v) => (v >= 1000 ? `${v / 1000}k` : v),
            color: "#6B7280",
          },
        },
        y: { ticks: { color: "#6B7280" } },
      },
    }),
    []
  );

  return (
    <div className="bg-white rounded-2xl ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          {campaignId ? "Campaign Top Content" : "Top Performing Content"}
        </h2>
        <Select value={filterType} onChange={setFilterType} style={{ width: 120 }} size="middle">
          <Option value="week">Week</Option>
          <Option value="month">Month</Option>
          <Option value="year">Year</Option>
        </Select>
      </div>

      <div className="relative w-full min-h-[250px]">
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : dataList.length ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Empty description="No data available" className="mt-10" />
        )}
      </div>
    </div>
  );
};

export default TopContentChart;
