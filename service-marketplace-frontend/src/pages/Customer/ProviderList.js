import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Header, Footer } from '../../components/Common';
import './ProviderList.css';

const ProviderList = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProviders();
        window.scrollTo(0, 0);
    }, []);

    const fetchProviders = async () => {
        try {
            const response = await api.get('/providers');
            setProviders(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch providers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProviders = providers.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="providers-page-wrapper">
            <Header />

            <main className="providers-content">
                <section className="providers-hero">
                    <div className="container">
                        <div className="hero-inner">
                            <h1>Expert <span className="text-gradient">Service</span> Providers</h1>
                            <p>Connect with top-rated professionals for all your home needs.</p>
                        </div>
                    </div>
                </section>

                <section className="providers-main section-padding">
                    <div className="container">
                        <div className="filter-bar-modern">
                            <div className="search-input-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input
                                    type="text"
                                    placeholder="Search providers By Name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Finding best providers for you...</p>
                            </div>
                        ) : (
                            <div className="providers-grid">
                                {filteredProviders.map((provider, idx) => {
                                    const activeDiscount = provider.discounts?.find(d => d.is_active);
                                    const primaryService = provider.services?.[0] || { name: 'Expert Services', category: 'General' };
                                    const interestCount = activeDiscount?.interests?.length || 0;
                                    const requiredCount = activeDiscount?.required_interest_count || 100;
                                    const progress = Math.min((interestCount / requiredCount) * 100, 100);

                                    return (
                                        <div
                                            key={provider.id}
                                            className="provider-card-premium animate-up"
                                            style={{ animationDelay: `${idx * 0.1}s` }}
                                        >
                                            <div className="card-media">
                                                <img
                                                    src={provider.profile_image ? (provider.profile_image.startsWith('data:') ? provider.profile_image : `data:image/jpeg;base64,${provider.profile_image}`) : `https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400`}
                                                    alt={provider.name}
                                                />
                                                {activeDiscount && (
                                                    <div className="discount-tag">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01" /></svg>
                                                        {activeDiscount.discount_percentage}% OFF
                                                    </div>
                                                )}
                                            </div>

                                            <div className="card-body">
                                                <div className="card-meta">
                                                    <span className="listing-type">{primaryService.name}</span>
                                                    <div className="rating-pill">
                                                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                                        <span>{provider.average_rating || '0.0'}</span>
                                                        <small>({provider.review_count || 0} reviews)</small>
                                                    </div>
                                                </div>

                                                <h3 className="provider-company">{provider.name}</h3>

                                                {activeDiscount && (
                                                    <div className="discount-progress-section">
                                                        <div className="progress-header">
                                                            <span>
                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
                                                                Interest-based discount
                                                            </span>
                                                            <span className="count">{interestCount}/{requiredCount}</span>
                                                        </div>
                                                        <div className="progress-bar-bg">
                                                            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="card-footer-action">
                                                    <Link to={`/providers/${provider.id}`} className="btn-view-profile">
                                                        View
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ProviderList;
