'use client';

import React, { useContext, useState } from 'react';
import { Mail, ArrowRight, Shield, CheckCircle, User, Phone, Lock, ArrowLeft } from 'lucide-react';
import SocialLogin from '@/components/Auth/SocialLogin';
import Header from '@/components/Header/Header';
import toast from 'react-hot-toast';
import { AuthContext } from '@/provider/AuthProvider';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ThreeStepRegister = () => {
    const router = useRouter();
    const { user, setUser ,setSubscription} = useContext(AuthContext);
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        name: '',
        phone: '',
        termsAccepted: false,
        password: '',
        confirmPassword: ''
    });
    const [otpSent, setOtpSent] = useState(false);



    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (formData.email) {
                const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/otp/send-otp`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: formData.email })
                })
                if (response.ok) {
                    setOtpSent(true);
                    toast.success('OTP sent successfully!');
                    setCurrentStep(2);
                    // Optionally, you can show a success message or handle the response
                    console.log('OTP sent successfully');
                } else {
                    // Handle error case
                    console.error('Failed to send OTP');
                }
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error('Failed to send OTP. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/otp/verify-otp`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: formData.email, otp: formData.otp })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    toast.success('OTP verified successfully!');
                    setCurrentStep(3);
                } else {
                    toast.error('Invalid OTP. Please try again.');
                }
            } else {
                toast.error('Failed to verify OTP. Please check your email and try again.');
                console.log('Failed to verify OTP:', response.statusText);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);


        }
        finally {
            setLoading(false);
        }

    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.name && formData.phone && formData.password && formData.password === formData.confirmPassword) {
                setLoading(true);
                const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/register`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        name: formData.name,
                        phone: formData.phone,
                        password: formData.password
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    toast.success('Registration successful!');
                    setUser(data?.data?.user); 
                    setSubscription(data?.data?.subscription || {});
                    setCookie('token', data?.data?.token, {
                        maxAge: 60 * 60 * 24 * 365,
                        path: '/',
                    });
                    router.push('/');
                } else {
                    const errorData = await response.json();
                    toast.error(`Registration failed: ${errorData.message || 'Please try again.'}`);
                }
            }
        } catch (error) {
            console.error('Error during registration:', error);
            toast.error('Registration failed. Please try again.');
        }
    };

    const nextStep = () => {
        if (currentStep === 1 && otpSent) {
            setCurrentStep(2);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const StepIndicator = ({ step, isActive, isCompleted }) => (
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${isCompleted ? 'bg-green-500 border-green-500' :
            isActive ? 'bg-blue-600 border-blue-600' : 'border-gray-600'
            }`}>
            {isCompleted ? (
                <CheckCircle className="w-4 h-4 text-white" />
            ) : (
                <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {step}
                </span>
            )}
        </div>
    );

    return (
        <div className='min-h-screen bg-gray-900 text-white '>
            <Header />
            <div className='flex items-center justify-center p-4'>
                <div className='w-full max-w-md'>
                    {/* Header */}
                    <div className='text-center mb-6'>
                        <h1 className='text-3xl font-bold mb-2'>Create Account</h1>
                        <p className='text-gray-400'>Join us in just 3 simple steps</p>
                    </div>

                    {/* Step Indicator */}
                    <div className='flex items-center justify-center mb-6'>
                        <StepIndicator step={1} isActive={currentStep === 1} isCompleted={currentStep > 1} />
                        <div className={`w-12 h-0.5 mx-2 ${currentStep > 1 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                        <StepIndicator step={2} isActive={currentStep === 2} isCompleted={currentStep > 2} />
                        <div className={`w-12 h-0.5 mx-2 ${currentStep > 2 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                        <StepIndicator step={3} isActive={currentStep === 3} isCompleted={false} />
                    </div>

                    {/* Form Container */}
                    <div className='bg-gray-800 rounded-lg border border-gray-700 p-6'>
                        {/* Step 1: Email */}
                        {currentStep === 1 && (
                            <div>
                                <div className='flex items-center mb-6'>
                                    <Mail className='w-6 h-6 text-blue-500 mr-2' />
                                    <h2 className='text-xl font-semibold'>Enter Your Email</h2>
                                </div>

                                <div>
                                    <div className='mb-6'>
                                        <label className='block text-sm font-medium mb-2' htmlFor='email'>
                                            Email Address
                                        </label>
                                        <input
                                            type='email'
                                            id='email'
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className='w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                            placeholder='Enter your email address'
                                            required
                                        />
                                    </div>
                                    {
                                        loading ? <button
                                            disabled={true}
                                            className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center cursor-not-allowed'
                                        >
                                            Sending...
                                        </button> : <button
                                            onClick={handleSendOTP}
                                            disabled={!formData.email}
                                            className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center'
                                        >
                                            Send OTP <ArrowRight className='w-4 h-4 ml-2' />
                                        </button>
                                    }

                                </div>
                            </div>
                        )}

                        {/* Step 2: Verify OTP */}
                        {currentStep === 2 && (
                            <div>
                                <div className='flex items-center mb-6'>
                                    <Shield className='w-6 h-6 text-green-500 mr-2' />
                                    <h2 className='text-xl font-semibold'>Verify OTP</h2>
                                </div>

                                <div>
                                    <div className='mb-4'>
                                        <p className='text-sm text-gray-400 mb-4'>
                                            We've sent a verification code to <span className='text-blue-400'>{formData.email}</span>
                                        </p>
                                        <label className='block text-sm font-medium mb-2' htmlFor='otp'>
                                            Verification Code
                                        </label>
                                        <input
                                            type='text'
                                            id='otp'
                                            value={formData.otp}
                                            onChange={(e) => handleInputChange('otp', e.target.value)}
                                            className='w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest'
                                            placeholder='Enter 6-digit code'
                                            maxLength='6'
                                            required
                                        />
                                    </div>

                                    <div className='flex space-x-3'>
                                        <button
                                            onClick={prevStep}
                                            className='flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center'
                                        >
                                            <ArrowLeft className='w-4 h-4 mr-2' /> Back
                                        </button>
                                        {
                                            loading ? <button
                                                disabled={true}
                                                className='flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center cursor-not-allowed'
                                            >
                                                Loading...
                                            </button> : <button
                                                onClick={handleVerifyOTP}
                                                disabled={!formData.otp || formData.otp.length !== 6}
                                                className='flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center'
                                            >
                                                Verify <ArrowRight className='w-4 h-4 ml-2' />
                                            </button>
                                        }

                                    </div>
                                    <div>
                                        {otpSent && (
                                            <p className='text-sm text-gray-400 mt-2'>
                                                If you didn't receive the code, please check your <Link className='text-yellow-500' target='_blank' href={`https://mail.google.com/mail/#spam`}>spam folder</Link> or{' '}
                                                <button
                                                    onClick={() => setOtpSent(false)}
                                                    className='text-blue-400 hover:underline cursor-pointer'
                                                >
                                                    try again
                                                </button>.
                                            </p>
                                        )}
                                    </div>
                                    <div className='text-center mt-4'>
                                        <button
                                            onClick={() => setOtpSent(false)}
                                            className='text-blue-400 hover:underline text-sm'
                                        >
                                            Didn't receive code? Resend
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Complete Registration */}
                        {currentStep === 3 && (
                            <div>
                                <div className='flex items-center mb-6'>
                                    <User className='w-6 h-6 text-purple-500 mr-2' />
                                    <h2 className='text-xl font-semibold'>Complete Your Profile</h2>
                                </div>

                                <div>
                                    <div className='mb-4'>
                                        <label className='block text-sm font-medium mb-2' htmlFor='name'>
                                            Full Name
                                        </label>
                                        <input
                                            type='text'
                                            id='name'
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className='w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                            placeholder='Enter your full name'
                                            required
                                        />
                                    </div>

                                    <div className='mb-4'>
                                        <label className='block text-sm font-medium mb-2' htmlFor='phone'>
                                            Phone Number
                                        </label>
                                        <input
                                            type='tel'
                                            id='phone'
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className='w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                            placeholder='Enter your phone number'
                                            required
                                        />
                                    </div>

                                    <div className='mb-4'>
                                        <label className='block text-sm font-medium mb-2' htmlFor='password'>
                                            Password
                                        </label>
                                        <input
                                            type='password'
                                            id='password'
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            className='w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                            placeholder='Create a strong password'
                                            required
                                        />
                                    </div>

                                    <div className='mb-6'>
                                        <label className='block text-sm font-medium mb-2' htmlFor='confirmPassword'>
                                            Confirm Password
                                        </label>
                                        <input
                                            type='password'
                                            id='confirmPassword'
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                            className='w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                            placeholder='Confirm your password'
                                            required
                                        />
                                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                            <p className='text-red-400 text-sm mt-1'>Passwords do not match</p>
                                        )}
                                    </div>

                                    {/* add terms and condition text for signup  */}
                                    <div className='my-6'>
                                        <label className='inline-flex items-center text-sm text-gray-400'>
                                            <input
                                                type='checkbox'
                                                required
                                                onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                                                className='form-checkbox h-5 w-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 cursor-pointer'
                                            />
                                            <span className='ml-3 cursor-pointer select-none'>
                                                I agree to the <Link href={`/terms-and-condition`} className="text-purple-400 hover:underline cursor-pointer">Terms and Conditions</Link> and <Link href={`/privacy-policy`} className="text-purple-400 hover:underline cursor-pointer">Privacy Policy</Link>
                                            </span>
                                        </label>
                                    </div>

                                    <div className='flex space-x-3'>
                                        <button
                                            onClick={prevStep}
                                            className='flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center'
                                        >
                                            <ArrowLeft className='w-4 h-4 mr-2' /> Back
                                        </button>
                                        <button
                                            onClick={handleFinalSubmit}
                                            disabled={
                                                !formData.name ||
                                                !formData.phone ||
                                                !formData.password ||
                                                formData.password !== formData.confirmPassword ||
                                                !formData.termsAccepted // ✅ Terms must be accepted
                                            }
                                            className='flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center'
                                        >
                                            <Lock className='w-4 h-4 mr-2' /> Create Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className='text-center mt-4'>
                        <p className='text-sm text-gray-400'>
                            Already have an account?{' '}
                            <Link href='/login' className='text-purple-400 hover:text-purple-300 font-medium'>
                                Sign In
                            </Link>
                        </p>
                    </div>

                    {/* Social Login */}
                    <SocialLogin type="signup" />
                </div>
            </div>
        </div>

    );
};

export default ThreeStepRegister;