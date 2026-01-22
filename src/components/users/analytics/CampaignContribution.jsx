import { useEffect, useMemo, useState, useCallback } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Select, Spin } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend);

const { Option } = Select;

const COLORS = [
  "#335CFF", // primary blue
  "#5853BC", // brand base
  "#362391", // dark blue-gray
  "#5E7BFF", // lighter blue
  "#8FA2FF",  // pastel highlight
  "#5457A6", // muted blue
];


const ENDPOINT_BY_ROLE = {
  1: "/user/analytics/campaign-Contribution",
  2: "/vendor/analytics/campaign-contribution",
};

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

// Fallback chart for empty data
const EMPTY_PIE_DATA = {
  labels: ["No Data"],
  datasets: [
    {
      data: [100],
      backgroundColor: ["#E5E7EB"], // light gray
      borderWidth: 0,
    },
  ],
};

const CampaignContribution = () => {
  const { token, role } = useSelector((state) => state.auth);

  const [filter, setFilter] = useState("month");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token || !role) {
      setData([]);
      return;
    }

    setLoading(true);
    try {
      const endpoint = ENDPOINT_BY_ROLE[role];
      if (!endpoint) return;

      const res = await axios.get(endpoint, {
        params: { p_filtertype: filter },
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Campaign contribution error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [token, role, filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Check if there is valid contribution data
  const hasValidData =
    data.length > 0 && data.some((d) => toNumber(d.contributionpercentage) > 0);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!hasValidData) return EMPTY_PIE_DATA;

    return {
      labels: data.map((d) => d.campaignname ?? "Unknown"),
      datasets: [
        {
          data: data.map((d) => toNumber(d.contributionpercentage)),
          backgroundColor: COLORS.slice(0, data.length),
          borderWidth: 0,
        },
      ],
    };
  }, [data, hasValidData]);

  // Chart options
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 8,       // smaller padding
            boxWidth: 8,      // smaller box
            font: { size: 12 }, // smaller font for legend
            filter: (item) => item.text !== "No Data",
          },
        },

        tooltip: {
          callbacks: {
            label: (ctx) =>
              ctx.label === "No Data"
                ? "No campaign contribution data"
                : `${ctx.label} – ${ctx.raw}%`,
          },
        },
      },
    }),
    []
  );

  return (
    <div className="bg-white rounded-2xl p-5 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-xl font-bold text-gray-900 ">Campaign Contribution</h2>

        <div className="flex justify-end w-full sm:w-auto">
          <Select value={filter} onChange={setFilter} style={{ width: 120 }}>
            <Option value="week">Week</Option>
            <Option value="month">Month</Option>
            <Option value="year">Year</Option>
          </Select>
        </div>

      </div>

      {/* Chart Container */}
      <div className="relative w-full h-48 md:h-64 flex flex-col items-center justify-center py-4">
        {loading ? (
          <Spin size="large" />
        ) : (
          <>
            <Pie data={chartData} options={options} />
            {!hasValidData && !loading && (
              <p className="text-sm text-gray-400 mt-2 text-center">
                No campaign contribution data available
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignContribution;
