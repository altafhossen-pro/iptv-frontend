'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Users,
    Tv,
    FolderOpen,
    CreditCard,
    DollarSign,
    UserCheck,
    Settings,
    Menu,
    X,
    BarChart3,
    Shield,
    LogOut
} from 'lucide-react';
import { useClientPath } from '@/hooks/useClientPath';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = useClientPath();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const menuItems = [
        { href: '/admin', icon: Home, label: 'Dashboard', exact: true },
        { href: '/admin/dashboard/users', icon: Users, label: 'Users' },
        { href: '/admin/dashboard/channels', icon: Tv, label: 'Channels' },
        { href: '/admin/dashboard/categories', icon: FolderOpen, label: 'Categories' },
        { href: '/admin/subscriptions', icon: UserCheck, label: 'Subscriptions' },
        { href: '/admin/payments', icon: CreditCard, label: 'Payments' },
        { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
        { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    const isActive = (href, exact = false) => {
        if (!pathname) return false; // Initial render
        if (exact) {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 bg-gray-900 text-white flex flex-col
      `}>
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Shield className="w-8 h-8 text-blue-400" />
                            <h2 className="text-xl font-bold">IPTV Admin</h2>
                        </div>
                        <button
                            onClick={closeSidebar}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeSidebar}
                            className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${isActive(item.href, item.exact)
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }
              `}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-700">
                    <Link
                        href="/logout"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Top Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden text-gray-600 hover:text-gray-900"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
                                Admin Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* User Profile Section */}
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">A</span>
                                </div>
                                <span className="hidden sm:inline text-gray-700 font-medium">Admin</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6 bg-gray-50 overflow-y-auto custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;