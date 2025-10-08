import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { RiAddLine } from "react-icons/ri";

export default function Sidebar({ onSelectChat }) {
  const { token } = useSelector((state) => state.auth);
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch campaign list
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

  // Fetch unread messages
  const fetchUnreadMessages = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`/chat/unread-messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.data) {
        setUnreadMessages(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch unread messages:", err);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchUnreadMessages();

    // refresh unread every few seconds
    const interval = setInterval(fetchUnreadMessages, 10000);
    return () => clearInterval(interval);
  }, [token, search]);
  
  // check if this campaign/vendor has an unread message
  const hasUnreadMessage = (vendor) => {
    if (!vendor) return false;

    const vendorId = vendor.vendorid || vendor.id || vendor.ownerid;
    // check if any unread message has same ownerid as vendorId
    return unreadMessages.some((msg) => String(msg.ownerid) === String(vendorId));
  };

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
            if (!vendor?.conversationid) return null;

            const conversationId = vendor.conversationid;
            const isSelected = selectedCampaignId === conversationId;
            const unread = hasUnreadMessage(vendor);

            return (
              <div
                key={conversationId}
                onClick={() => {
                  setSelectedCampaignId(conversationId);
                  onSelectChat({
                    id: conversationId,
                    name: campaign.campaignname,
                    img: campaign.campaignphoto,
                    vendorId: vendor.vendorid || vendor.id,
                  });

                  // remove from unread once clicked
                  setUnreadMessages((prev) =>
                    prev.filter((msg) => String(msg.ownerid) !== String(vendor.vendorid || vendor.id))
                  );
                }}
                className={`flex items-center justify-between p-4 border-b border-gray-100 rounded-lg transition-all duration-200 cursor-pointer
                    ${isSelected ? "bg-blue-100 shadow-md transform scale-105" : "hover:bg-gray-100"}
                    ${unread ? "bg-[#F0F4FF]" : ""}`}
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
                    <div className={`text-xs ${unread ? "text-[#0D132D] font-semibold" : "text-gray-500"}`}>
                      {unread ? "New message" : "Click to chat"}
                    </div>
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
