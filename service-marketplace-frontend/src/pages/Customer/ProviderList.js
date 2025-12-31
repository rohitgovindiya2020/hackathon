import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Header, Footer } from '../../components/Common';
import styles from './ProviderList.module.css';

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
        <div className={styles.providersPageWrapper}>
            <Header />

            <main className={styles.providersContent}>
                <section className={styles.providersHero}>
                    <div className={styles.heroInner}>
                        <h1>Expert <span className={styles.textGradient}>Service</span> Providers</h1>
                        <p>Discover top-rated professionals committed to delivering exceptional quality for all your home and business needs.</p>
                    </div>
                </section>

                <section className={styles.providersMain}>
                    <div className={styles.container}>
                        <div className={styles.filterBarModern}>
                            <div className={styles.searchInputWrapper}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search providers by name or expertise..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className={styles.loadingState}>
                                <div className={styles.spinner}></div>
                                <p>Curating the best providers for you...</p>
                            </div>
                        ) : (
                            <div className={styles.providersGrid}>
                                {filteredProviders.map((provider, idx) => {
                                    const primaryService = provider.services?.[0] || { name: 'Expert Services' };

                                    return (
                                        <div
                                            key={provider.id}
                                            className={styles.providerCardPremium}
                                            style={{ animation: `${styles.fadeIn} 0.5s ease-out forwards`, animationDelay: `${idx * 0.1}s` }}
                                        >
                                            <div className={styles.cardMedia}>
                                                <img
                                                    src={provider.profile_image ? (provider.profile_image.startsWith('data:') ? provider.profile_image : `data:image/jpeg;base64,${provider.profile_image}`) : `https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800`}
                                                    alt={provider.name}
                                                />
                                            </div>

                                            <div className={styles.cardBody}>
                                                <div className={styles.cardMeta}>
                                                    <span className={styles.listingType}>{primaryService.name}</span>
                                                    <div className={styles.ratingPill}>
                                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                        </svg>
                                                        <span>{provider.average_rating || '5.0'}</span>
                                                        <small>({provider.review_count || 0})</small>
                                                    </div>
                                                </div>

                                                <h3 className={styles.providerCompany}>{provider.name}</h3>

                                                <div className={styles.cardFooterAction}>
                                                    <Link to={`/providers/${provider.id}`} className={styles.btnViewProfile}>
                                                        View Profile
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {!loading && filteredProviders.length === 0 && (
                            <div className={styles.loadingState}>
                                <p>No providers found matching your search.</p>
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
