import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProfileComplation = () => {
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        const authToken = token || localStorage.getItem("token");
        const response = await axios.get(`user/dashboard/profile-completion`, {
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
      <div className="bg-white rounded-2xl p-6 text-center">
        Loading...
      </div>
    );
  }

  // Circular progress math
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completion / 100) * circumference;

  return (
    <div className="relative bg-white rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center h-full">

      {/* CIRCULAR PROGRESS */}
      <div className="relative w-36 h-36 shrink-0">
        <svg className="w-full h-full rotate-[-90deg]">
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="#0D132D"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>

        {/* CENTER TEXT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xl font-bold text-gray-900">
            {completion}%
          </p>
          <p className="text-xs text-gray-500">
            Complete
          </p>
        </div>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-xl font-semibold text-gray-900">
          Profile Completion
        </h3>

        <p className="text-sm text-gray-500 mt-1 max-w-md justify">
          You are almost there! Unlock new opportunities and increase your
          visibility by completing the final steps of your profile.
        </p>

        <Link to="/dashboard/my-profile">
          <button className="mt-4 bg-[#0D132D] cursor-pointer text-white text-sm px-6 py-2 rounded-full hover:bg-[#121A3F] transition">
            Complete Your Profile →
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProfileComplation;
