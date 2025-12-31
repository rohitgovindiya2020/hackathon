import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Header, Footer } from '../../components/Common';
import { useAuth } from '../../contexts/AuthContext';
import './ProviderDetail.css';

const ProviderDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');

    // Review Form State
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [userReview, setUserReview] = useState(null);

    useEffect(() => {
        fetchProviderDetails();
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (provider?.reviews && user) {
            const existingReview = provider.reviews.find(r =>
                r.customer?.id === user.id || r.customer_id === user.id
            );
            setUserReview(existingReview);
            if (existingReview) {
                setReviewForm({
                    rating: parseInt(existingReview.rating),
                    comment: existingReview.review
                });
            } else {
                setReviewForm({ rating: 5, comment: '' });
            }
        }
    }, [provider, user]);

    const fetchProviderDetails = async () => {
        try {
            const response = await api.get(`/providers/${id}`);
            setProvider(response.data.data);
        } catch (error) {
            console.error('Failed to fetch provider details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setSubmittingReview(true);
        try {
            if (userReview) {
                await api.put(`/reviews/${userReview.id}`, {
                    rating: reviewForm.rating,
                    review: reviewForm.comment,
                    provider_id: id
                });
            } else {
                await api.post(`/providers/${id}/reviews`, {
                    rating: reviewForm.rating,
                    review: reviewForm.comment
                });
            }
            await fetchProviderDetails();
            // Reset if needed, but for update we keep it
            if (!userReview) {
                setReviewForm({ rating: 5, comment: '' });
            }
        } catch (error) {
            console.error('Failed to submit review:', error);
            // Ideally show a toast notification here
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="provider-detail-loading">
                <Header />
                <div className="loader-container">
                    <div className="spinner-premium"></div>
                    <p>Loading expert profile...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="provider-not-found">
                <Header />
                <div className="error-container">
                    <h2>Provider Not Found</h2>
                    <p>The expert you are looking for might have moved or is no longer available.</p>
                    <Link to="/providers" className="btn-primary">Back to Providers</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const activeDiscount = provider.discounts?.find(d => d.is_active);

    return (
        <div className="pd-wrapper">
            <Header />

            <main className="pd-main">
                {/* Profile Hero Section */}
                <section className="pd-hero">
                    <div className="pd-container">
                        <div className="pd-hero-grid">
                            <div className="pd-profile-visual">
                                <div className="pd-avatar-frame">
                                    <img
                                        src={provider.profile_image ? (provider.profile_image.startsWith('data:') ? provider.profile_image : `data:image/jpeg;base64,${provider.profile_image}`) : `https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600`}
                                        alt={provider.name}
                                    />
                                    <div className="pd-pro-badge">VERIFIED EXPERT</div>
                                </div>
                            </div>

                            <div className="pd-profile-info">
                                <div className="pd-meta-row">
                                    <div className="pd-rating-badge">
                                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                        <strong>{provider.average_rating || '0.0'}</strong>
                                        <span>({provider.review_count || 0} Reviews)</span>
                                    </div>
                                    <span className="pd-locality-badge">{provider.address?.city || 'Local Pro'}</span>
                                </div>
                                <h1 className="pd-name">{provider.name}</h1>
                                <p className="pd-tagline">
                                    {provider.services?.[0]?.name || 'Service Provider'}
                                </p>
                            </div>

                            <div className="pd-cta-card">
                                <button className="pd-btn-primary">Book Appointment</button>
                                <button className="pd-btn-secondary">Message Expert</button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pd-container pd-body-layout">
                    {/* Main Content */}
                    <div className="pd-content-column">
                        <div className="pd-tabs">
                            <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>About</button>
                            <button className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>Services</button>
                            <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>Reviews</button>
                        </div>

                        <div className="pd-tab-panel">
                            {activeTab === 'about' && (
                                <div className="pd-about-panel">
                                    <h2 className="pd-section-title">Professional Bio</h2>
                                    <p className="pd-bio-text">
                                        {provider.description || "No description provided."}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'services' && (
                                <div className="pd-services-panel">
                                    <h2 className="pd-section-title">Service Menu</h2>
                                    <div className="pd-services-grid">
                                        {provider.services && provider.services.length > 0 ? provider.services.map(service => {
                                            const serviceDiscount = provider.discounts?.find(d => d.service_id === service.id && d.is_active);
                                            return (
                                                <div key={service.id} className="pd-service-card">
                                                    <div className="pd-service-header">
                                                        <div className="pd-service-icon">⚡</div>
                                                        <div className="pd-service-meta">
                                                            <h4>{service.name}</h4>
                                                            <span>{service.category}</span>
                                                        </div>
                                                    </div>

                                                    {serviceDiscount && (
                                                        <div className="pd-service-discount-badge">
                                                            <div className="pd-discount-row">
                                                                <span className="pd-discount-tag">Save {serviceDiscount.discount_percentage}%</span>
                                                                <span className="pd-discount-joined">{serviceDiscount.interests?.length || 0} / {serviceDiscount.required_interest_count} Joined</span>
                                                            </div>
                                                            <div className="pd-discount-progress">
                                                                <div
                                                                    className="pd-discount-bar"
                                                                    style={{ width: `${Math.min(((serviceDiscount.interests?.length || 0) / serviceDiscount.required_interest_count) * 100, 100)}%` }}
                                                                ></div>
                                                            </div>
                                                            <Link
                                                                to={`/providers/${provider.id}/discount/${serviceDiscount.id}`}
                                                                className={`pd-btn-interest ${(serviceDiscount.is_active || ((serviceDiscount.interests?.length || 0) >= serviceDiscount.required_interest_count)) ? 'goal-reached' : ''}`}
                                                                style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
                                                            >
                                                                {(serviceDiscount.is_active || ((serviceDiscount.interests?.length || 0) >= serviceDiscount.required_interest_count)) ? 'Goal Reached' : 'Join Deal'}
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }) : <div className="pd-empty">No services listed yet.</div>}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="pd-reviews-panel">
                                    <div className="pd-reviews-header">
                                        <h2 className="pd-section-title">Verified Reviews</h2>
                                        <div className="pd-score-wrap">
                                            <span className="pd-score-label">Average Score</span>
                                            <div className="pd-score-val">{provider.average_rating || '0.0'} / 5.0</div>
                                        </div>
                                    </div>

                                    {/* Review Form Section */}
                                    {user ? (
                                        <div className="pd-review-form-card">
                                            <h3>{userReview ? 'Update Your Review' : 'Share Your Experience'}</h3>
                                            <form onSubmit={handleReviewSubmit}>
                                                <div className="pd-form-rating-group">
                                                    <label>Your Rating</label>
                                                    <div className="pd-star-input">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <svg
                                                                key={star}
                                                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                                viewBox="0 0 24 24"
                                                                fill={star <= reviewForm.rating ? "#f59e0b" : "#e2e8f0"}
                                                                className="cursor-pointer"
                                                            >
                                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="pd-form-group">
                                                    <label>Your Review</label>
                                                    <textarea
                                                        className="pd-form-textarea"
                                                        rows="4"
                                                        placeholder="How was the service? Share some details..."
                                                        value={reviewForm.comment}
                                                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                                        required
                                                    ></textarea>
                                                </div>
                                                <button type="submit" className="pd-btn-submit" disabled={submittingReview}>
                                                    {submittingReview ? 'Submitting...' : (userReview ? 'Update Review' : 'Submit Review')}
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="pd-login-prompt">
                                            <p>Please <Link to="/login">login</Link> to leave a review.</p>
                                        </div>
                                    )}

                                    <div className="pd-reviews-list">
                                        {provider.reviews && provider.reviews.length > 0 ? provider.reviews.map(review => (
                                            <div key={review.id} className="pd-review-card">
                                                <div className="pd-review-user">
                                                    <div className="pd-user-avatar">
                                                        {review.customer?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="pd-user-info">
                                                        <strong>{review.customer?.name || 'Anonymous client'}</strong>
                                                        <span>Verified Service</span>
                                                    </div>
                                                    <div className="pd-review-stars">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg key={i} viewBox="0 0 24 24" fill={i < parseInt(review.rating) ? "#f59e0b" : "#e2e8f0"}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="pd-review-body">{review.review}</p>
                                                <div className="pd-review-date">{new Date(review.created_at).toLocaleDateString()}</div>
                                            </div>
                                        )) : (
                                            <div className="pd-empty">No reviews yet. Be the first!</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="pd-sidebar">
                        <div className="pd-sticky">
                            <div className="pd-side-card">
                                <h3 className="pd-side-title">Location</h3>
                                <div className="pd-location-box">
                                    <div className="pd-loc-icon">📍</div>
                                    <div className="pd-loc-details">
                                        <p className="pd-addr-main">{provider.address?.address || 'N/A'}</p>
                                        <p className="pd-addr-sub">{provider.address?.city || ''}{provider.address?.city && provider.address?.state ? ', ' : ''}{provider.address?.state || ''}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProviderDetail;
