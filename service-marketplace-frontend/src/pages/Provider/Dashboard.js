import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components/Common';
import styles from './ProviderDashboard.module.css';

const ProviderDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const providerActions = [
        { title: 'My Services', desc: 'Create and manage your professional listings', icon: '📋', link: '/provider/services', btnText: 'Manage All' },
        { title: 'New Discount', desc: 'Promote services with time-limited offers', icon: '🎯', link: '/provider/discounts', btnText: 'Go Live' },
        { title: 'Approved Discount Card', desc: 'View and manage your approved discounts', icon: '✅', link: '/provider/approved-discounts', btnText: 'View Approved' }
    ];

    return (
        <div className={styles['dashboard-page-wrapper']}>
            <Header />

            <main className={`${styles['dashboard-main']} section-padding`}>
                <div className={styles.container}>
                    {/* Provider Welcome Header */}
                    <div className={`${styles['dashboard-welcome-banner']} ${styles['animate-up']}`}>
                        <div className={styles['welcome-text']}>
                            <span className={styles['badge-pro']}>PRO Partner</span>
                            <h1>Welcome back, <span className={styles['text-gradient']}>{user?.name}</span></h1>
                            <p>Here's what's happening with your service business today.</p>
                        </div>
                        <div className={styles['welcome-stats']}>
                            <div className={styles['stat-pill']}>
                                <span className={styles['stat-val']}>$2,450</span>
                                <span className={styles['stat-label']}>This Month</span>
                            </div>
                            <div className={styles['stat-pill']}>
                                <span className={styles['stat-val']}>4.9</span>
                                <span className={styles['stat-label']}>Rating</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick View Dashboard */}
                    <div className={styles['dashboard-actions-grid']}>
                        {providerActions.map((card, idx) => (
                            <div
                                key={idx}
                                className={`${styles['action-card-modern']} ${styles['animate-up']}`}
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <div className={styles['card-icon-blob']}>{card.icon}</div>
                                <div className={styles['card-body']}>
                                    <h3>{card.title}</h3>
                                    <p>{card.desc}</p>
                                    <button
                                        className={styles['btn-card-action']}
                                        onClick={() => navigate(card.link)}
                                    >
                                        {card.btnText}
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Active Jobs Section Removed */}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProviderDashboard;
