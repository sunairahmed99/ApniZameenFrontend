import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useChats, useInitiateChat, useMessages } from '../../hooks/useChats';
import { useSocket } from '../../context/SocketContext';
import { FaComments, FaArrowLeft, FaTimes, FaPaperPlane, FaCheckDouble } from 'react-icons/fa';
import AuthModal from '../AuthModal/AuthModal';
import './ChatWidget.css';


const ChatWidget = () => {
    const { 
        user, socket, isOpen, setIsOpen, activeChat, setActiveChat, unreadCount, toggleWidget,
        isAuthRequired, setIsAuthRequired 
    } = useSocket();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [view, setView] = useState('list'); // 'list' or 'chat'
    const messagesEndRef = useRef(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Trigger modal when global auth state requires it (from property cards/details)
    useEffect(() => {
        if (isAuthRequired) {
            setIsAuthModalOpen(true);
        }
    }, [isAuthRequired]);

    const handleCloseAuthModal = () => {
        setIsAuthModalOpen(false);
        setIsAuthRequired(false);
    };

    const { data: chats = [], refetch: refetchChats } = useChats(user?._id || user?.id);
    const initiateChatMutation = useInitiateChat();

    const getSenderId = (m) => {
        const id = m.senderId || m.sender || m.sender_id;
        return id && typeof id === 'object' ? (id._id || id.id) : id;
    };

    const getCurrentUserId = () => {
        return user?._id || user?.id;
    };

    const getChatName = (chatData) => {
        if (!chatData) return "Chat";
        
        // 1. If we have an explicit name (synthetic or merged), prioritize it
        if (chatData.name && chatData.name !== "Seller" && chatData.name !== "Support") {
            return chatData.name;
        }

        // 2. Try to find other participant's name if populated
        if (chatData.participants && Array.isArray(chatData.participants)) {
            const currentUserId = getCurrentUserId();
            const otherParticipant = chatData.participants.find(p => {
                const pid = p._id || p; // Handle populated vs ID
                return pid && String(pid) !== String(currentUserId);
            });
            
            if (otherParticipant && typeof otherParticipant === 'object' && otherParticipant.name) {
                return otherParticipant.name;
            }
        }
        
        // 3. Fallback to property title if it's the only info we have
        if (chatData.propertyId?.title) return "Seller";
        
        // 4. Last resort
        return "Support";
    };

    const activeChatId = activeChat?._id || activeChat?.chatId;
    const { data: fetchedMessages } = useMessages(activeChatId);

    // Sync fetched messages with internal state
    useEffect(() => {
        if (fetchedMessages) {
            setMessages(fetchedMessages);
            scrollToBottom();
            if (socket && activeChatId) {
                socket.emit('mark_as_read', { chatId: activeChatId, userId: user?._id || user?.id });
            }
        }
    }, [fetchedMessages, socket, activeChatId, user]);

    // If activeChat is set via property page (synthetic object without ID), initialize it
    useEffect(() => {
        if (activeChat && !activeChat._id && !activeChat.chatId) {
            setView('chat');
            initiateChat(activeChat);
        } else if (activeChat) {
            setView('chat');
        }
    }, [activeChat]); // Trigger on any change to activeChat state

    // Listen for incoming messages
    useEffect(() => {
        if (socket) {
            const handleMsg = (msg) => {
                if (activeChat && (msg.chatId === activeChat._id || msg.chatId === activeChat.chatId)) {
                    // Check if message is from current user
                    const currentId = user?._id || user?.id;
                    const senderId = msg.senderId || msg.sender;
                    
                    // If it's our own message, don't add it again (already handled by handleSend's optimistic update)
                    if (senderId && currentId && String(senderId) === String(currentId)) {
                        return;
                    }

                    setMessages((prev) => [...prev, msg]);
                    scrollToBottom();
                    socket.emit('mark_as_read', { chatId: msg.chatId, userId: user?._id || user?.id });
                } else {
                    if (view === 'list') refetchChats();
                }
            };

            const handleRead = (data) => {
                if (activeChatId && data.chatId === activeChatId) {
                    setMessages(prev => prev.map(m => ({ ...m, read: true })));
                }
            };

            socket.on('receive_message', handleMsg);
            socket.on('messages_read', handleRead);
            return () => {
                socket.off('receive_message', handleMsg);
                socket.off('messages_read', handleRead);
            };
        }
    }, [socket, activeChat, view, refetchChats, user, activeChatId]);

    const initiateChat = async (details) => {
        if (details._id || details.chatId) {
            const id = details._id || details.chatId;
            if (socket) socket.emit('join_chat', id);
            return { _id: id };
        }

        // Safety gate: openChatWith already prevents unauthorized calls, 
        // but this check ensures no mutation is called if user is missing.
        if (!user) return null;

        try {
            const chat = await initiateChatMutation.mutateAsync({
                userId: user._id || user.id,
                sellerId: details.sellerId,
                propertyId: details.propertyId
            });

            if (chat && chat._id) {
                // Merge context from synthetic activeChat (like name/property info) 
                // if the backend response is somehow incomplete or delayed.
                const mergedChat = {
                    ...details,
                    ...chat,
                    name: details.name || getChatName(chat)
                };
                setActiveChat(mergedChat);
                if (socket) socket.emit('join_chat', chat._id);
                return mergedChat;
            }
        } catch (err) {
            // Only alert for actual API failures, not authentication
            alert("Failed to start chat. Please try again.");
            return null;
        }
    };

    const handleSend = async () => {
        if (!message.trim() || !activeChat) return;

        let chatId = activeChat._id || activeChat.chatId;

        // If chat isn't initialized yet (started from property page), initialize it first
        if (!chatId) {
            try {
                const chat = await initiateChat(activeChat);
                if (!chat?._id) return;
                chatId = chat._id;
            } catch (err) {
                console.error("Failed to initiate chat in handleSend:", err);
                return;
            }
        }

        const msgData = {
            chatId: chatId,
            senderId: user._id || user.id,
            text: message
        };

        try {
            // Get token from common localStorage path
            const userStr = localStorage.getItem('user');
            const userData = userStr ? JSON.parse(userStr) : null;
            const token = userData?.token;

            // Use Dynamic API Base URL for local/prod compatibility
            const response = await axios.post(`${API_BASE_URL}/api/chats/message`, {
                chatId: msgData.chatId,
                text: msgData.text
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state (Optimistic)
            setMessages(prev => [...prev, { ...msgData, timestamp: new Date() }]);
            setMessage('');
            scrollToBottom();
        } catch (err) {
            console.error("Failed to send message via HTTP:", err);
            let errorMsg = "Please try again later.";
            if (err.response?.status === 401) {
                errorMsg = "Your session has expired. Please log in again.";
            } else if (err.response?.data?.message) {
                errorMsg = err.response.data.message;
            } else if (err.message) {
                errorMsg = err.message;
            }
            alert(`Unable to send: ${errorMsg}`);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleFabClick = () => {
        if (!user) {
            setIsAuthRequired(true);
        } else {
            toggleWidget();
        }
    };

    return (
        <div className="chat-widget-container">
            {/* Floating Icon */}
            <div className="chat-fab" onClick={handleFabClick}>
                <FaComments size={24} />
                {unreadCount > 0 && <span className="chat-badge">{unreadCount}</span>}
            </div>

            <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />

            {/* Chat Window */}
            {user && isOpen && (
                <div className="chat-window shadow-lg">
                    <div className="chat-header">
                        {view === 'chat' && (
                            <button className="btn btn-sm text-white me-2" onClick={() => { setView('list'); setActiveChat(null); }}>
                                <FaArrowLeft />
                            </button>
                        )}
                        {view === 'chat' && (
                            <div className="chat-avatar-small me-2">
                                <img src={`https://ui-avatars.com/api/?name=${getChatName(activeChat)}&background=random`} alt="av" />
                            </div>
                        )}
                        <span>{view === 'chat' ? getChatName(activeChat) : 'Messages'}</span>
                        <button className="btn btn-sm text-white ms-auto" onClick={() => setIsOpen(false)}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="chat-body">
                        {view === 'list' ? (
                            <div className="chat-list">
                                {chats.length === 0 ? <p className="text-center mt-3 text-muted">No conversations yet.</p> : (
                                    chats.map(chat => {
                                        const currentUserId = user?._id || user?.id;
                                        
                                        // Helper to safely get ID for comparison
                                        const getPid = (p) => p && typeof p === 'object' ? (p._id || p.id) : p;
                                        
                                        const otherParticipant = chat.participants?.find(p => 
                                            getPid(p) && String(getPid(p)) !== String(currentUserId)
                                        );
                                        
                                        const displayName = otherParticipant?.name || "Seller";
                                        const propertyTitle = chat.propertyId?.title || "";
                                        
                                        return (
                                            <div key={chat._id} className="chat-list-item d-flex align-items-center" onClick={() => { setActiveChat(chat); setView('chat'); }}>
                                                <div className="chat-avatar me-3">
                                                    <img src={`https://ui-avatars.com/api/?name=${displayName}&background=random`} alt="av" />
                                                </div>
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <div className="chat-item-title">{displayName}</div>
                                                    {propertyTitle && (
                                                        <div className="chat-item-subtitle text-truncate">
                                                            {propertyTitle}
                                                        </div>
                                                    )}
                                                    <div className="chat-item-last-msg text-truncate">{chat.lastMessage?.text || "No messages"}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        ) : (
                            <div className="chat-messages d-flex flex-column h-100">
                                <div className="messages-area flex-grow-1 overflow-auto p-2 d-flex flex-column position-relative">
                                    <div className="wa-chat-background"></div>
                                    <div className="wa-messages-list" style={{ position: 'relative', zIndex: 1 }}>
                                        {Array.isArray(messages) && messages.map((msg, idx) => {
                                            const senderId = getSenderId(msg);
                                            const currentId = getCurrentUserId();
                                            const isMe = senderId && currentId && String(senderId) === String(currentId);

                                            return (
                                                <div key={idx} className={`message-row ${isMe ? 'wa-me' : 'wa-them'}`}>
                                                    <div className="message-bubble">
                                                        <div className="message-text">{msg.text}</div>
                                                        <div className="message-footer">
                                                            <span className="message-time">
                                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            {isMe && <FaCheckDouble className="ms-1" style={{ fontSize: '0.8rem', color: msg.read ? '#53bdeb' : '#999' }} />}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>
                                <div className="chat-input p-2 border-top d-flex">
                                    <input
                                        type="text"
                                        className="form-control me-2"
                                        placeholder="Type a message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    />
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={handleSend}
                                        disabled={initiateChatMutation.isLoading || !message.trim()}
                                    >
                                        {initiateChatMutation.isLoading ? (
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        ) : (
                                            <FaPaperPlane />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
