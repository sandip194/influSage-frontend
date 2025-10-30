import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import { toast } from "react-toastify";
import googleIcon from "../../assets/icons/google-logo.png";
import facebookIcon from "../../assets/icons/facebook-logo.png";
import { setCredentials } from "../../features/auth/authSlice";

const SideImageSlider = React.lazy(() =>
  import("../../components/common/SideImageSlider")
);

const validationSchema = {
  emailValidator: {
    required: { value: true, message: "Email is required" },
    pattern: {
      value: /^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,4}|\d+)$/i,
      message: "Please enter a valid email address",
    },
  },
  passwordValidator: {
    required: { value: true, message: "Password is required" },
  },
};

export const LoginForm = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const isLoggingInRef = useRef(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedEmail) {
      setValue("email", savedEmail);
      setValue("rememberMe", true);
    }
    if (savedPassword) setValue("password", savedPassword);
  }, [setValue]);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");
    const userId = params.get("userId");
    const roleId = params.get("roleId");
    const name = params.get("name");
    const p_code = params.get("p_code");

    if (token) {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("userId", userId || "");
      localStorage.setItem("roleId", roleId || "");
      localStorage.setItem("name", name || "");
      localStorage.setItem("email", email || "");
      localStorage.setItem("p_code", p_code || "");

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      dispatch(setCredentials({ token, id: userId, role: Number(roleId), name, email, p_code }));
      window.history.replaceState({}, document.title, window.location.pathname);

      if (Number(roleId) === 1) navigate("/complate-profile");
      else if (Number(roleId) === 2) navigate("/complate-vendor-profile");
    } else if (email && !token) {
      navigate(`/roledefault?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&roleId=${roleId}`);
    }
  }, [dispatch, navigate]);

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

  const submitHandler = async (data) => {
    if (isLoggingInRef.current) return;
    isLoggingInRef.current = true;
    setIsLoggingIn(true);

    try {
      const res = await axios.post("/user/login", data);
      if (res.status === 200) {
        if (data.rememberMe) {
          localStorage.setItem("rememberedEmail", data.email);
          localStorage.setItem("rememberedPassword", data.password);
        }

        toast.success(res.data.message || "Login successful!");
        const { id, role, token, name, p_code } = res.data;
        dispatch(setCredentials({ token, id, role, name, p_code }));
        localStorage.setItem("p_code", p_code || "");

        if (Number(role) === 2 && p_code === "SUCCESS") navigate("/vendor-dashboard");
        else if (Number(role) === 2) navigate("/complate-vendor-profile");
        else if (Number(role) === 1 && p_code === "SUCCESS") navigate("/dashboard");
        else if (Number(role) === 1) navigate("/complate-profile");
        else if (Number(role) === 4) navigate("/admin-dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {
      setIsLoggingIn(false);
      isLoggingInRef.current = false;
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 p-5 font-[Segoe_UI,Tahoma,Geneva,Verdana,sans-serif] overflow-hidden">
      {/* 🔹 Background slider (behind everything) */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div>Loading...</div>}>
          <SideImageSlider />
        </Suspense>
      </div>

      {/* 🔹 Foreground Login Card */}
      <div className="relative z-10 bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex flex-col gap-5">
          <div>
            <img src="/influSage-logo.png" alt="Logo" className="h-8 w-auto mb-2" />
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-sm text-gray-700">Your Journey Awaits—Log in to Continue.</p>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-3">
            {/* Email */}
            <div>
              <label className="font-semibold text-sm">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Your Email"
                {...register("email", validationSchema.emailValidator)}
                className="w-full mt-1 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="font-semibold text-sm">
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  {...register("password", validationSchema.passwordValidator)}
                  className="w-full mt-1 border border-gray-700 rounded-lg px-3 py-2 text-sm pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
                >
                  {showPassword ? <RiEyeOffLine className="w-5 h-5" /> : <RiEyeLine className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register("rememberMe")} className="h-4 w-4 rounded" />
                Remember Me
              </label>
              <Link to="/forgot-password" className="text-[#0e1532] hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2 bg-[#0e1532] text-white font-semibold rounded-full hover:bg-gray-800 transition"
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </button>

            {/* Divider */}
            <div className="text-center text-gray-900 text-sm">Or Login With</div>

            {/* Socials */}
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

            {/* Signup */}
            <div className="text-center text-sm text-gray-900">
              Don’t have an account?{" "}
              <Link to="/role" className="font-semibold text-gray-900 hover:underline">
                Create New Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

};
