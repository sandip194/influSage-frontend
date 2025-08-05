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
<<<<<<< HEAD
    title: "Build Brand Awareness",
    description:
      "Increase overall visibility and recognition of our brand.",
=======
    title: "Content Production",
    description:
      "Get influencers to create videos or images for your brand and/or post them on their social as Reels, Stories, Feeds, TikToks.",
>>>>>>> beea83cd3a90d9af67dc7d3cb750dfde7d150ec3
  },
  {
    id: 2,
    icon: <RiGiftLine />,
<<<<<<< HEAD
    title: "Promote a Product or Service",
    description:
      "Focus on showcasing or launching specific products or services.",
=======
    title: "Gifted Products",
    description:
      "Gift influencers a product to generate content and promote on their channels.",
>>>>>>> beea83cd3a90d9af67dc7d3cb750dfde7d150ec3
  },
  {
    id: 3,
    icon: <RiMegaphoneLine />,
<<<<<<< HEAD
    title: "Drive Website or App Traffic",
    description:
      "Increase visitors to our website or app through influencer campaigns.",
=======
    title: "Promotions/Shoutouts",
    description:
      "Ask influencers to post existing content of your product on their social channels or give a shout out to your brand and social account.",
>>>>>>> beea83cd3a90d9af67dc7d3cb750dfde7d150ec3
  },
  {
    id: 4,
    icon: <RiLinksLine />,
<<<<<<< HEAD
    title: "Generate Sales or Conversions",
    description:
      "Drive purchases, signups, or downloads from influencer referrals.",
=======
    title: "Affiliate Marketing",
    description:
      "Provide influencers a unique link to promote your product and earn a % of the sales they drive.",
>>>>>>> beea83cd3a90d9af67dc7d3cb750dfde7d150ec3
  },
  {
    id: 5,
    icon: <RiTrophyLine />,
<<<<<<< HEAD
    title: "Reach a New Target Audience",
    description:
      "Connect with a specific demographic, niche, or regional audience.",
=======
    title: "Giveaways & Contests",
    description:
      "Collaborate with influencers to organize giveaways or contests, creating engagement and brand awareness.",
>>>>>>> beea83cd3a90d9af67dc7d3cb750dfde7d150ec3
  },
  {
    id: 6,
    icon: <RiLiveLine />,
<<<<<<< HEAD
    title: "Build Social Media Presence",
    description:
      "Grow followers and engagement on our brand’s social channels.",
=======
    title: "Live Collaborations",
    description:
      "Host live sessions or Q&A sessions with influencers, fostering real-time interaction and engagement.",
>>>>>>> beea83cd3a90d9af67dc7d3cb750dfde7d150ec3
  },
  {
    id: 7,
    icon: <RiSwapBoxLine />,
<<<<<<< HEAD
    title: "Get High-Quality Content",
    description:
      "Receive influencer-generated content (photos, videos, testimonials) for our marketing use.",
=======
    title: "Barter",
    description:
      "Send product to influencers in exchange for promotion. They may also request a fee.",
>>>>>>> beea83cd3a90d9af67dc7d3cb750dfde7d150ec3
  },
  {
    id: 8,
    icon: <RiVipCrownLine />,
<<<<<<< HEAD
    title: "Improve Community Engagement",
    description:
      "Boost likes, comments, shares, and overall interaction with our brand.",
  },
  {
    id: 9,
    icon: <RiSwapBoxLine />,
    title: "Test Product with Real Users",
    description:
      "Collect feedback and create buzz by sending products to influencers for review.",
  },
  {
    id: 10,
    icon: <RiVipCrownLine />,
    title: "Support an Event or Campaign",
    description:
      "Use influencers to promote a launch, festival, pop-up, or online event.",
=======
    title: "Brand Ambassadorship",
    description:
      "Build long-term partnerships where influencers become brand ambassadors.",
>>>>>>> beea83cd3a90d9af67dc7d3cb750dfde7d150ec3
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
<<<<<<< HEAD
      <h2 className="text-2xl sm:text-3xl font-bold text-[#141843] mb-1">Objectives</h2>
=======
      <h2 className="text-2xl font-bold text-[#141843] mb-1">Objectives</h2>
>>>>>>> beea83cd3a90d9af67dc7d3cb750dfde7d150ec3
      <p className="text-sm text-gray-500 mb-6">
        What would you like to achieve with influencer?
      </p>

      {/* Objective Grid */}
<<<<<<< HEAD
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
=======
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
>>>>>>> beea83cd3a90d9af67dc7d3cb750dfde7d150ec3
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
