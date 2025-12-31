import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components/Common';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import styles from './ManageDiscounts.module.css';

const InterestedCustomers = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [interests, setInterests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInterests();
    }, [id]);

    const fetchInterests = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/discounts/${id}/interests`);
            setInterests(res.data.data);
        } catch (error) {
            toast.error('Failed to fetch interested customers');
        } finally {
            setLoading(false);
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
                                Back to Approved Discounts
                            </button>
                            <h1 className={styles['hero-title']}>
                                Interested <span className={styles['text-gradient']}>Customers</span>
                            </h1>
                            <p className={styles['hero-subtitle']}>List of customers who joined this discount offer</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className={styles.loading}>
                            <div className="spinner"></div>
                            <p>Loading interested customers...</p>
                        </div>
                    ) : (
                        <div className={`${styles['animate-up']}`}>
                            {interests.length > 0 ? (
                                <div className={styles['customers-table-wrapper']} style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--card-border)', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--card-border)' }}>
                                                <th style={{ padding: '16px 24px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Customer Name</th>
                                                <th style={{ padding: '16px 24px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Email Address</th>
                                                <th style={{ padding: '16px 24px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Phone</th>
                                                <th style={{ padding: '16px 24px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Interest Date</th>
                                                <th style={{ padding: '16px 24px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {interests.map((interest) => (
                                                <tr
                                                    key={interest.id}
                                                    style={{ borderBottom: '1px solid var(--card-border)', transition: 'background 0.2s ease', cursor: 'pointer' }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                                    onClick={() => navigate(`/provider/discounts/${id}/customers/${interest.customer_id}`)}
                                                >
                                                    <td style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-main)' }}>{interest.customer_name}</td>
                                                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{interest.customer_email}</td>
                                                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{interest.customer_phone || 'N/A'}</td>
                                                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{new Date(interest.interest_date).toLocaleDateString()}</td>
                                                    <td style={{ padding: '16px 24px' }}>
                                                        <span style={{
                                                            padding: '4px 12px',
                                                            borderRadius: '20px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '700',
                                                            background: interest.is_activate ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                            color: interest.is_activate ? 'var(--success)' : '#f59e0b',
                                                            border: `1px solid ${interest.is_activate ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                                                        }}>
                                                            {interest.is_activate ? 'Activated' : 'Interested'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className={styles['empty-state-card']}>
                                    <span className={styles['empty-icon']}>👥</span>
                                    <h3>No interested customers yet</h3>
                                    <p>Once customers join this discount offer, they will appear here.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default InterestedCustomers;
