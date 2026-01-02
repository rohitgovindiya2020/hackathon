import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Header, Footer } from '../../components/Common';
import './ServiceDiscountDetail.css';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const ServiceDiscountDetail = () => {
    const { providerId, discountId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [provider, setProvider] = useState(null);
    const [discount, setDiscount] = useState(null);
    const [service, setService] = useState(null);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, [providerId, discountId]);

    const fetchData = async () => {
        try {
            // We fetch the provider details which includes services and discounts
            const response = await api.get(`/providers/${providerId}`);
            const providerData = response.data.data;
            setProvider(providerData);

            // Find the specific discount
            const foundDiscount = providerData.discounts?.find(d => d.id == discountId);
            setDiscount(foundDiscount);

            // Find the service from the discount
            if (foundDiscount) {
                const foundService = providerData.services?.find(s => s.id == foundDiscount.service_id);
                setService(foundService);
            }

        } catch (error) {
            console.error("Failed to fetch details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinDeal = async () => {
        if (!discount || !user) return;
        setJoining(true);
        try {
            // Assuming there is an endpoint to join interest. 
            // Based on previous conversations/code, we might need to create one or use existing.
            // For now, we will simulate or assume '/interests' endpoint exists as per api.php routes:
            // Route::post('/interests', [InterestController::class, 'store']);

            await api.post('/interests', {
                discount_id: discount.id
            });

            // Refresh data to show updated count
            await fetchData();
            // Optional: User feedback
            toast.success("Successfully joined the deal!");
        } catch (error) {
            console.error("Failed to join deal", error);
            const msg = error.response?.data?.message || "Failed to join. You might have already joined.";
            toast.error(msg);
        } finally {
            setJoining(false);
        }
    };

    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingHour, setBookingHour] = useState('');
    const [bookingMinute, setBookingMinute] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [submittingBooking, setSubmittingBooking] = useState(false);
    const [acceptingSuggestion, setAcceptingSuggestion] = useState(false);
    const [bookedSlots, setBookedSlots] = useState([]);

    const fetchBookedSlots = async () => {
        try {
            const response = await api.get(`/discounts/${discountId}/booked-slots`);
            setBookedSlots(response.data.bookedSlots || []);
        } catch (error) {
            console.error("Failed to fetch booked slots", error);
        }
    };

    const handleOpenBooking = () => {
        if (!isJoined) {
            toast.error("Please join the deal first!");
            return;
        }
        if (!discount.is_active) {
            toast.error("Deal is not yet active. Booking will open once the goal is reached!");
            return;
        }
        fetchBookedSlots();
        setShowBookingModal(true);
    };

    useEffect(() => {
        if (bookingHour && bookingMinute) {
            setBookingTime(`${bookingHour}:${bookingMinute}`);
        } else {
            setBookingTime('');
        }
    }, [bookingHour, bookingMinute]);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setSubmittingBooking(true);

        if (!bookingTime) {
            toast.error("Please select both hour and minute.");
            setSubmittingBooking(false);
            return;
        }

        try {
            await api.post('/interests/book', {
                discount_id: discount.id,
                booking_date: bookingDate,
                booking_time: bookingTime
            });
            toast.success("Booking request submitted successfully!");
            setShowBookingModal(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit booking.");
        } finally {
            setSubmittingBooking(false);
        }
    };

    const handleAcceptSuggestion = async () => {
        setAcceptingSuggestion(true);
        try {
            await api.post('/interests/accept-suggestion', {
                discount_id: discount.id
            });
            toast.success("Suggestion accepted successfully!");
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to accept suggestion.");
        } finally {
            setAcceptingSuggestion(false);
        }
    };

    // Helper to check if slot is taken
    const isSlotTaken = (date, hour, minute) => {
        if (!date || !hour || !minute) return false;
        const timeToCheck = `${hour}:${minute}`;
        return bookedSlots.some(slot => slot.booking_date === date && slot.booking_time.slice(0, 5) === timeToCheck);
    };

    if (loading) {
        return (
            <div className="sdd-loading">
                <Header />
                <div className="loader-container">
                    <div className="spinner-premium"></div>
                    <p>Loading deal details...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!provider || !discount || !service) {
        return (
            <div className="sdd-not-found">
                <Header />
                <div className="error-container">
                    <h2>Deal Not Found</h2>
                    <p>The discount you are looking for is no longer available or invalid.</p>
                    <Link to={`/providers/${providerId}`} className="btn-primary">Back to Provider</Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Calculate dates
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const joinedInterest = discount.interests?.find(i => i.customer_id === user?.id);
    const isJoined = !!joinedInterest;
    const currentCount = discount.current_interest_count || 0;
    const requiredCount = discount.required_interest_count || 1;
    const progress = Math.min((currentCount / requiredCount) * 100, 100);
    const isUpcoming = discount.is_active == 0;
    const isGoalReached = currentCount >= requiredCount || discount.is_active == 1;

    return (
        <div className="sdd-wrapper-modern">
            <Header />
            <main className="sdd-main-modern">
                <div className="sdd-container-modern">
                    {/* Banner Image */}
                    <div className="sdd-banner-container">
                        <img
                            src={discount.banner_image || (service && service.image) || "https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=1200"}
                            alt={service.name}
                            className="sdd-banner-img"
                        />
                        <button onClick={() => navigate(-1)} className="sdd-back-btn-overlay">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>

                    <div className="sdd-card-content">
                        {/* Header Section */}
                        <div className="sdd-header-row-modern">
                            <div className="sdd-header-info">
                                <div className="sdd-badge-status-row">
                                    <span className={`sdd-status-badge ${isUpcoming ? 'upcoming' : 'active'}`}>
                                        {isUpcoming ? 'Upcoming Deal' : 'Active Deal'}
                                    </span>
                                </div>
                                <h1 className="sdd-title-modern">{service.name}</h1>
                                <p className="sdd-provider-name-modern">by {provider.name}</p>

                                <div className="sdd-stats-row-modern">
                                    <div className="sdd-stat-item-modern location">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        <span>{discount.address || (provider.address ? `${provider.address.city}, ${provider.address.state}` : "Manhattan, New York")}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="sdd-price-capsule-modern">
                                <span className="sdd-starting-label">Starting at</span>
                                <div className="sdd-price-stack">
                                    <span className="sdd-price-main">${discount.price_after_discount || discount.current_price}</span>
                                    <span className="sdd-price-strikethrough">${discount.current_price}</span>
                                </div>
                            </div>
                        </div>

                        {/* Interest-Based Discount Box */}
                        <div className="sdd-interest-box">
                            <div className="sdd-interest-header">
                                <div className="sdd-interest-text">
                                    <h3>Interest-Based Discount</h3>
                                    <p>Show interest to unlock {discount.discount_percentage}% discount when we reach {discount.required_interest_count} interested customers</p>
                                </div>
                                <div className="sdd-interest-badge">
                                    <span className="sdd-badge-count">{currentCount}/{discount.required_interest_count}</span>
                                    <span className="sdd-badge-label">interested</span>
                                </div>
                            </div>

                            <div className="sdd-progress-container-modern">
                                <div className="sdd-progress-bar-modern">
                                    <div
                                        className="sdd-progress-fill-modern"
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="sdd-progress-pointer"></div>
                                    </div>
                                </div>
                                <div className="sdd-progress-indicators">
                                    <span>{Math.round(progress)}% to unlock</span>
                                    <span>{Math.max(0, (discount.required_interest_count || 0) - currentCount)} more needed!</span>
                                </div>
                            </div>

                            <button
                                className={`sdd-btn-interest-modern ${isJoined ? 'joined' : ''} ${isGoalReached && !isJoined ? 'goal-reached' : ''}`}
                                onClick={handleJoinDeal}
                                disabled={joining || isJoined || (isGoalReached && !isJoined)}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                                </svg>
                                {joining ? 'Processing...' :
                                    isJoined ? 'Interest Registered ✓' :
                                        isGoalReached ? 'Deal Interest Goal Reached' : 'Show Interest & Get Notified'}
                            </button>

                            {isJoined && joinedInterest?.promo_code && (
                                <div className="sdd-coupon-display">
                                    <div className="sdd-coupon-divider"></div>
                                    <p className="sdd-coupon-label">Your Exclusive Coupon</p>
                                    <div className="sdd-coupon-code">{joinedInterest.promo_code}</div>
                                    <p className="sdd-coupon-note">Save this code. You can use it during the redemption period once the deal is activated.</p>
                                </div>
                            )}

                            {/* Booking Status Display */}
                            {isJoined && joinedInterest?.booking_status && (
                                <div className="sdd-booking-status-box">
                                    <div className="sdd-coupon-divider"></div>
                                    <div className="sdd-status-grid">
                                        <div className="sdd-status-item">
                                            <span className="sdd-label">Booking Status</span>
                                            <span className={`sdd-value-badge ${joinedInterest.booking_status}`}>
                                                {joinedInterest.booking_status.toUpperCase()}
                                            </span>
                                        </div>
                                        {joinedInterest.booking_date && (
                                            <div className="sdd-status-item">
                                                <span className="sdd-label">Appointed Date</span>
                                                <span className="sdd-value">{formatDate(joinedInterest.booking_date)} at {joinedInterest.booking_time}</span>
                                            </div>
                                        )}
                                        {joinedInterest.provider_suggested_date && (
                                            <div className="sdd-status-item suggested">
                                                <span className="sdd-label">Provider Suggestion</span>
                                                <span className="sdd-value">{formatDate(joinedInterest.provider_suggested_date)} at {joinedInterest.provider_suggested_time}</span>

                                                {(joinedInterest.provider_suggested_date !== joinedInterest.booking_date ||
                                                    joinedInterest.provider_suggested_time !== joinedInterest.booking_time) && (
                                                        <button
                                                            className="sdd-btn-accept-suggestion"
                                                            onClick={handleAcceptSuggestion}
                                                            disabled={acceptingSuggestion}
                                                        >
                                                            {acceptingSuggestion ? 'Accepting...' : 'Confirm & Accept Suggestion'}
                                                        </button>
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description Section */}
                        <div className="sdd-content-section">
                            <h3 className="sdd-section-title">Service Description</h3>
                            <div
                                className="sdd-description-text html-content"
                                dangerouslySetInnerHTML={{
                                    __html: discount.description || provider.description || "Our professional service provides thorough, top-to-bottom care."
                                }}
                            />
                        </div>

                        {/* What's Included Section */}
                        <div className="sdd-content-section">
                            <h3 className="sdd-section-title">What's Included</h3>
                            <div className="sdd-included-content">
                                {discount.included_services ? (
                                    <div
                                        className="html-content"
                                        dangerouslySetInnerHTML={{ __html: discount.included_services }}
                                    />
                                ) : (
                                    <div className="sdd-included-grid">
                                        {[
                                            "Professional Equipment Used", "Premium Quality Cleaning",
                                            "Verified & Experienced Team", "Satisfaction Guaranteed",
                                            "Transparent Pricing", "Eco-friendly products"
                                        ].map((item, idx) => (
                                            <div key={idx} className="sdd-included-item">
                                                <div className="sdd-check-icon">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </div>
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Timeline & Booking */}
                        <div className="sdd-footer-section">
                            <button
                                className={`sdd-btn-book-now ${(!isJoined || !discount.is_active) ? 'disabled' : ''}`}
                                onClick={handleOpenBooking}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                {!discount.is_active ? 'Goal Not Reached Yet' :
                                    joinedInterest?.booking_date ? 'Change Booking Slot' : 'Book This Service'}
                            </button>
                            <p className="sdd-footer-note">Instant booking available once deal is active • Satisfaction guaranteed</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="sdd-modal-backdrop" onClick={() => setShowBookingModal(false)}>
                    <div className="sdd-modal-card animate-scale" onClick={e => e.stopPropagation()}>
                        <div className="sdd-modal-header">
                            <h2>Select Your Slot</h2>
                            <button className="sdd-close-modal" onClick={() => setShowBookingModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleBookingSubmit} className="sdd-booking-form">
                            <div className="sdd-form-group">
                                <label>Preferred Date</label>
                                <input
                                    type="date"
                                    required
                                    min={discount.discount_start_date}
                                    max={discount.discount_end_date}
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                />
                                <small className="sdd-date-hint">Available: {formatDate(discount.discount_start_date)} - {formatDate(discount.discount_end_date)}</small>
                            </div>
                            <div className="sdd-form-group">
                                <label>Preferred Time</label>
                                <div className="sdd-time-grid">
                                    <div className="sdd-time-col">
                                        <select
                                            required
                                            value={bookingHour}
                                            onChange={(e) => setBookingHour(e.target.value)}
                                        >
                                            <option value="">Hour</option>
                                            {Array.from({ length: 24 }, (_, i) => {
                                                const h = i.toString().padStart(2, '0');
                                                return <option key={h} value={h}>{h}</option>;
                                            })}
                                        </select>
                                    </div>
                                    <div className="sdd-time-col">
                                        <select
                                            required
                                            value={bookingMinute}
                                            onChange={(e) => setBookingMinute(e.target.value)}
                                        >
                                            <option value="">Min</option>
                                            {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(m => {
                                                const taken = isSlotTaken(bookingDate, bookingHour, m);
                                                return (
                                                    <option key={m} value={m} disabled={taken && bookingHour}>
                                                        {m} {taken && bookingHour ? '(Booked)' : ''}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="sdd-btn-submit-booking" disabled={submittingBooking}>
                                {submittingBooking ? 'Submitting...' : 'Confirm Booking Slot'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ServiceDiscountDetail;
