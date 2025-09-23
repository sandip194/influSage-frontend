import { RiCheckboxCircleFill, RiDeleteBin6Line } from '@remixicon/react';
import React, { useState } from 'react'

const Requirements = [
    { label: "Shopify User:", value: "Yes" },
    {
        label: "Expectation:",
        value:
            "Post my existing content Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    },
    { label: "Due Date:", value: "11 Jul 2025" },
    { label: "Ship Products:", value: "Yes" },
    { label: "Target Country:", value: "India" },
    { label: "Duration:", value: "2 Months" },
    { label: "Offers:", value: "Allow Influencer to make offers" },
];

const VendorCampaignOverview = () => {
    const [images, setImages] = useState([
        "https://images.pexels.com/photos/33350497/pexels-photo-33350497.jpeg",
        "https://images.pexels.com/photos/25835001/pexels-photo-25835001.jpeg",
        "https://images.pexels.com/photos/32429493/pexels-photo-32429493.jpeg",
    ]);

    // Delete reference image
    const handleDeleteImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };
    return (
        <div>
            {/* Description */}
            <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="font-semibold text-lg mb-2">
                    Campaign Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and typesetting
                    industry...
                </p>
            </div>
            {/* Requirements */}
            <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold text-lg sm:text-xl mb-4">Requirements</h3>
                <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                    {Requirements.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <RiCheckboxCircleFill className="text-xl min-w-[1.25rem]" />
                            <span>
                                {item.label} <strong>{item.value}</strong>
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-6 mb-6">
                    {["Fixed Price", "Expert", "Beauty", "Micro Influencer"].map(
                        (tag, i) => (
                            <span
                                key={i}
                                className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                            >
                                {tag}
                            </span>
                        )
                    )}
                </div>

                {/* References */}
                <h2 className="text-lg font-semibold mb-3">References</h2>
                <div className="flex gap-4 flex-wrap">
                    {images.map((img, index) => (
                        <div key={index} className="relative">
                            <img
                                src={img}
                                alt={`reference-${index}`}
                                className="w-32 h-32 object-cover rounded-xl"
                            />
                            <button
                                onClick={() => handleDeleteImage(index)}
                                className="absolute top-2 right-2 bg-gray-600 bg-opacity-70 text-white p-2 rounded-full"
                            >
                                <RiDeleteBin6Line className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default VendorCampaignOverview