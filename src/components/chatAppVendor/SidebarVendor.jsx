import { RiAddLine, RiArrowLeftLine } from "react-icons/ri";
import { useState } from "react";

export default function SidebarVendor({ onSelectChat }) {
  const [selectedCampaign, setSelectedCampaign] = useState(null);

 const Influencer = [
    {
      name: "Sean Smith",
      message: "Hi How Are you ?",
      time: "05:00 PM",
      unread: 2,
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      campaignId: 1,
    },
    {
      name: "Annette Black",
      message: "Hi How Are you ?",
      time: "05:00 PM",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      campaignId: 2,
    },
  ];

  const Campaigns = [
    {
      id: 1,
      name: "Author One",
      message: "Published new book!",
      time: "02:30 PM",
      img: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      id: 2,
      name: "Author Two",
      message: "Working on a new article.",
      time: "04:10 PM",
      img: "https://randomuser.me/api/portraits/women/22.jpg",
    },
  ];

  const filteredInfluencers = selectedCampaign
    ? Influencer.filter((inf) => inf.campaignId === selectedCampaign.id)
    : [];

  return (
    <div className="h-full flex flex-col md:flex-row bg-white shadow-md rounded-2xl overflow-hidden">
      {/* Campaigns Panel */}
      <div className={`md:w-1/2 w-full border-r border-gray-200 flex flex-col
                      ${selectedCampaign ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <h2 className="font-semibold text-gray-700 text-sm md:text-base">Campaigns</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {Campaigns.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => setSelectedCampaign(campaign)}
              className={`flex items-center justify-between p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-100 transition ${
                selectedCampaign?.id === campaign.id ? "bg-gray-200" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={campaign.img}
                  alt={campaign.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="overflow-hidden">
                  <div className="font-semibold text-sm text-gray-800 truncate">{campaign.name}</div>
                  <div className="text-xs text-gray-500 truncate">{campaign.message}</div>
                </div>
              </div>
              <span className="text-xs text-gray-400">{campaign.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Influencers Panel */}
      <div className={`md:w-1/2 w-full flex flex-col
                      ${!selectedCampaign ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          {/* Back Button - only on mobile */}
          <button
            onClick={() => setSelectedCampaign(null)}
            className="md:hidden mr-2 p-2 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
            aria-label="Back"
          >
            <RiArrowLeftLine size={20} />
          </button>
          <h2 className="font-semibold text-gray-700 text-sm md:text-base flex-grow">
            Influencers
          </h2>
          <button className="w-9 h-9 bg-[#0D132D] text-white rounded-full flex items-center justify-center hover:bg-[#0a0e1f] transition">
            <RiAddLine />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredInfluencers.length > 0 ? (
            filteredInfluencers.map((inf) => (
              <div
                key={inf.name}
                onClick={() => onSelectChat(inf)}
                className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100 transition"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={inf.img}
                    alt={inf.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="overflow-hidden">
                    <div className="font-semibold text-sm text-gray-800 truncate">{inf.name}</div>
                    <div className="text-xs text-gray-500 truncate">{inf.message}</div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{inf.time}</span>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-400 text-sm">
              Please select a campaign to see influencers
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
