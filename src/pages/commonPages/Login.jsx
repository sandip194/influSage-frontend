import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  Suspense,
} from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import { toast } from "react-toastify";

import "../../assets/login.css";
import googleIcon from "../../assets/icons/google-logo.png";
import facebookIcon from "../../assets/icons/facebook-logo.png";
// import appleIcon from "../../assets/icons/apple-logo.png";

import { setCredentials } from "../../features/auth/authSlice";

// Lazy-load SideImageSlider
const SideImageSlider = React.lazy(() =>
  import("../../components/common/SideImageSlider")
);

// Validation schema
const validationSchema = {
  emailValidator: {
    required: {
      value: true,
      message: "Email is required",
    },
    pattern: {
      value: /^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,4}|\d+)$/i,
      message: "Please enter a valid email address",
    },
  },
  passwordValidator: {
    required: {
      value: true,
      message: "Password is required",
    },
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
    if (savedPassword) {
      setValue("password", savedPassword);
    }
  }, [setValue]);

  // OAuth redirect handling
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
      dispatch(
        setCredentials({
          token,
          id: userId,
          role: Number(roleId),
          name,
          email,
          p_code,
        })
      );

      window.history.replaceState({}, document.title, window.location.pathname);

      if (Number(roleId) === 1) {
        navigate("/complate-profile");
      } else if (Number(roleId) === 2) {
        navigate("/complate-vendor-profile");
      }
    } else if (email && !token) {
      navigate(
        `/roledefault?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&roleId=${roleId}`
      );
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

        // ✅ Save p_code to Redux and localStorage
        dispatch(setCredentials({ token, id, role, name, p_code }));
        localStorage.setItem("p_code", p_code || "");

        // 🔐 Navigate based on p_code
        if (Number(role) === 2 && p_code === "SUCCESS") {
          navigate("/vendor-dashboard");
        } else if (Number(role) === 2) {
          navigate("/complate-vendor-profile");
        } else if (Number(role) === 1 && p_code === "SUCCESS") {
          navigate("/dashboard");
        } else if (Number(role) === 1) {
          navigate("/complate-profile");
        } else if (Number(role) === 4) {
          navigate("/admin-dashboard");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {
      setIsLoggingIn(false);
      isLoggingInRef.current = false;
    }
  };

  return (
    <div className="login-container object-cover">
      <Suspense fallback={<div className="loader">Loading...</div>}>
        <SideImageSlider />
      </Suspense>
      <div className="relative z-20 login-card">
        <div className="login-card-right">
          <div className="">
            <img src="/influSage-logo.png" alt="Logo" className="h-8 w-auto" />
          </div>
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="header-text">
              <h2>Welcome Back</h2>
              <p>Your Journey Awaits—Log in to Continue.</p>
            </div>

            <label>
              Email<span className="text-red-500 text-sm">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Your Email"
              {...register("email", validationSchema.emailValidator)}
            />
            <span className="text-for-error">{errors.email?.message}</span>

            <label>
              Password<span className="text-red-500 text-sm">*</span>
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                {...register("password", validationSchema.passwordValidator)}
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <RiEyeOffLine className="w-[18px]" />
                ) : (
                  <RiEyeLine className="w-[18px]" />
                )}
              </span>
            </div>
            <span className="text-for-error">{errors.password?.message}</span>

            <div className="form-options flex items-center justify-between gap-4">
              <div className="remember-label text-sm flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="h-5 w-5"
                />
                <span>Remember Me</span>
              </div>
              <Link
                to="/forgot-password"
                className="forgot-password-link text-sm sm:text-base text-[#141843] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-btn bg-wonderblue"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </button>

            <div className="divider">Or Login With</div>

            <div className="social-buttons">
              <div className="social-btn" onClick={handleGoogleLogin}>
                <img className="social-icon" src={googleIcon} alt="Google" />
              </div>
              <div className="social-btn" onClick={handleFacebookLogin}>
                <img className="social-icon" src={facebookIcon} alt="Facebook" />
              </div>
              {/* <div className="social-btn">
                <img className="social-icon" src={appleIcon} alt="Apple" />
              </div> */}
            </div>

            <div className="signup-link mb-4">
              Don’t have an account? <Link to="/role">Create New Account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
