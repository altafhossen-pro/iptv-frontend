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
    AlertCircle,
    Unlock
} from 'lucide-react';
import Header from '../Header/Header';
import CurrentChannelInfo from './CurrentChannelInfo';
import KeyboardShortcut from './KeyboardShortcut';
import { AuthContext } from '@/provider/AuthProvider';
import Link from 'next/link';
import { getCookie } from 'cookies-next';

const MainUi = () => {
    const { user, subscription } = useContext(AuthContext);
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
    const [initialChannelsLoading, setInitialChannelsLoading] = useState(true);
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
    const [isBuffering, setIsBuffering] = useState(false);
    const [bufferHealth, setBufferHealth] = useState(0);
    const [retryCount, setRetryCount] = useState(0);
    const [streamQuality, setStreamQuality] = useState('auto');
    const [lastBufferTime, setLastBufferTime] = useState(0);


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
            finally {
                setInitialChannelsLoading(false);
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

    const [connectionQuality, setConnectionQuality] = useState('good');

    // Add this function to monitor buffer health
    const monitorBufferHealth = () => {
        const video = videoRef.current;
        if (!video || !video.buffered.length) return;

        const currentTime = video.currentTime;
        const buffered = video.buffered;

        for (let i = 0; i < buffered.length; i++) {
            if (currentTime >= buffered.start(i) && currentTime <= buffered.end(i)) {
                const bufferAhead = buffered.end(i) - currentTime;
                setBufferHealth(bufferAhead);

                if (bufferAhead < 2) {
                    setConnectionQuality('poor');
                } else if (bufferAhead < 5) {
                    setConnectionQuality('fair');
                } else {
                    setConnectionQuality('good');
                }
                break;
            }
        }
    };

    // Monitor buffer every 2 seconds
    useEffect(() => {
        const interval = setInterval(monitorBufferHealth, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleWaiting = () => {
            console.log('Video waiting for data...');
            setIsBuffering(true);
        };

        const handlePlaying = () => {
            console.log('Video started playing');
            setIsBuffering(false);
            setIsLoading(false);
        };

        const handleCanPlay = () => {
            console.log('Video can start playing');
            setIsLoading(false);
        };

        const handleStalled = () => {
            console.log('Video stalled');
            setIsBuffering(true);
        };

        const handleSeeking = () => {
            setIsBuffering(true);
        };

        const handleSeeked = () => {
            setIsBuffering(false);
        };

        const handleLoadStart = () => {
            console.log('Video load started');
            setIsLoading(true);
        };

        video.addEventListener('waiting', handleWaiting);
        video.addEventListener('playing', handlePlaying);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('stalled', handleStalled);
        video.addEventListener('seeking', handleSeeking);
        video.addEventListener('seeked', handleSeeked);
        video.addEventListener('loadstart', handleLoadStart);

        return () => {
            video.removeEventListener('waiting', handleWaiting);
            video.removeEventListener('playing', handlePlaying);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('stalled', handleStalled);
            video.removeEventListener('seeking', handleSeeking);
            video.removeEventListener('seeked', handleSeeked);
            video.removeEventListener('loadstart', handleLoadStart);
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

    // Load HLS stream
    const loadHLSStream = async (url) => {
        console.log('loadHLSStream called with URL:', url);

        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        try {
            setIsLoading(true);
            setIsBuffering(false);
            setShowErrorModal(false);
            setRetryCount(0);

            // Clean up previous HLS instance
            if (hlsRef.current) {
                try {
                    console.log('Destroying previous HLS instance');
                    hlsRef.current.destroy();
                    hlsRef.current = null;
                    await new Promise(resolve => setTimeout(resolve, 200));
                } catch (error) {
                    console.log('Error destroying previous HLS instance:', error);
                }
            }

            // Reset video element
            if (videoRef.current) {
                try {
                    console.log('Resetting video element');
                    videoRef.current.pause();
                    videoRef.current.removeAttribute('src');
                    videoRef.current.load();
                    videoRef.current.volume = volume;
                    videoRef.current.muted = isMuted;
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.log('Error resetting video element:', error);
                }
            }

            // Test stream URL first
            console.log('Testing stream URL...');
            const testResponse = await fetch(url, {
                method: 'HEAD',
                signal: AbortSignal.timeout(8000)
            });

            if (!testResponse.ok) {
                throw new Error(`Stream URL returned ${testResponse.status}`);
            }

            console.log('Stream URL test successful');

            // Check if HLS is supported natively (Safari)
            if (videoRef.current && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                console.log('Using native HLS support');
                videoRef.current.src = url;

                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => reject(new Error('Timeout waiting for video to load')), 15000);

                    const onLoadStart = () => {
                        clearTimeout(timeout);
                        videoRef.current.removeEventListener('loadstart', onLoadStart);
                        videoRef.current.removeEventListener('error', onError);
                        resolve();
                    };

                    const onError = (e) => {
                        clearTimeout(timeout);
                        videoRef.current.removeEventListener('loadstart', onLoadStart);
                        videoRef.current.removeEventListener('error', onError);
                        reject(new Error('Video load error'));
                    };

                    videoRef.current.addEventListener('loadstart', onLoadStart);
                    videoRef.current.addEventListener('error', onError);
                });

                setIsLoading(false);

                try {
                    await videoRef.current.play();
                    setIsPlaying(true);
                    console.log('Native playback started successfully');
                } catch (error) {
                    console.log('Auto-play prevented:', error);
                    setIsPlaying(false);
                }

            } else {
                console.log('Loading HLS.js for browser compatibility');

                if (!window.Hls) {
                    try {
                        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.12/hls.min.js');
                        await new Promise(resolve => setTimeout(resolve, 300));
                    } catch (error) {
                        throw new Error('HLS library failed to load');
                    }
                }

                if (window.Hls && window.Hls.isSupported()) {
                    console.log('Creating new HLS instance with enhanced config');

                    const hls = new window.Hls({
                        debug: false,
                        enableWorker: true,
                        lowLatencyMode: false,

                        // Enhanced buffer settings for stability
                        maxBufferLength: 120, // 2 minutes buffer
                        maxBufferSize: 200 * 1000 * 1000, // 200MB
                        maxBufferHole: 0.3,
                        backBufferLength: 180, // 3 minutes back buffer

                        // More aggressive loading
                        maxLoadingDelay: 12,
                        manifestLoadingTimeOut: 20000,
                        levelLoadingTimeOut: 20000,
                        fragLoadingTimeOut: 30000,

                        // Enhanced retry settings
                        manifestLoadingRetryDelay: 2000,
                        levelLoadingRetryDelay: 2000,
                        fragLoadingRetryDelay: 2000,
                        manifestLoadingMaxRetry: 5,
                        levelLoadingMaxRetry: 6,
                        fragLoadingMaxRetry: 8,

                        // Live streaming optimizations
                        liveSyncDurationCount: 5,
                        liveMaxLatencyDurationCount: 15,
                        liveDurationInfinity: true,

                        // Quality and loading
                        startLevel: -1, // Auto quality
                        capLevelToPlayerSize: true,
                        testBandwidth: true,
                        progressive: true,

                        // Fragment settings
                        fragLoadingMaxRetryTimeout: 128000,
                        manifestLoadingMaxRetryTimeout: 128000,
                        levelLoadingMaxRetryTimeout: 128000,

                        // Additional buffer control
                        nudgeOffset: 0.1,
                        nudgeMaxRetry: 3,
                        maxStarvationDelay: 4,
                        maxSeekHole: 2
                    });

                    hlsRef.current = hls;

                    // Enhanced buffer monitoring
                    let bufferMonitorInterval;
                    let stallRecoveryAttempts = 0;
                    const maxStallRecoveryAttempts = 8;
                    let isRecovering = false;

                    const startBufferMonitoring = () => {
                        bufferMonitorInterval = setInterval(() => {
                            const video = videoRef.current;
                            if (!video) return;

                            const currentTime = video.currentTime;
                            const buffered = video.buffered;

                            if (buffered.length > 0) {
                                for (let i = 0; i < buffered.length; i++) {
                                    if (currentTime >= buffered.start(i) && currentTime <= buffered.end(i)) {
                                        const bufferAhead = buffered.end(i) - currentTime;
                                        setBufferHealth(bufferAhead);

                                        // Show buffering spinner if buffer is very low
                                        if (bufferAhead < 1 && !video.paused) {
                                            setIsBuffering(true);
                                        } else if (bufferAhead > 3) {
                                            setIsBuffering(false);
                                        }

                                        // If buffer is critically low, try to help
                                        if (bufferAhead < 0.5 && !isRecovering && !video.paused) {
                                            isRecovering = true;
                                            console.log('Critical buffer level, attempting preemptive recovery');

                                            setTimeout(() => {
                                                try {
                                                    hls.trigger(window.Hls.Events.BUFFER_FLUSHING, {
                                                        startOffset: 0,
                                                        endOffset: Number.POSITIVE_INFINITY
                                                    });
                                                } catch (e) {
                                                    console.log('Buffer flush failed:', e);
                                                }
                                                isRecovering = false;
                                            }, 1000);
                                        }
                                        break;
                                    }
                                }
                            } else {
                                setBufferHealth(0);
                                if (!video.paused) {
                                    setIsBuffering(true);
                                }
                            }
                        }, 1000);
                    };

                    const stopBufferMonitoring = () => {
                        if (bufferMonitorInterval) {
                            clearInterval(bufferMonitorInterval);
                            bufferMonitorInterval = null;
                        }
                    };

                    // Enhanced error recovery
                    const recoverFromBufferStall = async (data) => {
                        stallRecoveryAttempts++;
                        setRetryCount(stallRecoveryAttempts);
                        setIsBuffering(true);

                        console.log(`Buffer stall recovery attempt ${stallRecoveryAttempts}/${maxStallRecoveryAttempts}`);

                        if (stallRecoveryAttempts > maxStallRecoveryAttempts) {
                            console.error('Max stall recovery attempts reached');
                            setErrorMessage('Stream keeps buffering. Please try another channel or check your internet connection.');
                            setShowErrorModal(true);
                            setIsBuffering(false);
                            setIsLoading(false);
                            return;
                        }

                        try {
                            const video = videoRef.current;
                            if (!video) return;

                            // Different recovery strategies based on attempt count
                            if (stallRecoveryAttempts <= 2) {
                                // Light recovery - just recover media error
                                console.log('Light recovery: Media error recovery');
                                hls.recoverMediaError();

                            } else if (stallRecoveryAttempts <= 4) {
                                // Medium recovery - flush buffer and recover
                                console.log('Medium recovery: Buffer flush + Media recovery');
                                hls.trigger(window.Hls.Events.BUFFER_RESET);
                                await new Promise(resolve => setTimeout(resolve, 500));
                                hls.recoverMediaError();

                            } else if (stallRecoveryAttempts <= 6) {
                                // Aggressive recovery - swap codec and recover
                                console.log('Aggressive recovery: Codec swap + Media recovery');
                                try {
                                    hls.swapAudioCodec();
                                } catch (e) {
                                    console.log('Codec swap failed:', e);
                                }
                                hls.recoverMediaError();

                            } else {
                                // Nuclear option - full restart
                                console.log('Nuclear recovery: Full HLS restart');
                                const currentTime = video.currentTime;

                                hls.detachMedia();
                                await new Promise(resolve => setTimeout(resolve, 1000));

                                hls.attachMedia(video);
                                hls.startLoad(currentTime);
                            }

                            // Give recovery some time
                            setTimeout(() => {
                                if (bufferHealth > 1) {
                                    stallRecoveryAttempts = Math.max(0, stallRecoveryAttempts - 1);
                                    setIsBuffering(false);
                                    console.log('Recovery successful, reduced attempt count');
                                }
                            }, 3000);

                        } catch (error) {
                            console.error('Recovery failed:', error);
                            setTimeout(() => recoverFromBufferStall(data), 2000 * stallRecoveryAttempts);
                        }
                    };

                    // Set up event listeners
                    const setupHLSEventListeners = () => {
                        return new Promise((resolve, reject) => {
                            let resolved = false;
                            const timeout = setTimeout(() => {
                                if (!resolved) {
                                    resolved = true;
                                    reject(new Error('HLS loading timeout'));
                                }
                            }, 30000);

                            hls.on(window.Hls.Events.MANIFEST_PARSED, async () => {
                                if (resolved) return;
                                resolved = true;
                                clearTimeout(timeout);

                                console.log('HLS manifest parsed successfully');
                                console.log('Available levels:', hls.levels.length);

                                // Reset recovery counters
                                stallRecoveryAttempts = 0;
                                setRetryCount(0);

                                // Start buffer monitoring
                                startBufferMonitoring();

                                if (videoRef.current) {
                                    videoRef.current.volume = volume;
                                    videoRef.current.muted = isMuted;

                                    try {
                                        await videoRef.current.play();
                                        setIsPlaying(true);
                                        setIsLoading(false);
                                        setIsBuffering(false);
                                        console.log('HLS playback started successfully');
                                    } catch (error) {
                                        console.log('Auto-play prevented:', error);
                                        setIsPlaying(false);
                                        setIsLoading(false);
                                    }
                                }

                                resolve();
                            });

                            hls.on(window.Hls.Events.ERROR, (event, data) => {
                                console.error('HLS Error:', data);

                                if (data.fatal) {
                                    stopBufferMonitoring();

                                    if (!resolved) {
                                        resolved = true;
                                        clearTimeout(timeout);

                                        let errorMsg = 'Fatal stream error. Please try another channel.';

                                        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                                            errorMsg = 'Network error: Unable to load the stream. Please check your connection.';
                                        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                                            errorMsg = 'Media error: Stream format issue. Please try again.';
                                        }

                                        reject(new Error(errorMsg));
                                    }
                                } else {
                                    // Handle non-fatal errors
                                    if (data.details === 'bufferStalledError' ||
                                        data.details === 'bufferSeekOverHole' ||
                                        data.details === 'bufferNudgeOnStall') {

                                        recoverFromBufferStall(data);
                                    } else {
                                        console.warn('Non-fatal HLS error:', data);
                                    }
                                }
                            });

                            // Useful events
                            hls.on(window.Hls.Events.BUFFER_CREATED, () => {
                                console.log('Buffer created');
                            });

                            hls.on(window.Hls.Events.BUFFER_APPENDED, () => {
                                // Buffer is getting filled
                                if (isBuffering && bufferHealth > 2) {
                                    setIsBuffering(false);
                                }
                            });

                            hls.on(window.Hls.Events.LEVEL_SWITCHED, (event, data) => {
                                console.log('Quality level switched to:', data.level);
                                if (hls.levels[data.level]) {
                                    setStreamQuality(hls.levels[data.level].height + 'p');
                                }
                            });

                            hls.on(window.Hls.Events.FRAG_BUFFERED, () => {
                                // Fragment successfully buffered
                                setLastBufferTime(Date.now());
                                if (stallRecoveryAttempts > 0) {
                                    stallRecoveryAttempts = Math.max(0, stallRecoveryAttempts - 1);
                                    setRetryCount(stallRecoveryAttempts);
                                }
                            });

                            // Cleanup function
                            hls.on(window.Hls.Events.DESTROYING, () => {
                                stopBufferMonitoring();
                            });
                        });
                    };

                    // Load source and attach to video
                    console.log('Loading HLS source...');
                    hls.loadSource(url);
                    hls.attachMedia(videoRef.current);

                    // Wait for HLS to be ready
                    await setupHLSEventListeners();

                } else {
                    // Fallback
                    console.log('Using fallback video source');
                    videoRef.current.src = url;
                    setIsLoading(false);

                    if (hasUserInteracted) {
                        try {
                            await videoRef.current.play();
                            setIsPlaying(true);
                        } catch (error) {
                            console.log('Auto-play prevented:', error);
                            setIsPlaying(false);
                        }
                    }
                }
            }

            console.log('Stream loaded successfully');

        } catch (error) {
            console.error('Stream loading error:', error);
            setIsLoading(false);
            setIsBuffering(false);
            setErrorMessage(error.message || 'Something went wrong. Please refresh and try again.');
            setShowErrorModal(true);
        }
    };


    const handleChannelSelect = async (channel) => {
        console.log('Channel selected:', channel.name);

        // Prevent selecting the same channel multiple times
        if (lastSelectedChannel?._id === channel._id && !showErrorModal) {
            console.log('Same channel already selected');
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

        // Clear previous states
        setShowErrorModal(false);
        setIsLoading(true);

        // Clear any existing loading timeout
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
        }

        // Set current channel immediately
        setCurrentChannel(channel);
        setLastSelectedChannel(channel);
        setHasUserInteracted(true);

        // Check if channel has valid stream URL
        if (!channel.m3u8_url) {
            console.error('No stream URL found for channel:', channel.name);
            setErrorMessage('Stream URL not available for this channel.');
            setShowErrorModal(true);
            setIsLoading(false);
            return;
        }

        try {
            console.log('Loading stream for:', channel.name);
            console.log('Stream URL:', channel.m3u8_url);

            // Add delay to prevent rapid switching issues
            await new Promise(resolve => setTimeout(resolve, 200));

            await loadHLSStream(`/api/stream?url=${encodeURIComponent(channel.m3u8_url)}`);

        } catch (error) {
            console.error('Error in handleChannelSelect:', error);
            setErrorMessage('Failed to load channel. Please try again.');
            setShowErrorModal(true);
            setIsLoading(false);
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
                        {/* Video Player with Enhanced Loading States - Replace your video player section */}
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
                                                setIsBuffering(false);
                                                setErrorMessage('Video playback error. Please try again.');
                                                setShowErrorModal(true);
                                            }}
                                            onClick={togglePlayPause}
                                        >
                                            Your browser does not support the video tag.
                                        </video>

                                        {/* Initial Loading Overlay */}
                                        {isLoading && !isBuffering && (
                                            <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
                                                <div className="text-center">
                                                    <Loader2 className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 animate-spin text-blue-400" />
                                                    <p className="text-white text-lg lg:text-xl mb-2">Loading stream...</p>
                                                    <p className="text-gray-400 text-sm">Please wait while we prepare your channel</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Buffering Overlay */}
                                        {isBuffering && !isLoading && (
                                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                                <div className="text-center bg-black/50 rounded-lg p-4 lg:p-6">
                                                    <div className="relative">
                                                        <Loader2 className="w-8 h-8 lg:w-10 lg:h-10 mx-auto mb-3 animate-spin text-blue-400" />
                                                        {retryCount > 0 && (
                                                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                                {retryCount}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-white text-sm lg:text-base mb-1">Buffering...</p>
                                                    {retryCount > 0 && (
                                                        <p className="text-yellow-400 text-xs lg:text-sm">
                                                            Retry attempt {retryCount}/8
                                                        </p>
                                                    )}
                                                    {bufferHealth > 0 && (
                                                        <div className="mt-2">
                                                            <div className="bg-gray-700 rounded-full h-1 w-24 mx-auto">
                                                                <div
                                                                    className="bg-blue-400 h-1 rounded-full transition-all duration-300"
                                                                    style={{ width: `${Math.min(100, (bufferHealth / 10) * 100)}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-gray-400 text-xs mt-1">
                                                                Buffer: {bufferHealth.toFixed(1)}s
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Stream Quality & Buffer Health Indicator */}
                                        {currentChannel && !isLoading && (
                                            <div className="absolute top-2 lg:top-4 left-2 lg:left-4 flex flex-col space-y-2">
                                                {/* Connection Quality */}
                                                <div className="bg-black/70 text-white px-2 py-1 rounded text-xs lg:text-sm flex items-center space-x-2">
                                                    <div className={`w-2 h-2 rounded-full ${bufferHealth > 5 ? 'bg-green-500' :
                                                            bufferHealth > 2 ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                        }`}></div>
                                                    <span className="hidden sm:inline">
                                                        {bufferHealth > 5 ? 'Excellent' :
                                                            bufferHealth > 2 ? 'Good' :
                                                                'Poor'}
                                                    </span>
                                                    <span className="text-xs text-gray-300">
                                                        {bufferHealth.toFixed(1)}s
                                                    </span>
                                                </div>

                                                {/* Stream Quality */}
                                                {streamQuality && streamQuality !== 'auto' && (
                                                    <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                                                        {streamQuality}
                                                    </div>
                                                )}

                                                {/* Retry Counter (only show if retrying) */}
                                                {retryCount > 0 && (
                                                    <div className="bg-red-500/80 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        <span>Retry {retryCount}/8</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Video Controls Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 lg:p-4">
                                            <div className="flex items-center justify-between text-white">
                                                <div className="flex items-center space-x-2 lg:space-x-4">
                                                    <button
                                                        onClick={togglePlayPause}
                                                        disabled={isLoading || isBuffering}
                                                        className={`bg-blue-600 hover:bg-blue-700 rounded-full p-1.5 lg:p-2 transition-colors ${(isLoading || isBuffering) ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                    >
                                                        {isLoading || isBuffering ? (
                                                            <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                                                        ) : isPlaying ? (
                                                            <Pause className="w-4 h-4 lg:w-5 lg:h-5" />
                                                        ) : (
                                                            <Play className="w-4 h-4 lg:w-5 lg:h-5 ml-0.5" />
                                                        )}
                                                    </button>

                                                    <div className="flex items-center space-x-1 lg:space-x-2">
                                                        <button
                                                            onClick={toggleMute}
                                                            className="hover:text-blue-400 transition-colors disabled:opacity-50"
                                                            disabled={isLoading || isBuffering}
                                                        >
                                                            {isMuted ? <VolumeX className="w-3 h-3 lg:w-4 lg:h-4" /> : <Volume2 className="w-3 h-3 lg:w-4 lg:h-4" />}
                                                        </button>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="1"
                                                            step="0.1"
                                                            value={volume}
                                                            onChange={handleVolumeChange}
                                                            disabled={isLoading || isBuffering}
                                                            className="w-12 lg:w-16 accent-blue-600 disabled:opacity-50"
                                                        />
                                                    </div>

                                                    {/* Live indicator */}
                                                    <div className="hidden sm:flex items-center space-x-2 text-xs lg:text-sm text-gray-300">
                                                        <div className="flex items-center space-x-1">
                                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                            <span>LIVE</span>
                                                        </div>
                                                        {currentChannel.viewer_count && (
                                                            <div className="flex items-center space-x-1">
                                                                <Eye className="w-3 h-3" />
                                                                <span>{currentChannel.viewer_count?.toLocaleString()}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    {/* Buffer health indicator */}
                                                    {bufferHealth > 0 && !isLoading && (
                                                        <div className="hidden lg:flex items-center space-x-1 text-xs text-gray-300">
                                                            <div className="bg-gray-600 rounded-full h-1 w-8">
                                                                <div
                                                                    className={`h-1 rounded-full transition-all duration-300 ${bufferHealth > 5 ? 'bg-green-500' :
                                                                            bufferHealth > 2 ? 'bg-yellow-500' :
                                                                                'bg-red-500'
                                                                        }`}
                                                                    style={{ width: `${Math.min(100, (bufferHealth / 10) * 100)}%` }}
                                                                />
                                                            </div>
                                                            <span>{bufferHealth.toFixed(1)}s</span>
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={toggleFullscreen}
                                                        className="hover:text-blue-400 transition-colors disabled:opacity-50"
                                                        disabled={isLoading || isBuffering}
                                                    >
                                                        <Maximize className="w-3 h-3 lg:w-4 lg:h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Buffer Progress Bar */}
                                            {(isBuffering || bufferHealth < 3) && !isLoading && (
                                                <div className="mt-2">
                                                    <div className="bg-gray-700 rounded-full h-1 w-full">
                                                        <div
                                                            className="bg-blue-400 h-1 rounded-full transition-all duration-500 animate-pulse"
                                                            style={{
                                                                width: isBuffering ? '30%' : `${Math.min(100, (bufferHealth / 10) * 100)}%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
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
                            {
                                initialChannelsLoading ? (
                                    <div className="flex items-center justify-center h-40">
                                        <Loader2 className="w-8 h-8 lg:w-12 lg:h-12 animate-spin text-blue-400" />
                                        <p className="text-gray-400 ml-4">Loading channels...</p>
                                    </div>
                                ) : <>
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
                                        loadHLSStream(currentChannel.m3u8_url);
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