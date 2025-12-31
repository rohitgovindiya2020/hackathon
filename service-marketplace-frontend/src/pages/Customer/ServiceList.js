import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { Header, Footer } from '../../components/Common';
import './Services.css';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');

    const location = useLocation();

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Handle category from URL query
        const queryParams = new URLSearchParams(location.search);
        const catQuery = queryParams.get('category');
        if (catQuery) {
            setCategory(catQuery);
        }

        fetchServices();
        window.scrollTo(0, 0);
    }, [location.search]);

    const fetchServices = async () => {
        try {
            const response = await api.get('/services?is_active=1');
            const servicesData = Array.isArray(response.data.data)
                ? response.data.data
                : (response.data.data?.data || []);
            setServices(servicesData);

            // Extract unique categories dynamically
            const uniqueCategories = [...new Set(servicesData.map(s => typeof s.category === 'object' ? s.category?.name : s.category).filter(Boolean))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = services.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryName = service.category?.name || service.category;
        const matchesCategory = category ? categoryName === category : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="services-page-wrapper">
            <Header />

            <main className="services-content">
                {/* Hero Header */}
                <section className="services-hero">
                    <div className="container">
                        <div className="hero-inner">
                            <h1>Our <span className="text-gradient">Professional</span> Services</h1>
                            <p>Discover high-quality services from verified experts in your area.</p>
                        </div>
                    </div>
                </section>

                <section className="services-main section-padding">
                    <div className="container">
                        {/* Filter Bar */}
                        <div className="filter-bar-modern">
                            <div className="search-input-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input
                                    type="text"
                                    placeholder="What service are you looking for?"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="category-filter-scroll">
                                <button
                                    className={`cat-tab ${category === '' ? 'active' : ''}`}
                                    onClick={() => setCategory('')}
                                >
                                    All Services
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        className={`cat-tab ${category === cat ? 'active' : ''}`}
                                        onClick={() => setCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="results-header">
                            <p>Showing <strong>{filteredServices.length}</strong> services</p>
                            {category && (
                                <button className="clear-filter" onClick={() => setCategory('')}>
                                    Clear Category: {category} ✕
                                </button>
                            )}
                        </div>

                        {/* Service Grid */}
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Finding best services for you...</p>
                            </div>
                        ) : (
                            <div className="services-list-grid">
                                {filteredServices.map((service, idx) => (
                                    <div
                                        key={service.id}
                                        className="service-list-card animate-up"
                                        style={{ animationDelay: `${idx * 0.05}s` }}
                                    >
                                        <div className="service-card-image">
                                            <img
                                                src={service.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(service.name)}&background=random`}
                                                alt={service.name}
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Service'; }}
                                            />
                                            {service.base_price && <span className="price-badge">${service.base_price}</span>}
                                        </div>
                                        <div className="service-card-content">
                                            <div className="card-top">
                                                <span className="cat-tag">{service.category?.name || service.category || 'General'}</span>
                                                <div className="rating">
                                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                                    <span>{service.rating || 'New'}</span>
                                                </div>
                                            </div>
                                            <h3>{service.name}</h3>
                                            {service.provider && (
                                                <div className="provider-info" style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                                                    Provided by <span style={{ fontWeight: '600', color: '#0f172a' }}>{service.provider.name}</span>
                                                </div>
                                            )}
                                            <p>{service.description ? (service.description.length > 80 ? service.description.substring(0, 80) + '...' : service.description) : 'No description available.'}</p>
                                            <div className="card-footer">
                                                <Link to={`/services/by-name/${encodeURIComponent(service.name)}`} className="btn-details">
                                                    View Details
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {filteredServices.length === 0 && (
                                    <div className="no-services-found">
                                        <div className="empty-icon">🔍</div>
                                        <h3>No services found</h3>
                                        <p>Try adjusting your search or category filters.</p>
                                        <button onClick={() => { setSearchTerm(''); setCategory(''); }} className="btn-reset">Reset All Filters</button>
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
export default ServiceList;
