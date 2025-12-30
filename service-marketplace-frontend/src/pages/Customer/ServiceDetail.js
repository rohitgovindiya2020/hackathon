import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Header, Footer } from '../../components/Common';
import './Services.css';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingError, setBookingError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchServiceDetails();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchServiceDetails = async () => {
        try {
            const response = await api.get(`/services/${id}`);
            setService(response.data.service);
        } catch (error) {
            console.error('Failed to fetch service details:', error);
            navigate('/services');
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!bookingDate) {
            setBookingError('Please select a date and time');
            return;
        }

        try {
            await api.post('/bookings', {
                service_id: id,
                booking_date: bookingDate
            });
            navigate('/customer/dashboard', { state: { bookingSuccess: true } });
        } catch (error) {
            setBookingError(error.response?.data?.message || 'Booking failed. Please login first.');
        }
    };

    if (loading) return (
        <div className="detail-loading">
            <Header />
            <div className="spinner-container">
                <div className="spinner"></div>
                <p>Loading service details...</p>
            </div>
            <Footer />
        </div>
    );

    if (!service) return null;

    return (
        <div className="service-detail-wrapper">
            <Header />

            <main className="detail-main-content">
                {/* Immersive Header Section */}
                <section className="detail-hero">
                    <div className="hero-bg" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1600')` }}></div>
                    <div className="container">
                        <div className="detail-hero-content animate-up">
                            <Link to="/services" className="back-link">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                                Back to All Services
                            </Link>
                            <div className="badge-row">
                                <span className="cat-badge">{service.category}</span>
                                <div className="rating-badge">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                    <span>4.9 (120+ reviews)</span>
                                </div>
                            </div>
                            <h1>{service.name}</h1>
                            <div className="provider-brief">
                                <div className="provider-avatar-small">
                                    {service.provider?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span>Service by <strong>{service.provider?.name}</strong></span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="detail-body section-padding">
                    <div className="container">
                        <div className="detail-grid">
                            {/* Left Column: Information */}
                            <div className="detail-info-col">
                                <div className="detail-tabs">
                                    <button
                                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('overview')}
                                    >
                                        Overview
                                    </button>
                                    <button
                                        className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('reviews')}
                                    >
                                        Reviews
                                    </button>
                                    <button
                                        className={`tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('faqs')}
                                    >
                                        FAQs
                                    </button>
                                </div>

                                <div className="tab-content animate-up">
                                    {activeTab === 'overview' && (
                                        <div className="overview-content">
                                            <h3>Service Description</h3>
                                            <p className="main-desc">{service.description}</p>

                                            <h3 className="section-mt">What's Included</h3>
                                            <ul className="included-list">
                                                <li>Professional equipment and supplies</li>
                                                <li>Background checked service provider</li>
                                                <li>Post-service cleanup</li>
                                                <li>Satisfaction guarantee warranty</li>
                                            </ul>

                                            <h3 className="section-mt">About the Provider</h3>
                                            <div className="provider-full-info">
                                                <div className="provider-card-detail">
                                                    <div className="provider-avatar-lg">
                                                        {service.provider?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="provider-meta">
                                                        <h4>{service.provider?.name}</h4>
                                                        <p>Verified Professional • Joined 2023</p>
                                                        <div className="provider-stats">
                                                            <span>⭐ 4.9</span>
                                                            <span>💼 500+ Jobs</span>
                                                            <span>⏱️ Fast Responder</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'reviews' && (
                                        <div className="reviews-placeholder">
                                            <p>Real customer reviews will appear here soon.</p>
                                        </div>
                                    )}
                                    {activeTab === 'faqs' && (
                                        <div className="faqs-placeholder">
                                            <p>Frequently asked questions about this service.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Booking Sidebar */}
                            <div className="detail-sidebar-col">
                                <div className="booking-card animate-up">
                                    <div className="booking-header">
                                        <span className="price-label">Starting at</span>
                                        <div className="price-amount">
                                            <span className="currency">$</span>
                                            <span className="value">{service.base_price}</span>
                                        </div>
                                    </div>

                                    <div className="booking-form">
                                        {bookingError && <div className="booking-error">{bookingError}</div>}

                                        <div className="form-group-modern">
                                            <label>When do you need it?</label>
                                            <div className="input-with-icon">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                                <input
                                                    type="datetime-local"
                                                    value={bookingDate}
                                                    onChange={(e) => {
                                                        setBookingDate(e.target.value);
                                                        setBookingError('');
                                                    }}
                                                    min={new Date().toISOString().slice(0, 16)}
                                                />
                                            </div>
                                        </div>

                                        <button className="btn-confirm-booking" onClick={handleBooking}>
                                            Confirm Your Booking
                                        </button>

                                        <p className="no-charge-text">You won't be charged yet</p>
                                    </div>

                                    <div className="booking-footer">
                                        <div className="guarantee">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                            <span>ServiceHub Satisfaction Guarantee</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="help-widget reveal">
                                    <h4>Need custom quote?</h4>
                                    <p>Contact the provider directly for complex tasks.</p>
                                    <button className="btn-contact">Message Provider</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ServiceDetail;
