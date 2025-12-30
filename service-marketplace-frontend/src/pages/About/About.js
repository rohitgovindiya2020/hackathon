import React, { useEffect } from 'react';
import { Header, Footer } from '../../components/Common';
import './About.css';

const About = () => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-up');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // Scroll to top on mount
        window.scrollTo(0, 0);
    }, []);

    const values = [
        {
            icon: '🎯',
            title: 'Precision & Quality',
            description: 'We believe in delivering excellence through attention to detail and a commitment to the highest service standards.'
        },
        {
            icon: '🛡️',
            title: 'Trust & Safety',
            description: 'Your security is our priority. Every professional is background-checked and every job is insured.'
        },
        {
            icon: '⚡',
            title: 'Efficiency',
            description: 'We value your time. Our platform is designed to connect you with the right pro in minutes, not hours.'
        },
        {
            icon: '🤝',
            title: 'Community First',
            description: 'We build relationships, not just transactions. Supporting local experts and satisfying local needs.'
        }
    ];

    const stats = [
        { value: '50K+', label: 'Happy Customers' },
        { value: '1,200+', label: 'Verified Experts' },
        { value: '4.9/5', label: 'Average Rating' },
        { value: '250+', label: 'Cities Covered' }
    ];

    return (
        <div className="about-wrapper">
            <Header />

            <main className="about-content">
                {/* Hero Section */}
                <section className="about-hero">
                    <div className="mesh-gradient-bg"></div>
                    <div className="container">
                        <div className="reveal">
                            <span className="about-hero-badge">Our Story</span>
                            <h1>Building the Future of <br /><span className="text-gradient">Home Services</span></h1>
                            <p>We're on a mission to simplify home maintenance by connecting homeowners with the most trusted professionals in their neighborhood.</p>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="mission-section section-padding">
                    <div className="container">
                        <div className="mission-grid">
                            <div className="mission-content reveal">
                                <h2>Our <span className="text-gradient">Mission</span></h2>
                                <p>Founded in 2020, our platform was born out of a simple frustration: finding reliable help for home repairs shouldn't be a gamble. We set out to build a marketplace where quality, transparency, and trust are the foundation.</p>
                                <p>Today, we empower thousands of skilled professionals to grow their businesses while providing homeowners with the peace of mind they deserve.</p>
                            </div>
                            <div className="mission-visual reveal">
                                <img
                                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1000"
                                    alt="Our Team"
                                    className="mission-image"
                                />
                                <div className="mission-badge-floating">
                                    <span className="number">4+</span>
                                    <span className="label">Years of Innovation</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="values-section section-padding">
                    <div className="container">
                        <div className="section-header reveal">
                            <span className="section-overline">Core Values</span>
                            <h2>What Drives <span className="text-gradient">Us Forward</span></h2>
                        </div>
                        <div className="values-grid">
                            {values.map((value, idx) => (
                                <div key={idx} className="value-card reveal" style={{ transitionDelay: `${idx * 0.1}s` }}>
                                    <div className="value-icon">{value.icon}</div>
                                    <h3>{value.title}</h3>
                                    <p>{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="stats-section">
                    <div className="container">
                        <div className="stats-grid">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="stat-item reveal" style={{ transitionDelay: `${idx * 0.1}s` }}>
                                    <span className="value">{stat.value}</span>
                                    <span className="label">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Vision Preview */}
                <section className="mission-section section-padding" style={{ background: 'white' }}>
                    <div className="container">
                        <div className="mission-grid">
                            <div className="mission-visual reveal">
                                <img
                                    src="https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=1000"
                                    alt="Global Vision"
                                    className="mission-image"
                                />
                            </div>
                            <div className="mission-content reveal">
                                <span className="section-overline">Our Vision</span>
                                <h2>A Seamless <span className="text-gradient">Home Journey</span></h2>
                                <p>We envision a world where home maintenance is effortless. Where every homeowner has a team of vetted experts at their fingertips, and every pro has the tools they need to thrive.</p>
                                <p>We are constantly innovating, using technology to bridge the gap between problem and solution, ensuring that your home remains your sanctuary.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default About;
