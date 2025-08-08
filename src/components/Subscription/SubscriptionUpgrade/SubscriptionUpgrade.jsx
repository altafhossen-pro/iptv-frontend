import React from 'react';
import { Crown, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const SubscriptionUpgrade = () => {
    const pricePerMonth = 79;


    return (
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 shadow-xl border border-purple-500/30 my-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Crown className="text-yellow-400" size={28} />
                    <h3 className="text-2xl font-bold text-white">Upgrade to Premium</h3>
                </div>
                <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                    Popular
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-4xl font-bold text-white">৳{pricePerMonth}</span>
                    <span className="text-purple-200">/month</span>
                </div>
                <p className="text-purple-100">Unlock premium features and enjoy unlimited streaming</p>
            </div>

            <div className="space-y-3 mb-6">
                {[
                    '100+ Premium channels',
                    'No advertisements',
                    'Multiple device support',
                    '24/7 customer support'
                ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="text-green-400" size={16} />
                        <span className="text-purple-100 text-sm">{feature}</span>
                    </div>
                ))}
            </div>

            <Link href={`/profile/subscription/upgrade`}
            
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg transition duration-300 cursor-pointer block mx-auto text-center"
            >
                Upgrade Now
            </Link>
        </div>
    );
};

export default SubscriptionUpgrade;