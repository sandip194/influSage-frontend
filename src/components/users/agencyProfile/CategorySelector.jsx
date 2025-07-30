import React, { useState, useEffect } from 'react';
import { CheckOutlined } from '@ant-design/icons';

const categoryTree = [
    {
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

    const currentParent = categoryTree.find((cat) => cat.id === selectedParentId);

    return (
        <div className="bg-white p-6 rounded-3xl  text-inter">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Select Categories</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Choose categories that match your interest or business.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Left: Parent Categories */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1 border-r pr-4">
                    <h3 className="font-semibold mb-2 text-gray-700">Main Categories</h3>
                    <ul className="space-y-2">
                        {categoryTree.map((cat) => (
                            <li
                                key={cat.id}
                                onClick={() => setSelectedParentId(cat.id)}
                                className={`cursor-pointer px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${selectedParentId === cat.id ? 'bg-[#121A3F] text-white font-semibold' : 'text-gray-800'
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
                        {currentParent?.children.map((child) => (
                            <div
                                key={child.id}
                                onClick={() => toggleChildSelection(child.id)}
                                className={`relative cursor-pointer rounded-lg px-3 py-2 text-sm border transition-all ${selectedChildren.includes(child.id)
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
