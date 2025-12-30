import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header, Footer } from '../../components/Common';
import api from '../../services/api';
import '../Dashboard.css';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [activeInterests, setActiveInterests] = useState(0);

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

    const dashboardCards = [
        { title: 'Search Services', desc: 'Find expert help in your area', icon: '🔍', link: '/services', btnText: 'Browse Now' },
        // { title: 'My Bookings', desc: 'Manage your active service requests', icon: '📅', link: '/customer/bookings', btnText: 'View All' },
        { title: 'My Interests', desc: 'Track special offers and discounts', icon: '⭐', link: '/customer/interests', btnText: 'Check Offers' },
        // { title: 'Promo Codes', desc: 'Active coupons for your next job', icon: '🎟️', link: '/customer/promos', btnText: 'My Wallet' },
        { title: 'Service History', desc: 'Review past completed tasks', icon: '📜', link: '/customer/history', btnText: 'View History' },
        // { title: 'Preferences', desc: 'Customize your service experience', icon: '⚙️', link: '/customer/settings', btnText: 'Edit Profile' }
    ];

    return (
        <div className="dashboard-page-wrapper">
            <Header />

            <main className="dashboard-main section-padding">
                <div className="container">
                    {/* Welcome Header */}
                    <div className="dashboard-welcome-banner animate-up">
                        <div className="welcome-text">
                            <h1>Hello, <span className="text-gradient">{user?.name}</span>!</h1>
                            <p>Manage your home services and track your bookings in one place.</p>
                        </div>
                        <div className="welcome-stats">
                            <div className="stat-pill">
                                <span className="stat-val">{activeInterests}</span>
                                <span className="stat-label">Active Interests</span>
                            </div>
                        </div>
                    </div>

                    {location.state?.bookingSuccess && (
                        <div className="success-banner animate-up">
                            <span>🎉 Your booking has been confirmed successfully!</span>
                        </div>
                    )}

                    {/* Quick Actions Grid */}
                    <div className="dashboard-actions-grid">
                        {dashboardCards.map((card, idx) => (
                            <div
                                key={idx}
                                className="action-card-modern animate-up"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <div className="card-icon-blob">{card.icon}</div>
                                <div className="card-body">
                                    <h3>{card.title}</h3>
                                    <p>{card.desc}</p>
                                    <button
                                        className="btn-card-action"
                                        onClick={() => navigate(card.link)}
                                    >
                                        {card.btnText}
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Bookings Section (Placeholder) */}
                    <div className="recent-activity-section reveal section-mt">
                        <div className="section-header-row">
                            <h2>Recent Activity</h2>
                            <button className="btn-text-only">View All Activity</button>
                        </div>
                        <div className="activity-placeholder-card">
                            <p>Stay tuned! Your latest activity and updates will appear here.</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CustomerDashboard;
