import {
  RiGiftLine,
  RiLinksLine,
  RiMegaphoneLine,
  RiTrophyLine,
  RiVideoAddLine,
  RiLiveLine,
  RiSwapBoxLine,
  RiVipCrownLine,
} from "@remixicon/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

const STORAGE_KEY = "selected_objective"; // Store a single ID



const ObjectiveSelector = ({ onBack, onNext }) => {
  const [selected, setSelected] = useState(null); // now a single value
  const [error, setError] = useState("");
  const [objectives, setObjectives] = useState([])



  const handleSelection = (id) => {
    setSelected(id);
  };

  const handleContinue = () => {
    if (!selected) {
      setError("Please select one objective to complete your profile.");
      return;
    }
    setError("");
    localStorage.setItem(STORAGE_KEY, selected.toString());
    onNext();
  };



  const fatchAllObjectives = async () => {
    try {
      const response = await axios.get("vendor/objectives")
      if (response.status === 200) {
        setObjectives(response.data.objectives)
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {

    fatchAllObjectives()
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) setSelected(parsed);
    }
  }, []);


  return (
    <div className="bg-white p-6 rounded-3xl text-inter">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#141843] mb-1">Objectives</h2>
      <p className="text-sm text-gray-500 mb-6">
        What would you like to achieve with influencer?
      </p>

      {/* Objective Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {objectives.map((obj) => (
          <div
            key={obj.id}
            onClick={() => handleSelection(obj.id)}
            className={`border rounded-2xl p-4 cursor-pointer transition hover:shadow-sm ${selected === obj.id
                ? "border-[#141843] bg-gray-50"
                : "border-gray-200"
              }`}
          >
            <div className="flex flex-col items-start gap-3 p-2">

              <div>
                <h3 className="font-bold text-[#141843] mb-1">{obj.name}</h3>
                <p className="text-sm text-gray-500">{obj.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-red-600 text-sm mt-4 font-medium">{error}</p>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={onBack}
          className="bg-white text-sm cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="bg-[#121A3F] text-sm text-white cursor-pointer inset-shadow-sm inset-shadow-gray-500 px-8 py-1 rounded-full hover:bg-[#0D132D]"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ObjectiveSelector;
