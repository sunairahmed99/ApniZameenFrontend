import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../../context/SocketContext';
import { useAllChats, useMessages, useInitiateChat } from '../../../hooks/useChats';
import {
    FaPaperPlane,
    FaSearch,
    FaEllipsisV,
    FaCheckDouble,
    FaComments,
    FaArrowLeft,
    FaUserShield
} from 'react-icons/fa';
import '../Seller/SellerChat.css'; // Reuse seller chat styles

const AdminChat = () => {
    const { user, socket } = useSocket();
    const [selectedChatId, setSelectedChatId] = useState(null);
    const { data: chats, refetch: refetchChats } = useAllChats();
    const { data: messagesData } = useMessages(selectedChatId);

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('support'); // Default to Direct Support
    const messagesEndRef = useRef(null);
    const { mutateAsync: initiateChatAsync } = useInitiateChat();

    const getSenderId = (m) => {
        const id = m.senderId || m.sender || m.sender_id;
        return id && typeof id === 'object' ? (id._id || id.id) : id;
    };

    const getCurrentUserId = () => {
        return user?._id || user?.id;
    };

    useEffect(() => {
        if (messagesData) {
            setMessages(messagesData);
            scrollToBottom();
        }
    }, [messagesData]);

    useEffect(() => {
        if (socket && selectedChatId) {
            socket.emit('join_chat', selectedChatId);
            socket.emit('mark_as_read', { chatId: selectedChatId, userId: user?._id || user?.id });
        }
    }, [socket, selectedChatId, user]);

    useEffect(() => {
        if (!socket) return;

        const handleMsg = (msg) => {
            if (selectedChatId && msg.chatId === selectedChatId) {
                setMessages(prev => [...prev, msg]);
                scrollToBottom();
                // If we are in the active chat, mark it as read immediately
                socket.emit('mark_as_read', { chatId: selectedChatId, userId: user?._id || user?.id });
            }
            refetchChats();
        };

        const handleRead = (data) => {
            if (selectedChatId && data.chatId === selectedChatId) {
                setMessages(prev => prev.map(m => ({ ...m, read: true })));
            }
        };

        socket.on('receive_message', handleMsg);
        socket.on('messages_read', handleRead);
        return () => {
            socket.off('receive_message', handleMsg);
            socket.off('messages_read', handleRead);
        };
    }, [socket, selectedChatId, user]); // Added user to dependencies

    const handleSend = async () => {
        if (!message.trim() || !selectedChatId) return;

        let activeChatId = selectedChatId;

        // If this is a synthetic chat instance (not created in DB yet), initialize it
        if (typeof selectedChatId === 'string' && selectedChatId.startsWith('new_')) {
            const sellerId = selectedChatId.split('_')[1];
            try {
                const newChat = await initiateChatAsync({ recipientId: sellerId });
                activeChatId = newChat._id;
                setSelectedChatId(activeChatId);
            } catch (err) {
                console.error("Failed to initiate chat before sending message", err);
                return;
            }
        }

        const msgData = {
            chatId: activeChatId,
            senderId: user._id || user.id,
            text: message
        };

        socket.emit('send_message', msgData);
        setMessages(prev => [...prev, { ...msgData, timestamp: new Date() }]);
        setMessage('');
        scrollToBottom();
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const formatTime = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getOtherParticipantName = (chat) => {
        if (!chat || !chat.participants) return "User";
        const currentId = String(user?._id || user?.id);
        const other = chat.participants.find(p => {
            const pId = (p && typeof p === 'object') ? (p._id || p.id) : p;
            return String(pId) !== currentId;
        });
        return other?.name || "User";
    };

    const isAdminParticipant = (chat) => {
        if (!chat || !chat.participants) return false;
        const currentId = String(user?._id || user?.id);
        return chat.participants.some(p => {
            const pId = (p && typeof p === 'object') ? (p._id || p.id) : p;
            return String(pId) === currentId;
        });
    };

    const filteredChats = (chats || []).filter(chat => {
        const otherName = getOtherParticipantName(chat);
        const searchMatch = otherName.toLowerCase().includes(searchTerm.toLowerCase());

        // Return match text and ensure chat has participants
        if (!chat || !chat.participants) return false;
        
        if (activeTab === 'support') {
            // For Support tab, show Admin chats or pseudo-chats (which have Admin)
            return searchMatch && isAdminParticipant(chat);
        } else {
            // General tab: chats where Admin is NOT a participant (Seller-to-User)
            // also exclude 'pseudo-chats' from here, pseudo chats are only for Admin
            return searchMatch && !isAdminParticipant(chat) && !chat.isNew;
        }
    });

    const activeChatData = (chats || []).find(c => c._id === selectedChatId);

    return (
        <div className={`wa-container ${selectedChatId ? 'chat-active' : ''}`}>
            {/* Sidebar List */}
            <div className={`wa-side ${selectedChatId ? 'mobile-hide' : ''}`}>
                <div className="wa-side-header">
                    <div className="wa-avatar-main">
                        <img src={`https://ui-avatars.com/api/?name=Admin&background=random`} alt="me" />
                    </div>
                    <div className="wa-side-actions">
                        <FaEllipsisV />
                    </div>
                </div>

                <div className="wa-admin-tabs">
                    <button
                        className={`wa-tab ${activeTab === 'general' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('general'); setSelectedChatId(null); }}
                    >
                        Seller-User
                    </button>
                    <button
                        className={`wa-tab ${activeTab === 'support' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('support'); setSelectedChatId(null); }}
                    >
                        Seller-Admin
                    </button>
                </div>

                <div className="wa-search-container">
                    <div className="wa-search-bar">
                        <FaSearch className="wa-search-icon" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="wa-chat-list">
                    {filteredChats.map(chat => {
                        const isSelected = selectedChatId === chat._id;
                        const currentUserId = user?._id || user?.id;
                        const otherParticipant = chat.participants?.find(p => p._id !== String(currentUserId));
                        const displayName = otherParticipant?.name || "User";
                        const propertyTitle = chat.propertyId?.title || "";

                        return (
                            <div
                                key={chat._id}
                                className={`wa-chat-item ${isSelected ? 'active' : ''}`}
                                onClick={() => setSelectedChatId(chat._id)}
                            >
                                <div className="wa-avatar">
                                    <img src={`https://ui-avatars.com/api/?name=${displayName}&background=random`} alt="avatar" />
                                </div>
                                <div className="wa-chat-info">
                                    <div className="wa-chat-top">
                                        <span className="wa-chat-name">{displayName}</span>
                                        <span className="wa-chat-time">{formatTime(chat.lastMessage?.timestamp)}</span>
                                    </div>
                                    <div className="wa-chat-bottom flex-column align-items-start overflow-hidden">
                                        {propertyTitle && (
                                            <div className="wa-chat-property text-truncate w-100">
                                                {propertyTitle}
                                            </div>
                                        )}
                                        <p className="wa-chat-msg text-truncate w-100">
                                            {chat.lastMessage?.text || "No messages yet"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`wa-main ${!selectedChatId ? 'mobile-hide' : ''}`}>
                {selectedChatId ? (
                    <>
                        <div className="wa-main-header">
                            <button className="wa-back-btn d-md-none" onClick={() => setSelectedChatId(null)}>
                                <FaArrowLeft />
                            </button>
                            <div className="wa-avatar">
                                <img src={`https://ui-avatars.com/api/?name=${getOtherParticipantName(activeChatData)}&background=random`} alt="avatar" />
                            </div>
                            <div className="wa-header-info">
                                <span className="wa-header-name">{getOtherParticipantName(activeChatData)}</span>
                                <span className="wa-header-status">online</span>
                            </div>
                        </div>

                        <div className="wa-chat-area">
                            <div className="wa-chat-background"></div>
                            <div className="wa-messages">
                                {messages.map((msg, idx) => {
                                    const senderId = getSenderId(msg);
                                    const currentId = getCurrentUserId();
                                    const isMe = senderId && currentId && String(senderId) === String(currentId);
                                    
                                    return (
                                        <div key={idx} className={`wa-msg-row ${isMe ? 'wa-me' : 'wa-them'}`}>
                                            <div className="wa-msg-bubble">
                                                <div className="wa-msg-text">{msg.text}</div>
                                                <div className="wa-msg-footer">
                                                    <span className="wa-msg-time">{formatTime(msg.timestamp)}</span>
                                                    {isMe && <FaCheckDouble className="wa-status-icon" style={{color: msg.read ? '#53bdeb' : '#999'}} />}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        <div className="wa-input-container">
                            <div className="wa-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Type a message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button className="wa-send-btn" onClick={handleSend}>
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="wa-empty-state">
                        <div className="wa-empty-content">
                            <div className="wa-empty-icon">
                                <FaComments size={80} />
                            </div>
                            <h2>Admin Support Terminal</h2>
                            <p>Select a chat to monitor or participate in support.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChat;
