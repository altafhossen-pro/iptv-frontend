import { Lock } from 'lucide-react';
import React from 'react';

const CurrentChannelInfo = ({currentChannel}) => {
    return (
        <div className="mt-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-3">
                <img
                    src={currentChannel.logo}
                    alt={currentChannel.name}
                    className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                    <h3 className="font-semibold text-lg">{currentChannel.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                        <span className="flex items-center space-x-1">
                            <span className={`w-2 h-2 rounded-full ${currentChannel.is_online ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span>{currentChannel.is_online ? 'Live' : 'Offline'}</span>
                        </span>
                        <span>{currentChannel.quality}</span>
                        <span>{currentChannel.language}</span>
                        <span>{currentChannel.category_id.name}</span>
                    </div>
                </div>
                {currentChannel.is_premium && (
                    <div className="flex items-center space-x-1 text-yellow-400">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm">Premium</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrentChannelInfo;