import React, { useState, useCallback, Suspense } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import googleIcon from "../../assets/icons/google-logo.png";
import facebookIcon from "../../assets/icons/facebook-logo.png";

const SideImageSlider = React.lazy(() =>
  import("../../components/common/SideImageSlider")
);

const Signup = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

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
        const response = await axios.post("/user/register", userData);
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
    const lowerEmail = e.target.value.toLowerCase();
    setValue("email", lowerEmail, { shouldValidate: true });
  };

  // 🔹 Helper: prevent special chars in names
  const handleNameChange = (e, field) => {
    const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setValue(field, onlyLetters, { shouldValidate: true });
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
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Only alphabets are allowed",
                    },
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
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Only alphabets are allowed",
                    },
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
                  pattern: {
                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    message: "Invalid email format (use lowercase letters only)",
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
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                      message:
                        "Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char",
                    },
                  })}
                  className="w-full mt-1 border border-gray-700 rounded-lg px-3 py-2 text-sm pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
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
                  className="h-4 w-4"
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
              className="w-full py-2 bg-[#0e1532] text-white font-semibold rounded-full hover:bg-gray-800 transition"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-11 h-11 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                <img src={googleIcon} alt="Google" className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                className="w-11 h-11 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                <img src={facebookIcon} alt="Facebook" className="w-6 h-6" />
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
          width={700}
          bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          <p>
            By using this platform, you agree to comply with our policies and
            guidelines.
            <br />
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            facilisis nulla in orci porttitor, at placerat risus dapibus. Morbi
            blandit suscipit sapien non tincidunt. Proin lacinia diam nec turpis
            posuere, eget vehicula est gravida. Pellentesque habitant morbi
            tristique senectus et netus et malesuada fames ac turpis egestas...
            <br />
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            facilisis nulla in orci porttitor, at placerat risus dapibus. Morbi
            blandit suscipit sapien non tincidunt. Proin lacinia diam nec turpis
            posuere, eget vehicula est gravida. Pellentesque habitant morbi
            tristique senectus et netus et malesuada fames ac turpis egestas...
          </p>
        </Modal>
      )}
    </div>
  );
};

export default Signup;



