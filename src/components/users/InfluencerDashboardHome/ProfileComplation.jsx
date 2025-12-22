import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiUserLine } from "@remixicon/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "antd";

const ProfileComplation = () => {
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        const authToken = token || localStorage.getItem("token");
        const response = await axios.get("user/dashboard/profile-completion", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        setCompletion(response.data?.percentage || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletion();
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 flex items-center justify-center">
        <Skeleton active />
      </div>
    );
  }

  return (
  <div className="bg-white rounded-2xl p-4 flex flex-col w-full max-w-[400px]">

    {/* Title */}
    <div className="flex items-center gap-3">
      <div className="bg-[#0D132D] p-2.5 rounded-full">
        <RiUserLine className="text-white text-lg" />
      </div>
      <span className="text-[15px] font-semibold text-[#0D132D]">
        Profile Completion
      </span>
    </div>

    {/* Content wrapper */}
    <div className="flex flex-col items-center my-6">

      {/* FULL CIRCLE */}
      <div className="relative w-[120px] h-[140px]">

        {/* base circle */}
        <svg className="w-[140px] h-[140px] rotate-[-90deg]">
          <circle
            cx="70"
            cy="70"
            r="58"
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="transparent"
          />
        </svg>

        {/* progress */}
        <svg className="w-[140px] h-[140px] rotate-[-90deg] absolute top-0 left-0">
          <circle
            cx="70"
            cy="70"
            r="58"
            stroke="#6D5BFF"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 58}
            strokeDashoffset={(2 * Math.PI * 58 * (100 - completion)) / 100}
            className="transition-all duration-700"
          />
        </svg>

        {/* percent text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold text-gray-800">
            {completion}%
          </span>
          <span className="text-xs text-gray-500">
            Complete
          </span>
        </div>

      </div>
    </div>

    {/* button positioned right */}
    <div className="flex justify-end">
      <Link to="/dashboard/editProfile">
        <button className="bg-[#121A3F] text-white text-xs px-4 py-2 rounded-full hover:bg-[#0D132D] transition">
          Complete Profile
        </button>
      </Link>
    </div>

  </div>
);
};

export default ProfileComplation;
