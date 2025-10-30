import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 overflow-hidden font-[Segoe_UI,Tahoma,Geneva,Verdana,sans-serif]">
      
      {/* Background Blur Layer */}
      <div className="absolute inset-0 bg-[url('/unauthorized-bg.jpg')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md" />

      {/* Glass Card */}
      <div className="relative z-10 bg-white/40 backdrop-blur-xl shadow-lg rounded-2xl p-10 max-w-md w-[90%] text-center border border-white/50">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M12 3c4.97 0 9 4.03 9 9 0 1.656-.448 3.208-1.23 4.543l-6.84 6.841a1.5 1.5 0 01-2.12 0l-6.84-6.841A8.966 8.966 0 013 12c0-4.97 4.03-9 9-9z"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          403 - Unauthorized
        </h1>
        <p className="text-gray-700 text-sm mb-6">
          You don’t have permission to view this page.
          <br />
          Please contact the administrator or log in with the correct account.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-900 transition font-semibold"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 rounded-full bg-white/60 text-gray-900 font-semibold border border-gray-300 hover:bg-white transition"
          >
            Go to Login
          </button>
        </div>
      </div>

      {/* Decorative Background Shapes */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#0e1532]/10 rounded-full blur-2xl" />
      <div className="absolute bottom-0 right-0 w-56 h-56 bg-red-500/10 rounded-full blur-3xl" />
    </div>
  );
};

export default Unauthorized;
