import React, { Suspense, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SideImageSlider = React.lazy(() =>
  import("../../components/common/SideImageSlider")
);

export const RoleDefault = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showError, setShowError] = useState(false);
  const [roles, setRoles] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchRoles = async () => {
    try {
      const res = await axios.get("roles");
      setRoles(res.data?.roles || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleContinue = () => {
    if (!selectedRole) {
      setShowError(true);
      return;
    }

    const params = new URLSearchParams(location.search);
    const email = params.get("email");
    const firstName = params.get("firstName");
    const lastName = params.get("lastName");

    navigate(
      `/setPassword?email=${encodeURIComponent(
        email
      )}&firstName=${encodeURIComponent(
        firstName
      )}&lastName=${encodeURIComponent(
        lastName
      )}&roleId=${selectedRole}`
    );
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 p-5 font-[Segoe_UI,Tahoma,Geneva,Verdana,sans-serif] overflow-hidden">
      {/* 🔹 Background Slider */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Suspense fallback={<div>Loading...</div>}>
          <SideImageSlider />
        </Suspense>
      </div>

      {/* 🔹 Glass-style Role Selection Card */}
      <div className="relative z-10 bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <img
            src="/influSage-logo.png"
            alt="Logo"
            className="h-8 w-auto mb-2"
          />

          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Select Your Role</h2>
            <p className="text-sm text-gray-700 mt-1">
              Choose the role that best matches your needs so we can personalize your experience.
            </p>
          </div>

          {/* Role Options */}
          <div className="grid grid-cols-2 gap-5 w-full">
            {roles.map((role) => (
              <div
                key={role.id}
               className={`flex flex-col items-center justify-center border rounded-xl p-4 cursor-pointer transition duration-300 hover:shadow-md ${Number(selectedRole) === role.id
                      ? "border-indigo-600 bg-indigo-50 shadow-lg scale-105 ring-2 ring-indigo-300"
                      : "border-gray-300 bg-white/70"
                    }`}
                onClick={() => {
                  setSelectedRole(role.id);
                  setShowError(false);
                }}
              >
                <img
                  src={role.iconpath}
                  alt={role.name}
                  className="w-16 h-16 rounded-full bg-gray-100 object-contain mb-2"
                  onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                />
                <p className="font-medium text-gray-900 text-sm">{role.name}</p>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {showError && (
            <p className="text-sm text-red-500 font-medium">
              Please select a role
            </p>
          )}

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full py-2 bg-[#0e1532] text-white font-semibold rounded-full hover:bg-gray-800 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
