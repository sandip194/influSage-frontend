import { RiAddLine, RiArrowLeftLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function SidebarVendor({ onSelectChat }) {
  const { token } = useSelector((state) => state.auth);
 // const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [search, setSearch] = useState("");
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [loadingUnread, setLoadingUnread] = useState(false);
  const selectChatFromOutside = location.state?.selectChatFromOutside || null;


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
          campaignphoto: c.campaignphoto ? c.campaignphoto : null,
        }));

        setCampaigns(formatted);

        const allInfluencers = formatted
          .flatMap((c) =>
            (c.influencers || []).map((v) => ({
              ...v,
              campaignId: c.campaignid,
              campaignName: c.campaignname,
              campaignPhoto: c.campaignphoto,
              img: v.userphoto ? v.userphoto : null,
              name: `${v.firstname} ${v.lastname}`,
              message: v.lastmessage || "No message",
              time: v.lastmessagedate || "",
            }))
          )
          .sort((a, b) => new Date(b.time) - new Date(a.time));

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
  fetchCampaigns();
  fetchUnreadMessages();

  // refresh unread messages every 10 seconds
  const unreadInterval = setInterval(fetchUnreadMessages, 3000);

  // refresh campaigns every 3 seconds
  const campaignsInterval = setInterval(fetchCampaigns, 3000);

  // Cleanup intervals on unmount
  return () => {
    clearInterval(unreadInterval);
    clearInterval(campaignsInterval);
  };
}, [token, search]);
useEffect(() => {
  if (selectChatFromOutside && campaigns.length > 0) {
    const { influencerid } = selectChatFromOutside;

    const campaign = campaigns.find(c =>
      c.influencers.some(i => i.influencerid === influencerid)
    );

    if (campaign) {
      setSelectedCampaign(campaign);

      const influencer = campaign.influencers.find(i => i.influencerid === influencerid);
      if (influencer) {
        setSelectedInfluencer(influencerid);

        onSelectChat({
          conversationid: influencer.conversationid,
          id: influencer.conversationid,
          name: `${influencer.firstname} ${influencer.lastname}`,
          img: influencer.userphoto ? influencer.userphoto : null,
          influencerid: influencer.influencerid,
        });
      }
    }
  }
}, [selectChatFromOutside, campaigns]);


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
            const hasUnread = unreadMessages.some(
              (msg) =>
                campaign.influencers?.some(
                  (inf) => String(inf.influencerid) === String(msg.userid)
                ) && msg.readbyvendor === false
            );
            return (
              <div
                key={campaign?.campaignid}
                onClick={() => {
                  setSelectedCampaign(campaign);
                  setSelectedInfluencer(null);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300
                  ${isSelected ? "bg-gray-200 border-l-4 border-gray-500 shadow-sm scale-[1.01]" : "hover:bg-gray-100"}
                  ${hasUnread ? "bg-gray-100 shadow-md scale-[1.02]" : ""}`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={campaign.campaignphoto}
                    alt={campaign.campaignname}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="overflow-hidden max-w-[140px] min-w-0">
                    <div className="font-semibold text-sm text-gray-800 truncate">
                      {campaign.campaignname}
                    </div>
                    <div
                      className={`text-xs truncate ${
                        hasUnread ? "text-gray-900 font-semibold" : "text-gray-500"
                      }`}
                    >
                      {hasUnread ? "New message" : "Click to chat"}
                    </div>
                  </div>
                </div>
                {hasUnread && (
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></div>
                )}
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
              setSelectedCampaign(campaign);
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
            const unread = unreadMessages.some(
              (msg) => String(msg.userid) === String(inf.influencerid) && msg.readbyvendor === false
            );

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
                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300
                  ${isSelected ? "bg-gray-200 border-l-4 border-gray-500 shadow-sm scale-[1.01]" : "hover:bg-gray-100"}
                  ${unread ? "bg-gray-100 shadow-md scale-[1.02]" : ""}`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {inf.img ? (
                    <img
                      src={inf.img}
                      alt={inf.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                      {inf.name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate max-w-[160px]">
                      {inf.name}
                    </div>
                    <div
                      className={`text-sm truncate max-w-[180px] ${
                        unread ? "text-gray-900 font-semibold" : "text-gray-500"
                      }`}
                    >
                      {unread ? "New message" : "Click to chat"}
                    </div>
                  </div>
                </div>

                {unread && (
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></div>
                )}
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
