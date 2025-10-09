import React, { useState } from "react";
import {
  Tabs,
  Input,
  Select,
  Tooltip,
  Drawer,
  Checkbox,
  Radio,
  Button,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  RiEyeLine,
  RiEditLine,
  RiDeleteBin6Line,
  RiArrowDownSLine,
} from "react-icons/ri";

// 🟡 Mock Data (Replace with real API data)
const campaigns = [
  {
    id: 1,
    title: "Winter Fitness Blast",
    vendor: "FitCorp",
    category: "Fitness",
    platforms: ["IG", "TikTok"],
   // influencers: 12,
    budget: 15000,
    startDate: "2025-11-01",
    endDate: "2025-11-30",
    createdOn: "2025-10-05",
    status: "Approved",
  },
  {
    id: 2,
    title: "Tech Unleashed",
    vendor: "GadgetPro",
    category: "Tech",
    platforms: ["YouTube"],
    // influencers: 8,
    budget: 25000,
    startDate: "2025-10-01",
    endDate: "2025-10-15",
    createdOn: "2025-09-25",
    status: "Rejected",
  },
   {
    id: 3,
    title: "Tech Unleashed",
    vendor: "GadgetPro",
    category: "Tech",
    platforms: ["YouTube"],
    // influencers: 8,
    budget: 25000,
    startDate: "2025-10-01",
    endDate: "2025-10-15",
    createdOn: "2025-09-25",
    status: "Approved",
  },
  // Add more...
];

const platformColors = {
  IG: "bg-pink-200 text-pink-700",
  TikTok: "bg-black text-white",
  YouTube: "bg-red-200 text-red-700",
  Facebook: "bg-blue-200 text-blue-800",
};

const CampaignTableLayout = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    platform: [],
    category: [],
  });

  // 🧠 Filtered + Searched + Sorted Data
  const filteredData = campaigns
    .filter((c) =>
      activeTab === "All" ? true : c.status === activeTab
    )
    .filter(
      (c) =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.vendor.toLowerCase().includes(search.toLowerCase())
    )
    .filter((c) => {
      // Platform filter
      if (filters.platform.length > 0) {
        return filters.platform.some((p) => c.platforms.includes(p));
      }
      return true;
    })
    .filter((c) => {
      // Category filter
      if (filters.category.length > 0) {
        return filters.category.includes(c.category);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdOn) - new Date(a.createdOn);
      } else {
        return new Date(a.createdOn) - new Date(b.createdOn);
      }
    });

  return (
    <div className="w-full">
      {/* 🧾 Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Campaign Management
        </h2>
        <p className="text-sm text-gray-600">
          View, filter, and manage your campaigns.
        </p>
      </div>

      {/* 🟦 Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        items={["All", "Approved", "Rejected"].map((tab) => ({
          key: tab,
          label: tab,
        }))}
        className="mb-4"
      />

      {/* 🔍 Controls: Search + Sort + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white shadow-sm p-3 rounded-t-2xl">
        <Input
          size="large"
          placeholder="Search campaigns"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3"
        />

        <div className="flex gap-2 w-full sm:w-auto">
          <Select
            size="large"
            defaultValue={sortOrder}
            onChange={setSortOrder}
            className="w-full sm:w-48"
            suffixIcon={<RiArrowDownSLine size={16} />}
          >
            <Select.Option value="newest">Newest</Select.Option>
            <Select.Option value="oldest">Oldest</Select.Option>
          </Select>

          <Button
            type="default"
            size="large"
            icon={<FilterOutlined />}
            onClick={() => setShowFilters(true)}
          >
            Filters
          </Button>
        </div>
      </div>

      {/* 🧾 Table */}
      <div className="bg-white shadow-sm rounded-b-2xl overflow-x-auto mt-0">
        <table className="min-w-[1000px] w-full text-left">
          <thead className="bg-gray-50 text-gray-700 text-sm font-semibold">
            <tr>
              <th className="p-4">Campaign Title</th>
              <th className="p-4">Vendor</th>
              <th className="p-4">Category</th>
              <th className="p-4">Platforms</th>
              {/* <th className="p-4">Influencers</th> */}
              <th className="p-4">Budget</th>
              <th className="p-4">Start Date</th>
              <th className="p-4">End Date</th>
              <th className="p-4">Created On</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {filteredData.length > 0 ? (
              filteredData.map((c) => (
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
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          platformColors[p] || "bg-gray-200"
                        }`}
                      >
                        {p}
                      </span>
                    ))}
                  </td>
                  {/* <td className="p-4">{c.influencers}</td> */}
                  <td className="p-4">${c.budget.toLocaleString()}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-10 text-gray-500">
                  No campaigns found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🧰 Filters Drawer */}
      <Drawer
        title="Filter Campaigns"
        placement="right"
        width={300}
        onClose={() => setShowFilters(false)}
        open={showFilters}
      >
        {/* Platform filter */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Platform</h4>
          <Checkbox.Group
            options={["IG", "TikTok", "YouTube", "Facebook"]}
            value={filters.platform}
            onChange={(checked) =>
              setFilters((prev) => ({ ...prev, platform: checked }))
            }
          />
        </div>

        {/* Category filter */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Category</h4>
          <Checkbox.Group
            options={["Fitness", "Tech", "Food", "Beauty", "Travel"]}
            value={filters.category}
            onChange={(checked) =>
              setFilters((prev) => ({ ...prev, category: checked }))
            }
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between items-center mt-6">
          <Button
            type="link"
            onClick={() =>
              setFilters({
                platform: [],
                category: [],
              })
            }
          >
            Clear Filters
          </Button>
          <Button type="primary" onClick={() => setShowFilters(false)}>
            Apply
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default CampaignTableLayout;
