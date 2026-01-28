import React, { useState, useCallback, Suspense } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import googleIcon from "../../assets/icons/google-logo.png";
import facebookIcon from "../../assets/icons/facebook-logo.png";
import TermsAndCondition from "../../components/common/TermsAndCondition";

const SideImageSlider = React.lazy(() =>
  import("../../components/common/SideImageSlider")
);

const Signup = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // ⭐ IMPORTANT FIX — enable validation mode
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = useCallback(
    async (data) => {
      const role = localStorage.getItem("selectedRole");
      if (!role) {
        toast.error("Please select a role first!", { position: "top-right" });
        return navigate("/role");
      }

      const userData = { ...data, roleId: Number(role) };
      localStorage.setItem("signupEmail", data.email);

      try {
        setLoading(true);
        const response = await api.post("/user/register", userData);
        if (response.status === 200) {
          localStorage.setItem("isCreatedNew", response.data.message);
          toast.success("Signup successful! Please verify your email or mobile.");
          navigate("/verify-email-or-mobile");
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Signup failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );


  // 🔹 Helper: handle lowercase email
  const handleEmailChange = (e) => {
    const val = e.target.value.trim().toLowerCase();
    setValue("email", val, { shouldValidate: true });
  };

  const formatName = (value) => {
    const cleaned = value.replace(/[^A-Za-z\s]/g, ""); // only letters + spaces
    const trimmed = cleaned.replace(/\s+/g, " ").trim(); // remove extra spaces
    return trimmed.replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize
  };

  // 🔹 Helper: prevent special chars in names
  const handleNameChange = (e, field) => {
    const formatted = formatName(e.target.value);
    setValue(field, formatted, { shouldValidate: true });
  };

  const handleGoogleLogin = useCallback(() => {
    const storedRole = localStorage.getItem("selected_role");
    const backendUrl = BASE_URL.replace(/\/$/, "");
    window.location.href = `${backendUrl}/auth/google/?roleid=${storedRole}`;
  }, [BASE_URL]);

  const handleFacebookLogin = useCallback(() => {
    const storedRole = localStorage.getItem("selected_role");
    const backendUrl = BASE_URL.replace(/\/$/, "");
    window.location.href = `${backendUrl}/auth/facebook?roleid=${storedRole}`;
  }, [BASE_URL]);

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 p-5 font-[Segoe_UI,Tahoma,Geneva,Verdana,sans-serif] overflow-hidden">
      {/* 🔹 Background Side Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Suspense fallback={<div>Loading...</div>}>
          <SideImageSlider />
        </Suspense>
      </div>

      {/* 🔹 Foreground Signup Card */}
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
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-sm text-gray-700">
              Start your journey with InfluSage today!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-3">
            {/* Name Fields */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="font-semibold text-sm">
                  First Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  {...register("firstName", {
                    required: "First name is required",
                    minLength: { value: 2, message: "Min 2 characters" },
                    maxLength: { value: 50, message: "Max 50 characters" },
                    pattern: { value: /^[A-Za-z\s]+$/, message: "Only alphabets allowed" },
                  })}
                  onChange={(e) => handleNameChange(e, "firstName")}
                  className="w-full mt-1 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="font-semibold text-sm">
                  Last Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  {...register("lastName", {
                    required: "Last name is required",
                    minLength: { value: 2, message: "Min 2 characters" },
                    maxLength: { value: 50, message: "Max 50 characters" },
                    pattern: { value: /^[A-Za-z\s]+$/, message: "Only alphabets allowed" },
                  })}
                  onChange={(e) => handleNameChange(e, "lastName")}
                  className="w-full mt-1 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="font-semibold text-sm">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  validate: (value) =>
                    value.length <= 60 || "Email cannot exceed 60 characters",
                  pattern: {
                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
                    message: "Invalid email format",
                  },
                })}
                onChange={handleEmailChange}
                className="w-full mt-1 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="font-semibold text-sm">
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  {...register("password", {
                    required: "Password is required",
                    validate: (value) => {
                      if (!value) return "Password is required";
                      if (value.length < 8) return "Password must be at least 8 characters";
                      if (value.length > 20) return "Password cannot exceed 20 characters";
                      if (!/[A-Z]/.test(value)) return "Must include at least one uppercase letter";
                      if (!/[a-z]/.test(value)) return "Must include at least one lowercase letter";
                      if (!/[0-9]/.test(value)) return "Must include at least one number";
                      return true;
                    },
                  })}
                  className="w-full mt-1 border border-gray-700 rounded-lg px-3 py-2 text-sm pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-700"
                >
                  {showPassword ? (
                    <RiEyeOffLine className="w-5 h-5" />
                  ) : (
                    <RiEyeLine className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="text-sm mt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("terms", {
                    required: "Please accept terms & conditions",
                  })}
                  className="h-4 w-4 cursor-pointer"
                />
                <span>
                  I agree to the{" "}
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={() => setShowModal(true)}
                  >
                    Terms & Conditions
                  </span>
                </span>
              </div>
              {errors.terms && (
                <p className="text-xs text-red-500">{errors.terms.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-[#0e1532] cursor-pointer text-white font-semibold rounded-full hover:bg-gray-800 transition"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-11 h-11 cursor-pointer rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                <img
                  src={googleIcon}
                  alt="Google"
                  className="w-6 h-6"
                  onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                />
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                className="w-11 h-11 cursor-pointer rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                <img
                  src={facebookIcon}
                  alt="Facebook"
                  className="w-6 h-6"
                  onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                />
              </button>
            </div>
            {/* Login link */}
            <div className="text-center text-sm text-gray-700 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-gray-900 hover:underline"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* 🔹 Terms & Conditions Modal */}
      {showModal && (
        <Modal
          title="Terms and Conditions"
          open={showModal}
          onCancel={() => setShowModal(false)}
          footer={null}
          centered
          width={800}
          bodyStyle={{ maxHeight: "70vh", }}
        >
          <TermsAndCondition/>
        </Modal>
      )}
    </div>
  );
};

export default Signup;



