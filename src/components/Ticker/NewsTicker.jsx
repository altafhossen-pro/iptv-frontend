'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Marquee from 'react-fast-marquee';

const NewsTicker = ({ 
    news = [], 
    speed = 50, 
    height = '50px',
    showIcon = true
}) => {
    // Default news items if none provided
    const defaultNews = [
        "🚨 ব্রেকিং নিউজ: নতুন IPTV সার্ভিস চালু হয়েছে! 🚨",
        "📺 ১০০+ চ্যানেল সহ প্রিমিয়াম IPTV প্যাকেজ 📺",
        "🔥 সীমিত সময়ের অফার: ৭৯ টাকায় প্রিমিয়াম প্ল্যান 🔥",
        "⚡ HD কোয়ালিটি সহ স্ট্রিমিং সার্ভিস ⚡",
        "🎯 বাংলাদেশের সেরা IPTV সার্ভিস প্রোভাইডার 🎯",
        "💎 বিনামূল্যে ট্রায়াল শুরু করুন আজই! 💎",
        "🌟 ২৪/৭ কাস্টমার সাপোর্ট সহ প্রফেশনাল সার্ভিস 🌟"
    ];

    const newsItems = news.length > 0 ? news : defaultNews;

    return (
        <div 
            className="relative bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white overflow-hidden shadow-lg border-b border-gray-600"
            style={{ height }}
        >
            {/* Breaking News Label */}
            <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 flex items-center justify-center z-10 min-w-[140px]">
                <div className="flex items-center space-x-2">
                    {showIcon && (
                        <AlertTriangle className="w-5 h-5 animate-pulse text-yellow-300" />
                    )}
                    <span className="font-bold text-sm whitespace-nowrap">
                        ব্রেকিং নিউজ
                    </span>
                </div>
            </div>

            {/* Ticker Content */}
            <div 
                className="flex items-center h-full"
                style={{ 
                    marginLeft: '140px', // Space for breaking news label
                    marginRight: '20px' // Small right margin
                }}
            >
                <Marquee
                    speed={speed}
                    gradient={false}
                    className="h-full flex items-center"
                >
                    {newsItems.map((item, index) => (
                        <div 
                            key={index}
                            className="flex items-center space-x-2 text-sm font-medium mx-8"
                        >
                            <span className="text-purple-400">•</span>
                            <span className="text-gray-200">{item}</span>
                        </div>
                    ))}
                </Marquee>
            </div>

            {/* Gradient Overlay for smooth edges */}
            <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-gray-800 to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-gray-800 to-transparent pointer-events-none"></div>
        </div>
    );
};

export default NewsTicker;
