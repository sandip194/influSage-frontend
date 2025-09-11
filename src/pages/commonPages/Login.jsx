import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import '../../assets/login.css';
import googleIcon from '../../assets/icons/google-logo.png';
import facebookIcon from '../../assets/icons/facebook-logo.png';
import appleIcon from '../../assets/icons/apple-logo.png';
import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';
import { toast } from 'react-toastify';

import { setCredentials } from '../../features/auth/authSlice';
import SideImageSlider from '../../components/common/SideImageSlider';


export const LoginForm = () => {

const BASE_URL = import.meta.env.VITE_API_BASE_URL;



  const dispatch = useDispatch();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false); // 👁️ Toggle state
  const [isLoggingIn, setIsLoggingIn] = useState(false);


  const navigate = useNavigate()
  
useEffect(() => {
  // Always set axios header if token exists
  const storedToken = localStorage.getItem("auth_token");
  if (storedToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
  }

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const email = params.get("email");
  const userId = params.get("userId");
  const roleId = params.get("roleId");
  const firstName = params.get("firstName");
  const lastName = params.get("lastName");

  console.log("[DEBUG] Login page params:", { token, email, userId, roleId, firstName, lastName });

  if (token) {
    // persist token + user info
    localStorage.setItem("auth_token", token);
    localStorage.setItem("userId", userId || "");
    localStorage.setItem("roleId", roleId || "");
    localStorage.setItem("firstName", firstName || "");
    localStorage.setItem("lastName", lastName || "");
    localStorage.setItem("email", email || "");

    // set axios default header
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // redux state update
    dispatch(setCredentials({ token, id: userId, role: Number(roleId), firstName, lastName, email }));

    // clean query string
    window.history.replaceState({}, document.title, window.location.pathname);

    // navigate immediately after state & storage are ready
    if (Number(roleId) === 1) {
      navigate("/complate-profile");
    } else if (Number(roleId) === 2) {
      navigate("/complate-vendor-profile");
    }
  } else if (email && !token) {
    navigate(
      `/roledefault?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&roleId=${roleId}`
    );
  }
}, [dispatch, navigate]);



  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail) {
      setValue('email', savedEmail);
      setValue('rememberMe', true);
    }
    if (savedPassword) {
      setValue('password', savedPassword);
    }
  }, [setValue]);

  const submitHandler = async (data) => {
    if (isLoggingIn) return; // prevent multiple submissions
    setIsLoggingIn(true);
    
    try {
      const res = await axios.post("/user/login", data);
      if (res.status === 200) {
        if (data.rememberMe) {
          localStorage.setItem('rememberedEmail', data.email);
          localStorage.setItem("rememberedPassword", data.password);
        }
        toast.success(res.data.message || "Login successful!");
        const { id, role, token, firstName, lastName } = res.data;
        dispatch(setCredentials({ token, id, role, firstName, lastName }));

        if (role === 2) {
          navigate("/complate-vendor-profile");
        } else if (role === 1) {
          navigate("/complate-profile");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {

      setIsLoggingIn(false);
    }
  };

    const handleGoogleLogin = () => {
    const storedRole = localStorage.getItem("selected_role");

    // if (!storedRole) {
    //   navigate("/roledefault");
    //   return;
    // }

    const backendUrl = BASE_URL.replace(/\/$/, "");
    window.location.href = `${backendUrl}/auth/google?roleid=${storedRole}`;
  };

  const validationSchema = {
    emailValidator: {
      required: {
        value: true,
        message: "Email is required"
      },
      pattern: {
        value: /^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,4}|\d+)$/i,
        message: "Please enter a valid email address"
      }
    },
    passwordValidator: {
      required: {
        value: true,
        message: "Password is required"
      },
      // pattern: {
      //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      //   message: "Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char"
      // }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card h-90vh">
        <SideImageSlider />
        <div className="login-card-right">

          <form onSubmit={handleSubmit(submitHandler)}>

            <div className="header-text">
              <h2>Welcome Back</h2>
              <p>Your Journey Awaits—Log in to Continue.</p>
            </div>


            <label>Email
              <span className='text-red-500 text-sm'>*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Your Email"
              {...register("email", validationSchema.emailValidator)}
            />
            <span className='text-for-error'>{errors.email?.message}</span>

            <label>Password
              <span className='text-red-500 text-sm'>*</span>
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                {...register("password", validationSchema.passwordValidator)}
              />
              <span className="eye-icon" onClick={() => setShowPassword(prev => !prev)}>
                {showPassword ? <RiEyeOffLine className='w-[18px]' /> : <RiEyeLine className='w-[18px]' />}
              </span>
            </div>
            <span className='text-for-error'>{errors.password?.message}</span>

            <div className="form-options flex items-center justify-between gap-4">
              {/* <label className="flex items-center cursor-pointer text-sm sm:text-base">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="w-5 h-5 mr-2 cursor-pointer"
                />
                Remember Me
              </label> */}

              <Link
                to="/forgot-password"
                className="forgot-password-link text-sm sm:text-base text-[#141843] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="login-btn bg-wonderblue" disabled={isLoggingIn}> {isLoggingIn ? "Logging in..." : "Login"}</button>

            <div className="divider">Or Login With</div>

            <div className="social-buttons">
              <div className="social-btn" onClick={handleGoogleLogin}>
                <img className="social-icon" src={googleIcon} alt="Google" />
              </div>
              <div className="social-btn">
                <img className='social-icon' src={facebookIcon} alt="Facebook" />
              </div>
              <div className="social-btn">
                <img className='social-icon' src={appleIcon} alt="Apple" />
              </div>
            </div>

            <div className="signup-link">
              Don’t have an account? <Link to="/role">Create New Account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
