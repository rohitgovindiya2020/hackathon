import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Newsletter Section */}
                <div className={styles.newsletterSection}>
                    <div className={styles.newsletterCard}>
                        <div className={styles.newsletterInfo}>
                            <h2>Weekly <span className="text-gradient">Innovations</span></h2>
                            <p>Join 20k+ homeowners receiving elite maintenance hacks and exclusive service previews.</p>
                        </div>
                        <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button type="submit" className={styles.submitBtn}>
                                    {subscribed ? 'Joined!' : 'Subscribe'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Main Footer Grid */}
                <div className={styles.footerGrid}>
                    <div className={styles.brandColumn}>
                        <Link to="/" className={styles.logo}>
                            <div className={styles.logoIcon}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7L12 12L22 7L12 2Z" /><path d="M2 17L12 22L22 17" /><path d="M2 12L12 17L22 12" /></svg>
                            </div>
                            <span className={styles.logoText}>Service<span>Hub</span></span>
                        </Link>
                        <p className={styles.brandDesc}>
                            Redefining home maintenance through elite craftsmanship and AI-powered reliability. Experience the future of local services.
                        </p>
                        <div className={styles.socialLinks}>
                            {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                                <a key={social} href={`https://${social}.com`} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        {social === 'facebook' && <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />}
                                        {social === 'twitter' && <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />}
                                        {social === 'instagram' && <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>}
                                        {social === 'linkedin' && <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className={styles.linksColumn}>
                        <h4 className={styles.columnTitle}>Company</h4>
                        <ul className={styles.links}>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/services">All Services</Link></li>
                            <li><Link to="/providers">Elite Partners</Link></li>
                            <li><Link to="/how-it-works">Technology</Link></li>
                            <li><Link to="/careers">Careers</Link></li>
                        </ul>
                    </div>

                    <div className={styles.linksColumn}>
                        <h4 className={styles.columnTitle}>Resources</h4>
                        <ul className={styles.links}>
                            <li><Link to="/help">Help Center</Link></li>
                            <li><Link to="/faq">Discovery FAQ</Link></li>
                            <li><Link to="/safety">Safety Protocol</Link></li>
                            <li><Link to="/become-provider">Partner Portal</Link></li>
                            <li><Link to="/blog">Premium Blog</Link></li>
                        </ul>
                    </div>

                    <div className={styles.contactColumn}>
                        <h4 className={styles.columnTitle}>Contact</h4>
                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                <div className={styles.contactIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                                </div>
                                <div className={styles.contactText}>
                                    <p>Support Hotline</p>
                                    <span>+1 (555) 000-0000</span>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.contactIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                </div>
                                <div className={styles.contactText}>
                                    <p>Official Email</p>
                                    <span>hello@servicehub.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className={styles.footerBottom}>
                    <div className={styles.bottomContent}>
                        <p className={styles.copyright}>
                            © {currentYear} ServiceHub. Engineered for Excellence globally.
                        </p>
                        <div className={styles.legalLinks}>
                            <Link to="/privacy">Privacy</Link>
                            <Link to="/terms">Terms</Link>
                            <Link to="/cookies">Cookies</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
