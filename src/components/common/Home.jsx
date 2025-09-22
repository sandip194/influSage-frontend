import { useState } from 'react'

export const Home = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  const campaigns = [
    { id: 1, name: "Campaign A", influencers: ["John", "Emma", "Liam"] },
    { id: 2, name: "Campaign B", influencers: ["Sophia", "Mia"] },
    { id: 3, name: "Campaign C", influencers: ["Noah", "Olivia", "Ethan"] },
  ];

  // For mobile, track which panel is currently visible
  const [activePanel, setActivePanel] = useState('campaigns'); // 'campaigns' | 'influencers' | 'chat'

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Campaigns Panel */}
      <div
        className={`
          bg-white border-r overflow-y-auto
          md:w-1/5
          ${activePanel === 'campaigns' ? 'block' : 'hidden'}
          md:block
        `}
      >
        <h2 className="p-4 font-bold text-lg border-b flex justify-between items-center">
          Campaigns
          {/* Show back button on mobile if not on campaigns panel */}
          {activePanel !== 'campaigns' && (
            <button
              onClick={() => setActivePanel('campaigns')}
              className="md:hidden text-blue-500"
            >
              Back
            </button>
          )}
        </h2>
        {campaigns.map((c) => (
          <div
            key={c.id}
            onClick={() => {
              setSelectedCampaign(c);
              setSelectedInfluencer(null);
              setActivePanel('influencers'); // move to influencers panel on mobile
            }}
            className={`p-3 cursor-pointer hover:bg-gray-200 ${
              selectedCampaign?.id === c.id ? "bg-gray-300 font-semibold" : ""
            }`}
          >
            {c.name}
          </div>
        ))}
      </div>

      {/* Influencers Panel */}
      <div
        className={`
          bg-white border-r overflow-y-auto
          md:w-1/5
          ${activePanel === 'influencers' ? 'block' : 'hidden'}
          md:block
        `}
      >
        <h2 className="p-4 font-bold text-lg border-b flex justify-between items-center">
          Influencers
          {/* Back button on mobile */}
          <button
            onClick={() => setActivePanel('campaigns')}
            className="md:hidden text-blue-500"
          >
            Back
          </button>
        </h2>
        {selectedCampaign ? (
          selectedCampaign.influencers.map((i, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedInfluencer(i);
                setActivePanel('chat'); // move to chat panel on mobile
              }}
              className={`p-3 cursor-pointer hover:bg-gray-200 ${
                selectedInfluencer === i ? "bg-gray-300 font-semibold" : ""
              }`}
            >
              {i}
            </div>
          ))
        ) : (
          <p className="p-3 text-gray-500">Select a campaign</p>
        )}
      </div>

      {/* Chat Panel */}
      <div
        className={`
          flex-1 bg-white flex flex-col
          ${activePanel === 'chat' ? 'block' : 'hidden'}
          md:block
        `}
      >
        <div className="p-4 border-b font-bold text-lg flex justify-between items-center">
          {selectedInfluencer
            ? `Chat with ${selectedInfluencer}`
            : "Select an influencer"}
          {/* Back button on mobile */}
          <button
            onClick={() => setActivePanel('influencers')}
            className="md:hidden text-blue-500"
          >
            Back
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedInfluencer ? (
            <div className="space-y-3">
              <div className="bg-gray-200 p-3 rounded-lg w-max">Hello 👋</div>
              <div className="bg-blue-500 text-white p-3 rounded-lg w-max ml-auto">
                Hi! Let’s work on the campaign.
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No messages yet</p>
          )}
        </div>

        {selectedInfluencer && (
          <div className="p-3 border-t flex">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-3 py-2 mr-2"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 