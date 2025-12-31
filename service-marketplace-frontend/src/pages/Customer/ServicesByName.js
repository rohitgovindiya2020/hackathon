import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Header, Footer } from '../../components/Common';
import './ServicesByName.css';

const ServicesByName = () => {
    const { serviceName } = useParams();
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalServices, setTotalServices] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage] = useState(12);

    useEffect(() => {
        fetchServicesByName();
        // Reset to page 1 when sorting/search changes, but not when page changes (handled locally)
    }, [serviceName]); // Removed currentPage dependency because we fetch all at once now

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortBy]);

    const fetchServicesByName = async () => {
        setLoading(true);
        try {
            const response = await api.get('/services/by-name', {
                params: {
                    name: serviceName
                }
            });

            const servicesData = response.data.data || [];
            setServices(servicesData);
            setTotalServices(servicesData.length);
            // Initial total pages calculation will be based on filtered results
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAndSortedServices = services
        .filter(discount => {
            if (!searchTerm) return true;
            return (
                (discount.service_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (discount.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (discount.provider?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (discount.included_services || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return (a.price_after_discount || 0) - (b.price_after_discount || 0);
                case 'price-high':
                    return (b.price_after_discount || 0) - (a.price_after_discount || 0);
                case 'discount':
                    return (b.discount_percentage || 0) - (a.discount_percentage || 0);
                default:
                    return (a.service_name || '').localeCompare(b.service_name || '');
            }
        });

    // Calculate pagination based on filtered results
    const totalFiltered = filteredAndSortedServices.length;
    const finalTotalPages = Math.max(1, Math.ceil(totalFiltered / perPage));

    // Slice for current page
    const paginatedServices = filteredAndSortedServices.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPagination = (pageCount) => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        pages.push(
            <button
                key="prev"
                className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>
        );

        // First page
        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    className="pagination-btn"
                    onClick={() => handlePageChange(1)}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="dots1" className="pagination-dots">...</span>);
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        // Last page
        if (endPage < pageCount) {
            if (endPage < pageCount - 1) {
                pages.push(<span key="dots2" className="pagination-dots">...</span>);
            }
            pages.push(
                <button
                    key={pageCount}
                    className="pagination-btn"
                    onClick={() => handlePageChange(pageCount)}
                >
                    {pageCount}
                </button>
            );
        }

        // Next button
        pages.push(
            <button
                key="next"
                className={`pagination-btn ${currentPage === pageCount ? 'disabled' : ''}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pageCount}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>
        );

        return pages;
    };

    return (
        <div className="services-by-name-wrapper">
            <Header />

            <main className="services-by-name-content">
                {/* Hero Section */}
                <section className="sbn-hero">
                    <div className="sbn-hero-bg">
                        <div className="hero-gradient-orb orb-1"></div>
                        <div className="hero-gradient-orb orb-2"></div>
                        <div className="hero-gradient-orb orb-3"></div>
                    </div>
                    <div className="sbn-hero-content">
                        <button onClick={() => navigate(-1)} className="back-btn-glass">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            <span>Back</span>
                        </button>

                        <div className="hero-title-section">
                            <h1 className="sbn-main-title">
                                <span className="title-highlight">{decodeURIComponent(serviceName)}</span>
                                <span className="title-subtitle">Discount Deals</span>
                            </h1>
                            <p className="sbn-subtitle">
                                Explore upcoming discount offers from verified providers
                            </p>
                        </div>

                        <div className="sbn-stats-row">
                            <div className="stat-card-modern">
                                <div className="stat-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <strong>{totalServices}</strong>
                                    <span>Deals Found</span>
                                </div>
                            </div>

                            <div className="stat-card-modern">
                                <div className="stat-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <strong>Up to {services.length > 0 ? Math.max(...services.map(s => s.discount_percentage || 0)) : 0}%</strong>
                                    <span>Max Discount</span>
                                </div>
                            </div>

                            <div className="stat-card-modern">
                                <div className="stat-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <strong>100%</strong>
                                    <span>Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filters and Search */}
                <section className="sbn-filters-section">
                    <div className="container">
                        <div className="filters-bar">
                            <div className="search-box-modern">
                                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by provider or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="sort-control-modern">
                                <label>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                    </svg>
                                    Sort by:
                                </label>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="name">Name (A-Z)</option>
                                    <option value="discount">Discount % (High to Low)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="sbn-services-section section-padding">
                    <div className="container">
                        {loading ? (
                            <div className="loading-state-modern">
                                <div className="spinner-modern"></div>
                                <p>Finding the best providers for you...</p>
                            </div>
                        ) : filteredAndSortedServices.length === 0 ? (
                            <div className="no-results-modern">
                                <div className="no-results-icon">🔍</div>
                                <h3>No Deals found</h3>
                                <p>We couldn't find any deals for "{decodeURIComponent(serviceName)}"</p>
                                <button onClick={() => navigate('/services')} className="btn-back-to-services">
                                    Browse All Services
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="services-grid-modern">
                                    {paginatedServices.map((discount, idx) => (
                                        <div
                                            key={discount.id}
                                            className="service-card-premium discount-card"
                                            style={{ animationDelay: `${idx * 0.05}s` }}
                                        >
                                            <div className="card-image-wrapper">
                                                <img
                                                    src={discount.banner_image || discount.service_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(discount.service_name || 'Discount')}&background=random&size=400`}
                                                    alt={discount.service_name}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/400x300?text=Discount+Deal';
                                                    }}
                                                />
                                                <div className="card-overlay"></div>

                                                {/* Discount Badge */}
                                                {discount.discount_percentage && (
                                                    <div className="discount-badge-large">
                                                        <span className="discount-value">{discount.discount_percentage}%</span>
                                                        <span className="discount-label">OFF</span>
                                                    </div>
                                                )}

                                                {/* Price Tag */}
                                                <div className="price-tag-glass">
                                                    <div className="price-original">${discount.current_price}</div>
                                                    <div className="price-discounted">${discount.price_after_discount}</div>
                                                </div>

                                                <button className="btn-favorite-card">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="card-content-area">
                                                <div className="card-header-row">
                                                    <span className="category-badge">
                                                        {discount.service_name || 'Service'}
                                                    </span>
                                                    <span className="deal-status upcoming">
                                                        ⏰ Upcoming Deal
                                                    </span>
                                                </div>

                                                <h3 className="service-name">{discount.description || 'Special Discount Offer'}</h3>

                                                {/* Deal Progress */}
                                                {discount.required_interest_count && (
                                                    <div className="deal-progress-section">
                                                        <div className="progress-bar-wrapper">
                                                            <div
                                                                className="progress-bar-fill"
                                                                style={{
                                                                    width: `${Math.min(100, (discount.current_interest_count / discount.required_interest_count) * 100)}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <div className="progress-info">
                                                            <span>{discount.current_interest_count || 0} / {discount.required_interest_count} interested</span>
                                                            <span className="progress-percentage">
                                                                {Math.round((discount.current_interest_count / discount.required_interest_count) * 100)}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Provider Info */}
                                                {discount.provider && (
                                                    <div className="provider-info-card">
                                                        <div className="provider-avatar">
                                                            {discount.provider.profile_image ? (
                                                                <img src={discount.provider.profile_image} alt={discount.provider.name} />
                                                            ) : (
                                                                <div className="avatar-placeholder">
                                                                    {discount.provider.name.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                            <div className="verified-badge">✓</div>
                                                        </div>
                                                        <div className="provider-details">
                                                            <span className="provider-label">Offered by</span>
                                                            <strong className="provider-name">{discount.provider.name}</strong>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Dates */}
                                                <div className="discount-dates">
                                                    {discount.interest_from_date && (
                                                        <div className="date-item date-start">
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <circle cx="12" cy="12" r="10"></circle>
                                                                <polyline points="12 6 12 12 16 14"></polyline>
                                                            </svg>
                                                            <span>Starts: {new Date(discount.interest_from_date).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                    {discount.interest_to_date && (
                                                        <div className="date-item date-end">
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                                            </svg>
                                                            <span>Ends: {new Date(discount.interest_to_date).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="card-footer-actions">
                                                    <Link
                                                        to={`/providers/${discount.service_provider_id}/discount/${discount.id}`}
                                                        className={`btn-view-details-modern btn-register-interest ${(discount.is_active || (discount.current_interest_count >= (discount.required_interest_count || 0))) ? 'goal-reached' : ''}`}
                                                    >
                                                        <span>{(discount.is_active || (discount.current_interest_count >= (discount.required_interest_count || 0))) ? 'Goal Reached' : 'Register Interest'}</span>
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {finalTotalPages > 1 && (
                                    <div className="pagination-container">
                                        <div className="pagination-info">
                                            Showing page <strong>{currentPage}</strong> of <strong>{finalTotalPages}</strong>
                                        </div>
                                        <div className="pagination-controls">
                                            {renderPagination(finalTotalPages)}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ServicesByName;
