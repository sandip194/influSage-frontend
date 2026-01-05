import React, { useRef, useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const SideImageSlider = React.lazy(() =>
  import("../../components/common/SideImageSlider")
);

export const VerifyEmailOrMobile = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const inputsRef = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Timer Countdown
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Redirect if no signup info
  useEffect(() => {
    const email = localStorage.getItem("signupEmail");
    const isCreatedNew = localStorage.getItem("isCreatedNew");
    if (!email || !isCreatedNew) navigate("/signup");
  }, [navigate]);

  // Handle OTP Input
  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    setError("");

    if (value && idx < 3) {
      inputsRef[idx + 1].current.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef[idx - 1].current.focus();
    }
  };

  // Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (timer === 0) return setError("OTP expired. Please resend OTP.");
    if (otp.some((digit) => digit === "")) {
      return setError("Please enter the complete OTP.");
    }

    try {
      const email = localStorage.getItem("signupEmail");
      const otpValue = otp.join("");
      const res = await axios.post("/user/verify-otp", { email, otp: otpValue });

      if (res.status === 200) {
        toast.success(res.data.message || "OTP verified successfully!");
        localStorage.removeItem("isCreatedNew");
        localStorage.removeItem("selectedRole");
        localStorage.removeItem("signupEmail");
        navigate("/login");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      toast.error(
        err.response?.data?.message || "OTP verification failed. Try again."
      );
      setError("OTP verification failed. Try again.");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (isResending) return;
    setIsResending(true);
    try {
      const email = localStorage.getItem("signupEmail");
      const res = await axios.post("/user/resend-otp", { email });
      if (res.status === 200) {
        setOtp(["", "", "", ""]);
        setTimer(60);
        toast.success(res.data.message || "OTP resent successfully!");
      }
    } catch (err) {
      console.error("Resend OTP failed:", err);
      toast.error("Failed to resend OTP. Try again.");
      setError("Failed to resend OTP. Try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handlePaste = (e) => {
  e.preventDefault();
  const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
  if (!pasted) return;

  const newOtp = [...otp];
  for (let i = 0; i < 4 && i < pasted.length; i++) {
    newOtp[i] = pasted[i];
  }
  setOtp(newOtp);

  // Move focus to the last filled input
  const lastFilled = Math.min(pasted.length, 4) - 1;
  if (lastFilled >= 0 && inputsRef[lastFilled]) {
    inputsRef[lastFilled].current.focus();
  }
};

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 p-5 font-[Segoe_UI,Tahoma,Geneva,Verdana,sans-serif] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Suspense fallback={<div>Loading...</div>}>
          <SideImageSlider />
        </Suspense>
      </div>

      {/* Glass Card */}
      <div className="relative z-10 bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex flex-col gap-5">
          {/* Logo */}
          <div>
            <img
              src="/influSage-logo.png"
              alt="Logo"
              className="h-8 w-auto mb-3"
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            Verification Required
          </h2>
          <p className="text-gray-700 text-sm mb-2">
            Please verify your email or mobile number to continue.
          </p>

          {/* OTP Input Boxes */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-center gap-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputsRef[idx]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onPaste={handlePaste}
                  autoFocus={idx === 0}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white/70"
                />
              ))}
            </div>

            {/* Timer + Resend */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-900">Didn’t get OTP?</span>
              {timer === 0 ? (
                <span
                  className={`cursor-pointer ${
                    isResending
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-indigo-600 hover:underline"
                  }`}
                  onClick={!isResending ? handleResendOtp : undefined}
                >
                  {isResending ? "Resending..." : "Resend OTP"}
                </span>
              ) : (
                <span className="text-gray-700">
                  OTP expires in: <b>{timer}s</b>
                </span>
              )}
            </div>

            {/* Error */}
            {error && <p className="text-xs text-red-500">{error}</p>}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={timer === 0}
              className={`w-full py-2 rounded-full font-semibold transition ${
                timer === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0e1532] cursor-pointer text-white hover:bg-gray-800"
              }`}
            >
              Verify OTP
            </button>
          </form>

          {/* Back to Login */}
          <p className="text-sm text-center text-gray-700 mt-4">
            Back to{" "}
            <span
              onClick={() => navigate("/login")}
              className="font-bold text-indigo-600 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailOrMobile;
