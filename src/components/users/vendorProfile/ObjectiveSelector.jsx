import { RiCheckLine } from '@remixicon/react';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Spin } from "antd";

const STORAGE_KEY = 'selected_objective';

const ObjectiveSelector = ({ onBack, onNext, data, showControls, showToast, onSave }) => {
  const [selected, setSelected] = useState(null);
  const [initialSelected, setInitialSelected] = useState(null); // ✅ Track original value
  const [error, setError] = useState("");
  const [objectives, setObjectives] = useState([]);

  const { token } = useSelector(state => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);

  // ✅ Fetch all objectives
  const fetchAllObjectives = async () => {
    try {
      const response = await axios.get("vendor/objectives");
      if (response.status === 200) {
        setObjectives(response.data.objectives || []);
      }
    } catch (error) {
      console.error("❌ Failed to fetch objectives:", error);
    }
  };

  useEffect(() => {
    fetchAllObjectives();

    if (data && Array.isArray(data) && data.length > 0 && data[0].objectiveid) {
      setSelected(data[0].objectiveid);
      setInitialSelected(data[0].objectiveid);
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) {
          setSelected(parsed);
          setInitialSelected(parsed);
        }
      }
    }
  }, [data]);

  // ✅ Detect change
  const handleSelection = (id) => {
    setSelected(id);
    setError("");
    setIsFormChanged(id !== initialSelected); // ✅ Enable only if changed
  };

  // ✅ Save / Continue handler
  const handleContinue = async () => {
    if (!selected) {
      setError("Please select one objective to complete your profile.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('objectivesjson', JSON.stringify([{ objectiveid: selected }]));

    try {
      const response = await axios.post("vendor/complete-vendor-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        if (showToast) toast.success('Profile updated successfully!');
        setIsFormChanged(false);
        setInitialSelected(selected); // ✅ Reset original after save
        localStorage.setItem(STORAGE_KEY, selected.toString());

        if (onNext) onNext();
        if (onSave) onSave(formData);
      }
    } catch (err) {
      console.error("❌ Failed to save objective:", err);
      setError("Failed to save your objective. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl text-inter">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#141843] mb-1">
        Objectives
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        What would you like to achieve with influencer marketing?
      </p>

      {/* Objective Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {objectives.map((obj) => (
          <div
            key={obj.id}
            onClick={() => handleSelection(obj.id)}
            className={`flex justify-between items-center border rounded-2xl px-4 py-4 cursor-pointer transition-all ${
              selected === obj.id
                ? "bg-[#0D132D26] text-black border-[#0D132D26]"
                : "bg-white text-black border-gray-300 hover:border-[#141843]"
            }`}
          >
            {/* Objective Info */}
            <div className="flex flex-col gap-1 pr-3">
              <h3 className="font-bold text-[#141843]">{obj.name}</h3>
              <p className="text-sm text-gray-600">{obj.description}</p>
            </div>

            {/* Checkbox */}
            <div
              className={`flex items-center justify-center rounded-full border transition-all ${
                selected === obj.id
                  ? "bg-[#141843] border-[#0D132D26] p-0 text-white"
                  : "bg-transparent border-gray-400 p-[10px] text-transparent"
              }`}
            >
              {selected === obj.id && <RiCheckLine size={22} />}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-red-600 text-sm mt-4 font-medium">{error}</p>}

      {/* Buttons */}
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
            onClick={handleContinue}
            disabled={onNext ? isSubmitting : !isFormChanged || isSubmitting}
            className={`px-8 py-3 rounded-full text-white font-medium transition
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

export default ObjectiveSelector;
