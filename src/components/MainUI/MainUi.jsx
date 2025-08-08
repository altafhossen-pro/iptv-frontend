/* eslint-disable */
'use client';

import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Users,
    Lock,
    Wifi,
    WifiOff,
    Search,
    Filter,
    Grid3X3,
    List,
    Star,
    Eye,
    Loader2,
    X,
    AlertCircle
} from 'lucide-react';
import Header from '../Header/Header';
import CurrentChannelInfo from './CurrentChannelInfo';
import KeyboardShortcut from './KeyboardShortcut';
import { AuthContext } from '@/provider/AuthProvider';
import Link from 'next/link';

const MainUi = () => {
    const { user } = useContext(AuthContext);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(() => {
        // Load volume from localStorage on component mount
        if (typeof window !== 'undefined') {
            const savedVolume = localStorage.getItem('iptv-volume');
            return savedVolume ? parseFloat(savedVolume) : 1;
        }
        return 1;
    });
    const [currentChannel, setCurrentChannel] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [isLoading, setIsLoading] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [lastSelectedChannel, setLastSelectedChannel] = useState(null);
    const [showLoginNeedModal, setShowLoginNeedModal] = useState(false);
    const [subscriptionUpdagradeModalOpen, setSubscriptionUpgradeModalOpen] = useState(false);
    const [channels, setChannels] = useState([]);
    const [categories, setCategories] = useState([]);
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const loadingTimeoutRef = useRef(null);
    const [selectedPremiumFilter, setSelectedPremiumFilter] = useState('all'); // 'all', 'free', 'premium'
    const [hasUserInteracted, setHasUserInteracted] = useState(false);



    useEffect(() => {
        // Fetch channels from API 
        const fetchChannels = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/channel?limit=100`); // Adjust the API endpoint as needed
                if (!response.ok) {
                    throw new Error('Failed to fetch channels');
                }
                const data = await response.json();
                setChannels(data?.data || []);


            }
            catch (error) {
                console.error('Error fetching channels:', error);
                setErrorMessage('Failed to load channels. Please try again later.');
                setShowErrorModal(true);
            }
        };
        fetchChannels();
    }, []);


    useEffect(() => {
        // fetch categories from API 
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/category`); // Adjust the API endpoint as needed
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                const allCategory = {
                    _id: 'all',
                    name: 'All',
                    slug: 'all'
                };
                setCategories([allCategory, ...data?.data || []]); // Add "All"
                // setCategories(data?.data || []);

            }
            catch (error) {
                console.error('Error fetching categories:', error);
                setErrorMessage('Failed to load categories. Please try again later.');
                setShowErrorModal(true);
            }
        };
        fetchCategories();
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

    // Load HLS stream
    const loadHLSStream = async (url) => {
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        if (isLoading) {
            console.log('Stream already loading, ignoring new request');
            return;
        }

        setIsLoading(true);
        setShowErrorModal(false);

        // Clean up previous HLS instance
        if (hlsRef.current) {
            try {
                hlsRef.current.destroy();
                hlsRef.current = null;
            } catch (error) {
                console.log('Error destroying previous HLS instance:', error);
            }
        }

        // Reset video element
        if (videoRef.current) {
            try {
                videoRef.current.pause();
                videoRef.current.removeAttribute('src');
                videoRef.current.load();
                videoRef.current.volume = volume;
                videoRef.current.muted = isMuted;
            } catch (error) {
                console.log('Error resetting video element:', error);
            }
        }

        try {
            // Check if HLS is supported natively (Safari)
            if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                videoRef.current.src = url;
                setIsLoading(false);

                // Auto-play only if user has interacted (clicked on channel)
                try {
                    await videoRef.current.play();
                    setIsPlaying(true);
                } catch (error) {
                    console.log('Auto-play prevented:', error);
                    setIsPlaying(false);
                }
            } else {
                // Try to load HLS.js from CDN
                if (!window.Hls) {
                    try {
                        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.12/hls.min.js');
                    } catch (error) {
                        setErrorMessage('HLS library failed to load');
                        setShowErrorModal(true);
                        setIsLoading(false);
                        return;
                    }
                }

                if (window.Hls && window.Hls.isSupported()) {
                    const hls = new window.Hls({
                        debug: false,
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 90
                    });

                    hlsRef.current = hls;
                    hls.loadSource(url);
                    hls.attachMedia(videoRef.current);

                    hls.on(window.Hls.Events.MANIFEST_PARSED, async () => {
                        console.log('HLS stream loaded successfully');
                        if (videoRef.current) {
                            videoRef.current.volume = volume;
                            videoRef.current.muted = isMuted;

                            // Auto-play only if user has interacted (clicked on channel)
                            try {
                                await videoRef.current.play();
                                setIsPlaying(true);
                            } catch (error) {
                                console.log('Auto-play prevented:', error);
                                setIsPlaying(false);
                            }
                        }
                        setIsLoading(false);
                    });

                    hls.on(window.Hls.Events.ERROR, (event, data) => {
                        if (data.fatal) {
                            setErrorMessage(`HLS Error: ${data.type} - ${data.details}`);
                            setShowErrorModal(true);
                            setIsLoading(false);
                        }
                    });
                } else {
                    videoRef.current.src = url;
                    setIsLoading(false);

                    // Auto-play only if user has interacted (clicked on channel)
                    if (hasUserInteracted) {
                        try {
                            await videoRef.current.play();
                            setIsPlaying(true);
                        } catch (error) {
                            console.log('Auto-play prevented:', error);
                            setIsPlaying(false);
                        }
                    } else {
                        setIsPlaying(false);
                    }
                }
            }
        } catch (error) {
            console.error('Stream loading error:', error);
            setIsLoading(false);
            setErrorMessage('Something went wrong. Please refresh and try again.');
            setShowErrorModal(true);
        }
    };

    const handleChannelSelect = (channel) => {
        // Prevent selecting the same channel multiple times
        if (lastSelectedChannel?._id === channel._id) {
            return;
        }

        console.log(channel);
        if (channel?.is_premium) {
            // Check if user is logged in and has access to premium channels
            if (!user?.email) {
                setErrorMessage('This is a premium channel. Please log in to access it.');
                setShowLoginNeedModal(true);
                return;
            }
            if (user?.subscription?.status !== 'active') {
                setErrorMessage('This is a premium channel. Please upgrade your subscription to access it.');
                setSubscriptionUpgradeModalOpen(true);
                return;
            }
        }

        // Clear any existing loading timeout
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
        }

        setCurrentChannel(channel);
        setLastSelectedChannel(channel);

        // ✅ এইখানে change করো - channel select করার সাথে সাথেই user interaction mark করো
        setHasUserInteracted(true);

        if (channel.m3u8_url) {
            // Add a small delay to prevent rapid switching
            loadingTimeoutRef.current = setTimeout(() => {
                loadHLSStream(channel.m3u8_url);
            }, 100);
        }
    };


    const togglePlayPause = () => {
        if (videoRef.current) {
            setHasUserInteracted(true); // Mark that user has interacted
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);

        // Save volume to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('iptv-volume', newVolume.toString());
        }

        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    };

    // Keyboard controls
    const handleKeyDown = (e) => {
        // Only handle keyboard shortcuts if video is focused or if we're not in an input field
        if (!videoRef.current || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.key) {
            case ' ':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                toggleFullscreen();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const newVolumeUp = Math.min(1, volume + 0.1);
                setVolume(newVolumeUp);
                // Save volume to localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem('iptv-volume', newVolumeUp.toString());
                }
                if (videoRef.current) {
                    videoRef.current.volume = newVolumeUp;
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                const newVolumeDown = Math.max(0, volume - 0.1);
                setVolume(newVolumeDown);
                // Save volume to localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem('iptv-volume', newVolumeDown.toString());
                }
                if (videoRef.current) {
                    videoRef.current.volume = newVolumeDown;
                }
                break;
            case 'm':
            case 'M':
                e.preventDefault();
                toggleMute();
                break;
        }
    };

    useEffect(() => {


        return () => {
            if (hlsRef.current) {
                try {
                    hlsRef.current.destroy();
                    hlsRef.current = null;
                } catch (error) {
                    console.log('Error destroying HLS instance:', error);
                }
            }
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        };
    }, [channels]);


    // Separate useEffect for keyboard controls
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [volume, isPlaying, isMuted]);

    // Apply saved volume to video element when it's available
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
        }
    }, [volume]);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <Header />

            <div className="flex flex-col lg:flex-row">
                {/* Left Side - Video Player */}
                <div className="w-full lg:w-1/2 p-3 lg:p-6">
                    <div className="max-w-full lg:max-w-2xl mx-auto">
                        {/* Video Player with 16:9 Aspect Ratio */}
                        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
                            <div className="aspect-video relative">
                                {currentChannel ? (
                                    <>
                                        <video
                                            ref={videoRef}
                                            className="w-full h-full object-contain bg-black cursor-pointer"
                                            onPlay={() => setIsPlaying(true)}
                                            onPause={() => setIsPlaying(false)}
                                            onError={(e) => {
                                                console.error('Video error:', e);
                                                setIsLoading(false);
                                                setErrorMessage('Video playback error. Please try again.');
                                                setShowErrorModal(true);
                                            }}
                                            onClick={togglePlayPause}
                                        >
                                            Your browser does not support the video tag.
                                        </video>

                                        {/* Loading Overlay */}
                                        {isLoading && (
                                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                                <div className="text-center">
                                                    <Loader2 className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-4 animate-spin text-blue-400" />
                                                    <p className="text-white text-base lg:text-lg">Loading stream...</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Video Controls Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 lg:p-4">
                                            <div className="flex items-center justify-between text-white">
                                                <div className="flex items-center space-x-2 lg:space-x-4">
                                                    <button
                                                        onClick={togglePlayPause}
                                                        className="bg-blue-600 hover:bg-blue-700 rounded-full p-1.5 lg:p-2 transition-colors"
                                                    >
                                                        {isPlaying ? <Pause className="w-4 h-4 lg:w-5 lg:h-5" /> : <Play className="w-4 h-4 lg:w-5 lg:h-5 ml-0.5" />}
                                                    </button>

                                                    <div className="flex items-center space-x-1 lg:space-x-2">
                                                        <button onClick={toggleMute} className="hover:text-blue-400 transition-colors">
                                                            {isMuted ? <VolumeX className="w-3 h-3 lg:w-4 lg:h-4" /> : <Volume2 className="w-3 h-3 lg:w-4 lg:h-4" />}
                                                        </button>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="1"
                                                            step="0.1"
                                                            value={volume}
                                                            onChange={handleVolumeChange}
                                                            className="w-12 lg:w-16 accent-blue-600"
                                                        />
                                                    </div>

                                                    {/* <div className="text-xs lg:text-sm text-gray-300 hidden sm:block">
                                                        <span className="flex items-center space-x-1 lg:space-x-2">
                                                            <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                                                            <span className="hidden sm:inline">{currentChannel.viewer_count?.toLocaleString()} watching</span>
                                                            <span className="sm:hidden">{currentChannel.viewer_count?.toLocaleString()}</span>
                                                        </span>
                                                    </div> */}
                                                </div>

                                                <button
                                                    onClick={toggleFullscreen}
                                                    className="hover:text-blue-400 transition-colors"
                                                >
                                                    <Maximize className="w-3 h-3 lg:w-4 lg:h-4" />
                                                </button>
                                            </div>
                                        </div>
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

                        {/* Current Channel Info */}
                        {currentChannel && (
                            <div className="mt-4">
                                <CurrentChannelInfo currentChannel={currentChannel} />
                            </div>
                        )}

                        {/* Keyboard Shortcuts Info - Hidden on mobile */}
                        <div className="hidden lg:block mt-4">
                            <KeyboardShortcut />
                        </div>
                    </div>
                </div>

                {/* Right Side - Channel Grid & Filters */}
                <div className="w-full lg:w-1/2 p-3 lg:p-6">
                    <div className="max-w-full lg:max-w-4xl mx-auto">
                        {/* Filters Section */}
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

                            {/* Search Bar */}
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

                            {/* Category Filters */}
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

                        {/* Channel Grid */}
                        <div className="space-y-4">
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
                                                        <span className="bg-red-500 text-white px-1 lg:px-2 py-0.5 lg:py-1 rounded text-xs font-medium">
                                                            <Lock className="w-2 h-2 lg:w-3 lg:h-3 inline mr-1" />
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
                                                    <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${channel.is_online ? 'bg-green-500' : 'bg-red-500'
                                                        }`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Modal */}
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
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm lg:text-base"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setShowErrorModal(false);
                                    if (currentChannel) {
                                        loadHLSStream(currentChannel.m3u8_url);
                                    }
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm lg:text-base"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Login Needed Modal */}
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
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm lg:text-base"
                            >
                                Close
                            </button>
                            <Link href="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm lg:text-base block text-center">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            {
                subscriptionUpdagradeModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 p-4 lg:p-6 rounded-lg max-w-md w-full mx-4">
                            <div className="flex items-center space-x-3 mb-4">
                                <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-400" />
                                <h3 className="text-base lg:text-lg font-semibold">Subscription Upgrade Needed</h3>
                            </div>
                            <p className="text-gray-300 mb-4 lg:mb-6 text-sm lg:text-base">This is a premium channel. Please upgrade your subscription to access it.</p>
                            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                                <button
                                    onClick={() => setSubscriptionUpgradeModalOpen(false)}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm lg:text-base cursor-pointer"
                                >
                                    Close
                                </button>
                                <Link href="/profile/subscription/upgrade" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm lg:text-base block text-center cursor-pointer">
                                    Upgrade Subscription
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default MainUi;