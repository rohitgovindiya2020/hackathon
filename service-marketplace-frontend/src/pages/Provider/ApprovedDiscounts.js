import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components/Common';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import '../Dashboard.css';
import styles from './ManageDiscounts.module.css';

const ApprovedDiscounts = () => {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const discRes = await api.get('/discounts');
            // Filter only approved discounts
            const approvedDiscounts = discRes.data.data.filter(
                discount => discount.current_interest_count === discount.required_interest_count
            );
            setDiscounts(approvedDiscounts);
        } catch (error) {
            toast.error('Failed to fetch approved discounts');
        } finally {
            setLoading(false);
        }
    };

    const getInterestStatus = (fromDate, toDate) => {
        const today = new Date().toISOString().split('T')[0];
        if (today < fromDate) return { label: 'Pending', class: 'status-pending' };
        if (today > toDate) return { label: 'Disapproved', class: 'status-disapproved' };
        return { label: 'In Progress', class: 'status-progress' };
    };

    return (
        <div className={styles['dashboard-page-wrapper']}>
            <Header />
            <main className={`${styles['dashboard-main']} section-padding`}>
                <div className={styles.container}>
                    <div className={`${styles['management-header']} ${styles['animate-up']}`}>
                        <div>
                            <h1 className={styles['hero-title']}>
                                <span className={styles['text-gradient']}>Approved</span> Discount Cards
                            </h1>
                            <p className={styles['hero-subtitle']}>View and manage your approved discount offers</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className={styles.loading}>
                            <div className="spinner"></div>
                            <p>Loading approved discounts...</p>
                        </div>
                    ) : (
                        <>
                            {/* Approved Discounts Section */}
                            {discounts.length > 0 ? (
                                <div className={styles['approved-section']}>
                                    <div className={styles['section-header']}>
                                        <h2 className={styles['section-title']}>
                                            <span className={styles['approved-icon']}>✓</span>
                                            Approved Discount Cards
                                        </h2>
                                        <span className={styles['count-badge']}>{discounts.length}</span>
                                    </div>
                                    <div className={`${styles['discounts-grid']} ${styles['animate-up']}`}>
                                        {discounts.map(discount => {
                                            const status = getInterestStatus(discount.interest_from_date, discount.interest_to_date);
                                            return (
                                                <div
                                                    key={discount.id}
                                                    className={`${styles['discount-card-modern']} ${styles['approved-card']}`}
                                                    onClick={() => navigate(`/provider/discounts/${discount.id}/interests`)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {discount.banner_image && (
                                                        <div className={styles['card-banner']}>
                                                            <img src={discount.banner_image} alt="Discount Banner" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }} />
                                                            <div className={`${styles['status-badge-overlay']} ${styles['status-approved']}`}>
                                                                APPROVED
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className={styles['card-header']}>
                                                        <div className={styles['service-tag']}>{discount.service?.name}</div>
                                                        <div className={styles['percentage-badge']}>{discount.discount_percentage}% OFF</div>
                                                    </div>
                                                    <div className={styles['card-body']}>
                                                        {discount.current_price && (
                                                            <div className={styles['info-row']}>
                                                                <span className={styles.label}>Original Price:</span>
                                                                <span className={styles.val} style={{ textDecoration: 'line-through', color: '#94a3b8' }}>${discount.current_price}</span>
                                                            </div>
                                                        )}
                                                        {discount.price_after_discount && (
                                                            <div className={styles['info-row']}>
                                                                <span className={styles.label}>Discounted Price:</span>
                                                                <span className={styles.val} style={{ color: '#10b981', fontWeight: 'bold' }}>${discount.price_after_discount}</span>
                                                            </div>
                                                        )}
                                                        <div className={styles['info-row']}>
                                                            <span className={styles.label}>Views:</span>
                                                            <span className={styles.val}>{discount.view_count}</span>
                                                        </div>
                                                        <div className={styles['info-row']}>
                                                            <span className={styles.label}>Interest Period:</span>
                                                            <span className={styles.val}>{discount.interest_from_date} to {discount.interest_to_date}</span>
                                                        </div>
                                                        <div className={styles['info-row']}>
                                                            <span className={styles.label}>Offer Period:</span>
                                                            <span className={styles.val}>{discount.discount_start_date} to {discount.discount_end_date}</span>
                                                        </div>
                                                        <div className={styles['progress-section']}>
                                                            <div className={styles['progress-labels']}>
                                                                <span>Interest Progress</span>
                                                                <span className={styles['progress-complete']}>✓ {discount.current_interest_count} / {discount.required_interest_count}</span>
                                                            </div>
                                                            <div className={styles['progress-bar-bg']}>
                                                                <div
                                                                    className={`${styles['progress-bar-fill']} ${styles['progress-complete-bar']}`}
                                                                    style={{ width: '100%' }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        {discount.address && (
                                                            <div className={styles['address-box']}>
                                                                <span className={styles.label}>Location:</span>
                                                                <p>{discount.address.area}, {discount.address.city}, {discount.address.state}, {discount.address.country}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={styles['card-footer']}>
                                                        {/* Additional actions can be added here */}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className={`${styles['discounts-grid']} ${styles['animate-up']}`}>
                                    <div className={styles['empty-state-card']}>
                                        <span className={styles['empty-icon']}>✅</span>
                                        <h3>No approved discounts yet</h3>
                                        <p>Discounts will appear here once they reach their required interest count!</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ApprovedDiscounts;
