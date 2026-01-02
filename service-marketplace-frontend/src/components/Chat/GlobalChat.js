import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ConversationsList from './ConversationsList';
import ChatWindow from './ChatWindow';
import api from '../../services/api';
import './GlobalChat.css';

const GlobalChat = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [totalUnread, setTotalUnread] = useState(0);
    const overlayRef = useRef(null);

    const fetchUnreadCount = async () => {
        if (!user) return;
        try {
            const response = await api.get('/chat/conversations');
            const conversations = response.data.data;
            const count = conversations.reduce((acc, conv) => acc + (conv.unread_count || 0), 0);
            setTotalUnread(count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 5000);
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (overlayRef.current && !overlayRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!user) return null;

    const handleSelectConversation = (partner) => {
        setActiveChat(partner);
        setIsOpen(false);
    };

    return (
        <div className="global-chat-wrapper">
            {/* Floating Action Button */}
            {!activeChat && (
                <button
                    className="chat-fab"
                    onClick={() => setIsOpen(!isOpen)}
                    title="Messages"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="28" height="28">
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                    </svg>
                    {totalUnread > 0 && (
                        <span className="unread-count">{totalUnread > 99 ? '99+' : totalUnread}</span>
                    )}
                </button>
            )}

            {/* Conversations Overlay */}
            {isOpen && !activeChat && (
                <div className="conversations-overlay" ref={overlayRef}>
                    <div className="conv-overlay-header">
                        <h3>Messages</h3>
                        <button className="btn-close-overlay" onClick={() => setIsOpen(false)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="conv-overlay-content">
                        <ConversationsList onSelectConversation={handleSelectConversation} />
                    </div>
                </div>
            )}

            {/* Global Chat Window */}
            {activeChat && (
                <ChatWindow
                    partner={activeChat}
                    onClose={() => {
                        setActiveChat(null);
                        fetchUnreadCount(); // Refresh count when closing chat
                    }}
                />
            )}
        </div>
    );
};

export default GlobalChat;
