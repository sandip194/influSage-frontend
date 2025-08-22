import React, { useState, useEffect, useRef } from 'react';
import { CheckOutlined } from '@ant-design/icons';
import axios from 'axios';

export const CategorySelector = ({ onBack, onNext, data }) => {
    const [categoryTree, setCategoryTree] = useState([])
    const [selectedParentId, setSelectedParentId] = useState(null); // default to first parent
    const [selectedChildren, setSelectedChildren] = useState([]);
    const [error, setError] = useState(false);

    const parentRefs = useRef({});

    const handleParentClick = (id) => {
        setSelectedParentId(id);
        setTimeout(() => {
            parentRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
    };

    const fatchAllCategories = async () => {
        try {
            const response = await axios.get("vendor/categories");
            if (response.status === 200) {
                const data = response.data.categories;
                setCategoryTree(data)

                if (data.length > 0) {
                    setSelectedParentId(data[0].parentcategoryid);
                }
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Load selected children from localStorage
    useEffect(() => {
        fatchAllCategories();

        if (data && Array.isArray(data)) {
            const preselectedIds = data
                .flatMap(parent => parent.categories)
                .map(child => child.categoryid);

            setSelectedChildren(preselectedIds);
        } else {
            // Fallback to localStorage if needed
            const saved = localStorage.getItem('selectedChildCategoryIds');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) setSelectedChildren(parsed);
                } catch (e) {
                    console.error('Error loading selected categories from localStorage', e);
                }
            }
        }
    }, []);

    const toggleChildSelection = (id) => {
        setSelectedChildren((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
        setError(false);
    };

    const sendDataToBackend = async (data) => {
        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");
            const role = localStorage.getItem("role");
            console.log(role)
            // for Influencer 
            if (role === "1") {
                const res = await axios.post(
                    "user/complete-profile",
                    {
                        userid: userId,
                        categoriesjson: data
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                );

                if (res.status === 200) {
                    console.log("✅ Backend response:", res.data);
                } else {
                    console.warn("❗ Unexpected response:", res);
                }
            }

            // for Vendor
            if (role === "2") {
                const res = await axios.post(
                    "vendor/complete-vendor-profile",
                    {
                        userid: userId,
                        categoriesjson: data
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                );

                if (res.status === 200) {
                    console.log("✅ Backend response:", res.data);
                } else {
                    console.warn("❗ Unexpected response:", res);
                }
            }

        } catch (error) {
            console.error("❌ Error sending data to backend:", error.response?.data || error.message);
        }
    };


    const handleSubmit = () => {
        if (selectedChildren.length === 0) {
            setError(true);
            return;
        }

        const selectedData = [];

        categoryTree.forEach(parent => {
            const matchedChildren = parent.categories.filter(child =>
                selectedChildren.includes(child.id)
            );

            if (matchedChildren.length > 0) {
                selectedData.push({
                    parentcategoryid: parent.parentcategoryid,
                    parentcategoryname: parent.name,
                    categories: matchedChildren.map(child => ({
                        categoryid: child.id,
                        categoryname: child.name
                    }))
                });
            }
        });

        sendDataToBackend(selectedData);
        // Save full data to localStorage or send to server
        localStorage.setItem('selectedFullCategoryData', JSON.stringify(selectedData));

        console.log('✅ Saved category data:', selectedData);

        if (onNext) onNext();
    };


    const currentParent = categoryTree.find((cat) => cat.parentcategoryid === selectedParentId);

    return (
        <div className="bg-white p-6 rounded-3xl  text-inter">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Select Categories</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Choose categories that match your interest or business.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Left: Parent Categories */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1 border-r pr-4">
                    <h3 className="font-semibold mb-2 text-gray-700">Main Categories</h3>
                    <ul className="space-y-2 wrap-anywhere">
                        {categoryTree.map((cat) => (
                            <li
                                key={cat.parentcategoryid}
                                onClick={() => setSelectedParentId(cat.parentcategoryid)}
                                className={`cursor-pointer px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${selectedParentId === cat.parentcategoryid ? 'bg-[#121A3F] text-white font-semibold' : 'text-gray-800'
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
                        {currentParent?.categories.map((child) => (
                            <div
                                key={child.id}
                                onClick={() => toggleChildSelection(child.id)}
                                className={`relative wrap-anywhere cursor-pointer rounded-lg px-3 py-2 text-sm border transition-all ${selectedChildren.includes(child.id)
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
