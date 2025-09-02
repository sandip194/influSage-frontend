import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  RiFileCopyLine,
  RiVideoAddLine,
  RiExchangeDollarLine,
  RiArrowDownSLine,
  RiEqualizerFill,
} from "@remixicon/react";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

const Browse = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState("browse");

  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (path) => {
    navigate(path);
  };

  const buttons = [
    { id: "browse", label: "Browse Campaign", path: "/dashboard/browse" },
    {
      id: "applied",
      label: "Applied Campaign",
      path: "/dashboard/browse/applied",
    },
    { id: "saved", label: "Saved Campaign", path: "/dashboard/browse/saved" },
  ];

  const selectedButton = buttons.find((b) => location.pathname === b.path)?.id;

  const campaigns = [
    {
      id: 1,
      time: "Posted 25 Mins Ago",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      title: "Instagram Campaign",
      brand: "Tiktokstar",
      type: "Instagram Video",
      price: "$120.25 / Video",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Read More...",
      tags: ["Fixed Price", "Expert", "Beauty", "Micro"],
    },
    {
      id: 2,
      time: "Posted 25 Mins Ago",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      title: "YouTube Review",
      brand: "BeautyPro",
      type: "YouTube Video",
      price: "$200.00 / Video",
      description:
        "Create a review video for our new product line. Read More...",
      tags: ["Fixed Price", "Intermediate", "Lifestyle"],
    },
    {
      id: 3,
      time: "Posted 25 Mins Ago",
      image: "https://randomuser.me/api/portraits/men/65.jpg",
      title: "Twitter Shoutout",
      brand: "TechGuru",
      type: "Twitter Post",
      price: "$50.00 / Post",
      description:
        "Share our latest tech gadget with your followers. Read More...",
      tags: ["One Time", "Beginner", "Tech"],
    },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "priceLowHigh", label: "Price: Low to High" },
    { value: "priceHighLow", label: "Price: High to Low" },
  ];

  return (
    <main className="flex-1 bg-gray-100 overflow-y-auto w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse Campaign</h2>
      <p className="mb-6 text-gray-700 text-sm">
        Track your campaigns & Browse
      </p>

      <div className="bg-white p-4 rounded-lg mb-6 flex flex-col sm:flex-row gap-3">
        {buttons.map(({ id, label, path }) => (
          <button
            key={id}
            onClick={() => handleClick(path)}
            className={`px-4 py-2 rounded-md border border-gray-300 transition
      ${
        selectedButton === id
          ? "bg-[#0f122f] text-white"
          : "bg-white text-[#141843] hover:bg-gray-100"
      }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg">
        <h4 className="text-xl font-bold text-gray-900 mb-2">
          Browse Campaign
        </h4>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search"
            className="w-full sm:w-auto flex-1"
          />

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-end">
              <div className="relative w-full sm:w-auto">
                <select className="w-full sm:w-auto appearance-none border border-gray-200 rounded-md px-4 py-2 pr-8 bg-white text-gray-700">
                  <option value="" disabled defaultValue>
                    Sort By
                  </option>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <RiArrowDownSLine size={16} />
                </span>
              </div>

              {!showFilter && (
                <button
                  onClick={() => setShowFilter(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-200 rounded-md px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 transition"
                >
                  Filter
                  <RiEqualizerFill size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div
            className={`grid gap-6 flex-1 ${
              showFilter
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border rounded-2xl transition hover:shadow-sm border-gray-200 bg-white p-5 flex flex-col"
              >
                <span className="text-xs text-gray-500 mb-3">
                  {campaign.time}
                </span>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={campaign.image}
                    alt="icon"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {campaign.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {campaign.brand}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <RiVideoAddLine size={16} />
                  <span>{campaign.type}</span>
                  <RiExchangeDollarLine size={16} />
                  <span>{campaign.price}</span>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  {campaign.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {campaign.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto gap-4">
                  <Link to="apply-now" className="flex-1">
                    <button className="w-full py-2 rounded-3xl bg-[#0f122f] text-white font-semibold hover:bg-[#23265a] transition">
                      Apply Now
                    </button>
                  </Link>
                  <Link to="description" className="flex-shrink-0">
                    <div className="border border-gray-200 bg-white w-10 h-10 p-2 flex justify-center items-center rounded-3xl cursor-pointer hover:bg-gray-100 transition">
                      <RiFileCopyLine size={20} />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {showFilter && (
            <div className="w-full lg:w-80 border border-gray-300 rounded-lg p-4 bg-gray-50 flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filter Options</h3>
                <button
                  onClick={() => setShowFilter(false)}
                  className="text-gray-500 hover:text-gray-900"
                >
                  Close
                </button>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Platform</h4>
                {["Instagram", "YouTube", "Facebook", "TikTok"].map((item) => (
                  <label key={item} className="block mb-1">
                    <input type="checkbox" className="mr-2" />
                    {item}
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">Type</h4>
                {["All", "Story", "Reel", "Video"].map((item) => (
                  <label key={item} className="block mb-1">
                    <input type="checkbox" className="mr-2" />
                    {item}
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">Campaign</h4>
                {["Instagram", "Youtube", "Guest"].map((item) => (
                  <label key={item} className="block mb-1">
                    <input type="checkbox" className="mr-2" />
                    {item}
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">Budget</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    className="border border-gray-300 rounded px-2 py-1 w-1/2"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    className="border border-gray-300 rounded px-2 py-1 w-1/2"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button className="flex-1 py-2 bg-gray-200 rounded hover:bg-gray-300">
                  Clear
                </button>
                <button
                  className="flex-1 py-2 bg-[#0f122f] text-white rounded hover:bg-[#23265a]"
                  onClick={() => setShowFilter(false)}
                >
                  Filter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Browse;
