import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Header, Footer } from '../../components/Common';
import ChatWindow from '../../components/Chat/ChatWindow';
import api from '../../services/api';
import ProviderCard from '../../components/Provider/ProviderCard';


// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Parallax, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/parallax';
import 'swiper/css/effect-fade';

import './Home.css';

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [providers, setProviders] = useState([]);
    const [loadingProviders, setLoadingProviders] = useState(true);
    const [activeChat, setActiveChat] = useState(null);
    const { user } = useAuth();
    const isProvider = user?.role === 'provider';

    const slides = [
        {
            id: 1,
            title: ["Future Of", "Home Services"],
            subtitle: "Next-Gen Living",
            description: "Experience the ultimate convenience with AI-powered matching and premium verified professionals for your smart home needs.",
            image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000",
            ctaPrimary: "Explore Future",
            ctaSecondary: "Watch Demo",
            link: "/services"
        },
        {
            id: 2,
            title: ["Elite", "Craftsmanship"],
            subtitle: "Premium Standard",
            description: "Elevate your living space with master artisans and certified experts who deliver perfection in every detail.",
            image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=2000",
            ctaPrimary: "Find Experts",
            ctaSecondary: "How it Works",
            link: "/providers"
        },
        {
            id: 3,
            title: ["Sanctuary", "At Home"],
            subtitle: "Wellness Delivered",
            description: "Transform your home into a private wellness retreat with our exclusive selection of beauty and spa services.",
            image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=2000",
            ctaPrimary: "Book Luxury",
            ctaSecondary: "View Menu",
            link: "/services"
        }
    ];


    useEffect(() => {
        setIsVisible(true);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-up');
                }
            });
        }, { threshold: 0.1 });

        setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        }, 100);

        return () => {
            observer.disconnect();
        };
    }, [services]);

    useEffect(() => {
        fetchServices();
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        setLoadingProviders(true);
        try {
            const response = await api.get('/providers', {
                params: { per_page: 4 }
            });
            const providersData = Array.isArray(response.data.data)
                ? response.data.data
                : (response.data.data?.data || []);
            setProviders(providersData);
        } catch (error) {
            console.error('Error fetching providers:', error);
        } finally {
            setLoadingProviders(false);
        }
    };

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
                {/* "Perfect" Minimalist Cinematic Hero Slider */}
                <section className="hero-perfect-container">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay, Parallax, EffectFade]}
                        speed={1500}
                        parallax={true}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        autoplay={{
                            delay: 7000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        onAutoplayTimeLeft={(s, time, progress) => {
                            const progressBar = document.querySelector('.hero-progress-fill');
                            if (progressBar) {
                                progressBar.style.width = `${(1 - progress) * 100}%`;
                            }
                        }}
                        navigation={{
                            nextEl: '.hero-control-next',
                            prevEl: '.hero-control-prev',
                        }}
                        className="hero-perfect-swiper"
                    >
                        {slides.map((slide) => (
                            <SwiperSlide key={slide.id}>
                                <div className="hero-slide-perfect-inner">
                                    {/* Atmospheric Background */}
                                    <div
                                        className="hero-atmosphere-bg"
                                        style={{ backgroundImage: `url(${slide.image})` }}
                                        data-swiper-parallax="40%"
                                    >
                                        <div className="vignette-overlay"></div>
                                        <div className="grain-overlay"></div>
                                    </div>

                                    {/* Centered Luxury Content */}
                                    <div className="container h-full">
                                        <div className="hero-luxury-content">
                                            <div className="content-reveal-layer" data-swiper-parallax="-300">
                                                <div className="hero-entry-tag" data-swiper-parallax="-150">
                                                    <span>{slide.subtitle}</span>
                                                </div>
                                                <h1 className="hero-perfect-title" data-swiper-parallax="-400">
                                                    <span className="title-top">{slide.title[0]}</span>
                                                    <span className="title-bottom italic-serif text-gradient">{slide.title[1]}</span>
                                                </h1>
                                                <p className="hero-perfect-desc" data-swiper-parallax="-500">
                                                    {slide.description}
                                                </p>

                                                <div className="hero-perfect-actions" data-swiper-parallax="-600">
                                                    <Link to={slide.link} className="btn-perfect-primary">
                                                        {slide.ctaPrimary}
                                                    </Link>
                                                    <Link to="/about" className="btn-perfect-outline">
                                                        <span>{slide.ctaSecondary}</span>
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}

                        {/* Luxury UI Controller */}
                        <div className="hero-luxury-ui">
                            <div className="container">
                                <div className="luxury-controls-row">
                                    <div className="hero-index-indicator">
                                        <span className="current">01</span>
                                        <div className="indicator-divider"></div>
                                        <span className="total">0{slides.length}</span>
                                    </div>

                                    <div className="hero-progress-container">
                                        <div className="hero-progress-bar">
                                            <div className="hero-progress-fill"></div>
                                        </div>
                                    </div>

                                    <div className="hero-simple-arrows">
                                        <button className="hero-control-btn hero-control-prev">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M15 18l-6-6 6-6" />
                                            </svg>
                                        </button>
                                        <button className="hero-control-btn hero-control-next">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M9 18l6-6-6-6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Swiper>
                </section>

                {/* Featured Services Section - Hidden for Providers */}
                {!isProvider && (
                    <section className="categories-modern-section section-padding">
                        <div className="container">
                            <div className="section-header-centered reveal">
                                <span className="section-overline">Excellence Defined</span>
                                <h2 className="title-premium">Featured <span className="text-gradient">Services</span></h2>
                                <p className="subtitle-premium">Discover professional solutions powered by our elite expert community.</p>
                            </div>

                            {loadingServices ? (
                                <div className="services-loading">
                                    <div className="spinner-premium"></div>
                                    <span>Curating excellence...</span>
                                </div>
                            ) : (
                                <div className="services-slider-wrapper">
                                    <Swiper
                                        modules={[Pagination, Autoplay]}
                                        spaceBetween={30}
                                        slidesPerView={1}
                                        pagination={{
                                            clickable: true,
                                            el: '.modern-services-pagination'
                                        }}
                                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                                        breakpoints={{
                                            768: { slidesPerView: 2 },
                                            1200: { slidesPerView: 3 },
                                        }}
                                        className="services-modern-swiper"
                                    >
                                        {services.map((service, idx) => (
                                            <SwiperSlide key={service.id}>
                                                <div
                                                    className="service-card-modern-v2 reveal"
                                                    style={{ animationDelay: `${idx * 0.1}s` }}
                                                >
                                                    <div className="service-visual-v2">
                                                        <img
                                                            src={service.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600'}
                                                            alt={service.name}
                                                            className="service-img-v2"
                                                        />
                                                        <div className="service-v2-overlay"></div>
                                                        <div className="service-v2-badges">
                                                            <span className="badge-v2-live">ELITE</span>
                                                            <span className="badge-v2-cat">{typeof service.category === 'object' ? service.category?.name : service.category || 'General'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="service-content-v2">
                                                        <div className="service-v2-meta">
                                                            <div className="v2-rating">
                                                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                                                <span>{service.rating || '4.9'}</span>
                                                            </div>
                                                            <span className="v2-status">Verified</span>
                                                        </div>
                                                        <h3 className="service-v2-title">{service.name}</h3>
                                                        <div className="service-v2-actions">
                                                            <Link to={`/services/${service.id}`} className="btn-v2-primary">
                                                                <span>Reserve</span>
                                                            </Link>
                                                            <Link to={`/services/by-name/${encodeURIComponent(service.name)}`} className="btn-v2-outline">
                                                                <span>All Pros</span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                    {/* Modern Pagination Only */}
                                    <div className="modern-slider-ui">
                                        <div className="modern-services-pagination"></div>
                                    </div>
                                </div>
                            )}

                            <div className="section-actions-center reveal" style={{ marginTop: '4rem' }}>
                                <Link to="/services" className="btn-modern-explore">
                                    <span>View All Offerings</span>
                                    <div className="btn-modern-glow"></div>
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* Enhanced How it Works Section - Hidden for Providers */}
                {!isProvider && (
                    <section className="how-it-works section-padding-lg">
                        <div className="container">
                            <div className="section-header-centered reveal">
                                <span className="section-overline">Simplified Journey</span>
                                <h2 className="title-premium">Your Path to <span className="text-gradient">Home Perfection</span></h2>
                                <p className="subtitle-premium">Experience a seamless process from discovery to completion.</p>
                            </div>

                            <div className="process-flow-container">
                                <div className="process-line-path"></div>

                                <div className="process-grid">
                                    <div className="process-card-wrapper reveal" style={{ animationDelay: '0.1s' }}>
                                        <div className="process-card-glass">
                                            <div className="process-icon-box">
                                                <div className="icon-glow"></div>
                                                <span className="step-number-floating">01</span>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <div className="process-text">
                                                <h3>Discover Experts</h3>
                                                <p>Explore our curated community of background-verified professionals tailored to your specific home needs.</p>
                                            </div>
                                            <div className="process-card-footer">
                                                <span className="footer-tag">AI-Powered Search</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="process-card-wrapper reveal" style={{ animationDelay: '0.2s' }}>
                                        <div className="process-card-glass">
                                            <div className="process-icon-box second">
                                                <div className="icon-glow"></div>
                                                <span className="step-number-floating">02</span>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="process-text">
                                                <h3>Instant Booking</h3>
                                                <p>Select your preferred professional and schedule a visit that fits your life perfectly with real-time availability.</p>
                                            </div>
                                            <div className="process-card-footer">
                                                <span className="footer-tag">Real-time Sync</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="process-card-wrapper reveal" style={{ animationDelay: '0.3s' }}>
                                        <div className="process-card-glass">
                                            <div className="process-icon-box third">
                                                <div className="icon-glow"></div>
                                                <span className="step-number-floating">03</span>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A11.952 11.952 0 003 11.233c0 5.591 3.807 10.29 9 11.622 5.193-1.332 9-6.03 9-11.622 0-2.51-.774-4.858-2.091-6.808z" />
                                                </svg>
                                            </div>
                                            <div className="process-text">
                                                <h3>Guaranteed Quality</h3>
                                                <p>Sit back as our experts deliver perfection. Every job is backed by our dedicated premium service guarantee.</p>
                                            </div>
                                            <div className="process-card-footer">
                                                <span className="footer-tag">Quality Insured</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="process-card-wrapper reveal" style={{ animationDelay: '0.4s' }}>
                                        <div className="process-card-glass">
                                            <div className="process-icon-box fourth">
                                                <div className="icon-glow"></div>
                                                <span className="step-number-floating">04</span>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                            </div>
                                            <div className="process-text">
                                                <h3>Secure Payments</h3>
                                                <p>Experience hassle-free transactions with our encrypted payment system. Only pay once you're fully satisfied.</p>
                                            </div>
                                            <div className="process-card-footer">
                                                <span className="footer-tag">Escrow Protection</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Top Rated Providers - Hidden for Providers */}
                {!isProvider && (
                    <section className="providers-section section-padding">
                        <div className="container">
                            <div className="section-header reveal">
                                <span className="section-overline">Elite Talent</span>
                                <h2>Top Service <span className="text-gradient">Providers</span></h2>
                                <p>Connect with our most highly rated and background-verified professionals.</p>
                            </div>

                            {loadingProviders ? (
                                <div className="services-loading">
                                    <div className="spinner-premium"></div>
                                    <span>Discovering experts...</span>
                                </div>
                            ) : (
                                <div className="providers-grid">
                                    {providers.map((pro, idx) => (
                                        <ProviderCard
                                            key={pro.id}
                                            pro={pro}
                                            idx={idx}
                                            setActiveChat={setActiveChat}
                                        />
                                    ))}

                                </div>
                            )}

                            <div className="section-actions-center reveal" style={{ marginTop: '4rem' }}>
                                <Link to="/providers" className="btn-explore-all">
                                    <span>Browse All Professionals</span>
                                    <div className="btn-glow-ring"></div>
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

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
                                    <img src="/assets/experience-quality.png" alt="Quality" className="main-exp-img" />
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



                {/* Immersive CTA Section - Hidden for Logged in Users */}
                {!user && (
                    <section className="cta-immersion-section reveal section-padding">
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
                    </section>
                )}

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

            {/* Chat Window Overlay */}
            {activeChat && user && (
                <ChatWindow
                    partner={activeChat}
                    onClose={() => setActiveChat(null)}
                />
            )}
        </div >
    );
};

export default Home;
