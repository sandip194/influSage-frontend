import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiUserLine } from "@remixicon/react";
import { useSelector } from "react-redux";

const ProfileComplation = () => {
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        const authToken = token || localStorage.getItem("token");

        const response = await axios.get(`user/dashboard/profile-completion`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const percentage = response.data?.percentage || 0;
        setCompletion(percentage);
      } catch (error) {
        console.error("Error fetching profile completion:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletion();
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl flex items-center justify-center mb-3">
        <p className="text-gray-500 text-sm">Loading profile completion...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl flex-row sm:flex items-center justify-between mb-3">
      <div className="flex items-center gap-4">
        <div className="bg-[#0D132D] rounded-full p-3">
          <RiUserLine className="text-white" />
        </div>

        <div>
          <p className="text-gray-700 font-semibold">Profile Completion</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-[#0D132D] h-2 rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            ></div>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            {completion}% of your profile is complete.
          </p>
        </div>
      </div>

      <button className="bg-[#121A3F] text-white cursor-pointer inset-shadow-sm inset-shadow-gray-500 px-8 py-3 rounded-full hover:bg-[#0D132D] mt-3 sm:mt-0">
        Complete Profile
      </button>
    </div>
  );
};

export default ProfileComplation;
