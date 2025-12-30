import { useRef, useState, useEffect, useMemo, memo, useCallback } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Select, Spin } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  zoomPlugin
);

const { Option } = Select;
const MemoLine = memo(Line);

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
const WEEKS = Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);

const ENDPOINT_BY_ROLE = {
  2: "/vendor/analytics/performance-timeline",
  1: "/user/analytics/performance-overtime",
};

const CAMPAIGN_ENDPOINT_BY_ROLE = {
  2: "/vendor/analytics/campaign-performance-overtime",
  1: "/user/analytics/campaign-performanceovertime",
};

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const PerformanceChart = ({ campaignId }) => {
  const wrapperRef = useRef(null);
  const [filter, setFilter] = useState("month");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token, role } = useSelector((state) => state.auth);

  const getEndpoint = useCallback(() => {
    return campaignId
      ? CAMPAIGN_ENDPOINT_BY_ROLE[role]
      : ENDPOINT_BY_ROLE[role];
  }, [campaignId, role]);

  const fetchData = useCallback(async () => {
    if (!role || !token) {
      setData([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    try {
      const endpoint = getEndpoint();
      if (!endpoint) return;

      const params = campaignId
        ? { p_campaignid: campaignId, p_filtertype: filter }
        : { p_filtertype: filter };

      const res = await axios.get(endpoint, {
        params,
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });

      setData(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      if (err.name !== "CanceledError") {
        console.error("Performance chart error:", err);
        setData([]);
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [role, token, filter, campaignId, getEndpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* =========================
     CHART DATA (UPDATED)
  ========================== */
  const chartData = useMemo(() => {
    const hasData = Array.isArray(data) && data.length > 0;
    const lookup = Object.create(null);

    if (hasData) {
      data.forEach(item => {
        if (!item) return;
        if (filter === "week" && item.week != null) lookup[item.week] = item;
        if (filter === "month" && item.month != null) lookup[item.month] = item;
        if (filter === "year" && item.year != null) lookup[item.year] = item;
      });
    }

    let labels = [];
    let views = [];
    let likes = [];
    let comments = [];
    let shares = [];

    if (filter === "week") {
      labels = WEEKS;
      views = labels.map((_, i) => toNumber(lookup[i + 1]?.totalviews));
      likes = labels.map((_, i) => toNumber(lookup[i + 1]?.totallikes));
      comments = labels.map((_, i) => toNumber(lookup[i + 1]?.totalcomments));
      shares = labels.map((_, i) => toNumber(lookup[i + 1]?.totalshares));
    } else if (filter === "month") {
      labels = MONTHS;
      views = labels.map((_, i) => toNumber(lookup[i + 1]?.totalviews));
      likes = labels.map((_, i) => toNumber(lookup[i + 1]?.totallikes));
      comments = labels.map((_, i) => toNumber(lookup[i + 1]?.totalcomments));
      shares = labels.map((_, i) => toNumber(lookup[i + 1]?.totalshares));
    } else {
      labels = YEARS;
      views = labels.map(y => toNumber(lookup[y]?.totalviews));
      likes = labels.map(y => toNumber(lookup[y]?.totallikes));
      comments = labels.map(y => toNumber(lookup[y]?.totalcomments));
      shares = labels.map(y => toNumber(lookup[y]?.totalshares));
    }

    return {
      labels,
      datasets: [
        { label: "Views", data: views, borderColor: "#335CFF", backgroundColor: "#335CFF", tension: 0.4, fill: true },
        { label: "Likes", data: likes, borderColor: "#0D132D", backgroundColor: "#0D132D", tension: 0.4, fill: true },
        { label: "Comments", data: comments, borderColor: "#1A3E5C", backgroundColor: "#1A3E5C", tension: 0.4, fill: true },
        { label: "Shares", data: shares, borderColor: "#0A84FF", backgroundColor: "#0A84FF", tension: 0.4, fill: true },
      ],
    };
  }, [data, filter]);

  /* =========================
     OPTIONS (UPDATED LEGEND COLOR)
  ========================== */
  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
         
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      tooltip: {
        intersect: false,
        mode: "index",
      },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x",
        },
        pan: {
          enabled: filter !== "year",
          mode: "x",
        },
      },
    },
  }), [filter]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {campaignId ? "Campaign Performance" : "Performance"}
        </h2>

        <Select value={filter} onChange={setFilter} style={{ width: 120 }}>
          <Option value="week">Week</Option>
          <Option value="month">Month</Option>
          <Option value="year">Year</Option>
        </Select>
      </div>

      <div ref={wrapperRef} className="relative w-full h-64 sm:h-48 md:h-64 lg:h-72">
        {loading && <Spin />}
        {!loading && <MemoLine data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default PerformanceChart;
