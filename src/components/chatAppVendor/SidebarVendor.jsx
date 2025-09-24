import { RiAddLine, RiArrowLeftLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function SidebarVendor({ onSelectChat }) {
  const { token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [influencers, setInfluencers] = useState([]);

  const fetchCampaigns = async () => {
    if (!token) return;

    try {
      const response = await axios.get(`/chat/conversationsdetails`, {
        params: { p_search: "" },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
  const formatted = (response.data.data || []).map((c) => ({
    ...c,
    campaignphoto: c.campaignphoto
      ? `${BASE_URL}/${c.campaignphoto.startsWith("src/") ? c.campaignphoto : `src/${c.campaignphoto}`}`
      : null,
  }));

  setCampaigns(formatted);

  const allInfluencers = formatted.flatMap((c) =>
    (c.influencers || []).map((v) => ({
      ...v,
      campaignId: c.conversationid,
      campaignName: c.campaignname,
      campaignPhoto: c.campaignphoto,
       img: v.userphoto
      ? `${BASE_URL}/${v.userphoto.startsWith("src/") ? v.userphoto : `src/${v.userphoto}`}`
      : null,
      name: `${v.firstname} ${v.lastname}`,
      message: v.lastmessage || "No message",
      time: v.lastmessagedate || "",
    }))
  );

  setInfluencers(allInfluencers);
}

    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setCampaigns([]);
      setInfluencers([]);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [token]);

  const filteredInfluencers = selectedCampaign
    ? influencers.filter((inf) => inf.campaignId === selectedCampaign.conversationid)
    : [];

  return (
    <div className="h-full flex flex-col md:flex-row gap-4">
      {/* Campaigns Panel */}
      <div
        className={`flex-1 flex flex-col bg-white shadow-md rounded-2xl overflow-hidden
                    ${selectedCampaign ? "hidden md:flex" : "flex"}`}
      >
        <div className="w-full p-4 flex items-center justify-between border-b border-gray-200">
          <h2 className="font-semibold text-gray-700 text-sm md:text-base w-full text-left">
            Campaigns
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {campaigns?.map((campaign) => (
            <div
              key={campaign?.conversationid}
              onClick={() => setSelectedCampaign(campaign)}
              className={`flex items-center justify-between p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-100 transition ${
                selectedCampaign?.conversationid === campaign.conversationid ? "bg-gray-200" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={campaign.campaignphoto}
                  alt={campaign.campaignname}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="overflow-hidden">
                  <div className="font-semibold text-sm text-gray-800 truncate">{campaign.campaignname}</div>
                  <div className="text-xs text-gray-500 truncate">Click to chat</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Influencers Panel */}
      <div
        className={`flex-1 flex flex-col bg-white shadow-md rounded-2xl overflow-hidden
                    ${!selectedCampaign ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
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
                key={inf.vendorid}
                onClick={() => onSelectChat({ ...inf, campaign: selectedCampaign })}
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
               <span className="text-xs text-gray-400">
                {inf.time ? new Date(inf.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
              </span>
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
