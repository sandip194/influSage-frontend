import React, { useState, Suspense } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import axios from "axios";
import { toast } from "react-toastify";

const SideImageSlider = React.lazy(() =>
  import("../../components/common/SideImageSlider")
);

export const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/user/reset-password", {
        password: data.password,
        token,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const validationSchema = {
    passwordValidator: {
      required: { value: true, message: "Password is required" },
      pattern: {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        message:
          "Password must be at least 8 chars long and include upper, lower, number & special char",
      },
    },
    confirmPasswordValidator: {
      validate: (value) =>
        value === watch("password") || "Passwords do not match",
    },
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 p-5 font-[Segoe_UI,Tahoma,Geneva,Verdana,sans-serif] overflow-hidden">
      {/* 🔹 Background slider */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Suspense fallback={<div>Loading...</div>}>
          <SideImageSlider />
        </Suspense>
      </div>

      {/* 🔹 Glass-style card */}
      <div className="relative z-10 bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex flex-col gap-5">
          {/* Logo */}
          <div>
            <img
              src="/influSage-logo.png"
              alt="Logo"
              className="h-8 w-auto mb-2"
            />
          </div>

          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
            <p className="text-sm text-gray-700">
              Please enter your new password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* New Password */}
            <div className="relative">
              <label className="font-semibold text-sm">
                New Password<span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter New Password"
                {...register("password", validationSchema.passwordValidator)}
                className="w-full mt-1 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] text-gray-600 cursor-pointer"
              >
                {showPassword ? (
                  <RiEyeOffLine className="w-5 h-5" />
                ) : (
                  <RiEyeLine className="w-5 h-5" />
                )}
              </span>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="font-semibold text-sm">
                Confirm Password<span className="text-red-500">*</span>
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                {...register(
                  "confirmPassword",
                  validationSchema.confirmPasswordValidator
                )}
                className="w-full mt-1 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] text-gray-600 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <RiEyeOffLine className="w-5 h-5" />
                ) : (
                  <RiEyeLine className="w-5 h-5" />
                )}
              </span>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 bg-[#0e1532] cursor-pointer text-white font-semibold rounded-full hover:bg-gray-800 transition"
            >
              Reset Password
            </button>

            {/* Back to Login */}
            <p className="text-center text-sm text-gray-700 mt-4">
              Back to{" "}
              <Link
                to="/login"
                className="font-semibold text-gray-900 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
