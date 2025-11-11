import React, { useState, useEffect } from "react";
import { RiCheckLine, RiArrowLeftSLine } from "@remixicon/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Spin } from "antd";

export const CategorySelector = ({
  onBack,
  onNext,
  data,
  showControls,
  showToast,
  onSave,
}) => {
  const [categoryTree, setCategoryTree] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [mobileMode, setMobileMode] = useState("parent");

  const { token, role } = useSelector((state) => state.auth);

  const fetchAllCategories = async () => {
    try {
      const response = await axios.get("categories");
      if (response.status === 200) {
        const data = response.data.categories;
        setCategoryTree(data);
        if (data.length > 0) setSelectedParentId(data[0].parentcategoryid);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchAllCategories();

    if (data && Array.isArray(data)) {
      const preselectedIds = data
        .flatMap((parent) => parent.categories)
        .map((child) => child.categoryid);
      setSelectedChildren(preselectedIds);
    }

    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleChildSelection = (id) => {
    setSelectedChildren((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      setIsFormChanged(true);
      return updated;
    });
    setError(false);
  };

  const sendDataToBackend = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("categoriesjson", JSON.stringify(data));

      const endpoint =
        role === 1
          ? "user/complete-profile"
          : "vendor/complete-vendor-profile";

      const res = await axios.post(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        if (showToast) toast.success("Profile updated successfully!");
        setIsFormChanged(false);
        if (onNext) onNext();
        if (onSave) onSave(formData);
      }
    } catch (error) {
      console.error("❌ Error sending data to backend:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedChildren.length === 0) {
      setError(true);
      return;
    }

    const selectedData = [];

    categoryTree.forEach((parent) => {
      const matchedChildren = parent.categories.filter((child) =>
        selectedChildren.includes(child.id)
      );

      if (matchedChildren.length > 0) {
        selectedData.push({
          parentcategoryid: parent.parentcategoryid,
          parentcategoryname: parent.name,
          categories: matchedChildren.map((child) => ({
            categoryid: child.id,
            categoryname: child.name,
          })),
        });
      }
    });

    localStorage.setItem(
      "selectedFullCategoryData",
      JSON.stringify(selectedData)
    );

    await sendDataToBackend(selectedData);
  };

  const currentParent = categoryTree.find(
    (cat) => cat.parentcategoryid === selectedParentId
  );

  return (
    <div className="bg-white p-6 rounded-3xl text-inter min-h-[80vh]">
      {/* --- Header with title and Save button --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Select Categories
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Choose categories that match your interest or business.
          </p>
        </div>

        {(showControls || onNext) && (
          <div className="w-full sm:w-auto">
            <button
              onClick={handleSubmit}
              disabled={onNext ? isSubmitting : !isFormChanged || isSubmitting}
              className={`w-full sm:w-auto px-6 py-2 sm:px-8 sm:py-3 rounded-full text-white font-medium transition
                ${
                  (onNext || isFormChanged) && !isSubmitting
                    ? "bg-[#121A3F] hover:bg-[#0D132D] cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              {isSubmitting ? (
                <Spin size="small" />
              ) : onNext ? (
                "Continue"
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}
      </div>

      {/* --- DESKTOP VIEW --- */}
      {!isMobileView && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Left: Parent Categories */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 border-r pr-4">
            <h3 className="font-semibold mb-2 text-gray-700">
              Main Categories
            </h3>
            <ul className="space-y-2 wrap-anywhere">
              {categoryTree.map((cat) => (
                <li
                  key={cat.parentcategoryid}
                  onClick={() => setSelectedParentId(cat.parentcategoryid)}
                  className={`cursor-pointer px-3 py-2 text-sm rounded-md 
                    ${
                      selectedParentId === cat.parentcategoryid
                        ? "bg-[#121A3F] text-white font-semibold"
                        : "text-gray-800 hover:text-black hover:bg-gray-100"
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
                  className={`flex justify-between items-center w-full px-4 py-3 text-sm rounded-xl border cursor-pointer transition-all ${
                    selectedChildren.includes(child.id)
                      ? "bg-[#0D132D26] text-black border-[#0D132D26]"
                      : "bg-white text-black border-gray-300 hover:border-[#141843]"
                  }`}
                >
                  <span className="wrap-anywhere">{child.name}</span>
                  <div
                    className={`w-5 h-5 flex items-center justify-center rounded-full border transition-all ${
                      selectedChildren.includes(child.id)
                        ? "bg-[#141843] border-[#0D132D26] text-white"
                        : "bg-transparent border-gray-400 text-transparent"
                    }`}
                  >
                    {selectedChildren.includes(child.id) && (
                      <RiCheckLine size={12} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MOBILE VIEW --- */}
      {isMobileView && (
        <div>
          {mobileMode === "parent" && (
            <div>
              <h3 className="font-semibold mb-2 text-gray-700">
                Main Categories
              </h3>
              <ul className="space-y-2 wrap-anywhere">
                {categoryTree.map((cat) => (
                  <li
                    key={cat.parentcategoryid}
                    onClick={() => {
                      setSelectedParentId(cat.parentcategoryid);
                      setMobileMode("child");
                    }}
                    className="cursor-pointer px-4 py-3 text-base rounded-xl border border-gray-200 hover:bg-gray-100 font-medium"
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mobileMode === "child" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setMobileMode("parent")}
                  className="text-gray-600 flex items-center gap-2 hover:text-gray-900 transition"
                >
                  <RiArrowLeftSLine className="text-lg" /> Back
                </button>
                <h3 className="font-semibold text-gray-700 text-base">
                  {currentParent?.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {currentParent?.categories.map((child) => (
                  <div
                    key={child.id}
                    onClick={() => toggleChildSelection(child.id)}
                    className={`flex justify-between items-center px-4 py-3 text-sm rounded-xl border cursor-pointer transition-all ${
                      selectedChildren.includes(child.id)
                        ? "bg-[#0D132D26] border-[#0D132D26]"
                        : "bg-white border-gray-300 hover:border-[#141843]"
                    }`}
                  >
                    <span>{child.name}</span>
                    <div
                      className={`w-5 h-5 flex items-center justify-center rounded-full border transition-all ${
                        selectedChildren.includes(child.id)
                          ? "bg-[#141843] text-white"
                          : "bg-transparent border-gray-400 text-transparent"
                      }`}
                    >
                      {selectedChildren.includes(child.id) && (
                        <RiCheckLine size={12} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- Error Message --- */}
      {error && (
        <div className="text-red-500 text-sm font-medium mt-4">
          Please select at least one subcategory.
        </div>
      )}

      {/* --- Bottom Back Button --- */}
      <div className="flex flex-row items-center gap-4 mt-6">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="bg-white cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};
