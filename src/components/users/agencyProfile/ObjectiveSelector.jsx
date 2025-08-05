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
    title: "Build Brand Awareness",
    description:
      "Increase overall visibility and recognition of our brand.",
  },
  {
    id: 2,
    icon: <RiGiftLine />,
    title: "Promote a Product or Service",
    description:
      "Focus on showcasing or launching specific products or services.",
  },
  {
    id: 3,
    icon: <RiMegaphoneLine />,
    title: "Drive Website or App Traffic",
    description:
      "Increase visitors to our website or app through influencer campaigns.",
  },
  {
    id: 4,
    icon: <RiLinksLine />,
    title: "Generate Sales or Conversions",
    description:
      "Drive purchases, signups, or downloads from influencer referrals.",
  },
  {
    id: 5,
    icon: <RiTrophyLine />,
    title: "Reach a New Target Audience",
    description:
      "Connect with a specific demographic, niche, or regional audience.",
  },
  {
    id: 6,
    icon: <RiLiveLine />,
    title: "Build Social Media Presence",
    description:
      "Grow followers and engagement on our brand’s social channels.",
  },
  {
    id: 7,
    icon: <RiSwapBoxLine />,
    title: "Get High-Quality Content",
    description:
      "Receive influencer-generated content (photos, videos, testimonials) for our marketing use.",
  },
  {
    id: 8,
    icon: <RiVipCrownLine />,
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
      <h2 className="text-2xl sm:text-3xl font-bold text-[#141843] mb-1">Objectives</h2>
      <p className="text-sm text-gray-500 mb-6">
        What would you like to achieve with influencer?
      </p>

      {/* Objective Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
