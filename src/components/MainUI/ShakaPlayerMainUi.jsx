'use client'

import React, { useState, useRef, useEffect, useContext } from 'react';
import Header from '../Header/Header';
import CurrentChannelInfo from './CurrentChannelInfo';
import KeyboardShortcut from './KeyboardShortcut';
import { AuthContext } from '@/provider/AuthProvider';
import Link from 'next/link';
import { Play, Users, Lock, List, Grid3X3, Loader2, AlertCircle, Unlock, Search } from 'lucide-react';

const ShakaPlayerMainUi = () => {
    const { user, subscription } = useContext(AuthContext);
    const [currentChannel, setCurrentChannel] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [isLoading, setIsLoading] = useState(false);
    const [initialChannelsLoading, setInitialChannelsLoading] = useState(true);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [lastSelectedChannel, setLastSelectedChannel] = useState(null);
    const [showLoginNeedModal, setShowLoginNeedModal] = useState(false);
    const [subscriptionUpdagradeModalOpen, setSubscriptionUpgradeModalOpen] = useState(false);
    const [channels, setChannels] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedPremiumFilter, setSelectedPremiumFilter] = useState('all');
    const playerContainerRef = useRef(null);
    const videoRef = useRef(null);
    const shakaPlayerRef = useRef(null);

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/channel?limit=100`);
                if (!response.ok) throw new Error('Failed to fetch channels');
                const data = await response.json();
                setChannels(data?.data || []);
            } catch (error) {
                setErrorMessage('Failed to load channels. Please try again later.');
                setShowErrorModal(true);
            } finally {
                setInitialChannelsLoading(false);
            }
        };
        fetchChannels();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/category`);
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();
                const allCategory = { _id: 'all', name: 'All', slug: 'all' };
                setCategories([allCategory, ...(data?.data || [])]);
            } catch (error) {
                setErrorMessage('Failed to load categories. Please try again later.');
                setShowErrorModal(true);
            }
        };
        fetchCategories();
    }, []);

    // Load Shaka Player script
    useEffect(() => {
        if (window.shaka) return;
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.3.7/shaka-player.compiled.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const sortedChannels = channels.filter(channel => {
        const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || channel.category_id.slug === selectedCategory;
        const matchesPremiumFilter = selectedPremiumFilter === 'all' ||
            (selectedPremiumFilter === 'free' && !channel.is_premium) ||
            (selectedPremiumFilter === 'premium' && channel.is_premium);
        return matchesSearch && matchesCategory && matchesPremiumFilter;
    });

    const filteredChannels = sortedChannels.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
    });

    const initializeShakaPlayer = (streamUrl) => {
        setIsLoading(true);
        if (shakaPlayerRef.current) {
            shakaPlayerRef.current.destroy();
            shakaPlayerRef.current = null;
        }
        if (!window.shaka) {
            setErrorMessage('Shaka Player not loaded. Please refresh the page.');
            setShowErrorModal(true);
            setIsLoading(false);
            return;
        }
        if (!videoRef.current) {
            setErrorMessage('Video element not found.');
            setShowErrorModal(true);
            setIsLoading(false);
            return;
        }
        shakaPlayerRef.current = new window.shaka.Player(videoRef.current);
        shakaPlayerRef.current.addEventListener('error', (e) => {
            setErrorMessage('Stream loading failed. Please try again.');
            setShowErrorModal(true);
            setIsLoading(false);
        });
        shakaPlayerRef.current.load(streamUrl).then(() => {
            setIsLoading(false);
            videoRef.current.play();
        }).catch(() => {
            setErrorMessage('Failed to load stream.');
            setShowErrorModal(true);
            setIsLoading(false);
        });
    };

    const handleChannelSelect = (channel) => {
        if (lastSelectedChannel?._id === channel._id) return;
        if (channel?.is_premium) {
            if (!user?.email) {
                setErrorMessage('This is a premium channel. Please log in to access it.');
                setShowLoginNeedModal(true);
                return;
            }
            if (subscription?.subscription_type !== 'premium' && subscription?.status !== 'active') {
                setErrorMessage('This is a premium channel. Please upgrade your subscription to access it.');
                setSubscriptionUpgradeModalOpen(true);
                return;
            }
        }
        setCurrentChannel(channel);
        setLastSelectedChannel(channel);
        setShowErrorModal(false);
        if (!channel.m3u8_url) {
            setErrorMessage('Stream URL not available for this channel.');
            setShowErrorModal(true);
            return;
        }
        if (window.shaka && videoRef.current) {
            initializeShakaPlayer(channel.m3u8_url);
        } else {
            // Wait for shaka to load
            const checkShaka = setInterval(() => {
                if (window.shaka && videoRef.current) {
                    clearInterval(checkShaka);
                    initializeShakaPlayer(channel.m3u8_url);
                }
            }, 100);
            setTimeout(() => clearInterval(checkShaka), 10000);
        }
    };

    useEffect(() => {
        return () => {
            if (shakaPlayerRef.current) {
                shakaPlayerRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className="min-h-screen overflow-hidden bg-gray-900 text-white">
            <Header />
            <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 p-3 lg:p-6">
                    <div className="max-w-full lg:max-w-2xl mx-auto">
                        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
                            <div className="aspect-video relative">
                                {currentChannel ? (
                                    <>
                                        <video
                                            ref={videoRef}
                                            className="w-full h-full"
                                            style={{ minHeight: '100%' }}
                                            controls
                                            autoPlay
                                            playsInline
                                        />
                                        {isLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                <div className="pointer-events-auto text-center mt-8">
                                                    <p className="text-white mt-12 text-sm lg:text-base">Loading...</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <div className="text-center p-4">
                                            <Play className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 opacity-50" />
                                            <p className="text-lg lg:text-xl">Select a channel to start watching</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {currentChannel && (
                            <div className="mt-4">
                                <CurrentChannelInfo currentChannel={currentChannel} />
                            </div>
                        )}
                        <div className="hidden lg:block mt-4">
                            <KeyboardShortcut />
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 p-3 lg:p-6">
                    <div className="max-w-full lg:max-w-4xl mx-auto">
                        <div className="mb-4 lg:mb-6 bg-gray-800 p-3 lg:p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center justify-between mb-3 lg:mb-4">
                                <h2 className="text-lg lg:text-xl font-semibold">
                                    Channels ({filteredChannels.length})
                                    {selectedPremiumFilter !== 'all' && (
                                        <span className="text-sm text-gray-400 ml-2">
                                            • {selectedPremiumFilter === 'free' ? '🆓 Free' : '💎 Premium'}
                                        </span>
                                    )}
                                </h2>
                                <div className="flex space-x-1 lg:space-x-2">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-1.5 lg:p-2 cursor-pointer rounded ${viewMode === 'grid' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                                    >
                                        <Grid3X3 className="w-4 h-4 lg:w-5 lg:h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-1.5 lg:p-2 rounded cursor-pointer ${viewMode === 'list' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                                    >
                                        <List className="w-4 h-4 lg:w-5 lg:h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="mb-3 lg:mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 lg:w-4 lg:h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search channels..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-8 lg:pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1 lg:gap-2 max-h-24 lg:max-h-none overflow-y-auto lg:overflow-visible">
                                {categories.map(category => (
                                    <button
                                        key={category._id}
                                        onClick={() => setSelectedCategory(category.slug)}
                                        className={`px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg transition-colors text-xs lg:text-sm font-medium cursor-pointer ${selectedCategory === category.slug
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                                <span className="text-sm text-gray-400 font-medium">Channel Type:</span>
                                <div className="flex space-x-1 lg:space-x-2">
                                    {[
                                        { key: 'all', label: 'All', icon: '🌟' },
                                        { key: 'free', label: 'Free', icon: '🆓' },
                                        { key: 'premium', label: 'Premium', icon: '💎' }
                                    ].map(filter => (
                                        <button
                                            key={filter.key}
                                            onClick={() => setSelectedPremiumFilter(filter.key)}
                                            className={`px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-all duration-200 text-xs lg:text-sm font-medium cursor-pointer flex items-center space-x-1 ${selectedPremiumFilter === filter.key
                                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
                                                : 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600 hover:shadow-md'
                                                }`}
                                        >
                                            <span className="text-xs">{filter.icon}</span>
                                            <span>{filter.label}</span>
                                            {filter.key !== 'all' && (
                                                <span className="bg-black/30 px-1.5 py-0.5 rounded text-xs">
                                                    {filter.key === 'free'
                                                        ? channels.filter(ch => !ch.is_premium && (selectedCategory === 'all' || ch.category_id.slug === selectedCategory)).length
                                                        : channels.filter(ch => ch.is_premium && (selectedCategory === 'all' || ch.category_id.slug === selectedCategory)).length
                                                    }
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {
                                initialChannelsLoading ? (
                                    <div className="flex items-center justify-center h-40">
                                        <Loader2 className="w-8 h-8 lg:w-12 lg:h-12 animate-spin text-blue-400" />
                                        <p className="text-gray-400 ml-4">Loading channels...</p>
                                    </div>
                                ) : (
                                    <>
                                        {viewMode === 'grid' ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 lg:gap-4 max-h-[40vh] lg:max-h-[60vh] overflow-y-auto">
                                                {filteredChannels.map(channel => (
                                                    <div
                                                        key={channel._id}
                                                        onClick={() => handleChannelSelect(channel)}
                                                        className={`cursor-pointer rounded-lg border transition-all duration-200 hover:scale-105 ${currentChannel?._id === channel._id
                                                            ? 'border-blue-500 bg-blue-500/10'
                                                            : 'border-gray-600 hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700'
                                                            }`}
                                                    >
                                                        <div className="relative">
                                                            <img
                                                                src={channel.thumbnail}
                                                                alt={channel.name}
                                                                className="w-full h-16 sm:h-20 lg:h-24 object-cover rounded-t-lg"
                                                            />
                                                            <div className="absolute top-1 lg:top-2 right-1 lg:right-2 flex space-x-1">
                                                                {channel.is_premium && (
                                                                    <span className={`${subscription?.subscription_type !== 'premium' && subscription?.status !== 'active' ? 'bg-red-500' : 'bg-emerald-600'} text-white px-1 lg:px-2 py-0.5 lg:py-1 rounded text-xs font-medium`}>
                                                                        {
                                                                            subscription?.subscription_type !== 'premium' && subscription?.status !== 'active' ? <Lock className="w-2 h-2 lg:w-3 lg:h-3 inline mr-1" /> : <Unlock className="w-2 h-2 lg:w-3 lg:h-3 inline mr-1" />
                                                                        }
                                                                        <span className="">Pro</span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="absolute bottom-1 lg:bottom-2 right-1 lg:right-2 bg-black/70 text-white px-1 lg:px-2 py-0.5 lg:py-1 rounded text-xs">
                                                                {channel.quality}
                                                            </div>
                                                        </div>
                                                        <div className="p-2 lg:p-3">
                                                            <h4 className="font-medium text-xs lg:text-sm truncate mb-1">{channel.name}</h4>
                                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                                <span className="truncate mr-2">{channel.category_id.name}</span>
                                                                <div className="flex items-center flex-shrink-0">
                                                                    <Users className="w-2 h-2 lg:w-3 lg:h-3 mr-1" />
                                                                    <span>{channel.viewer_count}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-2 lg:space-y-3 max-h-[40vh] lg:max-h-[60vh] overflow-y-auto">
                                                {filteredChannels.map(channel => (
                                                    <div
                                                        key={channel._id}
                                                        onClick={() => handleChannelSelect(channel)}
                                                        className={`cursor-pointer rounded-lg border transition-all duration-200 ${currentChannel?._id === channel._id
                                                            ? 'border-blue-500 bg-blue-500/10'
                                                            : 'border-gray-600 hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700'
                                                            }`}
                                                    >
                                                        <div className="flex items-center p-2 lg:p-3 space-x-2 lg:space-x-3">
                                                            <img
                                                                src={channel.logo}
                                                                alt={channel.name}
                                                                className="w-8 h-8 lg:w-12 lg:h-12 rounded-lg object-cover flex-shrink-0"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-medium text-sm lg:text-base truncate">{channel.name}</h4>
                                                                <div className="flex items-center space-x-1 lg:space-x-2 text-xs text-gray-400 mt-1">
                                                                    <span className="truncate">{channel.category_id.name}</span>
                                                                    <span className="hidden sm:inline">•</span>
                                                                    <span className="hidden sm:inline">{channel.quality}</span>
                                                                    <span className="hidden sm:inline">•</span>
                                                                    <div className="flex items-center">
                                                                        <Users className="w-2 h-2 lg:w-3 lg:h-3 mr-1" />
                                                                        <span>{channel.viewer_count}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end space-y-1">
                                                                {channel.is_premium && (
                                                                    <Lock className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400" />
                                                                )}
                                                                <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${channel.is_online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            {showErrorModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 p-4 lg:p-6 rounded-lg max-w-md w-full mx-4">
                        <div className="flex items-center space-x-3 mb-4">
                            <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-400" />
                            <h3 className="text-base lg:text-lg font-semibold">Stream Error</h3>
                        </div>
                        <p className="text-gray-300 mb-4 lg:mb-6 text-sm lg:text-base">{errorMessage}</p>
                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm lg:text-base cursor-pointer"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setShowErrorModal(false);
                                    if (currentChannel) {
                                        handleChannelSelect(currentChannel);
                                    }
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm lg:text-base cursor-pointer"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showLoginNeedModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 p-4 lg:p-6 rounded-lg max-w-md w-full mx-4">
                        <div className="flex items-center space-x-3 mb-4">
                            <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-400" />
                            <h3 className="text-base lg:text-lg font-semibold">Login Required</h3>
                        </div>
                        <p className="text-gray-300 mb-4 lg:mb-6 text-sm lg:text-base">This is a premium channel. Please log in to access it.</p>
                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={() => setShowLoginNeedModal(false)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm lg:text-base cursor-pointer"
                            >
                                Close
                            </button>
                            <Link href="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm lg:text-base block text-center cursor-pointer">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            {subscriptionUpdagradeModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 p-4 lg:p-6 rounded-lg max-w-md w-full mx-4">
                        <div className="flex items-center space-x-3 mb-4">
                            <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-400" />
                            <h3 className="text-base lg:text-lg font-semibold">Upgrade Required</h3>
                        </div>
                        <p className="text-gray-300 mb-4 lg:mb-6 text-sm lg:text-base">This is a premium channel. Please upgrade your subscription to access it.</p>
                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={() => setSubscriptionUpgradeModalOpen(false)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm lg:text-base cursor-pointer"
                            >
                                Close
                            </button>
                            <Link href="/pricing" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm lg:text-base block text-center cursor-pointer">
                                Upgrade Now
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShakaPlayerMainUi;
