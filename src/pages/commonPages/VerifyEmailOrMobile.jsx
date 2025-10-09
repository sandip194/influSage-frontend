import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import SideImageSlider from '../../components/common/SideImageSlider';

export const VerifyEmailOrMobile = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60); // 60 seconds countdown
    const [showTimer, setShowTimer] = useState(true);
    const inputsRef = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (e, idx) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[idx] = value;
        setOtp(newOtp);
        setError('');

        if (value && idx < 3) {
            inputsRef[idx + 1].current.focus();
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
            inputsRef[idx - 1].current.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (timer === 0) {
            setError('OTP expired. Please resend OTP.');
            return;
        }
        if (otp.some(digit => digit === '')) {
            setError('Please enter the complete OTP.');
            return;
        }
        setError('');
        const otpValue = otp.join('');
        const email = localStorage.getItem('signupEmail');
        try {
            const response = await axios.post('/user/verify-otp', { email, otp: otpValue });
            if (response.status === 200) {
                setShowTimer(false)
                toast.success(response.data.message || "OTP verified successfully!", { position: "top-right" });
                localStorage.removeItem('isCreatedNew');
                localStorage.removeItem('selectedRole');
                localStorage.removeItem('signupEmail');
                navigate("/login")
            }
            if (response.status === 400) {
                toast.error(response.data.message || "Invalid OTP", { position: "top-right" });
                setError(response.data.message);
            }
        } catch (error) {
            console.error("OTP verification failed:", error);
            toast.error(error.response?.data?.message || "OTP verification failed. Please try again.", { position: "top-right" });
            setError('OTP verification failed. Please try again.');
        }
    };

    const handleResendOtp = async () => {
        if (isResending) return;  // prevent double clicks if somehow triggered multiple times

        setIsResending(true);

        try {
            const email = localStorage.getItem('signupEmail');
            const response = await axios.post('/user/resend-otp', { email });
            if (response.status === 200) {
                setOtp(['', '', '', '']);
                setTimer(60);
                setShowTimer(true);
                toast.success(response.data.message || "OTP resent successfully!");
            }
        } catch (error) {
            console.error("Resending OTP failed:", error);
            toast.error(error.response?.data?.message || "Failed to resend OTP. Please try again.");
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setIsResending(false);

        }
    };


    useEffect(() => {
        const email = localStorage.getItem('signupEmail');
        const isCreatedNew = localStorage.getItem('isCreatedNew');
        if (!email || !isCreatedNew) {
            navigate('/signup');
        }
    }, [])

    return (
        <div className="login-container">
            <SideImageSlider />
            <div className="relative z-20 login-card">

                <div className="login-card-right">

                    <div className="mb-2 ">
                        <img src="/influSage-logo.png" alt="Logo" className="h-8 w-auto" />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <h2>Verification Required</h2>
                        <p>Please verify your email or mobile number to continue.</p>
                        <div className="flex gap-5 justify-center mb-4">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={inputsRef[idx]}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleChange(e, idx)}
                                    onKeyDown={e => handleKeyDown(e, idx)}
                                    className="otp-input p-0 w-10 h-10 text-center border rounded"
                                    autoFocus={idx === 0}
                                />
                            ))}
                        </div>
                        <div className="resend-box flex justify-between items-center ">
                            <span className='text-sm text-gray-900'>Didn’t Get OTP?</span>
                            {timer === 0 ? (
                                <span
                                    className={`text-sm cursor-pointer ${isResending ? 'text-gray-900 cursor-not-allowed' : 'text-[#2563eb]'}`}
                                    onClick={isResending ? undefined : handleResendOtp}
                                >
                                    {isResending ? 'Resending...' : 'Resend OTP'}
                                </span>
                            ) : (
                                <span className="text-sm text-gray-900">
                                    OTP Expires In : <b>{timer}s</b>
                                </span>
                            )}

                        </div>
                        {error && <span className="text-for-error">{error}</span>}
                        {/* {showTimer && <span>OTP Expires In : <b>{timer}s</b></span>} */}
                        <button type='submit' className="login-btn" disabled={timer === 0}>Verify OTP</button>
                    </form>
                    <p className="signup-link" style={{ marginTop: '20px' }}>
                        Back to <span onClick={() => navigate('/login')} style={{ fontWeight: 'bold', cursor: 'pointer' }}>Login</span>
                    </p>
                </div>
            </div>
        </div >
    )
}