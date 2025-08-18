import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';

import axios from 'axios';
import toast from 'react-hot-toast';


export const ResetPassword = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            console.log("Resetting password with data:", data);
            console.log("Token from URL:", token);
            const response = await axios.post('/user/reset-password', { password: data.password, token });
            if (response.status === 200) {
                toast.success(response.data.message || "Password reset successful!");
navigate('/login');
            }
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong!");
        }
    }

    const validationSchema = {
        passwordValidator: {
            required: {
                value: true,
                message: "Password is required"
            },
            // pattern: {
            //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
            //   message: "Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char"
            // }
        },
        confirmPasswordValidator: {
            validate: (value) => {
                if (value !== watch('password')) {
                    return "Passwords do not match";
                }
                return true;
            }
        }
    }

    return (
        <div className='login-container'>
            <div className="login-card h-90vh">
                <div className="login-card-left">
                    <div className="branding">
                        <h2>InfluSage</h2>
                        <p>Reset Your Password</p>
                    </div>
                </div>

                <div className="login-card-right">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h2>Reset Password</h2>
                        <p>Please enter your new password.</p>


                        <div className="relative">
                            <label>New Password
                                <span className='text-red-500 text-sm'>*</span>
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter New Password"
                                {...register("password", validationSchema.passwordValidator)}
                            />

                            <span className="eye-icon" onClick={() => setShowPassword(prev => !prev)}>
                                {showPassword ? <RiEyeOffLine className='w-[18px]' /> : <RiEyeLine className='w-[18px]' />}
                            </span>
                        </div>
                        <span className='text-for-error'>{errors.password?.message}</span>



                        <div className="relative">
                            <label>Confirm Password
                                <span className='text-red-500 text-sm'>*</span>
                            </label>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm New Password"
                                {...register("confirmPassword", validationSchema.confirmPasswordValidator)}
                            />
                            <span className="eye-icon" onClick={() => setShowConfirmPassword(prev => !prev)}>
                                {showConfirmPassword ? <RiEyeOffLine className='w-[18px]' /> : <RiEyeLine className='w-[18px]' />}
                            </span>
                        </div>
                        <span className='text-for-error'>{errors.confirmPassword?.message}</span>

                        <button type="submit" className="login-btn mt-5">Reset Password</button>

                        <p className="signup-link" style={{ marginTop: '20px' }}>
                            Back To
                            <Link to="/login" className="forgot-password-link" style={{ fontWeight: 'bold', cursor: 'pointer' }}> Login </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

