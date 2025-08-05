<<<<<<< HEAD
import React, { useState, useEffect, useRef  } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> beea83cd3a90d9af67dc7d3cb750dfde7d150ec3
import { CheckOutlined } from '@ant-design/icons';

const categoryTree = [
    {
<<<<<<< HEAD
        parentcategoryid: 4,
        name: "Business",
        categories: [
            { id: 36, name: "Real Estate" },
            { id: 37, name: "Marketing" },
            { id: 38, name: "Legal/Low" },
            { id: 39, name: "Finance" },
            { id: 40, name: "NFT" },
            { id: 41, name: "Web Apps" },
            { id: 42, name: "VPN" },
            { id: 43, name: "Entrepreneurs/Startup" },
            { id: 44, name: "Agency" },
            { id: 45, name: "Advertising" },
            { id: 46, name: "Other" },
            { id: 47, name: "Blockchain" },
            { id: 48, name: "Native Apps" },
            { id: 49, name: "Games" },
            { id: 50, name: "Small Business " },
            { id: 51, name: "Eccomerce" },
            { id: 52, name: "Social Media Marketing" },
            { id: 53, name: "Crypto Currency" },
            { id: 54, name: "Collectibles" },
            { id: 55, name: "Software " },
            { id: 56, name: "Online Services" }
        ]
    },
    {
        parentcategoryid: 9,
        name: "Family/Kids",
        categories: [
            { id: 103, name: "Motherhood" },
            { id: 104, name: "Kids" },
            { id: 105, name: "Family" },
            { id: 106, name: "Toys" },
            { id: 107, name: "Other" }
        ]
    },
    {
        parentcategoryid: 8,
        name: "Cars/Yachts/Jets",
        categories: [
            { id: 97, name: "Cars" },
            { id: 98, name: "Motors" },
            { id: 99, name: "Yachts" },
            { id: 100, name: "Jets and Planes" },
            { id: 101, name: "Boats" },
            { id: 102, name: "Jets" }
        ]
    },
    {
        parentcategoryid: 11,
        name: "Home/Garden/DIY",
        categories: [
            { id: 122, name: "Interior Design" },
            { id: 123, name: "Garden/Gardening" },
            { id: 124, name: "Constructions" },
            { id: 125, name: "Furnishing" },
            { id: 126, name: "DIY/Assembly" },
            { id: 127, name: "Garden" },
            { id: 128, name: "Home" },
            { id: 129, name: "Renovations" },
            { id: 130, name: "DIY" }
        ]
    },
    {
        parentcategoryid: 1,
        name: "Art/Craft/Music/Performing ",
        categories: [
            { id: 1, name: "Painting/Fine Arts" },
            { id: 2, name: "Writing/Books/Novel" },
            { id: 3, name: "Dance" },
            { id: 4, name: "General Entertainment" },
            { id: 5, name: "Architecture" },
            { id: 6, name: "Crafts" },
            { id: 7, name: "Film/Cinema/Performing" },
            { id: 8, name: "Music" },
            { id: 9, name: "Musical Instruments" },
            { id: 10, name: "Movies" },
            { id: 11, name: "Design" },
            { id: 12, name: "Performing" },
            { id: 13, name: "Poetry" },
            { id: 14, name: "Craft/DIY" },
            { id: 15, name: "Other" },
            { id: 16, name: "Sculpture" },
            { id: 17, name: "Art" }
        ]
    },
    {
        parentcategoryid: 12,
        name: "Animal/Pets",
        categories: [
            { id: 131, name: "Dogs" },
            { id: 132, name: "Wild Life" },
            { id: 133, name: "Animals" },
            { id: 134, name: "Pets/Animals" },
            { id: 135, name: "Exotic Animals" },
            { id: 136, name: "Pets" },
            { id: 137, name: "Cats" },
            { id: 138, name: "Pet Supplies" }
        ]
    },
    {
        parentcategoryid: 7,
        name: "Lifestyle/Fashion/Beauty",
        categories: [
            { id: 85, name: "Tattoos" },
            { id: 86, name: "Interior" },
            { id: 87, name: "Clothing" },
            { id: 88, name: "Fashion" },
            { id: 89, name: "Photography/Videography" },
            { id: 90, name: "Jewelry" },
            { id: 91, name: "Weddings" },
            { id: 92, name: "Makeup" },
            { id: 93, name: "Barber/Hairstylist" },
            { id: 94, name: "Beauty" },
            { id: 95, name: "Modelling" },
            { id: 96, name: "Lifestyle" }
        ]
    },
    {
        parentcategoryid: 6,
        name: "Fitness/Health/Wellness",
        categories: [
            { id: 69, name: "Medical" },
            { id: 70, name: "Psychology/Therapy" },
            { id: 71, name: "Fitness" },
            { id: 72, name: "Other" },
            { id: 73, name: "Gyms" },
            { id: 74, name: "Wellness" },
            { id: 75, name: "Nutrition" },
            { id: 76, name: "Yoga/Meditation" },
            { id: 77, name: "Leisure Sports" },
            { id: 78, name: "Extreme Sports" },
            { id: 79, name: "Virtual Sports" },
            { id: 80, name: "Healthy Eating" },
            { id: 81, name: "Sports" },
            { id: 82, name: "Life Coaching" },
            { id: 83, name: "Working Out" },
            { id: 84, name: "Health" }
        ]
    },
    {
        parentcategoryid: 2,
        name: "Travel/Event/Fun",
        categories: [
            { id: 18, name: "Travel" },
            { id: 19, name: "Inspirational" },
            { id: 20, name: "Other" },
            { id: 21, name: "Adventure" },
            { id: 22, name: "Luxury Travel" },
            { id: 23, name: "Nature" },
            { id: 24, name: "Events" },
            { id: 25, name: "Memes" },
            { id: 26, name: "Fun" }
        ]
    },
    {
        parentcategoryid: 10,
        name: "Influencer/Religious/Adults/Relationships",
        categories: [
            { id: 108, name: "Personal Page" },
            { id: 109, name: "Love" },
            { id: 110, name: "Vaping" },
            { id: 111, name: "Activist/Social Issues" },
            { id: 112, name: "Adults" },
            { id: 113, name: "General" },
            { id: 114, name: "Religious/Spiritual" },
            { id: 115, name: "Other" },
            { id: 116, name: "Adult Services/Goods" },
            { id: 117, name: "Relationships" },
            { id: 118, name: "Influencer" },
            { id: 119, name: "Political" },
            { id: 121, name: "Religious" },
            { id: 120, name: "Dating/Relationships" }
        ]
    },
    {
        parentcategoryid: 5,
        name: "Tech/Gadgets/Appliances",
        categories: [
            { id: 57, name: "Electronics" },
            { id: 58, name: "Other" },
            { id: 59, name: "Computers" },
            { id: 60, name: "Furniture/Decor" },
            { id: 61, name: "Smartphone" },
            { id: 62, name: "TV" },
            { id: 63, name: "Wearables" },
            { id: 64, name: "Tech" },
            { id: 65, name: "Appliances" },
            { id: 66, name: "Tablets" },
            { id: 67, name: "Cellphones/Accessories" },
            { id: 68, name: "Gadgets" }
        ]
    },
    {
        parentcategoryid: 3,
        name: "Food/Drinks/Dinning",
        categories: [
            { id: 27, name: "Drinks" },
            { id: 28, name: "Snacks" },
            { id: 29, name: "Grocery and Gourmet Foods" },
            { id: 30, name: "Food" },
            { id: 31, name: "Vegetables" },
            { id: 32, name: "Pet Foods" },
            { id: 33, name: "Dinning" },
            { id: 34, name: "Nutrition" },
            { id: 35, name: "Baby Foods" }
        ]
    }
];


export const CategorySelector = ({ onBack, onNext }) => {
    const [selectedParentId, setSelectedParentId] = useState(categoryTree[0].parentcategoryid); // default to first parent
    const [selectedChildren, setSelectedChildren] = useState([]);
    const [error, setError] = useState(false);

    const parentRefs = useRef({});

    const handleParentClick = (id) => {
        setSelectedParentId(id);
        setTimeout(() => {
            parentRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
    };

    
=======
        id: 1,
        name: 'Beauty',
        children: [
            { id: 101, name: 'Skincare' },
            { id: 102, name: 'Makeup' },
            { id: 103, name: 'Haircare' },
            { id: 104, name: 'beauty 02' },
            { id: 105, name: 'beauty 03' },
            { id: 106, name: 'beauty 04' },
        ],
    },
    {
        id: 2,
        name: 'Technology',
        children: [
            { id: 201, name: 'Artificial Intelligence' },
            { id: 202, name: 'IoT' },
            { id: 203, name: 'Software Development' },
        ],
    },
    {
        id: 3,
        name: 'Fitness',
        children: [
            { id: 301, name: 'Yoga' },
            { id: 302, name: 'Workouts' },
            { id: 303, name: 'Nutrition' },
        ],
    },
    {
        id: 4,
        name: 'Fashon',
        children: [
            { id: 401, name: 'Yoga' },
            { id: 402, name: 'Workouts' },
            { id: 403, name: 'Nutrition' },
        ],
    },
    {
        id: 5,
        name: 'Sports',
        children: [
            { id: 501, name: 'Cricket' },
            { id: 502, name: 'Workouts' },
            { id: 503, name: 'FootBall' },
            { id: 503, name: 'Kabbadi' },
        ],
    },
];

export const CategorySelector = ({ onBack, onNext }) => {
    const [selectedParentId, setSelectedParentId] = useState(categoryTree[0].id); // default to first parent
    const [selectedChildren, setSelectedChildren] = useState([]);
    const [error, setError] = useState(false);

>>>>>>> beea83cd3a90d9af67dc7d3cb750dfde7d150ec3
    // Load selected children from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('selectedChildCategoryIds');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) setSelectedChildren(parsed);
            } catch (e) {
                console.error('Error loading selected categories', e);
            }
        }
    }, []);

    const toggleChildSelection = (id) => {
        setSelectedChildren((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
        setError(false);
    };

    const handleSubmit = () => {
        if (selectedChildren.length === 0) {
            setError(true);
            return;
        }
        localStorage.setItem('selectedChildCategoryIds', JSON.stringify(selectedChildren));
        console.log('✅ Saved child category IDs:', selectedChildren);
        if (onNext) onNext();
    };

<<<<<<< HEAD
    const currentParent = categoryTree.find((cat) => cat.parentcategoryid === selectedParentId);
=======
    const currentParent = categoryTree.find((cat) => cat.id === selectedParentId);
>>>>>>> beea83cd3a90d9af67dc7d3cb750dfde7d150ec3

    return (
        <div className="bg-white p-6 rounded-3xl  text-inter">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Select Categories</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Choose categories that match your interest or business.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Left: Parent Categories */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1 border-r pr-4">
                    <h3 className="font-semibold mb-2 text-gray-700">Main Categories</h3>
<<<<<<< HEAD
                    <ul className="space-y-2 wrap-anywhere">
                        {categoryTree.map((cat) => (
                            <li
                                key={cat.parentcategoryid}
                                onClick={() => setSelectedParentId(cat.parentcategoryid)}
                                className={`cursor-pointer px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${selectedParentId === cat.parentcategoryid ? 'bg-[#121A3F] text-white font-semibold' : 'text-gray-800'
=======
                    <ul className="space-y-2">
                        {categoryTree.map((cat) => (
                            <li
                                key={cat.id}
                                onClick={() => setSelectedParentId(cat.id)}
                                className={`cursor-pointer px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${selectedParentId === cat.id ? 'bg-[#121A3F] text-white font-semibold' : 'text-gray-800'
>>>>>>> beea83cd3a90d9af67dc7d3cb750dfde7d150ec3
                                    }`}
                            >
                                {cat.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right: Child Categories */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <h3 className="font-semibold mb-3 text-gray-700">Subcategories</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
<<<<<<< HEAD
                        {currentParent?.categories.map((child) => (
                            <div
                                key={child.id}
                                onClick={() => toggleChildSelection(child.id)}
                                className={`relative wrap-anywhere cursor-pointer rounded-lg px-3 py-2 text-sm border transition-all ${selectedChildren.includes(child.id)
=======
                        {currentParent?.children.map((child) => (
                            <div
                                key={child.id}
                                onClick={() => toggleChildSelection(child.id)}
                                className={`relative cursor-pointer rounded-lg px-3 py-2 text-sm border transition-all ${selectedChildren.includes(child.id)
>>>>>>> beea83cd3a90d9af67dc7d3cb750dfde7d150ec3
                                        ? 'bg-[#121A3F] text-white border-[#121A3F]'
                                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                {child.name}
                                {selectedChildren.includes(child.id) && (
                                    <CheckOutlined className="absolute top-2 right-2 text-white bg-green-600 rounded-full p-1 w-5" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Error & Actions */}
            {error && (
                <div className="text-red-500 text-sm font-medium mt-4">Please select at least one subcategory.</div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                    onClick={onBack}
                    className="bg-white text-sm cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    className="bg-[#121A3F] text-sm text-white cursor-pointer inset-shadow-sm inset-shadow-gray-500 px-8 py-3 rounded-full hover:bg-[#0D132D]"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};
