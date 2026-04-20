import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../config';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [activeChat, setActiveChat] = useState(null); // { sellerId, propertyId, participantId }
    const [unreadCount, setUnreadCount] = useState(0);

    // Assuming user info is in Redux or local storage. 
    // For now we'll try to get it from localStorage if Redux isn't easy to tap into without inspecting store structure.
    // Or we pass it in if this component is inside Redux Provider.
    // Let's assume we can get user token/id from localStorage 'user_data' or similar as is common.
    const { user } = useSelector((state) => state.auth); // Sync with Redux

    useEffect(() => {
        // Connect to centralized API base URL
        const newSocket = io(API_BASE_URL, {
            autoConnect: false,
            transports: ['polling', 'websocket'], // Allow both for better compatibility
            reconnectionAttempts: 3, // Limit noise if platform rejects
            timeout: 5000, // Fail fast to let polling take over
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (socket && user) {
            socket.auth = { userId: user._id || user.id };
            socket.connect();

            socket.on('connect', () => {
                // join own room
                socket.emit('join_chat', user._id || user.id);
            });

            socket.on('receive_message', (msg) => {
                // Increment unread if chat not open or not active
                if (!isOpen || (activeChat && activeChat.chatId !== msg.chatId)) {
                    setUnreadCount(prev => prev + 1);
                }
            });
        }
    }, [socket, user, isOpen, activeChat]);

    const openChatWith = async (params) => {
        // params: { sellerId, propertyId, name, chatDetails }
        setActiveChat(params);
        setIsOpen(true);

        // Check if user is actually present
        if (!user) {
            alert("Please login to chat.");
            return;
        }

        // Optionally initiate via API if we need `chatId` before socket usage
        // But we can also lazily do it in the widget
    };

    const toggleWidget = () => {
        setIsOpen(!isOpen);
        if (isOpen) setActiveChat(null); // Clear active when closing? Or keep state?
    };

    const value = React.useMemo(() => ({
        socket, isOpen, setIsOpen, activeChat, setActiveChat, openChatWith, toggleWidget, unreadCount, user
    }), [socket, isOpen, activeChat, unreadCount, user]);

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

