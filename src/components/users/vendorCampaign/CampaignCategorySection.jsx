import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useSelector } from 'react-redux';

const { Option } = Select;

const CampaignCategorySection = ({ data, onNext, onBack, campaignId }) => {
    const [categoryTree, setCategoryTree] = useState([]);
    const [selectedParentId, setSelectedParentId] = useState(null);
    const [selectedChildren, setSelectedChildren] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorEmpty, setErrorEmpty] = useState(false);
    const [errorLimit, setErrorLimit] = useState(false);

    const { token } = useSelector((state) => state.auth);

    const fetchAllCategories = async () => {
        try {
            const response = await axios.get("categories");
            if (response.status === 200) {
                const data = response.data.categories;
                setCategoryTree(data);


            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchAllCategories();
    }, []);

    useEffect(() => {
        if (data && Array.isArray(data) && categoryTree.length > 0) {
            const preselectedIds = [];

            // Automatically select the first parent if there's only one in `data`
            if (data.length === 1) {
                setSelectedParentId(data[0].parentcategoryid);
            }

            // Find matches in categoryTree
            data.forEach(parentFromProp => {
                const matchingParent = categoryTree.find(
                    cat => cat.parentcategoryid === parentFromProp.parentcategoryid
                );

                if (matchingParent) {
                    parentFromProp.categories.forEach(childFromProp => {
                        const matchedChild = matchingParent.categories.find(
                            child => child.categoryid === childFromProp.categoryid || child.id === childFromProp.categoryid
                        );

                        if (matchedChild) {
                            preselectedIds.push(matchedChild.id); // Use categoryTree's `id`
                        }
                    });
                }
            });

            setSelectedChildren(preselectedIds);
        }
    }, [data, categoryTree]);



    const sendDataToBackend = async (formattedData) => {
        try {
            setLoading(true);

            const res = await axios.post(
                "/vendor/update-campaign",
                { p_campaigncategoyjson: formattedData, campaignId : campaignId ? campaignId : null },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 200) {
               // console.log("✅ Backend response:", res.data);
            } else {
                console.warn("❗ Unexpected response:", res);
            }

        } catch (error) {
            console.error("❌ Error sending data to backend:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (selectedChildren.length === 0) {
            setErrorEmpty(true);
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

        if (onNext) onNext();
    };

    const currentParent = categoryTree.find(cat => cat.parentcategoryid === selectedParentId);

    return (
        <div className="bg-white p-6 rounded-3xl text-inter">
            <h2 className="text-xl font-bold mb-1">Select Categories</h2>
            <p className="text-gray-600 mb-6 text-sm">Choose categories that match your interest or business.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Category Select */}
                <div>
                    <label className="block mb-2 font-semibold text-gray-700">Main Category <span className="text-red-500">*</span></label>
                    <Select
                        size="large"
                        style={{ width: '100%' }}
                        placeholder="Select main category"
                        value={selectedParentId}
                        onChange={(value) => {
                            setSelectedParentId(value);
                            setSelectedChildren([]); // ✅ clear subcategories
                            setErrorLimit(false);         // ✅ reset error
                        }}
                        showSearch
                        optionFilterProp="children"
                    >
                        {categoryTree.map(parent => (
                            <Option key={parent.parentcategoryid} value={parent.parentcategoryid}>
                                {parent.name}
                            </Option>
                        ))}
                    </Select>

                </div>

                {/* Subcategory Multi Select */}
                <div>
                    <label className="block mb-2 font-semibold text-gray-700">Subcategories <span className="text-red-500">*</span></label>
                    <Select
                        disabled={!selectedParentId}
                        size="large"
                        mode="multiple"
                        allowClear
                        maxTagCount={5}
                        style={{ width: '100%' }}
                        placeholder="Select subcategories"
                        value={selectedChildren}
                        onChange={(value) => {
                            if (value.length <= 5) {
                                setSelectedChildren(value);
                                setErrorEmpty(false); // reset empty error
                                setErrorLimit(false); // reset limit error
                            } else {
                                setErrorLimit(true);  // trigger limit error
                            }
                        }}

                        optionFilterProp="children"
                        showSearch
                        status={selectedChildren.length > 5 ? "error" : ""}
                    >
                        {currentParent?.categories.map(child => (
                            <Option key={child.id} value={child.id}>
                                {child.name}
                            </Option>
                        ))}
                    </Select>


                </div>

            </div>
            {/* Conditional Message Below Select */}

            {errorLimit && <p className="text-red-500 text-sm mt-1">⚠️ You can select only up to 5 subcategories.</p>}
            {errorEmpty && <p className="text-red-500 text-sm mt-4">Please select at least one subcategory.</p>}

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
                <button
                    onClick={onBack}
                    className="bg-white cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-[#121A3F] text-white cursor-pointer px-8 py-3 rounded-full hover:bg-[#0D132D] disabled:opacity-60"
                >
                    {loading ? "Saving..." : "Continue"}
                </button>
            </div>
        </div>
    );
};

export default CampaignCategorySection;
