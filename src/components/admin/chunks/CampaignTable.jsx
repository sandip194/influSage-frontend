import React from "react";
import { Tooltip, Button } from "antd";
import { RiEyeLine, RiEditLine, RiDeleteBin6Line } from "react-icons/ri";

// Sample campaign data
const campaigns = [
  {
    id: 1,
    title: "Winter Fitness Blast",
    vendor: "FitCorp",
    category: "Fitness",
    platforms: ["IG", "TikTok"],
    influencers: 12,
    budget: "$15,000",
    startDate: "2025-11-01",
    endDate: "2025-11-30",
    createdOn: "2025-10-05",
  },
  {
    id: 2,
    title: "Tech Unleashed",
    vendor: "GadgetPro",
    category: "Tech",
    platforms: ["YouTube"],
    influencers: 8,
    budget: "$25,000",
    startDate: "2025-10-15",
    endDate: "2025-11-15",
    createdOn: "2025-10-01",
  },
  {
    id: 3,
    title: "Festive Food Tour",
    vendor: "YumMates",
    category: "Food",
    platforms: ["IG", "Facebook"],
    influencers: 20,
    budget: "$10,000",
    startDate: "2025-10-20",
    endDate: "2025-11-05",
    createdOn: "2025-10-06",
  },
];

// Optional: platform color styling
const platformColors = {
  IG: "bg-pink-200 text-pink-700",
  TikTok: "bg-black text-white",
  YouTube: "bg-red-200 text-red-700",
  Facebook: "bg-blue-200 text-blue-800",
};

const CampaignTable = () => {
  return (
    <div className="bg-white shadow rounded-2xl overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="min-w-[1000px] w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-800 text-sm font-semibold">
            <tr>
              <th className="p-4">Campaign Title</th>
              <th className="p-4">Vendor Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Target Platforms</th>
              <th className="p-4">Target Influencers</th>
              <th className="p-4">Budget</th>
              <th className="p-4">Start Date</th>
              <th className="p-4">End Date</th>
              <th className="p-4">Created On</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {campaigns.map((c) => (
              <tr
                key={c.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">{c.title}</td>
                <td className="p-4">{c.vendor}</td>
                <td className="p-4">{c.category}</td>
                <td className="p-4 space-x-1">
                  {c.platforms.map((p) => (
                    <span
                      key={p}
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${platformColors[p] || "bg-gray-200"}`}
                    >
                      {p}
                    </span>
                  ))}
                </td>
                <td className="p-4">{c.influencers}</td>
                <td className="p-4">{c.budget}</td>
                <td className="p-4">{c.startDate}</td>
                <td className="p-4">{c.endDate}</td>
                <td className="p-4">{c.createdOn}</td>
                <td className="p-4 text-right space-x-3">
                  <Tooltip title="View">
                    <button className="text-blue-600 hover:text-blue-700">
                      <RiEyeLine size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <button className="text-green-600 hover:text-green-700">
                      <RiEditLine size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <button className="text-red-600 hover:text-red-700">
                      <RiDeleteBin6Line size={18} />
                    </button>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignTable;
