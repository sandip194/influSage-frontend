import {
  RiGiftLine,
  RiLinksLine,
  RiMegaphoneLine,
  RiTrophyLine,
  RiVideoAddLine,
  RiLiveLine,
  RiSwapBoxLine,
  RiVipCrownLine,
} from "@remixicon/react";
import React, { useEffect, useState } from "react";

const STORAGE_KEY = "selected_objective"; // Store a single ID

const objectives = [
  {
    id: 1,
    icon: <RiVideoAddLine />,
    title: "Content Production",
    description:
      "Get influencers to create videos or images for your brand and/or post them on their social as Reels, Stories, Feeds, TikToks.",
  },
  {
    id: 2,
    icon: <RiGiftLine />,
    title: "Gifted Products",
    description:
      "Gift influencers a product to generate content and promote on their channels.",
  },
  {
    id: 3,
    icon: <RiMegaphoneLine />,
    title: "Promotions/Shoutouts",
    description:
      "Ask influencers to post existing content of your product on their social channels or give a shout out to your brand and social account.",
  },
  {
    id: 4,
    icon: <RiLinksLine />,
    title: "Affiliate Marketing",
    description:
      "Provide influencers a unique link to promote your product and earn a % of the sales they drive.",
  },
  {
    id: 5,
    icon: <RiTrophyLine />,
    title: "Giveaways & Contests",
    description:
      "Collaborate with influencers to organize giveaways or contests, creating engagement and brand awareness.",
  },
  {
    id: 6,
    icon: <RiLiveLine />,
    title: "Live Collaborations",
    description:
      "Host live sessions or Q&A sessions with influencers, fostering real-time interaction and engagement.",
  },
  {
    id: 7,
    icon: <RiSwapBoxLine />,
    title: "Barter",
    description:
      "Send product to influencers in exchange for promotion. They may also request a fee.",
  },
  {
    id: 8,
    icon: <RiVipCrownLine />,
    title: "Brand Ambassadorship",
    description:
      "Build long-term partnerships where influencers become brand ambassadors.",
  },
];

const ObjectiveSelector = ({ onBack, onNext }) => {
  const [selected, setSelected] = useState(null); // now a single value
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) setSelected(parsed);
    }
  }, []);

  const handleSelection = (id) => {
    setSelected(id);
  };

  const handleContinue = () => {
    if (!selected) {
      setError("Please select one objective to complete your profile.");
      return;
    }
    setError("");
    localStorage.setItem(STORAGE_KEY, selected.toString());
    onNext();
  };

  return (
    <div className="bg-white p-6 rounded-3xl text-inter">
      <h2 className="text-2xl font-bold text-[#141843] mb-1">Objectives</h2>
      <p className="text-sm text-gray-500 mb-6">
        What would you like to achieve with influencer?
      </p>

      {/* Objective Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {objectives.map((obj) => (
          <div
            key={obj.id}
            onClick={() => handleSelection(obj.id)}
            className={`border rounded-2xl p-4 cursor-pointer transition hover:shadow-sm ${
              selected === obj.id
                ? "border-[#141843] bg-gray-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex flex-col items-start gap-3 p-2">
              <div className="w-14 h-14 p-1 flex justify-center items-center rounded-full bg-gray-100 text-xl">
                {obj.icon}
              </div>
              <div>
                <h3 className="font-bold text-[#141843] mb-1">{obj.title}</h3>
                <p className="text-sm text-gray-500">{obj.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-red-600 text-sm mt-4 font-medium">{error}</p>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={onBack}
          className="bg-white text-sm cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="bg-[#121A3F] text-sm text-white cursor-pointer inset-shadow-sm inset-shadow-gray-500 px-8 py-1 rounded-full hover:bg-[#0D132D]"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ObjectiveSelector;
