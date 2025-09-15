import React, { useState, useCallback, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';
import axios from 'axios';
import { toast } from 'react-toastify';

import '../../assets/login.css';

// ✅ Lazy load SideImageSlider for performance
const SideImageSlider = React.lazy(() => import('../../components/common/SideImageSlider'));

export const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = useCallback(async (data) => {
    const role = localStorage.getItem('selectedRole');
    if (!role) {
      toast.error('Please select a role first!', { position: "top-right" });
      return navigate('/role');
    }

    const userData = { ...data, roleId: Number(role) };
    localStorage.setItem('signupEmail', data.email);

    try {
      setLoading(true);
      const response = await axios.post('/user/register', userData);

      if (response.status === 200) {
        localStorage.setItem('isCreatedNew', response.data.message);
        toast.success('Signup successful! Please verify your email or mobile.');
        navigate('/verify-email-or-mobile');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="login-card h-90vh">
        <Suspense fallback={<div className="loader">Loading...</div>}>
          <SideImageSlider />
        </Suspense>

        <div className="login-card-right">
          <form onSubmit={handleSubmit(submitHandler)}>
            <h2>Create Account</h2>
            <p>Start your journey with InfluSage today!</p>

            {/* First Name */}
            <label>First Name<span className="text-red-500 text-sm">*</span></label>
            <input
              type="text"
              placeholder="Enter first name"
              {...register('firstName', { required: "First name is required" })}
            />
            <span className="text-for-error">{errors.firstName?.message}</span>

            {/* Last Name */}
            <label>Last Name<span className="text-red-500 text-sm">*</span></label>
            <input
              type="text"
              placeholder="Enter last name"
              {...register('lastName', { required: "Last name is required" })}
            />
            <span className="text-for-error">{errors.lastName?.message}</span>

            {/* Email */}
            <label>Email<span className="text-red-500 text-sm">*</span></label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register('email', {
                required: "Email is required",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Invalid email format"
                }
              })}
            />
            <span className="text-for-error">{errors.email?.message}</span>

            {/* Password */}
            <label>Password<span className="text-red-500 text-sm">*</span></label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                {...register('password', {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                    message: "Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char"
                  }
                })}
              />
              <span className="eye-icon" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <RiEyeOffLine className="w-[18px]" /> : <RiEyeLine className="w-[18px]" />}
              </span>
            </div>
            <span className="text-for-error">{errors.password?.message}</span>

            {/* Terms */}
            <div className="mt-2 mb-2 text-sm">
              <div className='text-sm flex  items-center gap-2'>
                <input
                  className="h-5 w-5"
                  type="checkbox"
                  {...register("terms", {
                    required: "Please accept terms & conditions",
                  })}
                />
                &nbsp;I agree to&nbsp;
                <span
                  style={{ color: "#0066cc", cursor: "pointer" }}
                  onClick={() => setShowModal(true)}
                >
                  Terms & Conditions
                </span>
              </div>

              <span className="text-red-500 text-xs">{errors.terms?.message}</span>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <div className="signup-link">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Terms and Conditions</h3>
            <p className="modal-text">
              {/* Replace with real T&C */}
              By using this platform, you agree to comply with our policies and guidelines.
              <br /><br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse facilisis nulla in orci porttitor, at placerat risus dapibus...
            </p>
            <button className="modal-close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
