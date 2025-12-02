import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const campaignData = {
  labels: ["GlowSkincare", "FitPro", "Clothify"],
  datasets: [
    {
      data: [45, 30, 25],
      backgroundColor: ["#335CFF", "#4C6FFF", "#0D132D"], // Blue shades
      borderWidth: 0,
    },
  ],
};

const campaignOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: { usePointStyle: true, padding: 20, boxWidth: 12 },
    },
    tooltip: { callbacks: { label: ctx => `${ctx.label} – ${ctx.raw}%` } },
  },
};

export const CampaignContribution = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm w-full">
    <h2 className="text-lg font-bold text-gray-900 mb-4">Campaign Contribution</h2>
    <div className="w-full h-64">
      <Pie data={campaignData} options={campaignOptions} />
    </div>
  </div>
);
