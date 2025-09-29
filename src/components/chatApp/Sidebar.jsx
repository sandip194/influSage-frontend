import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { RiAddLine } from "react-icons/ri";

export default function Sidebar({ onSelectChat }) {
  const { token } = useSelector((state) => state.auth);
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchCampaigns = async () => {
    if (!token) return;

    try {
      const response = await axios.get(`/chat/conversationsdetails`, {
        params: { p_search: search },
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
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setCampaigns([]);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [token, search]);

  return (
    <div className="h-full flex rounded-2xl flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b-2 border-gray-100 font-bold text-xl flex justify-between items-center">
        <span>Conversations</span>
        <button className="w-10 h-10 bg-[#0D132D] text-white rounded-full text-xl flex items-center justify-center">
          <RiAddLine />
        </button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-2">
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
            placeholder="Search campaigns..."
            className="w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Campaign List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {campaigns?.length > 0 ? (
          campaigns.map((campaign) => {
            const vendor = campaign.vendors?.[0];
            if (!vendor?.conversationid) return null; // safety check

            const conversationId = vendor.conversationid;
            const isSelected = selectedCampaignId === conversationId;

            return (
              <div
                key={conversationId}
                onClick={() => {
                  setSelectedCampaignId(conversationId);
                  onSelectChat({
                    id: conversationId, // ✅ normalized id
                    name: campaign.campaignname,
                    img: campaign.campaignphoto,
                    // add other fields if needed
                  });
                }}
                className={`flex items-center justify-between p-4 cursor-pointer border-b border-gray-100
                  ${isSelected ? "bg-gray-100 scale-105" : "hover:bg-gray-100"} transition`}
              >
                <div className="flex items-center space-x-3">
                  {campaign.campaignphoto && (
                    <img
                      src={campaign.campaignphoto}
                      alt={campaign.campaignname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-sm">{campaign.campaignname}</div>
                    <div className="text-xs text-gray-500">Click to chat</div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-sm text-gray-500">No campaigns found</div>
        )}
      </div>
    </div>
  );
}
