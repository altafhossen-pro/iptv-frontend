import React from 'react';

const KeyboardShortcut = () => {
    return (
        <div className="mt-4 bg-gray-800 p-3 rounded-lg border border-gray-700">
            <h4 className="text-sm font-medium mb-2 text-gray-300">Keyboard Shortcuts:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                <div>Space - Play/Pause</div>
                <div>F - Fullscreen</div>
                <div>↑/↓ - Volume</div>
                <div>M - Mute</div>
            </div>
        </div>
    );
};

export default KeyboardShortcut;