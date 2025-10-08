import { RiAddLine, RiArrowLeftLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function SidebarVendor({ onSelectChat }) {
  const { token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [search, setSearch] = useState("");
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [loadingUnread, setLoadingUnread] = useState(false);


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

        const allInfluencers = formatted.flatMap((c) =>
          (c.influencers || []).map((v) => ({
            ...v,
            campaignId: c.campaignid,
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

  const fetchUnreadMessages = async () => {
  try {
    setLoadingUnread(true);
    const res = await axios.get(`/chat/unread-messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data?.data) {
      setUnreadMessages(res.data.data);
    }
  } catch (err) {
    console.error("Failed to fetch unread messages:", err);
  } finally {
    setLoadingUnread(false);
  }
};

  useEffect(() => {
  if (token) {
    fetchCampaigns();
    fetchUnreadMessages();
  }
  const interval = setInterval(fetchUnreadMessages, 10000);
    return () => clearInterval(interval);
}, [token, search]);



  const filteredInfluencers = selectedCampaign
    ? influencers.filter((inf) => inf.campaignId === selectedCampaign.campaignid)
    : [];

  return (
    <div className="h-full flex flex-col md:flex-row gap-4">
      {/* Campaigns Panel */}
      <div
        className={`flex-1 w-full h-full flex flex-col bg-white shadow-md rounded-2xl overflow-hidden
              ${selectedCampaign ? "hidden md:flex" : "flex"}`}
      >
        <div className="w-full p-4 flex items-center justify-between border-b border-gray-200">
          <h2 className="font-semibold text-gray-700 text-sm md:text-base w-full text-left">
            Campaigns
          </h2>
        </div>

    {/* Search */}
      <div className="p-3">
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

       <hr className="my-2 border-gray-200" />

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {campaigns?.map((campaign) => {
            const isSelected = selectedCampaign?.campaignid === campaign.campaignid;
            return (
              <div
                key={campaign?.campaignid}
                onClick={() => {
                  setSelectedCampaign(campaign);
                  setSelectedInfluencer(null); // reset selected influencer
                }}
                className={`flex items-center justify-between p-4 cursor-pointer border-b border-gray-100 rounded-lg transition-all duration-200
                        ${isSelected
                    ? "bg-blue-100 shadow-md transform scale-105"
                    : "hover:bg-gray-100"}`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={campaign.campaignphoto}
                    alt={campaign.campaignname}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="overflow-hidden max-w-[140px] min-w-0">
                    <div className="font-semibold text-sm text-gray-800 truncate">{campaign.campaignname}</div>
                    <div className="text-xs text-gray-500 truncate">Click to chat</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Influencers Panel */}
      <div
        className={`flex-1 w-full h-full flex flex-col bg-white shadow-md rounded-2xl overflow-hidden
              ${!selectedCampaign ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <button
            onClick={() => {
              setSelectedCampaign(null);
              setSelectedInfluencer(null);
            }}
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
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {filteredInfluencers?.length > 0 ? (
            filteredInfluencers.map((inf) => {
              const isSelected = selectedInfluencer === inf.influencerid;

              // Find unread message for this influencer
              const unreadMsg = unreadMessages.find(
                (msg) => String(msg.userid) === String(inf.influencerid) && msg.readbyvendor === false
              );

              const displayMessage = unreadMsg ? 'New Message' : inf.message;
              const highlight = !!unreadMsg;

              return (
                <div
                  key={inf.influencerid}
                  onClick={() => {
                    setSelectedInfluencer(inf.influencerid);
                    onSelectChat({ ...inf, campaign: selectedCampaign });

                    // Remove from unread once clicked
                    setUnreadMessages((prev) =>
                      prev.filter((msg) => String(msg.userid) !== String(inf.influencerid))
                    );
                  }}
                  className={`flex items-center justify-between p-4 border-b border-gray-100 rounded-lg transition-all duration-200 cursor-pointer
                    ${isSelected ? "bg-blue-100 transform scale-105" : "hover:bg-gray-100"}
                    ${highlight ? "bg-[#F0F4FF]" : ""}`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={inf.img}
                      alt={inf.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="overflow-hidden max-w-[140px] min-w-0">
                      <div className="font-semibold text-sm text-gray-800 truncate">{inf.name}</div>
                      <div className={`text-xs truncate ${highlight ? "text-[#0D132D] font-semibold" : "text-gray-500"}`}>
                        {displayMessage}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {inf.time ? new Date(inf.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                  </span>
                </div>
              );
            })
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
