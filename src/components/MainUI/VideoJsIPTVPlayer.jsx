/* eslint-disable */
'use client';

import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    Play,
    Users,
    Lock,
    Search,
    Filter,
    Grid3X3,
    List,
    Eye,
    Loader2,
    X,
    AlertCircle,
    Unlock,
    RefreshCw,
    Wifi,
    WifiOff
} from 'lucide-react';
import Header from '../Header/Header';
import CurrentChannelInfo from './CurrentChannelInfo';
import KeyboardShortcut from './KeyboardShortcut';
import { AuthContext } from '@/provider/AuthProvider';
import Link from 'next/link';

const VideoJsIPTVPlayer = () => {
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

    // Video.js specific states
    const [videoJsLoaded, setVideoJsLoaded] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [showRetryIndicator, setShowRetryIndicator] = useState(false);

    // Video.js refs
    const playerContainerRef = useRef(null);
    const playerInstance = useRef(null);
    const retryTimeoutRef = useRef(null);

    const MAX_RETRY_ATTEMPTS = 3;
    const RETRY_DELAYS = [2000, 5000, 10000]; // Progressive delay

    useEffect(() => {
        // Fetch channels from API 
        const fetchChannels = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/channel?limit=100`);
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
            finally {
                setInitialChannelsLoading(false);
            }
        };
        fetchChannels();
    }, []);

    useEffect(() => {
        // Fetch categories from API 
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/category`);
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                const allCategory = {
                    _id: 'all',
                    name: 'All',
                    slug: 'all'
                };
                setCategories([allCategory, ...data?.data || []]);
            }
            catch (error) {
                console.error('Error fetching categories:', error);
                setErrorMessage('Failed to load categories. Please try again later.');
                setShowErrorModal(true);
            }
        };
        fetchCategories();
    }, []);

    // Load Video.js scripts
    useEffect(() => {
        const loadVideoJs = async () => {
            // Check if Video.js is already loaded
            if (window.videojs) {
                console.log('Video.js already loaded');
                setVideoJsLoaded(true);
                return;
            }

            try {
                // Load Video.js CSS
                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/video.js/8.6.1/video.min.css';
                document.head.appendChild(cssLink);

                // Load Video.js script
                const videoJsScript = document.createElement('script');
                videoJsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/video.js/8.6.1/video.min.js';
                document.head.appendChild(videoJsScript);

                await new Promise((resolve) => {
                    videoJsScript.onload = resolve;
                });

                // Load VHS (HLS support) for Video.js
                const vhsScript = document.createElement('script');
                vhsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/5.15.0/videojs-contrib-hls.min.js';
                document.head.appendChild(vhsScript);

                await new Promise((resolve) => {
                    vhsScript.onload = resolve;
                });

                console.log('Video.js loaded successfully');
                setVideoJsLoaded(true);
            } catch (error) {
                console.error('Error loading Video.js:', error);
                setErrorMessage('Failed to load video player. Please refresh the page.');
                setShowErrorModal(true);
            }
        };

        loadVideoJs();
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

    const clearRetryTimeout = () => {
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }
    };

    const handleRetry = (streamUrl, channelName, attempt = 0) => {
        if (attempt >= MAX_RETRY_ATTEMPTS) {
            console.log('Max retry attempts reached');
            setIsRetrying(false);
            setShowRetryIndicator(false);
            setConnectionStatus('failed');
            setIsLoading(false);
            // Don't show error modal for failed retries, just stop trying
            return;
        }

        console.log(`Scheduling retry attempt ${attempt + 1} for channel: ${channelName}`);
        setIsRetrying(true);
        setShowRetryIndicator(true);
        setConnectionStatus('reconnecting');
        setRetryCount(attempt + 1);

        const delay = RETRY_DELAYS[attempt] || 10000;

        retryTimeoutRef.current = setTimeout(() => {
            console.log(`Executing retry attempt ${attempt + 1} for channel: ${channelName}`);
            initializeVideoJs(streamUrl, channelName, attempt + 1);
        }, delay);
    };

    const initializeVideoJs = (streamUrl, channelName, retryAttempt = 0) => {
        // Add timeout to ensure DOM is ready
        setTimeout(() => {
            if (!window.videojs) {
                console.error('Video.js not loaded');
                if (retryAttempt < MAX_RETRY_ATTEMPTS) {
                    handleRetry(streamUrl, channelName, retryAttempt);
                }
                return;
            }

            if (!playerContainerRef.current) {
                console.error('Player container not found');
                return;
            }

            // Clear any existing retry timeout
            clearRetryTimeout();

            // Destroy existing player instance
            if (playerInstance.current) {
                try {
                    playerInstance.current.dispose();
                    playerInstance.current = null;
                } catch (error) {
                    console.log('Error disposing previous player:', error);
                }
            }

            // Clear container and create video element
            playerContainerRef.current.innerHTML = '';
            const videoElement = document.createElement('video-js');
            videoElement.className = 'video-js vjs-default-skin w-full h-full';
            videoElement.setAttribute('controls', 'true');
            videoElement.setAttribute('preload', 'auto');
            videoElement.setAttribute('data-setup', '{}');
            playerContainerRef.current.appendChild(videoElement);

            try {
                console.log('Initializing Video.js with:', streamUrl);

                // Initialize Video.js player
                playerInstance.current = window.videojs(videoElement, {
                    fluid: true,
                    responsive: true,
                    controls: true,
                    preload: 'auto',
                    autoplay: true,
                    muted: false,
                    liveui: true,
                    playbackRates: [0.5, 1, 1.25, 1.5, 2],
                    html5: {
                        vhs: {
                            enableLowInitialPlaylist: true,
                            smoothQualityChange: true,
                            overrideNative: true,
                            useDevicePixelRatio: true,
                            withCredentials: false
                        }
                    }
                });

                // Event listeners
                playerInstance.current.ready(() => {
                    console.log('Video.js player ready');
                    setConnectionStatus('connecting');

                    // Set source with proxy
                    playerInstance.current.src({
                        src: `/api/stream?url=${encodeURIComponent(streamUrl)}`,
                        type: 'application/x-mpegURL'
                    });
                });

                playerInstance.current.on('loadstart', () => {
                    console.log('Video.js: Load started');
                    setIsLoading(true);
                    setConnectionStatus('connecting');
                    if (retryAttempt === 0) {
                        setIsRetrying(false);
                        setShowRetryIndicator(false);
                    }
                });

                playerInstance.current.on('canplay', () => {
                    console.log('Video.js: Can play');
                    setIsLoading(false);
                    setConnectionStatus('connected');
                    setRetryCount(0);
                    setIsRetrying(false);
                    setShowRetryIndicator(false);
                });

                playerInstance.current.on('playing', () => {
                    console.log('Video.js: Playing');
                    setIsLoading(false);
                    setConnectionStatus('connected');
                    setRetryCount(0);
                    setIsRetrying(false);
                    setShowRetryIndicator(false);
                });

                playerInstance.current.on('waiting', () => {
                    console.log('Video.js: Waiting for data');
                    if (!isRetrying && connectionStatus === 'connected') {
                        setIsLoading(true);
                    }
                });

                playerInstance.current.on('stalled', () => {
                    console.log('Video.js: Stalled - checking for retry');
                    if (!isRetrying && retryAttempt < MAX_RETRY_ATTEMPTS) {
                        console.log('Stream stalled, attempting retry...');
                        handleRetry(streamUrl, channelName, retryAttempt);
                    }
                });

                playerInstance.current.on('error', (error) => {
                    console.error('Video.js error:', error);
                    setIsLoading(false);

                    // Get error details
                    const playerError = playerInstance.current?.error();
                    const errorCode = playerError?.code;

                    console.log('Error code:', errorCode, 'Retry attempt:', retryAttempt);

                    // Network errors (code 2), decode errors (code 3), or source errors (code 4) should trigger retry
                    if ((errorCode === 2 || errorCode === 3 || errorCode === 4) && retryAttempt < MAX_RETRY_ATTEMPTS && !isRetrying) {
                        console.log('Recoverable error detected, attempting retry...');
                        handleRetry(streamUrl, channelName, retryAttempt);
                    } else if (retryAttempt >= MAX_RETRY_ATTEMPTS) {
                        console.log('Max retries reached, stopping attempts');
                        setConnectionStatus('failed');
                        setIsRetrying(false);
                        setShowRetryIndicator(false);
                        // Only show modal if explicitly requested or critical error
                        setErrorMessage('Unable to load this channel. Please try another channel.');
                        setShowErrorModal(true);
                    }
                });

                // Monitor buffer health
                playerInstance.current.on('progress', () => {
                    if (playerInstance.current && !playerInstance.current.paused() && connectionStatus === 'connected') {
                        const buffered = playerInstance.current.buffered();
                        const currentTime = playerInstance.current.currentTime();

                        if (buffered.length > 0) {
                            const bufferEnd = buffered.end(buffered.length - 1);
                            const bufferHealth = bufferEnd - currentTime;

                            // If buffer is very low and not retrying, show loading
                            if (bufferHealth < 1 && !isRetrying) {
                                setIsLoading(true);
                            } else if (bufferHealth > 3) {
                                setIsLoading(false);
                            }
                        }
                    }
                });

            } catch (error) {
                console.error('Error initializing Video.js:', error);
                setIsLoading(false);
                setConnectionStatus('failed');
                if (retryAttempt < MAX_RETRY_ATTEMPTS && !isRetrying) {
                    handleRetry(streamUrl, channelName, retryAttempt);
                } else {
                    setErrorMessage('Failed to initialize video player. Please try another channel.');
                    setShowErrorModal(true);
                }
            }
        }, 100);
    };

    const handleChannelSelect = async (channel) => {
        console.log('Channel selected:', channel.name);

        // Prevent selecting the same channel multiple times
        if (lastSelectedChannel?._id === channel._id) {
            return;
        }

        // Premium channel access check
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
        setRetryCount(0);
        setIsRetrying(false);
        setShowRetryIndicator(false);
        setConnectionStatus('disconnected');
        clearRetryTimeout();

        // Check if channel has valid stream URL
        if (!channel.m3u8_url) {
            console.error('No stream URL found for channel:', channel.name);
            setErrorMessage('Stream URL not available for this channel.');
            setShowErrorModal(true);
            return;
        }

        // Wait for Video.js to be loaded and DOM to be ready
        if (!videoJsLoaded || !window.videojs) {
            console.log('Waiting for Video.js to load...');
            setIsLoading(true);
            const checkVideoJs = setInterval(() => {
                if (window.videojs && playerContainerRef.current) {
                    clearInterval(checkVideoJs);
                    initializeVideoJs(channel.m3u8_url, channel.name);
                }
            }, 100);

            // Clear interval after 10 seconds to prevent infinite loop
            setTimeout(() => {
                clearInterval(checkVideoJs);
                if (!window.videojs) {
                    setIsLoading(false);
                    setErrorMessage('Failed to load video player. Please refresh the page.');
                    setShowErrorModal(true);
                }
            }, 10000);
            return;
        }

        initializeVideoJs(channel.m3u8_url, channel.name);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearRetryTimeout();
            if (playerInstance.current) {
                try {
                    playerInstance.current.dispose();
                } catch (error) {
                    console.log('Error disposing player on unmount:', error);
                }
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <Header />

            <div className="flex flex-col lg:flex-row">
                {/* Left Side - Video Player */}
                <div className="w-full lg:w-1/2 p-3 lg:p-6">
                    <div className="max-w-full lg:max-w-2xl mx-auto">
                        {/* Video Player Container */}
                        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
                            <div className="aspect-video relative">
                                {currentChannel ? (
                                    <>
                                        {/* Video.js Container */}
                                        <div
                                            ref={playerContainerRef}
                                            className="w-full h-full"
                                            style={{ minHeight: '100%' }}
                                        />

                                        {/* Loading Overlay */}
                                        {(isLoading || isRetrying) && (
                                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                                                <div className="text-center">
                                                    <Loader2 className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-4 animate-spin text-blue-400" />
                                                    <p className="text-white text-base lg:text-lg">
                                                        {isRetrying ? `Reconnecting... (${retryCount}/${MAX_RETRY_ATTEMPTS})` : 'Loading stream...'}
                                                    </p>
                                                    {isRetrying && (
                                                        <div className="flex items-center justify-center mt-2 text-sm text-gray-300">
                                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                            Attempting to reconnect
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Connection Status Indicator */}
                                        {showRetryIndicator && (
                                            <div className="absolute top-4 right-4 z-20">
                                                <div className="flex items-center space-x-2 bg-black/70 px-3 py-2 rounded-lg">
                                                    {connectionStatus === 'reconnecting' ? (
                                                        <>
                                                            <WifiOff className="w-4 h-4 text-yellow-400 animate-pulse" />
                                                            <span className="text-yellow-400 text-sm">Reconnecting...</span>
                                                        </>
                                                    ) : connectionStatus === 'connected' ? (
                                                        <>
                                                            <Wifi className="w-4 h-4 text-green-400" />
                                                            <span className="text-green-400 text-sm">Connected</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <WifiOff className="w-4 h-4 text-red-400" />
                                                            <span className="text-red-400 text-sm">Failed</span>
                                                        </>
                                                    )}
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
                                                                <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${channel.is_online ? 'bg-green-500' : 'bg-red-500'
                                                                    }`}></div>
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

            {/* Subscription Upgrade Modal */}
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

export default VideoJsIPTVPlayer;