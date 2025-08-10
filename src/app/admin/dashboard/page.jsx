'use client';

import React, { useState, useEffect } from 'react';
import {
    Users,
    Tv,
    FolderOpen,
    CreditCard,
    DollarSign,
    UserCheck,
    UserX,
    TrendingUp,
    Clock,
    AlertCircle,
    CheckCircle,
    Eye,
    Activity
} from 'lucide-react';
import { getCookie } from 'cookies-next';

const AdminDashboard = () => {
    const [stats, setStats] = useState({});

    const [isLoading, setIsLoading] = useState(true);

    // Simulate API call to fetch dashboard stats
    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/get-dashboard`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${getCookie('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard stats');
                }
                const data = await response.json();
                setStats(data?.data) || {};


            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, prefix = '', suffix = '', trend = null }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 lg:p-3 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                {trend && (
                    <div className={`flex items-center text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendingUp className={`w-4 h-4 mr-1 ${trend.positive ? '' : 'rotate-180'}`} />
                        <span>{trend.value}%</span>
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {isLoading ? (
                        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                        `${prefix}${typeof value === 'number' ? value.toLocaleString() : value}${suffix}`
                    )}
                </div>
                <p className="text-sm lg:text-base text-gray-600 font-medium">{title}</p>
            </div>
        </div>
    );

    const statsData = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'bg-blue-500',
            trend: { positive: true, value: 12.5 }
        },
        {
            title: 'Active Users',
            value: stats.totalActiveUsers,
            icon: UserCheck,
            color: 'bg-green-500',
            trend: { positive: true, value: 8.2 }
        },
        {
            title: 'Inactive Users',
            value: stats?.totalInactiveUsers,
            icon: UserX,
            color: 'bg-red-500',
            trend: { positive: false, value: 3.1 }
        },
        {
            title: 'Total Channels',
            value: stats.totalChannels,
            icon: Tv,
            color: 'bg-purple-500',
            trend: { positive: true, value: 5.7 }
        },
        {
            title: 'Categories',
            value: stats.totalCategories,
            icon: FolderOpen,
            color: 'bg-orange-500',
        },
        {
            title: 'Premium Users',
            value: stats.totalPremiumSubscriptions,
            icon: CheckCircle,
            color: 'bg-yellow-500',
            trend: { positive: true, value: 15.3 }
        },
        {
            title: 'Total Subscriptions',
            value: stats.totalSubscriptions,
            icon: UserCheck,
            color: 'bg-indigo-500',
            trend: { positive: true, value: 9.8 }
        },
        {
            title: 'Total Payments',
            value: stats.totalPayments,
            icon: DollarSign,
            color: 'bg-blue-600',
            prefix: '',
            trend: { positive: true, value: 18.4 }
        },
        {
            title: 'Total Completed Payments',
            value: stats.totalCompletedPayments,
            icon: DollarSign,
            color: 'bg-teal-600',
            prefix: '',
            trend: { positive: false, value: 5.2 }
        },
        {
            title: 'Total Manual Payments',
            value: stats.totalManualPayments,
            icon: CreditCard,
            color: 'bg-cyan-500',
            prefix: '',
        }
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your IPTV platform.</p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Last updated: {new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-4 lg:p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                            <div className="text-2xl lg:text-3xl font-bold">
                                {isLoading ? (
                                    <div className="h-8 bg-blue-400 rounded animate-pulse"></div>
                                ) : (
                                    `${stats.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'} TK`
                                )}
                            </div>
                        </div>
                        <DollarSign className="w-8 h-8 text-blue-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm p-4 lg:p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Active Rate</p>
                            <div className="text-2xl lg:text-3xl font-bold">
                                {isLoading ? (
                                    <div className="h-8 bg-green-400 rounded animate-pulse"></div>
                                ) : (
                                    `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}%`
                                )}
                            </div>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-sm p-4 lg:p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Avg. Channels/User</p>
                            <div className="text-2xl lg:text-3xl font-bold">
                                {isLoading ? (
                                    <div className="h-8 bg-purple-400 rounded animate-pulse"></div>
                                ) : (
                                    Math.round(stats.totalChannels / stats.totalUsers * 100)
                                )}
                            </div>
                        </div>
                        <Tv className="w-8 h-8 text-purple-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-sm p-4 lg:p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Premium Rate</p>
                            <div className="text-2xl lg:text-3xl font-bold">
                                {isLoading ? (
                                    <div className="h-8 bg-orange-400 rounded animate-pulse"></div>
                                ) : (
                                    `${Math.round((stats.premiumUsers / stats.totalUsers) * 100)}%`
                                )}
                            </div>
                        </div>
                        <CheckCircle className="w-8 h-8 text-orange-200" />
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {statsData.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>


        </div>
    );
};

export default AdminDashboard;