import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { Header, Footer } from '../../components/Common';
import './Services.css'; // Reusing established styles for consistency

const Search = () => {
    const [results, setResults] = useState({ services: [], providers: [], discounts: [] });
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q') || '';

    useEffect(() => {
        if (query) {
            handleSearch();
        } else {
            setLoading(false);
        }
        window.scrollTo(0, 0);
    }, [query]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
            if (response.data.status === 'success') {
                setResults(response.data.data);
            }
        } catch (error) {
            console.error('Failed to perform search:', error);
        } finally {
            setLoading(false);
        }
    };

    const hasResults = results.services.length > 0 || results.providers.length > 0 || results.discounts.length > 0;

    return (
        <div className="search-page-wrapper">
            <Header />

            <main className="search-content">
                <section className="services-hero">
                    <div className="container">
                        <div className="hero-inner">
                            <h1>Search <span className="text-gradient">Results</span></h1>
                            <p>Showing findings for: <strong>"{query}"</strong></p>
                        </div>
                    </div>
                </section>

                <section className="search-main section-padding">
                    <div className="container">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Searching the marketplace...</p>
                            </div>
                        ) : !hasResults ? (
                            <div className="no-services-found">
                                <div className="empty-icon">🔍</div>
                                <h3>No matches found</h3>
                                <p>We couldn't find any services, providers, or discounts matching your search.</p>
                                <Link to="/" className="btn-reset">Back to Home</Link>
                            </div>
                        ) : (
                            <div className="search-results-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {results.services.length > 0 && (
                                    <div className="search-group" style={{ marginBottom: '4rem' }}>
                                        <h2 className="group-title" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #f1f5f9' }}>Services ({results.services.length})</h2>
                                        <div className="services-list-grid">
                                            {results.services.map((service) => (
                                                <div key={service.id} className="service-list-card">
                                                    <div className="service-card-image">
                                                        <img src={service.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(service.name)}&background=random`} alt={service.name} />
                                                    </div>
                                                    <div className="service-card-content">
                                                        <h3>{service.name}</h3>
                                                        <Link to={`/services/${service.id}`} className="btn-details">View Details</Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {results.providers.length > 0 && (
                                    <div className="search-group" style={{ marginBottom: '4rem' }}>
                                        <h2 className="group-title" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #f1f5f9' }}>Service Professionals ({results.providers.length})</h2>
                                        <div className="services-list-grid">
                                            {results.providers.map((pro) => (
                                                <div key={pro.id} className="service-list-card">
                                                    <div className="service-card-image">
                                                        <img src={pro.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}&background=random`} alt={pro.name} />
                                                    </div>
                                                    <div className="service-card-content">
                                                        <h3>{pro.name}</h3>
                                                        <Link to={`/providers/${pro.id}`} className="btn-details">View Profile</Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {results.discounts.length > 0 && (
                                    <div className="search-group">
                                        <h2 className="group-title" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #f1f5f9' }}>Available Discounts ({results.discounts.length})</h2>
                                        <div className="services-list-grid">
                                            {results.discounts.map((discount) => (
                                                <div key={discount.id} className="service-list-card">
                                                    <div className="service-card-image">
                                                        <img src={discount.banner_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(discount.service?.name)}&background=random`} alt={discount.service?.name} />
                                                        <span className="price-badge" style={{ backgroundColor: '#ef4444' }}>-{discount.discount_percentage}%</span>
                                                    </div>
                                                    <div className="service-card-content">
                                                        <h3>{discount.service?.name}</h3>
                                                        <p>{discount.address?.city}, {discount.address?.area}</p>
                                                        <Link to={`/providers/${discount.service_provider_id}/service/${discount.service_id}/discount`} className="btn-details">Join Deal</Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Search;
