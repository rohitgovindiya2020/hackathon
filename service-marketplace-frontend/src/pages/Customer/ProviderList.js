import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Header, Footer } from '../../components/Common';
import ProviderCard from '../../components/Provider/ProviderCard';
import ChatWindow from '../../components/Chat/ChatWindow';
import styles from './ProviderList.module.css';


const ProviderList = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeChat, setActiveChat] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });


    const filteredProviders = providers.filter(provider =>
        (provider.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (provider.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchProviders();
        window.scrollTo(0, 0);

        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            setMousePos({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (loading) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-up');
                }
            });
        }, { threshold: 0.1 });

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [loading, filteredProviders.length]);

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
                            <div className="providers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                                {filteredProviders.map((provider, idx) => (
                                    <ProviderCard
                                        key={provider.id}
                                        pro={provider}
                                        idx={idx}
                                        setActiveChat={setActiveChat}
                                        mousePos={mousePos}
                                    />
                                ))}
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

            {activeChat && (
                <ChatWindow
                    partner={activeChat}
                    onClose={() => setActiveChat(null)}
                />
            )}

            <Footer />

        </div>
    );
};

export default ProviderList;
