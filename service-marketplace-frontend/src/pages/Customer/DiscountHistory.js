import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components/Common';
import api from '../../services/api';
import './DiscountHistory.css';

const DiscountHistory = () => {
    const [interests, setInterests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await api.get('/interest-history');
            setInterests(response.data.interests || []);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleCardClick = (interest) => {
        const discount = interest.discount;
        if (discount) {
            navigate(`/providers/${discount.service_provider_id}/discount/${discount.id}`);
        }
    };

    return (
        <div className="history-page">
            <Header />

            <main className="history-main section-padding">
                <div className="container">
                    <div className="history-header animate-up">
                        <h1>Interest <span className="text-gradient">History</span></h1>
                        <p>View all the deals you've participated in over time.</p>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner-premium"></div>
                            <p>Loading your history...</p>
                        </div>
                    ) : interests.length > 0 ? (
                        <div className="history-grid">
                            {interests.map((interest, idx) => {
                                const discount = interest.discount;
                                const service = discount?.service;
                                const isActive = discount?.is_active;
                                const isExpired = new Date(discount?.discount_end_date) < new Date();

                                return (
                                    <div
                                        key={interest.id}
                                        className={`history-card animate-up ${isExpired ? 'is-expired' : ''}`}
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                        onClick={() => handleCardClick(interest)}
                                    >
                                        <div className="history-visual">
                                            <img
                                                src={service?.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600'}
                                                alt={service?.name}
                                            />
                                            <div className="history-badges">
                                                <span className={`status-badge ${isActive ? 'active' : 'pending'}`}>
                                                    {isActive ? 'Deal Active' : 'Gathering Interest'}
                                                </span>
                                                {isExpired && <span className="status-badge expired">Expired</span>}
                                            </div>
                                        </div>
                                        <div className="history-content">
                                            <div className="category-meta">{service?.category || 'Service'}</div>
                                            <h3>{service?.name}</h3>

                                            <div className="provider-info" style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#64748b' }}>
                                                <strong>Provider:</strong> {discount?.provider?.company_name || discount?.provider?.name || 'Professional Provider'}
                                            </div>

                                            <div className="discount-meta">
                                                <div className="price-stack">
                                                    <span className="price-label">Price after discount</span>
                                                    <div className="price-flex">
                                                        <span className="discounted-price">${discount?.price_after_discount}</span>
                                                        <span className="original-price">${discount?.current_price}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="history-dates-grid">
                                                <div className="date-item">
                                                    <span className="date-label">Interest Period</span>
                                                    <span className="date-value">{formatDate(discount?.interest_from_date)} - {formatDate(discount?.interest_to_date)}</span>
                                                </div>
                                                <div className="date-item">
                                                    <span className="date-label">Discount Period</span>
                                                    <span className="date-value">{formatDate(discount?.discount_start_date)} - {formatDate(discount?.discount_end_date)}</span>
                                                </div>
                                            </div>

                                            {interest.promo_code && isActive && !isExpired && (
                                                <div className="promo-code-box" onClick={(e) => e.stopPropagation()}>
                                                    <span className="promo-label">Your Coupon Code</span>
                                                    <div className="promo-value">{interest.promo_code}</div>
                                                </div>
                                            )}

                                            <button className="btn-view-deal">View Details</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-state animate-up">
                            <div className="empty-icon">📜</div>
                            <h2>No History Found</h2>
                            <p>You haven't participated in any deals yet.</p>
                            <button className="btn-primary-elegant" onClick={() => navigate('/services')}>
                                Browse Services
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DiscountHistory;
