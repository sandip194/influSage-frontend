import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async(data) => {
    try {
      const response = await axios.post('/user/forgot-password', { email: data.email });
      if (response.status === 200) {
        toast.success(response.data.message || "Reset link sent to your email!");
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong!");
    }
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
    }
  }

  return (
    <div className="login-container">
      <div className="login-card h-90vh">
        <div className="login-card-left">
          <div className="branding">
            <h2>InfluSage</h2>
            <p>Forget Your Password?
              <br /> Enter your email to reset it.</p>
          </div>
        </div>

        <div className="login-card-right">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Forgot Password</h2>
            <p>Please enter your email to reset your password.</p>

            <label>Email
              <span className='text-red-500 text-sm'>*</span>
            </label>
            <input type="text" placeholder="Enter Your Email" 
            {...register("email", validationSchema.emailValidator)}/>
            <span className='text-for-error'>{errors.email?.message}</span>

            <button type="submit" className="login-btn">Send Reset Link</button>

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
