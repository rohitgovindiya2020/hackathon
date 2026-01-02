import React, { useState, useEffect } from 'react';
import { Header, Footer } from '../../components/Common';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import '../Dashboard.css';
import styles from './ManageServices.module.css';


const ManageServices = () => {
    const [myServices, setMyServices] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [discounts, setDiscounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('my'); // 'my' or 'all'
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const perPage = 12;

    useEffect(() => {
        fetchMyServices();
        fetchDiscounts();
    }, []);

    useEffect(() => {
        if (activeTab === 'all') {
            fetchAllServices(currentPage, searchTerm);
        }
    }, [activeTab, currentPage, searchTerm]);

    const fetchMyServices = async () => {
        try {
            setLoading(true);
            const res = await api.get('/my-services');
            setMyServices(res.data.data);
        } catch (error) {
            toast.error('Failed to fetch your services');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllServices = async (page, search = '') => {
        try {
            setLoading(true);
            const res = await api.get(`/services?per_page=${perPage}&page=${page}&search=${search}&is_active=1`);
            setAllServices(res.data.data.data);
            setTotalPages(res.data.data.last_page);
        } catch (error) {
            toast.error('Failed to fetch services');
        } finally {
            setLoading(false);
        }
    };

    const fetchDiscounts = async () => {
        try {
            const res = await api.get('/discounts');
            setDiscounts(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch discounts:', error);
        }
    };

    const hasActiveFilledDiscount = (serviceId) => {
        return discounts.some(discount =>
            discount.service_id === serviceId &&
            discount.current_interest_count >= discount.required_interest_count
        );
    };

    const handleAddService = async (serviceId) => {
        try {
            await api.post('/my-services', { service_id: serviceId });
            toast.success('Service added successfully');
            fetchMyServices();
            // Optimistically update UI or re-fetch depending on preference, re-fetching to be safe
            if (activeTab === 'all') fetchAllServices(currentPage, searchTerm);
        } catch (error) {
            toast.error('Failed to add service');
        }
    };

    const handleRemoveService = async (serviceId) => {
        if (!window.confirm('Are you sure you want to remove this service?')) return;
        try {
            await api.delete(`/my-services/${serviceId}`);
            toast.success('Service removed successfully');
            fetchMyServices();
        } catch (error) {
            toast.error('Failed to remove service');
        }
    };

    const isServiceSelected = (serviceId) => {
        return myServices.some(s => s.id === serviceId);
    };

    const filteredMyServices = (myServices || []).filter(s =>
        (s.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayServices = activeTab === 'my' ? filteredMyServices : allServices;

    return (
        <div className={styles['dashboard-page-wrapper']}>
            <Header />
            <main className={`${styles['dashboard-main']} section - padding`}>
                <div className={styles.container}>

                    {/* Hero Header */}
                    <div className={`${styles['management-header']} ${styles['animate-fade-in-up']} `}>
                        <div className={styles['header-content']}>
                            <h1 className={styles['hero-title']}>
                                Manage <span className={styles['text-highlight']}>Services</span>
                            </h1>
                            <p className={styles['hero-subtitle']}>Curate your service catalog and reach more customers.</p>
                        </div>
                        <div className={styles['stats-container']}>
                            <div className={`${styles['stat-card']} ${styles['glass-panel']} `}>
                                <div className={styles['stat-icon']}>✨</div>
                                <div className={styles['stat-info']}>
                                    <span className={styles['stat-value']}>{myServices.length}</span>
                                    <span className={styles['stat-label']}>Active Services</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Section */}
                    <div className={`${styles['controls-wrapper']} ${styles['glass-panel']} ${styles['animate-fade-in-up']} ${styles['delay-1']} `}>
                        <div className={styles['tabs-wrapper']}>
                            <button
                                className={`${styles['tab-pill']} ${activeTab === 'my' ? styles.active : ''} `}
                                onClick={() => { setActiveTab('my'); setCurrentPage(1); }}
                            >
                                My Services
                            </button>
                            <button
                                className={`${styles['tab-pill']} ${activeTab === 'all' ? styles.active : ''} `}
                                onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
                            >
                                Browse All
                            </button>
                        </div>

                        <div className={styles['search-wrapper']}>
                            <div className={styles['search-input-group']}>
                                <svg className={styles['search-icon']} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search for services..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    {loading ? (
                        <div className={`${styles['loading-state']} ${styles['glass-panel']} ${styles['animate-fade-in']} `}>
                            <div className={styles['spinner-loader']}></div>
                            <p>Loading your services...</p>
                        </div>
                    ) : (
                        <>
                            <div className={`${styles['services-grid']} ${styles['animate-fade-in-up']} ${styles['delay-2']} `}>
                                {displayServices.length === 0 ? (
                                    <div className={`${styles['empty-state']} ${styles['glass-panel']} `}>
                                        <div className={styles['empty-icon-wrapper']}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                        </div>
                                        <h3>No Services Found</h3>
                                        <p>Adjust your search/filters to find what you're looking for.</p>
                                    </div>
                                ) : (
                                    displayServices.map((service) => (
                                        <div key={service.id} className={`${styles['service-card']} ${styles['glass-panel']} `}>
                                            <div className={styles['card-image-wrapper']}>
                                                <img
                                                    src={service.image || `https://ui-avatars.com/api/?name=${service.name}&background=random`}
                                                    alt={service.name}
                                                    className={styles['service-image']}
                                                />
                                                <div className={styles['category-tag']}>{service.category?.name || 'General'}</div>
                                            </div >
                                            <div className={styles['card-content']}>
                                                <h4 className={styles['service-name']}>{service.name}</h4>
                                                <p className={styles['service-desc']}>{service.description ? (service.description.length > 60 ? service.description.substring(0, 60) + '...' : service.description) : 'No description available.'}</p>

                                                <div className={styles['card-footer']}>
                                                    {activeTab === 'my' ? (
                                                        <button
                                                            className={`${styles['btn-action']} ${styles['btn-danger']}`}
                                                            onClick={() => handleRemoveService(service.id)}
                                                            disabled={hasActiveFilledDiscount(service.id)}
                                                            title={hasActiveFilledDiscount(service.id) ? 'Cannot deactivate: Service has an active discount with filled interest count' : 'Deactivate this service'}
                                                        >
                                                            {hasActiveFilledDiscount(service.id) ? 'Locked' : 'Deactivate'}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className={`${styles['btn-action']} ${isServiceSelected(service.id) ? styles['btn-success'] : styles['btn-primary']}`}
                                                            disabled={isServiceSelected(service.id)}
                                                            onClick={() => handleAddService(service.id)}
                                                        >
                                                            {isServiceSelected(service.id) ? 'Added' : 'Add to My List'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div >
                                    ))
                                )}
                            </div >

                            {activeTab === 'all' && totalPages > 1 && (
                                <div className={`${styles['pagination-wrapper']} ${styles['animate-fade-in-up']} ${styles['delay-3']}`}>
                                    <button
                                        className={styles['btn-pagination']}
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                    >
                                        &larr; Prev
                                    </button>
                                    <span className={styles['pagination-info']}>Page {currentPage} of {totalPages}</span>
                                    <button
                                        className={styles['btn-pagination']}
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                    >
                                        Next &rarr;
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div >
            </main >
            <Footer />
        </div >
    );
};

export default ManageServices;
