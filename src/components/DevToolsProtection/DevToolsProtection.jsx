'use client';
import React, { useEffect, useState } from 'react';

const DevToolsProtection = () => {
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');

    const showWarningModal = (message) => {
        setWarningMessage(message);
        setShowWarning(true);
        
        // Auto close after 3 seconds
        setTimeout(() => {
            setShowWarning(false);
        }, 3000);
    };



    useEffect(() => {

        if(process.env.NODE_ENV !== 'production') {
            console.warn('DevToolsProtection is only active in production mode.');
            return;
        }
        // Disable right-click context menu silently (no warning)
        const disableRightClick = (e) => {
            e.preventDefault();
            return false;
        };

        // Disable common developer tools keyboard shortcuts
        const disableKeyboardShortcuts = (e) => {
            let warningMsg = '';
            
            // F12
            if (e.keyCode === 123) {
                warningMsg = '🚨 DEVELOPER TOOLS BLOCKED - This function is dangerous and disabled!';
                e.preventDefault();
            }
            
            // Ctrl+Shift+I (Developer Tools)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                warningMsg = '🚨 INSPECT MODE BLOCKED - System security activated!';
                e.preventDefault();
            }
            
            // Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
                warningMsg = '🚨 CONSOLE ACCESS DENIED - This is a restricted area!';
                e.preventDefault();
            }
            
            // Ctrl+U (View Source)
            if (e.ctrlKey && e.keyCode === 85) {
                warningMsg = '🚨 SOURCE VIEW BLOCKED - This action will not work here!';
                e.preventDefault();
            }
            
            // Ctrl+Shift+C (Inspect Element)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
                warningMsg = '🚨 ELEMENT INSPECTOR BLOCKED - Access denied!';
                e.preventDefault();
            }

            // Ctrl+S (Save Page) - silently block without warning
            if (e.ctrlKey && e.keyCode === 83) {
                e.preventDefault();
                // No warning for save page as it's common
            }

            // Only show warning for developer tools related shortcuts
            if (warningMsg) {
                showWarningModal(warningMsg);
                return false;
            }
        };

        // Detect developer tools opening
        const detectDevTools = () => {
            const threshold = 160;
            
            const check = () => {
                if (
                    window.outerHeight - window.innerHeight > threshold ||
                    window.outerWidth - window.innerWidth > threshold
                ) {
                    showWarningModal('🚨 DEVELOPER TOOLS DETECTED - Close immediately or system will be locked!');
                }
            };

            setInterval(check, 1000);
        };

        // Disable text selection silently (no warning)
        const disableTextSelection = () => {
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            document.body.style.mozUserSelect = 'none';
            document.body.style.msUserSelect = 'none';
        };

        // Clear console periodically
        const clearConsole = () => {
            setInterval(() => {
                console.clear();
                console.log('%c🚨 WARNING: Console access is being monitored and blocked!', 'color: red; font-size: 20px; font-weight: bold;');
            }, 1000);
        };

        // Disable drag and drop silently (no warning)
        const disableDragDrop = (e) => {
            e.preventDefault();
            return false;
        };

        // Add event listeners
        document.addEventListener('contextmenu', disableRightClick);
        document.addEventListener('keydown', disableKeyboardShortcuts);
        document.addEventListener('dragstart', disableDragDrop);
        document.addEventListener('drop', disableDragDrop);

        // Initialize protections
        disableTextSelection();
        detectDevTools();
        clearConsole();

        // Cleanup function
        return () => {
            document.removeEventListener('contextmenu', disableRightClick);
            document.removeEventListener('keydown', disableKeyboardShortcuts);
            document.removeEventListener('dragstart', disableDragDrop);
            document.removeEventListener('drop', disableDragDrop);
            
            // Restore text selection
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            document.body.style.mozUserSelect = '';
            document.body.style.msUserSelect = '';
        };
    }, []);

    return (
        <div>
            
            {/* Warning Modal - Only shows for developer tools attempts */}
            {showWarning && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    animation: 'shake 0.5s ease-in-out'
                }}>
                    <div style={{
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        padding: '40px',
                        borderRadius: '15px',
                        textAlign: 'center',
                        boxShadow: '0 0 50px rgba(211, 47, 47, 0.8)',
                        border: '4px solid #ff1744',
                        maxWidth: '600px',
                        animation: 'pulse 1s infinite',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        <div style={{
                            fontSize: '64px',
                            marginBottom: '20px',
                            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))'
                        }}>🚨</div>
                        
                        <h2 style={{
                            margin: '0 0 20px 0',
                            fontSize: '28px',
                            fontWeight: 'bold',
                            textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
                            letterSpacing: '1px'
                        }}>
                            ⚠️ SECURITY BREACH DETECTED ⚠️
                        </h2>
                        
                        <p style={{
                            margin: '0 0 25px 0',
                            fontSize: '18px',
                            lineHeight: '1.5',
                            fontWeight: '500'
                        }}>
                            {warningMessage}
                        </p>
                        
                        <div style={{
                            fontSize: '14px',
                            opacity: 0.8,
                            fontStyle: 'italic',
                            background: 'rgba(0,0,0,0.3)',
                            padding: '10px',
                            borderRadius: '5px'
                        }}>
                            🔒 System Protection Active - Unauthorized access blocked
                        </div>
                    </div>
                </div>
            )}
            
            {/* CSS Animations */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0) rotate(0deg); }
                    25% { transform: translateX(-8px) rotate(-1deg); }
                    75% { transform: translateX(8px) rotate(1deg); }
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 50px rgba(211, 47, 47, 0.8); }
                    50% { transform: scale(1.02); box-shadow: 0 0 80px rgba(211, 47, 47, 1); }
                    100% { transform: scale(1); box-shadow: 0 0 50px rgba(211, 47, 47, 0.8); }
                }
            `}</style>
        </div>
    );
};

export default DevToolsProtection;