import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './ChatWindow.css';

const ChatWindow = ({ partner, onClose, isEmbedded = false }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const windowRef = useRef(null);
    const { user } = useAuth();

    // Determine partner details
    const partnerId = partner.id;
    const isPartnerProvider = partner.role === 'provider' || partner.hasOwnProperty('services');
    const targetType = isPartnerProvider ? 'provider' : 'customer';

    const fetchMessages = async () => {
        try {
            const response = await api.get(`/chat/messages/${partnerId}/${targetType}`);
            setMessages(response.data.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [partnerId, targetType]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (windowRef.current && !windowRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (!isEmbedded) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEmbedded, onClose]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setLoading(true);
        try {
            const response = await api.post('/chat/send', {
                receiver_id: partnerId,
                receiver_type: targetType,
                message: newMessage
            });
            setMessages([...messages, response.data.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPartnerImage = () => {
        if (!partner.profile_image) return `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=random`;

        if (partner.profile_image.startsWith('data:') || partner.profile_image.startsWith('http')) {
            return partner.profile_image;
        }

        return `data:image/jpeg;base64,${partner.profile_image}`;
    };

    return (
        <div className={`chat-window ${isEmbedded ? 'embedded' : ''}`} ref={windowRef}>
            <div className="chat-header">
                <div className="chat-user-info">
                    <img src={getPartnerImage()} alt={partner.name} className="chat-avatar" />
                    <div className="chat-user-details">
                        <h4>{partner.name}</h4>
                        <div className="chat-status">
                            <span className="status-dot"></span>
                            Online
                        </div>
                    </div>
                </div>
                {!isEmbedded && (
                    <button className="btn-close-chat" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="chat-messages">
                {messages.map((msg) => {
                    const myRole = user.role === 'provider' ? 'provider' : 'customer';
                    const isMyMessage = msg.sender_type === myRole && msg.sender_id === user.id;

                    return (
                        <div key={msg.id} className={`message ${isMyMessage ? 'sent' : 'received'} ${isEmbedded ? 'wide' : ''}`}>
                            <div className="message-content">{msg.message}</div>
                            <span className="message-time">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <form onSubmit={handleSend} className="input-wrapper">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={loading}
                    />
                    <button type="submit" className="btn-send" disabled={loading || !newMessage.trim()}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
