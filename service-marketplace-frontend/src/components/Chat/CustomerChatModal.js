import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ChatWindow from './ChatWindow';
import api from '../../services/api';
import './CustomerChatModal.css';

const CustomerChatModal = ({ isOpen, onClose, initialPartner = null }) => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activePartner, setActivePartner] = useState(initialPartner);
    const [loading, setLoading] = useState(true);

    const fetchConversations = async () => {
        try {
            const response = await api.get('/chat/conversations');
            setConversations(response.data.data);

            if (initialPartner && !activePartner) {
                setActivePartner(initialPartner);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchConversations();
            const interval = setInterval(fetchConversations, 10000);
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredConversations = conversations.filter(conv =>
        conv.partner.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="customer-chat-modal-overlay" onClick={onClose}>
            <div className="customer-chat-modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Left Sidebar: Conversations List */}
                <div className="customer-chat-sidebar">
                    <div className="sidebar-header">
                        <div className="sidebar-title-row">
                            <h3>Messages</h3>
                            <div className="sidebar-header-actions">
                                <button className="sidebar-action-btn">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="sidebar-search">
                            <div className="search-input-wrapper">
                                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search experts"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-conversations-list">
                        {loading && conversations.length === 0 ? (
                            <div className="conv-status-message">
                                <div className="loading-spinner-tiny"></div>
                                <span>Syncing chats...</span>
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="conv-status-message">
                                <span>{searchTerm ? 'No experts found' : 'No messages yet'}</span>
                            </div>
                        ) : (
                            filteredConversations.map((conv, idx) => (
                                <div
                                    key={idx}
                                    className={`sidebar-conversation-item ${activePartner?.id === conv.partner.id ? 'active' : ''}`}
                                    onClick={() => setActivePartner(conv.partner)}
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
                                            <span className="conv-unread-dot">{conv.unread_count}</span>
                                        )}
                                    </div>
                                    <div className="conv-summary">
                                        <div className="conv-header">
                                            <span className="conv-name">{conv.partner.name}</span>
                                            <span className="conv-time">
                                                {new Date(conv.last_active).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className={`conv-last-msg ${conv.unread_count > 0 ? 'highlight-unread' : ''}`}>
                                            {conv.last_message?.message || 'New conversation'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Area: Chat Content */}
                <div className="customer-chat-content">
                    {activePartner ? (
                        <ChatWindow
                            partner={activePartner}
                            onClose={onClose}
                            isEmbedded={true}
                        />
                    ) : (
                        <div className="chat-splash-screen">
                            <div className="splash-illustration">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" width="120" height="120">
                                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
                                    <path d="M8 9h8M8 13h5" />
                                </svg>
                            </div>
                            <h2>Connect with Your Experts</h2>
                            <p>Select a provider on the left to discuss your service needs.<br />Verified professionals at your fingertips.</p>
                            <div className="splash-lock">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                                <span>End-to-end encrypted</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Universal Modal Controls */}
                <button className="global-modal-close" onClick={onClose} aria-label="Close Chat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CustomerChatModal;
