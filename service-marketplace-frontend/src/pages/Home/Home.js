import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Header, Footer } from '../../components/Common';
import api from '../../services/api';
import './Home.css';

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [openFaq, setOpenFaq] = useState(null);
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);

    const slides = [
        {
            id: 1,
            title: ["Expert Home", "Services"],
            subtitle: "Premium Excellence",
            description: "Find the most reliable cleaning, plumbing, and repair services for your home with just a few clicks.",
            image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=2000",
            ctaPrimary: "Explore Services",
            ctaSecondary: "View Portfolio",
            link: "/services"
        },
        {
            id: 2,
            title: ["Your Personal", "Repair Pro"],
            subtitle: "On-Demand Help",
            description: "From electrical fixes to full-scale renovations, our verified professionals are here to help.",
            image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=2000",
            ctaPrimary: "Find a Pro",
            ctaSecondary: "How it Works",
            link: "/providers"
        },
        {
            id: 3,
            title: ["Beauty & Wellness", "At Home"],
            subtitle: "Luxury Delivered",
            description: "Experience premium salon and spa treatments in the comfort of your own home.",
            image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=2000",
            ctaPrimary: "Book Now",
            ctaSecondary: "Our Services",
            link: "/services"
        }
    ];

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, [slides.length]);

    useEffect(() => {
        setIsVisible(true);
        const timer = setInterval(nextSlide, 7000); // Cinematic timing

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-up');
                }
            });
        }, { threshold: 0.1 });

        // Observe elements, including those that might have been added dynamically
        setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        }, 100);

        return () => {
            clearInterval(timer);
            observer.disconnect();
        };
    }, [nextSlide, services]); // Re-run when services change

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoadingServices(true);
        try {
            const response = await api.get('/services', {
                params: { per_page: 6, is_active: 1 }
            });
            const servicesData = Array.isArray(response.data.data)
                ? response.data.data
                : (response.data.data?.data || []);
            setServices(servicesData);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoadingServices(false);
        }
    };

    const categories = [
        { id: 1, name: 'Cleaning', icon: '🧹', count: '120+ Jobs', color: '#e0f2fe' },
        { id: 2, name: 'Plumbing', icon: '🔧', count: '80+ Jobs', color: '#fef3c7' },
        { id: 3, name: 'Electrical', icon: '⚡', count: '95+ Jobs', color: '#ffedd5' },
        { id: 4, name: 'Painting', icon: '🎨', count: '60+ Jobs', color: '#f3e8ff' },
        { id: 5, name: 'Carpentry', icon: '🪚', count: '45+ Jobs', color: '#dcfce7' },
        { id: 6, name: 'Gardening', icon: '🌿', count: '30+ Jobs', color: '#ecfdf5' },
    ];

    const popularServices = [
        { id: 1, title: 'Deep Home Cleaning', provider: 'Shiny Homes Co.', rating: 4.8, price: '$80', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400', tag: 'POPULAR' },
        { id: 2, title: 'Emergency Plumbing', provider: 'Quick Fix Plumbers', rating: 4.9, price: '$120', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400', tag: 'EMERGENCY' },
        { id: 3, title: 'Full House Painting', provider: 'Artisan Decorators', rating: 4.7, price: '$450', image: 'https://images.unsplash.com/photo-1589939705384-5185138a0470?auto=format&fit=crop&q=80&w=400', tag: 'TOP RATED' },
    ];

    const featuredProviders = [
        { id: 1, name: 'Marco Rossi', role: 'Master Electrician', rating: 4.9, jobs: 450, reviews: 320, responseTime: '15 min', image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=150', isPro: true },
        { id: 2, name: 'Elena Gilbert', role: 'Interior Designer', rating: 4.8, jobs: 320, reviews: 210, responseTime: '45 min', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', isPro: true },
        { id: 3, name: 'John Wick', role: 'Security Expert', rating: 5.0, jobs: 890, reviews: 750, responseTime: '5 min', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', isPro: true },
        { id: 4, name: 'Sarah Connor', role: 'Smart Home Specialist', rating: 4.9, jobs: 210, reviews: 180, responseTime: '30 min', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', isPro: false },
    ];

    const stats = [
        { label: 'Happy Customers', value: '50k+', icon: '😊' },
        { label: 'Verified Experts', value: '1.2k+', icon: '🤝' },
        { label: 'Average Rating', value: '4.9/5', icon: '⭐' },
        { label: 'Cities Covered', value: '250+', icon: '📍' },
    ];

    const faqs = [
        { q: "How do I book a service?", a: "Simply browse our categories, select a service that fits your needs, choose a verified provider, and pick a convenient date and time." },
        { q: "Are the service providers verified?", a: "Yes, 100%. Every professional on our platform undergoes a rigorous background check and skill verification process." },
        { q: "What if I'm not satisfied with the work?", a: "We offer a Quality Guarantee. If you're not happy, we'll send someone to fix it for free or provide a full refund." },
        { q: "Can I cancel a booking?", a: "Yes, you can cancel any booking for free up to 24 hours before the scheduled appointment." }
    ];

    return (
        <div className="home-wrapper">
            <Header />

            <main className="home-content">
                {/* Geometric Narrative Hero */}
                <section className="hero-geometric">
                    <div className="mesh-gradient-bg"></div>
                    <div className="floating-particles"></div>

                    <div className="container">
                        <div className="hero-split-narrative">
                            <div className="narrative-content-column">
                                <div className="hero-perspective-card">
                                    {slides.map((slide, idx) => (
                                        <div
                                            key={slide.id}
                                            className={`narrative-frame ${idx === currentSlide ? 'active' : ''}`}
                                        >
                                            <div className="narrative-meta">
                                                <span className="narrative-badge">{slide.subtitle}</span>
                                                <div className="meta-line"></div>
                                            </div>
                                            <h1 className="narrative-title">
                                                <span>{slide.title[0]}</span>
                                                <span className="text-gradient">{slide.title[1]}</span>
                                            </h1>
                                            <p className="narrative-description">{slide.description}</p>

                                            <div className="narrative-actions">
                                                <Link to={slide.link} className="btn-narrative-primary">
                                                    <span>{slide.ctaPrimary}</span>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                                </Link>
                                                <Link to="/about" className="btn-narrative-secondary">
                                                    {slide.ctaSecondary}
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="vertical-sequence-nav">
                                    {slides.map((_, idx) => (
                                        <button
                                            key={idx}
                                            className={`sequence-item ${idx === currentSlide ? 'active' : ''}`}
                                            onClick={() => setCurrentSlide(idx)}
                                        >
                                            <span className="sequence-number">{idx + 1}</span>
                                            <div className="sequence-indicator">
                                                <div className="indicator-fill"></div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="visual-prism-column">
                                <div className="media-prism-stack">
                                    {slides.map((slide, idx) => (
                                        <div
                                            key={slide.id}
                                            className={`prism-layer ${idx === currentSlide ? 'active' : ''}`}
                                            style={{
                                                '--layer-index': idx,
                                                '--total-layers': slides.length,
                                                backgroundImage: `url(${slide.image})`
                                            }}
                                        >
                                            <div className="prism-glass-overlay"></div>
                                        </div>
                                    ))}
                                </div>

                                <div className="prism-decorative-elements">
                                    <div className="prism-ring"></div>
                                    <div className="prism-dot"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hero-scroll-guide">
                        <div className="scroll-bar">
                            <div className="scroll-fill"></div>
                        </div>
                        <span className="scroll-label">DISCOVER</span>
                    </div>
                </section>



                {/* Featured Services Section */}
                <section className="categories-section section-padding bg-light">
                    <div className="container">
                        <div className="section-header reveal">
                            <span className="section-overline">Platform Offerings</span>
                            <h2>Featured <span className="text-gradient">Services</span></h2>
                            <p>Discover professional solutions powered by our expert community.</p>
                        </div>

                        {loadingServices ? (
                            <div className="services-loading">
                                <div className="spinner-premium"></div>
                                <span>Curating best services...</span>
                            </div>
                        ) : (
                            <div className="categories-grid">
                                {services.map((service, idx) => (
                                    <div
                                        key={service.id}
                                        className="service-card-modern reveal"
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                    >
                                        <div className="service-visual-area">
                                            <img
                                                src={service.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600'}
                                                alt={service.name}
                                                className="service-hero-img"
                                            />
                                            <div className="service-glass-overlay"></div>
                                            <div className="service-badges-top">
                                                <span className="badge-live">LIVE</span>
                                                <span className="badge-category">{typeof service.category === 'object' ? service.category?.name : service.category || 'General'}</span>
                                            </div>
                                            <button className="btn-wishlist-glass">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                                            </button>
                                        </div>
                                        <div className="service-details-area">
                                            <div className="service-meta-info">
                                                <div className="meta-rating">
                                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                                    <span>{service.rating || '4.9'}</span>
                                                </div>
                                                <span className="meta-verified">● Verified</span>
                                            </div>
                                            <h3 className="service-title-modern">{service.name}</h3>
                                            <div className="service-price-row-modern">
                                                <Link to={`/services/${service.id}`} className="btn-book-cinematic">
                                                    <span>Reserve</span>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="section-actions-center reveal">
                            <Link to="/services" className="btn-explore-all">
                                <span>Explore All Services</span>
                                <div className="btn-glow-ring"></div>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
                < section className="how-it-works section-padding" >
                    <div className="container">
                        <div className="section-header reveal">
                            <span className="section-overline">The Process</span>
                            <h2>How It <span className="text-gradient">Works</span></h2>
                            <p>Get your home tasks handled by experts in three simple steps.</p>
                        </div>
                        <div className="steps-container">
                            <div className="step-item reveal">
                                <div className="step-number-container">
                                    <div className="step-number">01</div>
                                    <div className="step-blob"></div>
                                </div>
                                <h3>Find a Service</h3>
                                <p>Choose from our wide range of premium services.</p>
                            </div>
                            <div className="step-line reveal"></div>
                            <div className="step-item reveal">
                                <div className="step-number-container">
                                    <div className="step-number">02</div>
                                    <div className="step-blob second"></div>
                                </div>
                                <h3>Choose Provider</h3>
                                <p>Pick the best professional based on reviews and price.</p>
                            </div>
                            <div className="step-line reveal"></div>
                            <div className="step-item reveal">
                                <div className="step-number-container">
                                    <div className="step-number">03</div>
                                    <div className="step-blob third"></div>
                                </div>
                                <h3>Book & Relax</h3>
                                <p>Schedule a time and let us handle the rest.</p>
                            </div>
                        </div>
                    </div>
                </section >

                {/* Featured Services */}
                < section className="featured-section section-padding bg-light" >
                    <div className="container">
                        <div className="section-header reveal">
                            <span className="section-overline">Top Picked</span>
                            <h2>Popular <span className="text-gradient">Services</span></h2>
                            <p>Hand-picked services from our most trusted and highly-rated providers.</p>
                        </div>

                        <div className="services-grid">
                            {popularServices.map((service, idx) => (
                                <div
                                    key={service.id}
                                    className="service-card-modern reveal"
                                    style={{ animationDelay: `${idx * 0.15}s` }}
                                >
                                    <div className="service-visual-area">
                                        <img src={service.image} alt={service.title} className="service-hero-img" />
                                        <div className="service-glass-overlay"></div>
                                        <div className="service-badges-top">
                                            <span className="badge-tag">{service.tag}</span>
                                        </div>
                                        <button className="btn-wishlist-glass">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                                        </button>
                                    </div>
                                    <div className="service-details-area">
                                        <div className="service-meta-info">
                                            <div className="meta-rating">
                                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                                <span>{service.rating}</span>
                                            </div>
                                            <span className="meta-verified">● Premium</span>
                                        </div>
                                        <h3 className="service-title-modern">{service.title}</h3>
                                        <p className="service-provider-line">by <strong>{service.provider}</strong></p>
                                        <div className="service-price-row-modern">
                                            <div className="price-label-group">
                                                <span className="start-at">Investment</span>
                                                <span className="price-amount">{service.price}</span>
                                            </div>
                                            <Link to={`/services/${service.id}`} className="btn-book-cinematic">
                                                <span>View</span>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section >

                {/* Top Rated Providers */}
                < section className="providers-section section-padding" >
                    <div className="container">
                        <div className="section-header reveal">
                            <span className="section-overline">Elite Talent</span>
                            <h2>Expert <span className="text-gradient">Partners</span></h2>
                            <p>Connect with our most highly rated and background-verified professionals.</p>
                        </div>
                        <div className="providers-grid">
                            {featuredProviders.map((pro, idx) => (
                                <div key={pro.id} className="provider-card-modern reveal" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className="pro-card-header">
                                        {pro.isPro && <span className="elite-badge">ELITE PRO</span>}
                                        <div className="pro-actions">
                                            <button className="pro-action-btn favorite">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pro-main-info">
                                        <div className="pro-avatar-wrapper">
                                            <div className="pro-avatar-ring"></div>
                                            <img src={pro.image} alt={pro.name} className="pro-avatar-img" />
                                            <div className="pro-status-pulse"></div>
                                        </div>
                                        <h3>{pro.name}</h3>
                                        <span className="pro-role-tag">{pro.role}</span>
                                    </div>

                                    <div className="pro-rating-row">
                                        <div className="pro-stars">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={i < Math.floor(pro.rating) ? 'star-filled' : 'star-empty'} viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="rating-count">({pro.reviews} reviews)</span>
                                    </div>

                                    <div className="pro-meta-grid">
                                        <div className="meta-item">
                                            <span className="meta-label">Total Jobs</span>
                                            <span className="meta-value">{pro.jobs}+</span>
                                        </div>
                                        <div className="meta-divider"></div>
                                        <div className="meta-item">
                                            <span className="meta-label">Response</span>
                                            <span className="meta-value">{pro.responseTime}</span>
                                        </div>
                                    </div>

                                    <div className="pro-card-footer">
                                        <button className="btn-message-pro">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
                                        </button>
                                        <Link to={`/providers/${pro.id}`} className="btn-view-pro-profile">
                                            <span>View Profile</span>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section >

                {/* Experience Quality Section */}
                < section className="experience-section section-padding bg-gradient-dark" >
                    <div className="container">
                        <div className="experience-inner reveal">
                            <div className="experience-text">
                                <span className="section-overline">Unmatched Quality</span>
                                <h2>Experience the <span className="text-gradient">Premium Standard</span></h2>
                                <p>We don't just connect you with providers; we ensure every job meets our high bar for excellence.</p>

                                <div className="qualities-grid">
                                    <div className="quality-item">
                                        <div className="q-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                        </div>
                                        <h4>Full Protection</h4>
                                        <p>Every job is insured and protected by our platform guarantee.</p>
                                    </div>
                                    <div className="quality-item">
                                        <div className="q-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                        </div>
                                        <h4>Expert Quality</h4>
                                        <p>Only the top 5% of service providers meet our strict standards.</p>
                                    </div>
                                    <div className="quality-item">
                                        <div className="q-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
                                        </div>
                                        <h4>Seamless Support</h4>
                                        <p>Our dedicated support team is available 24/7 for your needs.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="experience-image-modern">
                                <div className="image-stack-wrapper">
                                    <img src="https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=800" alt="Quality" className="main-exp-img" />
                                    <div className="floating-exp-card reveal">
                                        <div className="exp-icon-box">🏆</div>
                                        <div className="exp-info">
                                            <strong>#1 Choice</strong>
                                            <span>Home Services 2024</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="floating-badge-pro">
                                    <span className="number">10+</span>
                                    <span className="text">Years Experience</span>
                                </div>
                            </div>
                        </div>
                        <div className="experience-trust-row reveal">
                            <div className="trust-brand">ISO 9001 Certified</div>
                            <div className="trust-brand">Safe Payments</div>
                            <div className="trust-brand">Quality Insured</div>
                            <div className="trust-brand">24/7 Verified</div>
                        </div>
                    </div>
                </section >

                {/* Testimonials Section */}
                < section className="testimonials-section section-padding" >
                    <div className="container">
                        <div className="section-header reveal">
                            <span className="section-overline">Customer Reviews</span>
                            <h2>Customer <span className="text-gradient">Voice</span></h2>
                            <p>Real stories from our satisfied community across the globe.</p>
                        </div>
                        <div className="testimonials-grid">
                            <div className="testimonial-card-premium reveal">
                                <div className="t-header">
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => <svg key={i} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>)}
                                    </div>
                                    <div className="quote-mark">“</div>
                                </div>
                                <p>The most efficient way to handle home repairs. The provider was on time and very professional. Highly recommended!</p>
                                <div className="t-user">
                                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="User" />
                                    <div className="u-info">
                                        <h4>Sarah Johnson</h4>
                                        <span className="u-tag">Verified Homeowner</span>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial-card-premium reveal" style={{ animationDelay: '0.2s' }}>
                                <div className="t-header">
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => <svg key={i} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>)}
                                    </div>
                                    <div className="quote-mark">“</div>
                                </div>
                                <p>Found a great interior designer here. The whole process from selection to payment was smooth and transparent.</p>
                                <div className="t-user">
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="User" />
                                    <div className="u-info">
                                        <h4>David Miller</h4>
                                        <span className="u-tag">Verified Customer</span>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial-card-premium reveal" style={{ animationDelay: '0.4s' }}>
                                <div className="t-header">
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => <svg key={i} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>)}
                                    </div>
                                    <div className="quote-mark">“</div>
                                </div>
                                <p>Exceptional service. I booked a deep cleaning and the team exceeded all my expectations. Worth every penny!</p>
                                <div className="t-user">
                                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" alt="User" />
                                    <div className="u-info">
                                        <h4>Elena Gilbert</h4>
                                        <span className="u-tag">Gold Member</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="testimonials-trust-bar reveal">
                            <div className="trust-source">
                                <span className="source-stars">Excellent 4.9/5</span>
                                <span className="source-label">on Trustpilot</span>
                            </div>
                            <div className="trust-divider"></div>
                            <div className="trust-source">
                                <span className="source-stars">★★★★★ 4.8</span>
                                <span className="source-label">on Google Reviews</span>
                            </div>
                            <div className="trust-divider"></div>
                            <div className="trust-source">
                                <span className="source-stars">100% Secure</span>
                                <span className="source-label">Payment Protection</span>
                            </div>
                        </div>
                    </div>
                </section >

                {/* FAQ Section */}
                < section className="faq-section section-padding bg-light" >
                    <div className="container">
                        <div className="faq-flex-container">
                            <div className="faq-header-side reveal">
                                <div className="section-header text-left">
                                    <span className="section-overline">Support Center</span>
                                    <h2>Common <span className="text-gradient">Questions</span></h2>
                                    <p>Everything you need to know about our services and booking process.</p>
                                </div>

                                <div className="support-card-mini">
                                    <div className="support-icon">💬</div>
                                    <h4>Still have questions?</h4>
                                    <p>Can't find what you're looking for? Reach out to our 24/7 support team.</p>
                                    <button className="btn-support-link">Contact Support</button>
                                </div>
                            </div>

                            <div className="faq-content-side reveal">
                                <div className="faq-container">
                                    {faqs.map((faq, idx) => (
                                        <div
                                            key={idx}
                                            className={`faq-item-modern ${openFaq === idx ? 'open' : ''}`}
                                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        >
                                            <div className="faq-question">
                                                <div className="q-text">
                                                    <span className="q-number">0{idx + 1}</span>
                                                    <h3>{faq.q}</h3>
                                                </div>
                                                <span className="faq-toggle">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 9l-7 7-7-7" /></svg>
                                                </span>
                                            </div>
                                            <div className="faq-answer">
                                                <p>{faq.a}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section >



                {/* Immersive CTA Section */}
                < section className="cta-immersion-section reveal section-padding" >
                    <div className="cta-bg-shapes">
                        <div className="glass-shape s1"></div>
                        <div className="glass-shape s2"></div>
                    </div>
                    <div className="container">
                        <div className="cta-theatrical-box">
                            <div className="cta-content-column">
                                <div className="cta-badge-modern">🚀 Limitless Possibilities</div>
                                <h2 className="cta-title-ultra">
                                    Ready to Transform<br />
                                    Your <span className="text-gradient">Home Journey?</span>
                                </h2>
                                <p className="cta-p-premium">
                                    Join thousands of satisfied homeowners who trust our verified experts
                                    for their most important tasks. Quality guaranteed, every single time.
                                </p>

                                <div className="cta-trust-grid">
                                    <div className="cta-trust-card">
                                        <div className="trust-icon-box">🛡️</div>
                                        <div className="trust-info">
                                            <h4>Quality Guarantee</h4>
                                            <span>Verified Professionals</span>
                                        </div>
                                    </div>
                                    <div className="cta-trust-card">
                                        <div className="trust-icon-box">💬</div>
                                        <div className="trust-info">
                                            <h4>24/7 Support</h4>
                                            <span>Always here to help</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="cta-main-actions">
                                    <Link to="/register" className="btn-cta-cinematic">
                                        <span>Start Your Journey</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </Link>
                                    <Link to="/register?role=provider" className="btn-cta-outline-glass">
                                        Become a Partner
                                    </Link>
                                </div>
                            </div>

                            <div className="cta-visual-column">
                                <div className="floating-trust-medal">
                                    <div className="medal-content">
                                        <span className="medal-number">4.9</span>
                                        <span className="medal-stars">★★★★★</span>
                                        <span className="medal-label">User Rating</span>
                                    </div>
                                </div>
                                <div className="security-seal-glass">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                    <span>100% Secure Payments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section >

                {/* Statistics Highlights */}
                < section className="stats-impact-section reveal section-padding" >
                    <div className="container">
                        <div className="stats-premium-row">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="stat-glass-card" style={{ animationDelay: `${idx * 0.15}s` }}>
                                    <div className="stat-content">
                                        <div className="stat-visual">
                                            <span className="stat-emoji">{stat.icon}</span>
                                            <div className="stat-pulse-ring"></div>
                                        </div>
                                        <div className="stat-text">
                                            <h3 className="stat-number">{stat.value}</h3>
                                            <p className="stat-desc">{stat.label}</p>
                                        </div>
                                    </div>
                                    {idx < stats.length - 1 && <div className="stat-v-divider"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section >

                {/* Elite Trust Partners Marquee */}
                < section className="partners-marquee-section reveal section-padding" >
                    <div className="marquee-container">
                        <div className="partners-header">
                            <span className="section-overline">Our Ecosystem</span>
                            <p>Collaborating with Global Leaders</p>
                        </div>
                        <div className="marquee-track">
                            <div className="marquee-content">
                                {[...Array(2)].map((_, i) => (
                                    <React.Fragment key={i}>
                                        <div className="partner-brand">
                                            <div className="brand-icon">H</div>
                                            <span>HomePro Global</span>
                                        </div>
                                        <div className="partner-brand">
                                            <div className="brand-icon">F</div>
                                            <span>FixIt United</span>
                                        </div>
                                        <div className="partner-brand">
                                            <div className="brand-icon">S</div>
                                            <span>SafeSpace Tech</span>
                                        </div>
                                        <div className="partner-brand">
                                            <div className="brand-icon">P</div>
                                            <span>ProCare Elite</span>
                                        </div>
                                        <div className="partner-brand">
                                            <div className="brand-icon">A</div>
                                            <span>Artisan Alliance</span>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </section >
            </main >

            <Footer />
        </div >
    );
};

export default Home;
