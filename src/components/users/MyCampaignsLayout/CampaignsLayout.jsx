import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  RiMore2Fill,   // similar to FiMoreVertical
  RiEyeLine,     // similar to FiEye
  RiCheckboxCircleLine, // similar to FiCheckCircle
  RiCloseCircleLine,    // similar to FiXCircle
} from "@remixicon/react";

import { FiMoreVertical, FiEye, FiCheckCircle, FiXCircle } from "react-icons/fi";

const campaigns = [
  {
    id: 1,
    client: "Presse Citron",
    clientImage: "https://i.pravatar.cc/40?img=1",
    campaignName: "Instagram Campaign",
    amount: "$124.32",
    date: "16 Jan,2025",
    status: "inprogress",
  },
  {
    id: 2,
    client: "Presse Citron",
    clientImage: "https://i.pravatar.cc/40?img=2",
    campaignName: "YouTube Shortvideo Campaign",
    amount: "$124.32",
    date: "16 Jan,2025",
    status: "completed",
  },
  {
    id: 3,
    client: "Presse Citron",
    clientImage: "https://i.pravatar.cc/40?img=3",
    campaignName: "TikTok Video",
    amount: "$124.32",
    date: "16 Jan,2025",
    status: "cancelled",
  },
  {
    id: 4,
    client: "Presse Citron",
    clientImage: "https://i.pravatar.cc/40?img=4",
    campaignName: "Instagram Campaign",
    amount: "$124.32",
    date: "16 Jan,2025",
    status: "inprogress",
  },
];

const statusStyles = {
  inprogress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusLabels = {
  inprogress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const CampaignsLayout = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const pageSize = 6;

  const navigate = useNavigate();

  const tabs = [
    { id: "all", label: "All" },
    { id: "inprogress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const filteredCampaigns = useMemo(() => {
    let data = campaigns;

    if (statusFilter !== "all") {
      data = data.filter((c) => c.status === statusFilter);
    }

    if (searchText.trim()) {
      data = data.filter((c) =>
        c.campaignName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return data;
  }, [statusFilter, searchText]);

  // ---------- Pagination ----------
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCampaigns.slice(start, start + pageSize);
  }, [page, filteredCampaigns]);

  const totalPages = Math.ceil(filteredCampaigns.length / pageSize);

  return (
    <div className="w-full text-sm px-2 sm:px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">My Campaigns</h2>
      <p className="mb-6 text-gray-600 text-sm">Your Campaigns Overview</p>

      {/* Tabs (Status Filters) */}
      <div className="bg-white p-3 sm:p-4 rounded-lg mb-6 flex flex-wrap gap-3 shadow-sm">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => {
              setStatusFilter(id);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg border transition font-medium ${
              statusFilter === id
                ? "bg-[#0f122f] text-white border-[#0f122f]"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#0f122f] focus:outline-none"
        />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-gray-50 text-gray-700 text-sm tracking-wide">
              <tr>
                <th className="p-4">Client</th>
                <th className="p-4">Campaign Name</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date Started</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {paginatedData.map((row) => (
                <tr key={row.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                  {/* Client with photo */}
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={row.clientImage}
                      alt={row.client}
                      className="w-9 h-9 rounded-full"
                    />
                    <span>{row.client}</span>
                  </td>

                  <td className="p-4">{row.campaignName}</td>
                  <td className="p-4 font-medium">{row.amount}</td>
                  <td className="p-4">{row.date}</td>

                  {/* Status badge */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[row.status]}`}
                    >
                      {statusLabels[row.status]}
                    </span>
                  </td>

                  {/* Action Menu */}
                  <td className="p-4 relative">
                    <button
                      onClick={() =>
                        setMenuOpenId(menuOpenId === row.id ? null : row.id)
                      }
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <RiMore2Fill className="text-gray-600" />
                    </button>

                    {menuOpenId === row.id && (
                      <div className="absolute right-4 mt-2 w-44 bg-white rounded-lg shadow-lg border z-50">
                        <button
                          onClick={() => {
                            setMenuOpenId(null);
                            navigate(`/dashboard/my-campaigns/details/`);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left"
                        >
                          <RiEyeLine className="text-gray-500" /> View Details
                        </button>
                        <button
                          onClick={() => setMenuOpenId(null)}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left"
                        >
                          <RiCheckboxCircleLine/> Mark As Complete
                        </button>
                        <button
                          onClick={() => setMenuOpenId(null)}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left"
                        >
                          <RiCloseCircleLine /> Cancel Campaign
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No campaigns found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
        <p className="text-sm text-gray-600">
          Showing {paginatedData.length} of {filteredCampaigns.length} Results
        </p>
        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg border ${
                page === i + 1
                  ? "bg-[#0f122f] text-white border-[#0f122f]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignsLayout;
