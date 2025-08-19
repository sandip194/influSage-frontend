import React, { useState } from "react";
import { Input, message } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { TextArea } = Input;

// Content options with ID mapping
const platforms = {
    Instagram: [
        { id: 1, label: "Post" },
        { id: 2, label: "Story" },
        { id: 3, label: "Reel" },
    ],
    FaceBook: [
        { id: 4, label: "Post" },
        { id: 5, label: "Story" },
        { id: 6, label: "Reel" },
    ],
    Youtube: [
        { id: 7, label: "Video" },
        { id: 8, label: "Short" },
    ],
    Twitter: [
        { id: 9, label: "Video" },
        { id: 10, label: "Post" },
    ],
};

const CampaignStep5 = ({ onNext, onBack }) => {
    const [formState, setFormState] = useState(() => {
        const initial = {};
        Object.keys(platforms).forEach((platform) => {
            initial[platform] = {
                selectedTypes: [],
                caption: "",
            };
        });
        return initial;
    });

    const [errors, setErrors] = useState({});

    const toggleContentType = (platform, typeId) => {
        setFormState((prev) => {
            const selected = prev[platform].selectedTypes;
            const alreadySelected = selected.includes(typeId);
            return {
                ...prev,
                [platform]: {
                    ...prev[platform],
                    selectedTypes: alreadySelected
                        ? selected.filter((id) => id !== typeId)
                        : [...selected, typeId],
                },
            };
        });
    };

    const handleCaptionChange = (platform, value) => {
        setFormState((prev) => ({
            ...prev,
            [platform]: {
                ...prev[platform],
                caption: value,
            },
        }));
    };

    const handleContinue = () => {
        const newErrors = {};
        let hasError = false;

        for (const [platform, data] of Object.entries(formState)) {
            if (data.selectedTypes.length === 0 || !data.caption.trim()) {
                newErrors[platform] = {
                    type: data.selectedTypes.length === 0,
                    caption: !data.caption.trim(),
                };
                hasError = true;
            }
        }

        setErrors(newErrors);

        if (hasError) {
            message.error("Please fill in all required fields.");
            return;
        }

        // Clean data structure ready for backend or next step
        onNext?.(formState);
    };

    const renderPlatformSection = (platform, types) => {
        const { selectedTypes, caption } = formState[platform];
        const platformErrors = errors[platform] || {};

        return (
            <div key={platform} className="mb-5">
                <p className="font-semibold mb-2">{platform}</p>
                <div className="flex gap-2 mb-3 flex-wrap">
                    {types.map(({ id, label }) => {
                        const isSelected = selectedTypes.includes(id);
                        return (
                            <button
                                key={id}
                                onClick={() => toggleContentType(platform, id)}
                                type="button"
                                className={`px-6 py-2 rounded-xl cursor-pointer border ${isSelected
                                        ? "border-[#0D132D] font-semibold"
                                        : "border-gray-300"
                                    }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {platformErrors.type && (
                    <p className="text-red-500 text-sm mb-2">Select at least one type</p>
                )}

                <div className="relative">
                    <TextArea
                        placeholder="Caption"
                        size="large"
                        value={caption}
                        onChange={(e) => handleCaptionChange(platform, e.target.value)}
                        rows={2}
                        className="rounded-2xl p-2 pr-32"
                    />
                </div>

                

                {platformErrors.caption && (
                    <p className="text-red-500 text-sm mt-1">Caption is required</p>
                )}

                <hr className="mt-5 border-gray-200" />
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-3xl">
            {Object.entries(platforms).map(([platform, types]) =>
                renderPlatformSection(platform, types)
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-6">
                <button
                    onClick={onBack}
                    className="bg-white text-[#0D132D] cursor-pointer px-8 py-3 rounded-full border border-[#121a3f26] hover:bg-[#0D132D] hover:text-white transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={handleContinue}
                    className="bg-[#121A3F] text-white cursor-pointer px-8 py-3 rounded-full hover:bg-[#0D132D]"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default CampaignStep5;
