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

  /* ------------------ Skeleton UI ------------------ */
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-2xl flex flex-col gap-4 h-full">
        <div className="flex items-center gap-4">
          <Skeleton.Avatar active size={40} shape="circle" />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton.Input active size="small" style={{ width: "40%" }} />
            {/* Progress bar skeleton */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <Skeleton.Node active style={{ width: "60%", height: "8px" }} />
            </div>
            <Skeleton.Input active size="small" style={{ width: "30%" }} />
          </div>
        </div>

        <div className="mt-auto">
          <Skeleton.Button active shape="round" style={{ width: 160, height: 36 }} />
        </div>
      </div>
    );
  }

  /* ------------------ Actual UI ------------------ */
  return (
    <div className="bg-white p-6 rounded-2xl flex flex-col gap-4 h-full">
      <div className="flex items-center gap-4">
        <div className="bg-[#0D132D] rounded-full p-3 flex-shrink-0">
          <RiUserLine className="text-white text-xl" />
        </div>

        <div className="flex-1">
          <p className="text-gray-700 font-medium text-sm">
            Profile Completion
          </p>

          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-[#0D132D] h-2 rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>

          <p className="text-xs text-gray-500 mt-1">
            {completion}% of your profile is complete.
          </p>
        </div>
      </div>

      <Link to="/dashboard/editProfile" className="mt-auto">
        <button className="w-full sm:w-auto bg-[#121A3F] text-white px-4 py-2 rounded-full hover:bg-[#0D132D]">
          Complete Profile
        </button>
      </Link>
    </div>
  );
};

export default ProfileComplation;
