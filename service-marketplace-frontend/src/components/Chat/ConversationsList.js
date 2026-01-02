import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './ConversationsList.css';

const ConversationsList = ({ onSelectConversation }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConversations = async () => {
        try {
            const response = await api.get('/chat/conversations');
            setConversations(response.data.data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 10000); // Check for new chats every 10s
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="conv-loading">Loading conversations...</div>;

    return (
        <div className="conversations-container">
            <h2 className="conv-title">Recent Messages</h2>
            {conversations.length === 0 ? (
                <div className="no-conv">No active conversations yet.</div>
            ) : (
                <div className="conv-list">
                    {conversations.map((conv, idx) => (
                        <div
                            key={idx}
                            className="conv-item animate-up"
                            style={{ animationDelay: `${idx * 0.05}s` }}
                            onClick={() => onSelectConversation(conv.partner)}
                        >
                            <div className="conv-avatar-wrapper">
                                <img
                                    src={conv.partner.profile_image ? (
                                        (conv.partner.profile_image.startsWith('data:') || conv.partner.profile_image.startsWith('http'))
                                            ? conv.partner.profile_image
                                            : `data:image/jpeg;base64,${conv.partner.profile_image}`
                                    ) : `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.partner.name)}&background=random`}
                                    alt={conv.partner.name}
                                    className="conv-avatar"
                                />
                                {conv.unread_count > 0 && (
                                    <span className="unread-badge">{conv.unread_count}</span>
                                )}
                            </div>
                            <div className="conv-details">
                                <div className="conv-header">
                                    <span className="conv-name">{conv.partner.name}</span>
                                    <span className="conv-time">
                                        {new Date(conv.last_active).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className={`conv-last-msg ${conv.unread_count > 0 ? 'unread' : ''}`}>
                                    {conv.last_message?.message || 'No messages yet'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConversationsList;
