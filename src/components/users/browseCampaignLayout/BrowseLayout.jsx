import React from "react";
import {
  RiFileCopyLine,
  RiVideoAddLine,
  RiExchangeDollarLine,
  RiArrowDownSLine,
  RiEqualizerFill
} from "@remixicon/react";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import DeshboardHeader from "../deshboardLayout/DeshboardHeader";
import Sidebar from "../deshboardLayout/Sidebar";
import { Link } from "react-router-dom";
import DescriptionLayout from "./DescriptionLayout";

const Browse = () => {

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
      description: "Create a review video for our new product line. Read More...",
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
      description: "Share our latest tech gadget with your followers. Read More...",
      tags: ["One Time", "Beginner", "Tech"],
    },
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
    },{
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
    }
  ];

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "priceLowHigh", label: "Price: Low to High" },
    { value: "priceHighLow", label: "Price: High to Low" },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="lg:block hidden w-full lg:w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-auto">
        {/* Header */}
        <DeshboardHeader />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 bg-gray-100 overflow-y-auto">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Browse Campaign
          </h2>
          <p className="mb-4 sm:mb-6 text-gray-700 text-sm sm:text-base">
            Track your campaigns & Browse
          </p>

          <div className="p-4 sm:p-5 bg-white rounded-lg mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="px-4 py-2 rounded-md cursor-pointer bg-white text-[#141843] border border-[#e5e7eb] hover:bg-[#f3f4f6] focus:bg-[#0f122f] focus:text-white transition">
              Browse Campaign
            </button>
            <button className="px-4 py-2 rounded-md cursor-pointer bg-white text-[#141843] border border-[#e5e7eb] hover:bg-[#f3f4f6] focus:bg-[#0f122f] focus:text-white transition">
              Applied Campaign
            </button>
            <button className="px-4 py-2 rounded-md cursor-pointer bg-white text-[#141843] border border-[#e5e7eb] hover:bg-[#f3f4f6] focus:bg-[#0f122f] focus:text-white transition">
              Saved Campaign
            </button>
          </div>

          <div className="p-6 bg-white rounded-lg">
            <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Browse Campaign
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
              <div className="w-full sm:w-auto flex-1">
                <Input
                  size="large"
                  prefix={<SearchOutlined />}
                  placeholder=" Search"
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <div className="relative">
                  <select className="appearance-none border border-gray-200 rounded-md px-4 py-2 pr-8 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f122f] transition">
                    <option value="" disabled selected>
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
                <button className="flex items-center gap-2 border border-gray-200 rounded-md px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 transition">
                  Filter
                  <RiEqualizerFill size={16} />
                </button>

              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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
                    <RiExchangeDollarLine size={16}/>
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
                     <Link to="/">
                        <button
                          className="w-full px-4 py-2 cursor-pointer rounded-3xl bg-[#0f122f] text-white font-semibold hover:bg-[#23265a] transition"
                        >
                          Apply Now
                        </button>
                      </Link>

                      <Link to="/DescrpitionLayout">
                        <div
                          className="border border-gray-200 bg-white w-14 h-11 p-1 flex justify-center items-center rounded-full text-xl cursor-pointer"
                        >
                          <RiFileCopyLine size={18} />
                        </div>
                      </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Browse;
