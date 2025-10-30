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
      <div className="relative z-10 bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex flex-col items-start gap-5">
          {/* Logo */}
          <img src="/influSage-logo.png" alt="Logo" className="h-8 w-auto" />

          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Select Your Role</h2>
            <p className="text-sm text-gray-700 mt-1">
              Select your role based on your requirements
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-5 w-full">
            {/* Role Options */}
            <div className="grid grid-cols-3 gap-4 mt-4 w-full">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role.id);
                    setShowError(false);
                  }}
                  className={`flex flex-col items-center justify-center border rounded-xl p-4 cursor-pointer transition duration-300 hover:shadow-md ${Number(selectedRole) === role.id
                      ? "border-[#0d0e2f] bg-gray-100"
                      : "border-gray-300 bg-white/70"
                    }`}
                >
                  <img
                    src={role.iconpath}
                    alt={role.name}
                    className="w-16 h-16 object-contain rounded-full bg-gray-50"
                  />
                  <p className="mt-2 font-medium text-gray-800">{role.name}</p>
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
