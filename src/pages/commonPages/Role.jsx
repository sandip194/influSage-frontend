import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SideImageSlider = React.lazy(() =>
  import("../../components/common/SideImageSlider")
);

export const Role = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showError, setShowError] = useState(false);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchRoles = async () => {
      try {
        const res = await axios.get("/roles");
        if (isMounted) setRoles(res.data?.roles || []);
      } catch (error) {
        console.error("Failed to fetch roles", error);
      }
    };
    fetchRoles();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedRole) {
      localStorage.setItem("selectedRole", selectedRole);
      navigate("/signup");
    } else {
      setShowError(true);
    }
  }, [selectedRole, navigate]);

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 p-5 font-[Segoe_UI,Tahoma,Geneva,Verdana,sans-serif] overflow-hidden">
      {/* 🔹 Background image slider */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Suspense fallback={<div>Loading...</div>}>
          <SideImageSlider />
        </Suspense>
      </div>

      {/* 🔹 Foreground glass card */}
      <div className="relative z-10 bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg w-full max-w-xl p-8">
        <div className="flex flex-col items-start gap-5">
          {/* Logo */}
          <img src="/influSage-logo.png" alt="Logo" className="h-8 w-auto" />

          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Select Your Role</h2>
            <p className="text-sm text-gray-700 mt-1">
               Choose the role that best matches your needs so we can personalize your experience.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-5 w-full">
            {/* Role Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 w-full justify-items-center">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role.id);
                    setShowError(false);
                  }}
                  className={`w-full sm:w-48 md:w-56 flex flex-col items-center justify-center border rounded-xl p-6 cursor-pointer transition duration-300 hover:shadow-md ${
                    (selectedRole) === role.id
                      ? "border-indigo-600 bg-indigo-50 shadow-lg scale-105 ring-2 ring-indigo-300"
                      : "border-gray-300 bg-white/70"
                  }`}
                >
                  <img
                    src={role.iconpath}
                    alt={role.name}
                    className="w-20 h-20 object-contain rounded-full bg-gray-50"
                  />
                  <p className="mt-3 text-lg font-semibold text-gray-800">{role.name}</p>
                </div>
              ))}
            </div>

            {/* Error Message */}
            {showError && (
              <p className="text-sm text-red-500 -mt-2">Please select a role</p>
            )}

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full mt-2 py-2 bg-[#0e1532] text-white font-semibold rounded-full hover:bg-gray-800 transition"
            >
              Continue
            </button>

            {/* Back to Login */}
            <p className="text-sm text-gray-700 mt-0">
              Back to{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-semibold text-gray-900 hover:underline cursor-pointer"
              >
                Login
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
