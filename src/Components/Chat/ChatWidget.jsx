import React, { useState, useEffect, useRef } from 'react';
import { useChats, useInitiateChat, useMessages } from '../../hooks/useChats';
import { useSocket } from '../../context/SocketContext';
import { FaComments, FaArrowLeft, FaTimes, FaPaperPlane, FaCheckDouble } from 'react-icons/fa';
import AuthModal from '../AuthModal/AuthModal';
import './ChatWidget.css';


const ChatWidget = () => {
    const { user, socket, isOpen, setIsOpen, activeChat, setActiveChat, unreadCount, toggleWidget } = useSocket();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [view, setView] = useState('list'); // 'list' or 'chat'
    const messagesEndRef = useRef(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
        if (chatData?.chatName) return chatData.chatName;
        let name = "Chat";
        if (chatData?.participants && Array.isArray(chatData.participants)) {
            const currentUserId = user?._id || user?.id;
            const otherParticipant = chatData.participants.find(p => p._id !== currentUserId);
            if (otherParticipant && otherParticipant.name) {
                name = otherParticipant.name;
            }
        }
        
        if (chatData?.propertyId && chatData.propertyId.title) {
            if (name === "Chat") name = "Seller"; // Default if we only know property
            name = `${name} - ${chatData.propertyId.title}`;
        }
        return name;
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

    // If activeChat is set via property page, switch to chat view
    useEffect(() => {
        if (activeChat) {
            setView('chat');
            initiateChat(activeChat);
        }
    }, [activeChat]);

    // Listen for incoming messages
    useEffect(() => {
        if (socket) {
            const handleMsg = (msg) => {
                if (activeChat && (msg.chatId === activeChat._id || msg.chatId === activeChat.chatId)) {
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
            // Room join is handled by socket emit in loadMessages logic or similar
            if (socket) socket.emit('join_chat', details._id || details.chatId);
            return;
        }

        try {
            const chat = await initiateChatMutation.mutateAsync({
                userId: user._id || user.id,
                sellerId: details.sellerId,
                propertyId: details.propertyId
            });

            if (chat && chat._id) {
                setActiveChat(chat);
                if (socket) socket.emit('join_chat', chat._id);
            }
        } catch (err) {
            
            alert("Failed to start chat. Please try again.");
        }
    };

    const handleSend = () => {
        if (!message.trim() || !activeChat) return;

        const msgData = {
            chatId: activeChat._id,
            senderId: user._id || user.id,
            text: message
        };

        socket.emit('send_message', msgData);
        setMessages(prev => [...prev, { ...msgData, timestamp: new Date() }]); // Optimistic UI
        setMessage('');
        scrollToBottom();
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleFabClick = () => {
        if (!user) {
            setIsAuthModalOpen(true);
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

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

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
                                        const name = getChatName(chat);
                                        return (
                                            <div key={chat._id} className="chat-list-item d-flex align-items-center" onClick={() => { setActiveChat(chat); setView('chat'); }}>
                                                <div className="chat-avatar me-3">
                                                    <img src={`https://ui-avatars.com/api/?name=${name}&background=random`} alt="av" />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold">{name}</div>
                                                    <div className="small text-muted text-truncate">{chat.lastMessage?.text || "No messages"}</div>
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
                                    <button className="btn btn-primary" onClick={handleSend}><FaPaperPlane /></button>
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
