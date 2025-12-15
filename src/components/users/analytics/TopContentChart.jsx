import { useEffect, useState } from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TopContentChart = ({ filterType }) => {
  const { token } = useSelector((state) => state.auth);

  const [labels, setLabels] = useState([]);
  const [views, setViews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTopContent = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "vendor/analytics/top-performing-content",
        {
          params: { p_filtertype: filterType },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const apiData = res.data?.data || [];

      setLabels(
        apiData.map(
          item => `${item.contenttypename} • ${item.campaignname}`
        )
      );

      setViews(
        apiData.map(item => item.totalengagement || 0)
      );

    } catch (err) {
      console.error("Top content fetch error:", err);
      setLabels([]);
      setViews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchTopContent();
  }, [filterType, token]);

  const data = {
    labels,
    datasets: [
      {
        label: "Views",
        data: views,
        backgroundColor: "#335CFF",
        borderRadius: 8,
        barThickness: 8,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw.toLocaleString()} Views`,
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
      y: {
        ticks: { color: "#6B7280" },
      },
    },
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center text-gray-400">Loading…</div>;
  }

  if (!labels.length) {
    return <div className="h-64 flex items-center justify-center text-gray-400">No data found</div>;
  }

  return (
    <div className="relative w-full h-64">
      <Bar data={data} options={options} />
    </div>
  );
};

export default TopContentChart;
