'use client';

import Header from '@/components/Header/Header';
import { AuthContext } from '@/provider/AuthProvider';
import React, { useContext } from 'react';
import { User, Mail, Phone, Calendar, Shield, Crown, Clock, CheckCircle } from 'lucide-react';
import SubscriptionUpgrade from '@/components/Subscription/SubscriptionUpgrade/SubscriptionUpgrade';
import { useRouter } from 'next/navigation';

const page = () => {
    const { user, setUser, subscription, loading } = useContext(AuthContext);
    const router = useRouter();
    // Use actual user data or fallback to mock data
    const userData = user || {};

    const subscriptionData = subscription || {};

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            active: 'bg-green-500',
            inactive: 'bg-red-500',
            suspended: 'bg-yellow-500'
        };
        return statusColors[status] || 'bg-gray-500';
    };

    const getSubscriptionBadge = (type) => {
        const typeColors = {
            free: 'bg-blue-500',
            premium: 'bg-purple-500',
            vip: 'bg-gold-500'
        };
        return typeColors[type] || 'bg-gray-500';
    };
    if (!userData || Object.keys(userData).length === 0 && !loading) {
        return (
            <div className='min-h-screen bg-gray-900 text-white'>
                <Header />
                <div>
                    <div className="flex items-center justify-center h-[calc(100vh-74px)]">
                        <div className="text-center">
                            <p className="text-xl">Please log in to access your profile.</p>
                            <div className="mt-6 flex justify-center flex-wrap gap-4">
                                <button
                                    onClick={() => router.push('/')}
                                    className="ml-4 px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors cursor-pointer"
                                >
                                    Back to Home
                                </button>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                                >
                                    Go to Login
                                </button>

                            </div>
                        </div>


                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-900 text-white'>
            <Header />

            {
                loading ? (
                    <div className="flex items-center justify-center h-screen">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                    </div>
                ) : <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-2xl">
                        <div className="flex items-center space-x-6 flex-wrap">
                            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center border-4 border-white/20">
                                {userData.avatar ? (
                                    <img src={userData.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User size={40} className="text-gray-300" />
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h1 className="text-3xl font-bold">{userData.name}</h1>
                                    <div className='flex items-center gap-2 justify-end flex-wrap'>
                                        {userData.is_admin && (
                                            <div className="flex items-center space-x-1 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                                                <Crown size={16} />
                                                <span>Admin</span>
                                            </div>
                                        )}
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(userData.status)}`}>
                                            <span className="capitalize">{userData.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-blue-100 text-lg">SID: {userData.sid}</p>
                                <p className="text-blue-200">Member since {formatDate(userData.created_at)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Personal Information */}
                        <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
                            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                                <User className="text-blue-400" size={24} />
                                <span>Personal Information</span>
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                                    <Mail className="text-blue-400" size={20} />
                                    <div>
                                        <p className="text-gray-400 text-sm">Email Address</p>
                                        <p className="font-medium">{userData.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                                    <Phone className="text-green-400" size={20} />
                                    <div>
                                        <p className="text-gray-400 text-sm">Phone Number</p>
                                        <p className="font-medium">{userData.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                                    <Shield className="text-purple-400" size={20} />
                                    <div>
                                        <p className="text-gray-400 text-sm">Role</p>
                                        <p className="font-medium capitalize">{userData.role}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                                    <Clock className="text-yellow-400" size={20} />
                                    <div>
                                        <p className="text-gray-400 text-sm">Last Login</p>
                                        <p className="font-medium">{formatDateTime(userData.last_login)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subscription Information */}
                        <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
                            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                                <CheckCircle className="text-green-400" size={24} />
                                <span>Subscription Details</span>
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30">
                                    <div>
                                        <p className="text-gray-400 text-sm">Current Plan</p>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xl font-bold capitalize">{subscriptionData?.subscription_type}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionBadge(subscriptionData?.subscription_type)}`}>
                                                {subscriptionData?.subscription_type?.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                                    <Calendar className="text-blue-400" size={20} />
                                    <div>
                                        <p className="text-gray-400 text-sm">Start Date</p>
                                        <p className="font-medium">{formatDate(subscriptionData.start_date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                                    <Calendar className="text-red-400" size={20} />
                                    <div>
                                        <p className="text-gray-400 text-sm">End Date</p>
                                        <p className="font-medium">{subscriptionData.end_date ? formatDate(subscriptionData.end_date) : 'No expiry'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                                    <div>
                                        <p className="text-gray-400 text-sm">Auto Renewal</p>
                                        <p className={`font-medium ${subscriptionData.auto_renewal ? 'text-green-400' : 'text-red-400'}`}>
                                            {subscriptionData.auto_renewal ? 'Enabled' : 'Disabled'}
                                        </p>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${subscriptionData.auto_renewal ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                                    <div>
                                        <p className="text-gray-400 text-sm">Status</p>
                                        <p className={`font-medium ${subscriptionData.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                                            {subscriptionData?.status?.charAt(0).toUpperCase() + subscriptionData?.status?.slice(1)}
                                        </p>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${getStatusBadge(subscriptionData?.status)}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <SubscriptionUpgrade />


                    {/* Account Statistics */}
                    <div className="mt-8 bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
                        <h2 className="text-2xl font-bold mb-6">Account Overview</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 text-center">
                                <div className="text-3xl font-bold mb-1">
                                    {userData.created_at ? Math.floor((new Date() - new Date(userData.created_at)) / (1000 * 60 * 60 * 24)) || 0 : 0}
                                </div>
                                <div className="text-blue-100 text-sm">Days Active</div>
                            </div>

                            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-4 text-center">
                                <div className="text-3xl font-bold mb-1">{subscriptionData.subscription_type === 'free' ? 'Free' : 'Premium'}</div>
                                <div className="text-green-100 text-sm">Plan Type</div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-4 text-center">
                                <div className="text-3xl font-bold mb-1">{userData.is_admin ? 'Admin' : 'User'}</div>
                                <div className="text-purple-100 text-sm">Access Level</div>
                            </div>
                        </div>
                    </div>
                </div>
            }


        </div>
    );
};

export default page;