import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const VerifyEmailOrMobile = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60); // 60 seconds countdown
    const [showTimer, setShowTimer] = useState(true);
    const inputsRef = [useRef(null), useRef(null), useRef(null), useRef(null)];

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
                toast.success(response.data.message || "OTP verified successfully!" , { position: "top-right", });
                localStorage.removeItem('isCreatedNew');
                localStorage.removeItem('selectedRole');
                localStorage.removeItem('signupEmail');
            }
            if (response.status === 400) {
                toast.error(response.data.message || "Invalid OTP" , { position: "top-right", });
                setError(response.data.message );
            }
        } catch (error) {
            console.error("OTP verification failed:", error);
            toast.error(error.response?.data?.message || "OTP verification failed. Please try again." , { position: "top-right", });
            setError('OTP verification failed. Please try again.');
        }
    };


    const handleResendOtp = async () =>{
        try {
            const email = localStorage.getItem('signupEmail');
            const response = await axios.post('/user/resend-otp', { email });
            if (response.status === 200) {
                setOtp(['', '', '', '']);
                setTimer(60);
                setShowTimer(true);
                toast.success(response.data.message || "OTP resent successfully!" , { position: "top-right", });
            }
        } catch (error) {
            console.error("Resending OTP failed:", error);
            toast.error(error.response?.data?.message || "Failed to resend OTP. Please try again." , { position: "top-right" });
            setError('Failed to resend OTP. Please try again.');
        }
    }



    useEffect(()=>{
        const email = localStorage.getItem('signupEmail');
        const isCreatedNew = localStorage.getItem('isCreatedNew');
        if (!email || !isCreatedNew) {
            navigate('/signup');
        }
    },[])

    return (
        <div className="login-container">

            <div className="login-card h-90vh">
                <div className="login-card-left">
                    <div className="branding">
                        <h2>InfluSage</h2>
                        <p>Verify Your Email or Mobile</p>
                    </div>
                </div>
                <div className="login-card-right">



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
                            <span className='text-sm text-[#6b7280]'>Didn’t Get OTP?</span>
                            {timer === 0 ? (
                                <span
                                className='text-sm text-[#2563eb] cursor-pointer'
                                onClick={handleResendOtp}
                                >
                                Resend OTP
                                </span>
                            ) : (
                                <span className="text-sm text-[#6b7280]">
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