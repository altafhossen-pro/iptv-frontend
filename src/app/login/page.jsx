'use client';

import Header from '@/components/Header/Header';
import { AuthContext } from '@/provider/AuthProvider';
import { setCookie } from 'cookies-next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import toast from 'react-hot-toast';

const page = () => {
    const router = useRouter();
    const { setUser } = useContext(AuthContext);
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const identifier = e.target.identifier.value;
            const password = e.target.password.value;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password }),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('Login successful');
                setUser(data?.data?.user); // Assuming the API returns user data
                setCookie('token', data?.data?.token, {
                    maxAge: 60 * 60 * 24 * 365,
                    path: '/',
                });
                router.push('/');
            } else {
                const errorData = await response.json();
                toast.error(errorData?.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    }

    return (
        <div className='min-h-screen bg-gray-900 text-white'>
            <Header />
            {/* login page form here */}
            <h1 className='text-center text-4xl font-bold mt-10'>Login Page</h1>
            <form onSubmit={handleLogin} className='max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-lg'>
                <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2' htmlFor='identifier'>Email / SID</label>
                    <input
                        type='text'
                        id='identifier'
                        name='identifier'
                        className='w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Enter your email or SID'
                    />


                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2' htmlFor='password'>Password</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        className='w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Enter your password'
                    />
                </div>
                <button
                    type='submit'
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                    Login
                </button>
            </form>
            <div className='text-center mt-4'>
                <p className='text-sm text-gray-400'>
                    Don't have an account? <Link href='/register' className='text-blue-500 hover:underline'>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default page;