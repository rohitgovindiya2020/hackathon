import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationContext } from '../../contexts/LocationContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Header, Footer } from '../../components/Common';
import './MyAreaDiscounts.css';

const MyAreaDiscounts = () => {
    const { selectedLocation } = useLocationContext();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiscounts = async () => {
            setLoading(true);
            try {
                // Construct query params from selected location
                const params = new URLSearchParams();
                if (selectedLocation.country) params.append('country', selectedLocation.country);
                if (selectedLocation.state) params.append('state', selectedLocation.state);
                if (selectedLocation.city) params.append('city', selectedLocation.city);
                if (selectedLocation.area) params.append('area', selectedLocation.area);

                const response = await api.get(`/public/discounts?${params.toString()}`);
                console.log(response.data);
                if (response.data.status === 'success') {
                    setDiscounts(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching discounts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDiscounts();
    }, [selectedLocation]);

    const handleViewDiscount = (discountId, providerId) => {
        navigate(`/providers/${providerId}/discount/${discountId}`);
    };

    return (
        <div className="page-wrapper">
            <Header />
            <div className="my-area-discounts-page">
                <div className="container">
                    <div className="page-header">
                        <h1>Discounts in {selectedLocation.area || selectedLocation.city || 'Your Area'}</h1>
                        <p>Exclusive deals and offers available in your location</p>
                    </div>

                    {loading ? (
                        <div className="loading-state">Loading amazing deals...</div>
                    ) : discounts.length > 0 ? (
                        <div className="discount-grid">
                            {discounts.map(discount => (
                                <div key={discount.id} className="discount-card">
                                    <div className="card-image">
                                        <img
                                            src={discount.banner_image || 'https://via.placeholder.com/400x250?text=Discount'}
                                            alt={discount.service?.name}
                                        />
                                        <div className="discount-badge">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {discount.discount_percentage}% OFF
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="service-title">{discount.service?.name}</h3>
                                        <p className="provider-name">{discount.provider?.user?.name || 'Service Provider'}</p>
                                        <div className="rating">
                                            <span className="star">★</span>
                                            <span className="score">4.8</span>
                                            <span className="reviews">(245 reviews)</span>
                                        </div>

                                        <div className="interest-section">
                                            <div className="interest-header">
                                                <span className="interest-label">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                        <circle cx="9" cy="7" r="4" />
                                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                    </svg>
                                                    Interest-based discount
                                                </span>
                                                <span className="interest-count">
                                                    {discount.current_interest_count}/{discount.required_interest_count}
                                                </span>
                                            </div>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${Math.min((discount.current_interest_count / discount.required_interest_count) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="card-footer">
                                            <div className="price-info">
                                                <span className="label">Starting at</span>
                                                <span className="price">${discount.current_price}</span>
                                            </div>
                                            <button
                                                className="btn-view"
                                                onClick={() => handleViewDiscount(discount.id, discount.service_provider_id)}
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <h3>No discounts found in this area</h3>
                            <p>Try changing your location or check back later for new deals!</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MyAreaDiscounts;
