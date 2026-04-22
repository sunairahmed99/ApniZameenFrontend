import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../config';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isAuthRequired, setIsAuthRequired] = useState(false);

    const { user } = useSelector((state) => state.auth);

    // Only create socket when user is logged in — saves bandwidth for anonymous visitors
    useEffect(() => {
        if (!user) {
            // If user logs out, close and remove socket
            if (socket) {
                socket.close();
                setSocket(null);
            }
            return;
        }

        // Lazy import socket.io-client so the vendor-socket chunk is only loaded for logged-in users
        import('socket.io-client').then(({ default: io }) => {
            const newSocket = io(API_BASE_URL, {
                autoConnect: false,
                transports: ['polling', 'websocket'],
                reconnectionAttempts: 3,
                timeout: 5000,
            });

            newSocket.auth = { userId: user._id || user.id };
            newSocket.connect();

            newSocket.on('connect', () => {
                newSocket.emit('join_chat', user._id || user.id);
            });

            newSocket.on('receive_message', (msg) => {
                if (!isOpen || (activeChat && activeChat.chatId !== msg.chatId)) {
                    setUnreadCount(prev => prev + 1);
                }
            });

            setSocket(newSocket);

            return () => newSocket.close();
        });
    }, [user?._id]); // Only re-run when user id changes (login/logout)

    const openChatWith = async (params) => {
        if (!user) {
            setIsAuthRequired(true);
            return;
        }

        setActiveChat(params);
        setIsOpen(true);
    };

    const toggleWidget = () => {
        setIsOpen(!isOpen);
        if (isOpen) setActiveChat(null);
    };

    const value = React.useMemo(() => ({
        socket, isOpen, setIsOpen, activeChat, setActiveChat, openChatWith, toggleWidget, unreadCount, user,
        isAuthRequired, setIsAuthRequired
    }), [socket, isOpen, activeChat, unreadCount, user, isAuthRequired]);

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
