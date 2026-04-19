import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaWifi, FaExclamationTriangle } from 'react-icons/fa';

const NetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [networkError, setNetworkError] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setNetworkError(false);
        };
        const handleOffline = () => setIsOnline(false);
        const handleNetworkError = () => setNetworkError(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('network-error', handleNetworkError);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('network-error', handleNetworkError);
        };
    }, []);

    if (isOnline && !networkError) return null;

    const message = !isOnline
        ? "No Internet Connection"
        : "Network Error: Unable to reach server";

    return createPortal(
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            backgroundColor: '#dc3545',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '16px',
            fontWeight: '500',
            animation: 'slideUp 0.3s ease-out'
        }}>
            {isOnline ? <FaExclamationTriangle /> : <FaWifi />}
            <span>{message}</span>
            <style>
                {`
                    @keyframes slideUp {
                        from { transform: translate(-50%, 100%); opacity: 0; }
                        to { transform: translate(-50%, 0); opacity: 1; }
                    }
                `}
            </style>
        </div>,
        document.body
    );
};

export default NetworkStatus;
