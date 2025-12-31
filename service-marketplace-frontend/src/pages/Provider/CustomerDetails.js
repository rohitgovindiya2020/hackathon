import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components/Common';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import styles from './ManageDiscounts.module.css';

const CustomerDetails = () => {
    const { discountId, customerId } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [promoCode, setPromoCode] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [suggestedDate, setSuggestedDate] = useState('');
    const [suggestedTime, setSuggestedTime] = useState('');
    const [isSuggesting, setIsSuggesting] = useState(false);

    useEffect(() => {
        fetchCustomerDetails();
    }, [discountId, customerId]);

    const fetchCustomerDetails = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/discounts/${discountId}/customers/${customerId}`);
            setDetails(res.data.data);
            if (res.data.data.promo_code) {
                setPromoCode(res.data.data.promo_code);
            }
            if (res.data.data.provider_suggested_date) {
                setSuggestedDate(res.data.data.provider_suggested_date);
                setSuggestedTime(res.data.data.provider_suggested_time);
            }
        } catch (error) {
            toast.error('Failed to fetch customer details');
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitPromo = async (e) => {
        e.preventDefault();
        if (!promoCode.trim()) {
            toast.error('Please enter a promo code');
            return;
        }

        try {
            setSubmitting(true);
            await api.post(`/discounts/${discountId}/customers/${customerId}/promo-code`, {
                promo_code: promoCode
            });
            toast.success('Promo code submitted successfully');
            fetchCustomerDetails(); // Refresh details
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit promo code');
        } finally {
            setSubmitting(false);
        }
    };

    const handleApproveBooking = async () => {
        try {
            setSubmitting(true);
            await api.post(`/discounts/${discountId}/customers/${customerId}/approve-booking`);
            toast.success('Booking approved successfully');
            fetchCustomerDetails();
        } catch (error) {
            toast.error('Failed to approve booking');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSuggestSlot = async (e) => {
        e.preventDefault();
        if (!suggestedDate || !suggestedTime) {
            toast.error('Please select both date and time');
            return;
        }

        try {
            setSubmitting(true);
            await api.post(`/discounts/${discountId}/customers/${customerId}/suggest-slot`, {
                suggested_date: suggestedDate,
                suggested_time: suggestedTime
            });
            toast.success('Alternative slot suggested successfully');
            setIsSuggesting(false);
            fetchCustomerDetails();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to suggest alternative slot');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles['dashboard-page-wrapper']}>
            <Header />
            <main className={`${styles['dashboard-main']} section-padding`}>
                <div className={styles.container}>
                    <div className={`${styles['management-header']} ${styles['animate-up']}`}>
                        <div>
                            <button
                                className={styles['btn-back']}
                                onClick={() => navigate(-1)}
                                style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600' }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                                Back to Customer List
                            </button>
                            <h1 className={styles['hero-title']}>
                                Customer <span className={styles['text-gradient']}>Details</span>
                            </h1>
                            <p className={styles['hero-subtitle']}>View customer information and manage booking slots</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className={styles.loading}>
                            <div className="spinner"></div>
                            <p>Loading customer details...</p>
                        </div>
                    ) : (
                        <div className={`${styles['animate-up']} ${styles['details-grid']}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            {/* Left Column: Customer Info & Booking Status */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid var(--card-border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                    <h3 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>Personal Information</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Name:</span>
                                            <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>{details.customer_name}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Email:</span>
                                            <span style={{ color: 'var(--text-main)' }}>{details.customer_email}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Phone:</span>
                                            <span style={{ color: 'var(--text-main)' }}>{details.customer_phone || 'N/A'}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Interest Date:</span>
                                            <span style={{ color: 'var(--text-main)' }}>{new Date(details.interest_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <h3 style={{ marginTop: '30px', marginBottom: '20px', fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>Discount Context</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Service:</span>
                                            <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>{details.service_name}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Offer:</span>
                                            <span style={{ color: 'var(--primary-color)', fontWeight: '700' }}>{details.discount_percentage}% OFF</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Valid Period:</span>
                                            <span style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{details.discount_start_date} to {details.discount_end_date}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Slot Section */}
                                <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid var(--card-border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                    <h3 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>Booking Slot</h3>

                                    {details.booking_date ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                    <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Customer Requested:</span>
                                                    <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>{details.booking_date} at {details.booking_time}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Status:</span>
                                                    <span style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '700',
                                                        background: details.booking_status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : (details.booking_status === 'suggested' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)'),
                                                        color: details.booking_status === 'approved' ? 'var(--success)' : (details.booking_status === 'suggested' ? 'var(--primary-color)' : '#f59e0b'),
                                                        border: `1px solid ${details.booking_status === 'approved' ? 'rgba(16, 185, 129, 0.2)' : (details.booking_status === 'suggested' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)')}`
                                                    }}>
                                                        {details.booking_status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            {details.booking_status === 'pending' && (
                                                <div style={{ display: 'flex', gap: '15px' }}>
                                                    <button
                                                        onClick={handleApproveBooking}
                                                        disabled={submitting}
                                                        style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'var(--success)', color: 'white', fontWeight: '700', border: 'none', cursor: 'pointer' }}
                                                    >
                                                        Approve Slot
                                                    </button>
                                                    <button
                                                        onClick={() => setIsSuggesting(true)}
                                                        disabled={submitting}
                                                        style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'white', color: 'var(--primary-color)', fontWeight: '700', border: '2px solid var(--primary-color)', cursor: 'pointer' }}
                                                    >
                                                        Suggest Other
                                                    </button>
                                                </div>
                                            )}

                                            {details.booking_status === 'suggested' && (
                                                <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                                    <p style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.9rem', marginBottom: '5px' }}>Your Suggested Slot:</p>
                                                    <p style={{ fontWeight: '700' }}>{details.provider_suggested_date} at {details.provider_suggested_time}</p>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px' }}>Waiting for customer to confirm or suggest another time.</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                                            <p>No booking slot requested by customer yet.</p>
                                        </div>
                                    )}

                                    {isSuggesting && (
                                        <div style={{ marginTop: '20px', padding: '20px', background: '#f1f5f9', borderRadius: '12px' }}>
                                            <h4 style={{ marginBottom: '15px', fontSize: '1rem' }}>Suggest Alternative Slot</h4>
                                            <form onSubmit={handleSuggestSlot}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: '600' }}>Date</label>
                                                        <input
                                                            type="date"
                                                            value={suggestedDate}
                                                            min={details.discount_start_date}
                                                            max={details.discount_end_date}
                                                            onChange={(e) => setSuggestedDate(e.target.value)}
                                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: '600' }}>Time</label>
                                                        <input
                                                            type="time"
                                                            value={suggestedTime}
                                                            onChange={(e) => setSuggestedTime(e.target.value)}
                                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                                        />
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button type="submit" disabled={submitting} style={{ flex: 1, padding: '10px', background: 'var(--primary-color)', color: 'white', borderRadius: '6px', border: 'none', fontWeight: '600' }}>Send Suggestion</button>
                                                        <button type="button" onClick={() => setIsSuggesting(false)} style={{ padding: '10px', background: '#94a3b8', color: 'white', borderRadius: '6px', border: 'none' }}>Cancel</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Promo Code Form */}
                            <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid var(--card-border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                <h3 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>Assign Promo Code</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
                                    Assign a unique promo code to this customer. Once submitted, the customer's interest will be marked as "Activated".
                                </p>
                                <form onSubmit={handleSubmitPromo}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-main)' }}>Promo Code</label>
                                        <input
                                            type="text"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            placeholder="e.g. SAVE25-XYZ"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: '8px',
                                                border: '1px solid var(--card-border)',
                                                fontSize: '1rem',
                                                outline: 'none',
                                                transition: 'border-color 0.2s'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                                            disabled={details.is_activate && details.promo_code}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submitting || (details.is_activate && details.promo_code)}
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            borderRadius: '8px',
                                            background: (details.is_activate && details.promo_code) ? '#94a3b8' : 'var(--primary-color)',
                                            color: 'white',
                                            fontWeight: '700',
                                            border: 'none',
                                            cursor: (details.is_activate && details.promo_code) ? 'not-allowed' : 'pointer',
                                            transition: 'transform 0.2s, opacity 0.2s'
                                        }}
                                        onMouseOver={(e) => !submitting && !(details.is_activate && details.promo_code) && (e.target.style.opacity = '0.9')}
                                        onMouseOut={(e) => !submitting && !(details.is_activate && details.promo_code) && (e.target.style.opacity = '1')}
                                    >
                                        {submitting ? 'Submitting...' : (details.is_activate && details.promo_code) ? 'Promo Code Assigned' : 'Submit Promo Code'}
                                    </button>
                                </form>

                                {details.is_activate && details.promo_code ? (
                                    <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '1.2rem' }}>✅</span>
                                        <span style={{ color: 'var(--success)', fontWeight: '600', fontSize: '0.9rem' }}>This customer has been activated with promo code: <strong>{details.promo_code}</strong></span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CustomerDetails;
