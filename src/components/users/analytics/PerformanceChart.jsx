import { useRef, useState } from "react";
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

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  zoomPlugin
);

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
const WEEKS = Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);


const PerformanceChart = ({ data = [], filter = "year" }) => {

  const wrapperRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);

  let labels = [], views = [], likes = [], comments = [], shares = [];
  const lookup = {};
  data.forEach(item => {
      if (filter === "week") lookup[item.week] = item;
      if (filter === "month") lookup[item.month] = item;
      if (filter === "year") lookup[item.year] = item;
  });


  // --- LABEL LOGIC ---
  if (filter === "week") {
    labels = WEEKS;
    views = labels.map((_, i) => lookup[i + 1]?.totalviews || 0);
    likes = labels.map((_, i) => lookup[i + 1]?.totallikes || 0);
    comments = labels.map((_, i) => lookup[i + 1]?.totalcomments || 0);
    shares = labels.map((_, i) => lookup[i + 1]?.totalshares || 0);
  }

  if (filter === "month") {
    labels = MONTHS;
    views = labels.map((_, i) => lookup[i + 1]?.totalviews || 0);
    likes = labels.map((_, i) => lookup[i + 1]?.totallikes || 0);
    comments = labels.map((_, i) => lookup[i + 1]?.totalcomments || 0);
    shares = labels.map((_, i) => lookup[i + 1]?.totalshares || 0);
  }

  if (filter === "year") {
    labels = YEARS;
    views = YEARS.map(y => lookup[y]?.totalviews || 0);
    likes = YEARS.map(y => lookup[y]?.totallikes || 0);
    comments = YEARS.map(y => lookup[y]?.totalcomments || 0);
    shares = YEARS.map(y => lookup[y]?.totalshares || 0);
  }

  // --- CHART DATA ---
  const chartData = {
    labels,
    datasets: [
      { label: "Views", data: views, borderColor: "#335CFF", tension: 0.4, fill: true },
      { label: "Likes", data: likes, borderColor: "#0D132D", tension: 0.4, fill: true },
      { label: "Comments", data: comments, borderColor: "#1A3E5C", tension: 0.4, fill: true },
      { label: "Shares", data: shares, borderColor: "#0A84FF", tension: 0.4, fill: true },
    ],
  };

  // --- ZOOM + PAN OPTIONS ---
  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: { position: "bottom", labels: { usePointStyle: true } },
      tooltip: { intersect: false, mode: "index" },

      zoom: {
        zoom: {
          wheel: { enabled: true },   // Enabled for week + month + year
          pinch: { enabled: true },
          mode: "x",
        },
        pan: {
          enabled: filter !== "year",
          mode: "x",
          onPanStart: () => setIsPanning(true),
          onPanComplete: () => setIsPanning(false),
        },
      },
    },
  };

  // --- CURSOR CLASS ---
  const cursorClass =
    filter === "year"
      ? "cursor-zoom-in"
      : isPanning
      ? "cursor-grabbing"
      : "cursor-zoom-in";

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full h-64 sm:h-48 md:h-64 lg:h-72 ${cursorClass}`}
    >
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PerformanceChart;
