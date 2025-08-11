'use client';

import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { createContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [subscription, setSubscription] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        const token = getCookie('token');
        const fetchUser = async () => {
            if (token) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profile`, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUser(data?.data?.user || {});
                        setSubscription(data?.data?.subscription || {});
                    } else {
                        console.error('Failed to fetch user data');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
                finally {
                    setIsLoading(false);
                }
            }
            else {
                setIsLoading(false);
            }
        };
        fetchUser();


    }, []);

    const handleLogout = ({ redirectLogin = false }) => {
        setUser({});
        setSubscription({});
        deleteCookie('token');
        toast.success('Logout successful');
        if (redirectLogin) {
            router.push('/login');
        }
    };

    const data = { user, subscription, setSubscription, setUser, loading: isLoading, handleLogout };
    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;