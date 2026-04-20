import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSocket } from '../../../context/SocketContext';
import {
    FaUserShield, FaEllipsisV, FaSearch, FaArrowLeft,
    FaCheckDouble, FaPaperPlane, FaComments
} from 'react-icons/fa';
import { useChats, useMessages, useInitiateChat, useAdminId } from '../../../hooks/useChats';
import './SellerChat.css';

const SellerChat = () => {
    const { user, socket } = useSocket();
    const location = useLocation();

    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messages, setMessages] = useState([]);

    const { data: chats, refetch: refetchChats } = useChats(user?._id || user?.id);
    const { data: fetchedMessages } = useMessages(selectedChatId);
    const initiateChatMutation = useInitiateChat();
    const adminIdQuery = useAdminId();

    const getSenderId = (m) => {
        const id = m.senderId || m.sender || m.sender_id;
        return id && typeof id === 'object' ? (id._id || id.id) : id;
    };

    const getCurrentUserId = () => {
        return user?._id || user?.id;
    };

    // Sync messages
    useEffect(() => {
        if (fetchedMessages) {
            setMessages(fetchedMessages);
            scrollToBottom();
            if (socket && selectedChatId) {
                socket.emit('join_chat', selectedChatId);
                socket.emit('mark_as_read', { chatId: selectedChatId, userId: user?._id || user?.id });
            }
        }
    }, [fetchedMessages, selectedChatId, socket, user]);

    useEffect(() => {
        if (user && adminIdQuery.isSuccess && adminIdQuery.data) {
            const params = new URLSearchParams(location.search);
            if (params.get('admin') === 'true') {
                startAdminChat();
            }
        }
    }, [user, location.search, adminIdQuery.isSuccess, adminIdQuery.data]);

    useEffect(() => {
        if (!socket) return;

        const handleMsg = (msg) => {
            if (selectedChatId && msg.chatId === selectedChatId) {
                setMessages(prev => [...prev, msg]);
                scrollToBottom();
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
    }, [socket, selectedChatId, refetchChats, user]);

    const handleSend = () => {
        if (!message.trim() || !selectedChatId) return;

        const msgData = {
            chatId: selectedChatId,
            senderId: user._id || user.id,
            text: message
        };

        socket.emit('send_message', msgData);
        setMessages(prev => [...prev, { ...msgData, timestamp: new Date() }]);
        setMessage('');
        scrollToBottom();
    };

    const startAdminChat = async () => {
        try {
            // If query is still loading, wait or show a message
            if (adminIdQuery.isLoading) {
                // You could show a toast or loader here
                return;
            }

            const adminData = adminIdQuery.data;

            if (!adminData?._id) {
                // If query finished but no ID, then show error
                if (adminIdQuery.isSuccess) {
                    alert("Admin user not found. Please try again later.");
                }
                return;
            }

            const chatData = await initiateChatMutation.mutateAsync({
                userId: adminData._id,
                sellerId: user._id || user.id
            });

            if (chatData._id) {
                setSelectedChatId(chatData._id);
            }
        } catch (err) {
            alert("Could not connect to Admin.");
        }
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

    const enrichedChats = (chats || []).map(chat => {
        let name = "Client";
        if (chat.participants && Array.isArray(chat.participants)) {
            const currentUserId = user?._id || user?.id;
            const otherParticipant = chat.participants.find(p => p._id !== currentUserId);
            if (otherParticipant && otherParticipant.name) {
                name = otherParticipant.name;
            }
        }
        if (chat.propertyId && chat.propertyId.title) {
            name = `${name} - ${chat.propertyId.title}`;
        }
        return {
            ...chat,
            chatName: name
        };
    });

    const filteredChats = enrichedChats.filter(chat =>
        chat.chatName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeChatData = enrichedChats.find(c => c._id === selectedChatId);

    return (
        <div className={`wa-container ${selectedChatId ? 'chat-active' : ''}`}>
            {/* Sidebar List */}
            <div className={`wa-side ${selectedChatId ? 'mobile-hide' : ''}`}>
                <div className="wa-side-header">
                    <div className="wa-avatar-main">
                        <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} alt="me" />
                    </div>
                    <div className="wa-side-actions">
                        <button
                            className="wa-action-btn"
                            title="Chat with Admin"
                            onClick={startAdminChat}
                        >
                            <FaUserShield />
                        </button>
                        <FaEllipsisV />
                    </div>
                </div>

                <div className="wa-search-container">
                    <div className="wa-search-bar">
                        <FaSearch className="wa-search-icon" />
                        <input
                            type="text"
                            placeholder="Search or start new chat"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="wa-chat-list">
                    {filteredChats.map(chat => {
                        const isSelected = selectedChatId === chat._id;
                        const currentId = getCurrentUserId();
                        const otherParticipant = chat.participants?.find(p => p._id !== String(currentId));
                        const displayName = otherParticipant?.name || "Client";
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
                                <img src={`https://ui-avatars.com/api/?name=${activeChatData?.chatName || 'C'}&background=random`} alt="avatar" />
                            </div>
                            <div className="wa-header-info">
                                <span className="wa-header-name">{activeChatData?.chatName}</span>
                                <span className="wa-header-status">online</span>
                            </div>
                            <div className="wa-header-actions">
                                <FaSearch />
                                <FaEllipsisV />
                            </div>
                        </div>

                        <div className="wa-chat-area">
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
                                                    {isMe && <FaCheckDouble className="wa-status-icon" style={{ color: msg.read ? '#53bdeb' : '#999' }} />}
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
                            <h2>WhatsApp Web</h2>
                            <p>Send and receive messages without keeping your phone online.</p>
                            <div className="wa-empty-footer">
                                <span>End-to-end encrypted</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerChat;
