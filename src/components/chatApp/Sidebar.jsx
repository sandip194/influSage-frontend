import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { RiAddLine } from "react-icons/ri";
import { CloseCircleFilled } from "@ant-design/icons";
import { Tooltip, Skeleton  } from "antd";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../../sockets/socket";

const SidebarSkeleton = () => (
    <div className="px-4 py-3 flex items-center gap-3">
      <Skeleton.Avatar active size="large" shape="circle" />
      <div className="flex-1">
        <Skeleton.Input
          active
          size="small"
          style={{ width: "70%", marginBottom: 6 }}
        />
        <Skeleton.Input active size="small" style={{ width: "40%" }} />
      </div>
    </div>  
);
export default function Sidebar({ onSelectChat }) {
  const socket = getSocket();
  const { token } = useSelector((state) => state.auth);
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  
  // const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch campaign list
  const fetchCampaigns = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const response = await axios.get(`/chat/conversationsdetails`, {
        params: { p_search: search.trim() || "" },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const formatted = (response.data.data || []).map((c) => ({
          ...c,
          campaignphoto: c.campaignphoto ?? null,
        }));
        setCampaigns(formatted);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };


 useEffect(() => {
  fetchCampaigns();

  const handleIncoming = () => {
    fetchCampaigns();
  };

  if (socket) {
    socket.off("receiveMessage", handleIncoming);
    socket.on("receiveMessage", handleIncoming);
  }

  return () => {
    if (socket) {
      socket.off("receiveMessage", handleIncoming);
    }
  };
}, [socket, token, search]);

const hasUnreadMessage = (vendor) => {
  if (!vendor) return false;
  if (!vendor.lastmessage || vendor.lastmessage === null) {
    return false;
  }
  return vendor.readbyinfluencer === false;
};

  return (
    <div className="h-full flex rounded-2xl flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b-2 border-gray-100 font-bold text-xl flex justify-between items-center">
        <span>Conversations</span>
          <Tooltip title="Search Campaign">
            <button
              onClick={() => navigate("/dashboard/browse")}
              className="w-10 cursor-pointer h-10 cursor-pointer bg-[#0D132D] text-white rounded-full text-xl flex items-center justify-center hover:bg-[#1a1f3f] transition"
            >
              <RiAddLine />
            </button>
          </Tooltip>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-2 relative">
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
            className="w-full outline-none text-sm pr-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <Tooltip title="Clear search" placement="top">
              <CloseCircleFilled
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-150"
              />
            </Tooltip>
          )}
        </div>
      </div>

      {/* Campaign List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <>
            {Array.from({ length: 6 }).map((_, idx) => (
              <SidebarSkeleton key={idx} />
            ))}
          </>
        ) : campaigns?.length > 0 ? (
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
                  if (socket) {
                    socket.emit("joinRoom", String(conversationId));
                  }
                  onSelectChat({
                    id: conversationId,
                    name: campaign.campaignname,
                    img: campaign.campaignphoto,
                    vendorId: vendor.vendorid || vendor.id,
                    campaignid: campaign.campaignid,
                    campaignname: campaign.campaignname,
                    vendorName: `${vendor.firstname }`,
                    canstartchat: vendor.canstartchat, 
                    date: Date.now(),
                  });

                  // remove from unread once clicked
                  setCampaigns(prev =>
                    prev.map(c =>
                      c.vendors?.[0]?.conversationid === conversationId
                        ? {
                            ...c,
                            vendors: [
                              {
                                ...c.vendors[0],
                                readbyinfluencer: true,
                              },
                            ],
                          }
                        : c
                    )
                  );
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300
                  ${isSelected
                    ? "bg-gray-200 border-l-4 border-gray-500 shadow-sm scale-[1.01]"
                    : "hover:bg-gray-100"
                  }
                  ${unread ? "bg-gray-100 shadow-md scale-[1.02]" : ""}
                `}
              >
                <div className="flex items-center space-x-3">
                  {campaign.campaignphoto ? (
                    <img
                      src={campaign.campaignphoto}
                      alt={campaign.campaignname}
                      onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                      {campaign.campaignname?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate max-w-[160px]">
                      {campaign.campaignname}
                    </div>
                    <div
                      className={`text-sm truncate max-w-[180px] ${unread ? "text-gray-900 font-semibold" : "text-gray-500"
                        }`}
                    >
                      {
                        unread
                          ? "New message"
                          : vendor.ishtml
                            ? "Campaign invitation received"
                            : vendor.lastmessage || "No messages yet"
                      }
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
          <div className="p-4 text-sm text-gray-500">No campaigns found</div>
        )}
      </div>
    </div>
  );
}
