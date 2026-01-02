import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header, Footer } from '../../components/Common';
import api from '../../services/api';
import styles from './Dashboard.module.css';
import ConversationsList from '../../components/Chat/ConversationsList';
import CustomerChatModal from '../../components/Chat/CustomerChatModal';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [activeInterests, setActiveInterests] = useState(0);
    const [activePartner, setActivePartner] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/my-interests/active-count');
            setActiveInterests(response.data.count);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    const handleSelectConversation = (partner) => {
        setActivePartner(partner);
        setIsChatOpen(true);
    };

    const dashboardCards = [
        { title: 'Search Services', desc: 'Find expert help in your area from top-rated pros', icon: '🔍', link: '/services', btnText: 'Browse Now' },
        { title: 'My Interests', desc: 'Track special offers and curated service discounts', icon: '⭐', link: '/customer/interests', btnText: 'Check Offers' },
        { title: 'Service History', desc: 'Review and manage your past completed tasks', icon: '📜', link: '/customer/history', btnText: 'View History' },
    ];

    return (
        <div className={styles.dashboardPageWrapper}>
            <Header />

            <main className={styles.dashboardMain}>
                <div className={styles.container}>
                    {/* Welcome Header */}
                    <div className={styles.dashboardWelcomeBanner}>
                        <div className={styles.welcomeText}>
                            <h1>Hello, <span className={styles.textGradient}>{user?.name}</span>!</h1>
                            <p>Manage your home services, track bookings, and discover exclusive local deals in one place.</p>
                        </div>
                        <div className={styles.welcomeStats}>
                            <div className={styles.statPill}>
                                <span className={styles.statVal}>{activeInterests}</span>
                                <span className={styles.statLabel}>Active Interests</span>
                            </div>
                        </div>
                    </div>

                    {location.state?.bookingSuccess && (
                        <div className={styles.successBanner}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: '#10b981' }}>
                                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Your booking has been confirmed successfully!</span>
                        </div>
                    )}

                    {/* Quick Actions Grid */}
                    <div className={styles.dashboardActionsGrid}>
                        {dashboardCards.map((card, idx) => (
                            <div
                                key={idx}
                                className={styles.actionCardModern}
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <div className={styles.cardIconBlob}>{card.icon}</div>
                                <div className={styles.cardBody}>
                                    <h3>{card.title}</h3>
                                    <p>{card.desc}</p>
                                    <button
                                        className={styles.btnCardAction}
                                        onClick={() => navigate(card.link)}
                                    >
                                        {card.btnText}
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Messages Section */}
                    <div className={styles.recentMessagesSection}>
                        <div className={styles.sectionHeaderRow}>
                            <h2>Recent Messages</h2>
                        </div>
                        <ConversationsList onSelectConversation={handleSelectConversation} />
                    </div>
                </div>
            </main>

            {/* Premium Chat Modal Overlay */}
            <CustomerChatModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                initialPartner={activePartner}
            />

            <Footer />
        </div>
    );
};

export default CustomerDashboard;
