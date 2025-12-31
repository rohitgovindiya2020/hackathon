import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components/Common';
import api from '../../services/api';
import styles from './Dashboard.module.css'; // Reusing some base dashboard styles
import './MyInterests.css';

const MyInterests = () => {
    const [interests, setInterests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchInterests();
    }, []);

    const fetchInterests = async () => {
        setLoading(true);
        try {
            const response = await api.get('/my-interests');
            setInterests(response.data.interests || []);
        } catch (error) {
            console.error('Error fetching interests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (interest) => {
        const discount = interest.discount;
        if (discount) {
            navigate(`/providers/${discount.service_provider_id}/discount/${discount.id}`);
        }
    };

    return (
        <div className="my-interests-page">
            <Header />

            <main className="interests-main section-padding">
                <div className="container">
                    <div className="interests-header animate-up">
                        <h1>My <span className="text-gradient">Interests</span></h1>
                        <p>Track all the special offers and exclusive deals you've joined.</p>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner-premium"></div>
                            <p>Loading your interests...</p>
                        </div>
                    ) : interests.length > 0 ? (
                        <div className="interests-grid">
                            {interests.map((interest, idx) => {
                                const discount = interest.discount;
                                const service = discount?.service;
                                const isActive = discount?.is_active;
                                const progress = Math.min(((discount?.current_interest_count || 0) / (discount?.required_interest_count || 1)) * 100, 100);

                                return (
                                    <div
                                        key={interest.id}
                                        className={`interest-card animate-up ${isActive ? 'deal-activated' : ''}`}
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                        onClick={() => handleCardClick(interest)}
                                    >
                                        <div className="interest-visual">
                                            <img
                                                src={service?.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600'}
                                                alt={service?.name}
                                            />
                                            <div className="interest-badges">
                                                <span className={`status-badge ${isActive ? 'active' : 'pending'}`}>
                                                    {isActive ? 'Deal Active' : 'Gathering Interest'}
                                                </span>
                                            </div>
                                            {isActive && <div className="active-ribbon">Ready to Use</div>}
                                        </div>
                                        <div className="interest-content">
                                            <div className="category-meta">{service?.category || 'Service'}</div>
                                            <h3>{service?.name}</h3>

                                            <div className="discount-meta">
                                                <div className="price-stack">
                                                    <span className="price-label">Price after discount</span>
                                                    <div className="price-flex">
                                                        <span className="discounted-price">${discount?.price_after_discount || discount?.discounted_price}</span>
                                                        <span className="original-price">${discount?.current_price || discount?.original_price}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="interest-progress-section">
                                                <div className="progress-header">
                                                    <span>Goal Progress</span>
                                                    <span>{Math.round(progress)}%</span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {interest.promo_code && isActive ? (
                                                <div className="promo-code-box" onClick={(e) => e.stopPropagation()}>
                                                    <span className="promo-label">Your Coupon Code</span>
                                                    <div className="promo-value">{interest.promo_code}</div>
                                                </div>
                                            ) : (
                                                <div className="waiting-box">
                                                    <p>Promo code will be unlocked when goal is reached!</p>
                                                </div>
                                            )}

                                            <button className="btn-view-deal">View Full Details</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-state animate-up">
                            <div className="empty-icon">⭐</div>
                            <h2>No Interests Yet</h2>
                            <p>Explore our exclusive services and join deals to save more!</p>
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

export default MyInterests;
