import { RiAddLine } from "react-icons/ri";
import { useState } from "react";

export default function SidebarVendor({ onSelectChat }) {
  const [activeTab, setActiveTab] = useState("Influencer");

  const Influencer = [
    {
      name: "Sean Smith",
      message: "Hi How Are you ?",
      time: "05:00 PM",
      unread: 2,
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Annette Black",
      message: "Hi How Are you ?",
      time: "05:00 PM",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];

  const Campaigns = [
    {
      name: "Author One",
      message: "Published new book!",
      time: "02:30 PM",
      img: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      name: "Author Two",
      message: "Working on a new article.",
      time: "04:10 PM",
      img: "https://randomuser.me/api/portraits/women/22.jpg",
    },
  ];

  const currentList = activeTab === "Campaigns" ? Campaigns : Influencer;

  return (
    <div className="h-full flex rounded-2xl flex-col bg-white">
      <div className="p-4 flex items-center bg-white border-b border-gray-200">
        <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-2 flex-1">
          <svg
            className="w-5 h-5 text-gray-400 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 12.65z" />
          </svg>
          <input
            placeholder="Search"
            className="w-full outline-none text-sm"
          />
        </div>
      </div>

      {/* Tabs + Add Button */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex space-x-6 text-sm font-medium">
          {["Influencer", "Campaigns"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-[#0D132D] text-[#0D132D]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button className="w-9 h-9 bg-[#0D132D] text-white rounded-full flex items-center justify-center">
          <RiAddLine />
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {currentList.map((item, i) => (
          <div
            key={i}
            onClick={() => onSelectChat(item)}
            className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <img
                src={item.img}
                alt={item.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-xs text-gray-500">{item.message}</div>
              </div>
            </div>
            <span className="text-xs text-gray-400">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
