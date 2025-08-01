import React, { useState, useEffect } from "react";
import { FaInstagram, FaYoutube, FaFacebook, FaTiktok } from "react-icons/fa";

// Numeric IDs for platforms
const platforms = [
    { id: 1, name: "Instagram", icon: <FaInstagram className="text-xl text-pink-500" /> },
    { id: 2, name: "YouTube", icon: <FaYoutube className="text-xl text-red-600" /> },
    { id: 3, name: "Facebook", icon: <FaFacebook className="text-xl text-blue-600" /> },
    { id: 4, name: "Tiktok", icon: <FaTiktok className="text-xl text-black" /> },
];

// Numeric IDs for influencer ranges
const influencers = [
    { id: 1, label: "Nano Influencer (5k - 10k Followers)" },
    { id: 2, label: "Micro Influencer (10k - 100k Followers)" },
    { id: 3, label: "Macro Influencer (100k - 1M Followers)" },
    { id: 4, label: "Mega Influencer (Over 1M Followers)" },
    { id: 5, label: "All & Any Range" },
];

const PlatformSelector = ({ onBack, onNext }) => {
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [selectedInfluencers, setSelectedInfluencers] = useState([]);
    const [error, setError] = useState(false)

    const togglePlatform = (id) => {
        setSelectedPlatforms((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const toggleInfluencer = (id) => {
        setSelectedInfluencers((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        const payload = {
            platforms: selectedPlatforms,
            influencerTypes: selectedInfluencers,
        };

        if (payload.platforms.length === 0) {
            setError(true)
            return
        }
        if (payload.influencerTypes.length === 0) {
            setError(true)
            return
        }

        console.log("Saving to database:", payload);
        localStorage.setItem("PlatformsAndInfluencers", JSON.stringify(payload));
        // send to API
        onNext();
    };


    useEffect(() => {
        const saved = localStorage.getItem("PlatformsAndInfluencers");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed?.platforms) setSelectedPlatforms(parsed.platforms);
                if (parsed?.influencerTypes) setSelectedInfluencers(parsed.influencerTypes);
            } catch (err) {
                console.error("Failed to load saved selection:", err);
            }
        }
    }, []);

    return (
        <div className="bg-white p-6 rounded-3xl text-inter">
            <h2 className="text-2xl font-bold text-[#141843] mb-1">
                Platform & Influencer
            </h2>
            <p className="text-sm text-gray-500 mb-6">
                Choose Platform & Influencer as per your preferences
            </p>

            {/* Platform */}
            <div className="mb-6">
                <p className="text-sm font-semibold mb-3 text-[#141843]">Platform</p>
                <div className="flex gap-3 flex-wrap">
                    {platforms.map((platform) => (
                        <button
                            key={platform.id}
                            onClick={() => togglePlatform(platform.id)}
                            className={`flex items-center gap-2 px-6 py-3 border rounded-xl font-medium text-base ${selectedPlatforms.includes(platform.id)
                                ? "border-[#141843] bg-gray-50"
                                : "border-gray-300"
                                }`}
                        >
                            {platform.icon}
                            {platform.name}
                        </button>
                    ))}
                </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Influencers */}
            <div>
                <p className="text-sm font-semibold mb-3 text-[#141843]">
                    Target Influencer
                </p>
                <div className="flex flex-col gap-3">
                    {influencers.map((inf) => (
                        <label key={inf.id} className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedInfluencers.includes(inf.id)}
                                onChange={() => toggleInfluencer(inf.id)}
                                className="w-5 h-5 accent-[#141843] rounded"
                            />
                            <span className="text-sm text-[#141843]">{inf.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Error & Actions */}
            {error && (
                <div className="text-red-500 text-sm font-medium mt-4">Please select at least one Platform and Influencer Type.</div>
            )}


            {/* Buttons */}
            <div className="mt-8 flex gap-4">
                <button
                    onClick={onBack}
                    className="bg-white text-sm cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors">
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    className="bg-[#121A3F] text-sm text-white cursor-pointer inset-shadow-sm inset-shadow-gray-500 px-8 py-1 rounded-full hover:bg-[#0D132D]"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default PlatformSelector;
