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

  // 👉 NEW CODE — Get selected count per parent
  const getSelectedCount = (parent) => {
    return parent.categories.filter((c) =>
      selectedChildren.includes(c.id)
    ).length;
  };

  // 👉 NEW CODE — Build selected chip objects
  const selectedChipData = categoryTree.flatMap((parent) =>
    parent.categories
      .filter((child) => selectedChildren.includes(child.id))
      .map((child) => ({
        id: child.id,
        name: child.name,
        parent: parent.name,
      }))
  );

  // 👉 NEW CODE — Max 10 selection limit
  const toggleChildSelection = (id) => {
    setSelectedChildren((prev) => {
      const alreadySelected = prev.includes(id);

      if (!alreadySelected && prev.length >= 10) {
        toast.error("You can select a maximum of 10 categories.");
        return prev;
      }

      const updated = alreadySelected
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
        const successMessage =
          res?.data?.message || "Profile updated successfully";

        if (showToast) toast.success(successMessage);

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

      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Select Categories
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Choose categories that match your interest or business.
          </p>
        </div>

        
      </div>

      {/* ---------- GLOBAL COUNTER (NEW) ---------- */}
      <div className="mb-4 text-sm font-medium text-gray-800">
        Selected: {selectedChildren.length}/10
      </div>

      {/* ---------- SELECTED CHIPS (NEW) ---------- */}
      {selectedChipData.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedChipData.map((chip) => (
            <div
              key={chip.id}
              className="bg-[#121A3F] text-white text-xs px-3 py-1 rounded-full flex items-center gap-2"
            >
              <span>{chip.name}</span>
              <button
                onClick={() => toggleChildSelection(chip.id)}
                className="text-white hover:text-red-300"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---------- DESKTOP VIEW ---------- */}
      {!isMobileView && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          
          {/* PARENT CATEGORY LIST */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 border-r pr-4">
            <h3 className="font-semibold mb-2 text-gray-700">
              Main Categories
            </h3>
            <ul className="space-y-2 wrap-anywhere">
              {categoryTree.map((cat) => (
                <li
                key={cat.parentcategoryid}
                onClick={() => setSelectedParentId(cat.parentcategoryid)}
                className={`
                  cursor-pointer px-3 py-2 text-sm rounded-md
                  flex items-start gap-2
                  ${
                    selectedParentId === cat.parentcategoryid
                      ? "bg-[#121A3F] text-white font-semibold"
                      : getSelectedCount(cat) > 0
                      ? "bg-[#E8ECF7] text-[#121A3F] font-medium border border-[#CED3E0]"
                      : "text-gray-800 hover:text-black hover:bg-gray-100"
                  }
                `}
              >
                <span
                  className="text-sm whitespace-normal break-words min-w-0 flex-1 leading-snug"
                  dangerouslySetInnerHTML={{
                    __html: cat.name.replaceAll("/", "/<wbr>"),
                  }}
                />

                {getSelectedCount(cat) > 0 && (
                  <span className="shrink-0 text-xs bg-[#121A3F] text-white px-2 py-1 rounded-full">
                    {getSelectedCount(cat)}
                  </span>
                )}
              </li>
              ))}
            </ul>
          </div>

          {/* CHILD CATEGORY LIST */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <h3 className="font-semibold mb-3 text-gray-700">Subcategories</h3>

            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4">
              {currentParent?.categories.map((child) => {
                const isSelected = selectedChildren.includes(child.id);

                return (
                  <div
                    key={child.id}
                    onClick={() => toggleChildSelection(child.id)}
                    className={`
                      flex justify-between items-center gap-3
                      w-full px-4 py-3 text-sm rounded-xl border
                      cursor-pointer transition-all
                      ${
                        isSelected
                          ? "bg-[#0D132D26] text-black border-[#0D132D26]"
                          : "bg-white text-black border-gray-300 hover:border-[#141843]"
                      }
                    `}
                  >
                    {/* Category Name */}
                    <span
                      className="text-sm leading-snug break-words flex-1"
                      dangerouslySetInnerHTML={{
                        __html: child.name.replaceAll("/", "/<wbr>"),
                      }}
                    />

                    {/* Check Icon */}
                    <div
                      className={`
                        w-5 h-5 shrink-0 flex items-center justify-center
                        rounded-full border transition-all
                        ${
                          isSelected
                            ? "bg-[#141843] border-[#141843] text-white"
                            : "bg-transparent border-gray-400 text-transparent"
                        }
                      `}
                    >
                      {isSelected && <RiCheckLine size={12} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---------- MOBILE VIEW ---------- */}
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
                    className={`
                      cursor-pointer px-4 py-3 text-base rounded-xl border flex justify-between items-center
                      ${
                        getSelectedCount(cat) > 0
                          ? "bg-[#E8ECF7] border-[#CED3E0] text-[#121A3F] font-medium"
                          : "border-gray-200 hover:bg-gray-100"
                      }
                    `}
                  >
                    <span>{cat.name}</span>

                    {getSelectedCount(cat) > 0 && (
                      <span className="text-xs bg-[#121A3F] text-white px-2 py-1 rounded-full">
                        {getSelectedCount(cat)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mobileMode === "child" && (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pb-2 border-b border-gray-200">
                <button
                  onClick={() => setMobileMode("parent")}
                  className="text-gray-700 flex items-center gap-1 font-medium hover:text-[#0D132D] transition"
                >
                  <RiArrowLeftSLine className="text-lg" /> Back
                </button>
                <h3 className="font-semibold text-gray-800 text-base truncate max-w-[60%] text-center">
                  {currentParent?.name}
                </h3>
                <div className="w-8" />
              </div>
              <div className="flex-1 overflow-y-auto space-y-3">
                {currentParent?.categories.map((child) => (
                  <div
                    key={child.id}
                    onClick={() => toggleChildSelection(child.id)}
                    className={`flex justify-between items-center px-4 py-3 text-sm rounded-xl border cursor-pointer transition-all
                      ${
                        selectedChildren.includes(child.id)
                          ? "bg-[#0D132D26] border-[#0D132D26]"
                          : "bg-white border-gray-300 hover:border-[#141843]"
                      }`}
                  >
                    <span className="text-gray-800">{child.name}</span>

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
      
      {/* ERROR */}
      {error && (
        <div className="text-red-500 text-sm font-medium mt-4">
          Please select at least one subcategory.
        </div>
      )}

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
        {(showControls || onNext) && (
          <button
            onClick={handleSubmit}
            disabled={onNext ? isSubmitting : !isFormChanged || isSubmitting}
            className={`px-6 py-2 sm:px-8 sm:py-3 rounded-full text-white font-medium transition
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
      )}
      </div>
    </div>
  );
};
