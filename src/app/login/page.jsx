'use client';

import Header from '@/components/Header/Header';
import { AuthContext } from '@/provider/AuthProvider';
import { setCookie } from 'cookies-next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import SocialLogin from '@/components/Auth/SocialLogin';

const LoginPage = () => {
    const router = useRouter();
    const { setUser, setSubscription } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!formData.identifier || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier: formData.identifier,
                    password: formData.password
                }),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('Login successful!');
                setUser(data?.data?.user);
                setSubscription(data?.data?.subscription || {});
                setCookie('token', data?.data?.token, {
                    maxAge: 60 * 60 * 24 * 365,
                    path: '/',
                });
                router.push('/');
            } else {
                const errorData = await response.json();
                toast.error(errorData?.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };



    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='min-h-screen bg-gray-900 text-white'>
            <Header />

            <div className='flex items-center justify-center min-h-[calc(100vh-80px)] px-4'>
                <div className='w-full max-w-md'>
                    {/* Header */}
                    <div className='text-center my-6'>
                        <h1 className='text-3xl font-bold mb-2'>Welcome Back</h1>
                        <p className='text-gray-400'>Sign in to your IPTV account</p>
                    </div>

                    {/* Login Form */}
                    <div className='bg-gray-800 rounded-lg border border-gray-700 p-6'>
                        <form onSubmit={handleLogin} className='space-y-4'>
                            {/* Email/SID Field */}
                            <div>
                                <label className='block text-sm font-medium mb-2 text-gray-300' htmlFor='identifier'>
                                    Email / SID
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Mail className='h-4 w-4 text-gray-400' />
                                    </div>
                                    <input
                                        type='text'
                                        id='identifier'
                                        name='identifier'
                                        value={formData.identifier}
                                        onChange={(e) => handleInputChange('identifier', e.target.value)}
                                        className='w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400'
                                        placeholder='Enter your email or SID'
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className='block text-sm font-medium mb-2 text-gray-300' htmlFor='password'>
                                    Password
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Lock className='h-4 w-4 text-gray-400' />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id='password'
                                        name='password'
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className='w-full pl-10 pr-12 py-2.5 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400'
                                        placeholder='Enter your password'
                                        autoComplete='new-password'
                                        autoCorrect='off'
                                        autoCapitalize='off'
                                        spellCheck='false'
                                        required
                                    />
                                    <button
                                        type='button'
                                        onClick={togglePasswordVisibility}
                                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300'
                                    >
                                        {showPassword ? (
                                            <EyeOff className='h-4 w-4' />
                                        ) : (
                                            <Eye className='h-4 w-4' />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password Link */}
                            <div className='text-right'>
                                <Link
                                    href='/forgot-password'
                                    className='text-sm text-purple-400 hover:text-purple-300'
                                >
                                    Forgot your password?
                                </Link>
                            </div>

                            {/* Login Button */}
                            <button
                                type='submit'
                                disabled={loading || !formData.identifier || !formData.password}
                                className='w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors'
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className='text-center mt-6'>
                            <p className='text-gray-400 text-sm'>
                                Don't have an account?{' '}
                                <Link
                                    href='/register'
                                    className='text-purple-400 hover:text-purple-300 font-medium'
                                >
                                    Please Register
                                </Link>
                            </p>
                        </div>

                        {/* Social Login */}
                        <SocialLogin type="login" />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;