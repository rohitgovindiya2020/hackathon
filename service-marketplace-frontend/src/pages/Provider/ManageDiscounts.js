import React, { useState, useEffect } from 'react';
import { Header, Footer } from '../../components/Common';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import '../Dashboard.css';
import styles from './ManageDiscounts.module.css';

const ManageDiscounts = () => {
    const [discounts, setDiscounts] = useState([]);
    const [myServices, setMyServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [formData, setFormData] = useState({
        service_id: '',
        discount_percentage: '',
        interest_from_date: '',
        interest_to_date: '',
        discount_start_date: '',
        discount_end_date: '',
        required_interest_count: '',
        current_interest_count: 0,
        country: '',
        state: '',
        city: '',
        area: '',
        description: '',
        included_services: '',
        current_price: '',
        banner_image: ''
    });

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        fetchCountries();
    }, []);

    useEffect(() => {
        if (formData.country) fetchStates(formData.country);
        else setStates([]);
    }, [formData.country]);

    useEffect(() => {
        if (formData.state) fetchCities(formData.state);
        else setCities([]);
    }, [formData.state]);

    useEffect(() => {
        if (formData.city) fetchAreas(formData.city);
        else setAreas([]);
    }, [formData.city]);

    const fetchCountries = async () => {
        try {
            const res = await api.get('/service-areas/countries');
            setCountries(res.data);
        } catch (error) {
            console.error('Failed to fetch countries');
        }
    };

    const fetchStates = async (country) => {
        try {
            const res = await api.get(`/service-areas/states?country=${country}`);
            setStates(res.data);
        } catch (error) {
            console.error('Failed to fetch states');
        }
    };

    const fetchCities = async (state) => {
        try {
            const res = await api.get(`/service-areas/cities?state=${state}`);
            setCities(res.data);
        } catch (error) {
            console.error('Failed to fetch cities');
        }
    };

    const fetchAreas = async (city) => {
        try {
            const res = await api.get(`/service-areas/areas?city=${city}`);
            setAreas(res.data);
        } catch (error) {
            console.error('Failed to fetch areas');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [discRes, servRes] = await Promise.all([
                api.get('/discounts'),
                api.get('/my-services')
            ]);
            setDiscounts(discRes.data.data);
            setMyServices(servRes.data.data);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleQuillChange = (value) => {
        setFormData(prev => ({ ...prev, included_services: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast.error('Image size should be less than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, banner_image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateDates = () => {
        const today = new Date().toISOString().split('T')[0];
        const { interest_from_date, interest_to_date, discount_start_date, discount_end_date } = formData;

        if (interest_from_date < today) {
            toast.error('Interest From Date must be today or in the future.');
            return false;
        }
        if (interest_to_date <= interest_from_date) {
            toast.error('Interest To Date must be greater than Interest From Date.');
            return false;
        }
        if (discount_start_date <= interest_to_date) {
            toast.error('Discount Start Date must be greater than Interest To Date.');
            return false;
        }
        if (discount_end_date <= discount_start_date) {
            toast.error('Discount End Date must be greater than Discount Start Date.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateDates()) return;

        try {
            await api.post('/discounts', formData);
            toast.success('Discount created successfully');
            setShowForm(false);
            setFormData({
                service_id: '',
                discount_percentage: '',
                interest_from_date: '',
                interest_to_date: '',
                discount_start_date: '',
                discount_end_date: '',
                required_interest_count: '',
                current_interest_count: 0,
                country: '',
                state: '',
                city: '',
                area: '',
                description: '',
                included_services: '',
                current_price: '',
                banner_image: ''
            });
            fetchData();
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to create discount';
            toast.error(msg);
            if (error.response?.data?.errors) {
                console.table(error.response.data.errors);
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this discount?')) return;
        try {
            await api.delete(`/discounts/${id}`);
            toast.success('Discount deleted successfully');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete discount');
        }
    };

    const getInterestStatus = (fromDate, toDate) => {
        const today = new Date().toISOString().split('T')[0];
        if (today < fromDate) return { label: 'Pending', class: 'status-pending' };
        if (today > toDate) return { label: 'Disapproved', class: 'status-disapproved' };
        return { label: 'In Progress', class: 'status-progress' };
    };

    return (
        <div className={styles['dashboard-page-wrapper']}>
            <Header />
            <main className={`${styles['dashboard-main']} section-padding`}>
                <div className={styles.container}>
                    <div className={`${styles['management-header']} ${styles['animate-up']}`}>
                        <div>
                            <h1 className={styles['hero-title']}>Manage <span className={styles['text-gradient']}>Discounts</span></h1>
                            <p className={styles['hero-subtitle']}>Create and monitor your promotional offers</p>
                        </div>
                        <button
                            className={styles['btn-action-solid']}
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? 'Close Form' : '+ New Discount'}
                        </button>
                    </div>

                    {/* Filter and Sort Controls */}
                    <div className={`${styles['filter-controls']} ${styles['animate-up']}`}>
                        <div className={styles['filter-buttons']}>
                            <button
                                className={`${styles['filter-btn']} ${activeFilter === 'all' ? styles['active'] : ''}`}
                                onClick={() => setActiveFilter('all')}
                            >
                                All
                            </button>
                            <button
                                className={`${styles['filter-btn']} ${styles['filter-progress']} ${activeFilter === 'progress' ? styles['active'] : ''}`}
                                onClick={() => setActiveFilter('progress')}
                            >
                                In Progress
                            </button>
                            <button
                                className={`${styles['filter-btn']} ${styles['filter-pending']} ${activeFilter === 'pending' ? styles['active'] : ''}`}
                                onClick={() => setActiveFilter('pending')}
                            >
                                Pending
                            </button>
                            <button
                                className={`${styles['filter-btn']} ${styles['filter-disapproved']} ${activeFilter === 'disapproved' ? styles['active'] : ''}`}
                                onClick={() => setActiveFilter('disapproved')}
                            >
                                Disapproved
                            </button>
                        </div>
                        <div className={styles['sort-control']}>
                            <label>Sort by:</label>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles['sort-select']}>
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="alpha-asc">A-Z (Service Name)</option>
                                <option value="alpha-desc">Z-A (Service Name)</option>
                                <option value="discount-high">Discount % (High to Low)</option>
                                <option value="discount-low">Discount % (Low to High)</option>
                            </select>
                        </div>
                    </div>

                    {showForm && (
                        <div className={styles['modal-overlay']} onClick={() => setShowForm(false)}>
                            <div className={`${styles['form-container-modern']} ${styles['animate-up']}`} onClick={e => e.stopPropagation()}>
                                <div className={styles['form-header']}>
                                    <h2 className={styles['form-title']}>Create New Discount</h2>
                                    <button
                                        type="button"
                                        className={styles['btn-close-modal']}
                                        onClick={() => setShowForm(false)}
                                    >
                                        &times;
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className={styles['form-grid']}>
                                        <div className={styles['form-group']}>
                                            <label>Select Service</label>
                                            <select
                                                name="service_id"
                                                value={formData.service_id}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Choose a service...</option>
                                                {myServices.map(s => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={styles['form-group']}>
                                            <label>Discount Percentage (%)</label>
                                            <input
                                                type="number"
                                                name="discount_percentage"
                                                value={formData.discount_percentage}
                                                onChange={handleInputChange}
                                                placeholder="e.g. 20"
                                                required
                                            />
                                        </div>
                                        <div className={styles['form-group']}>
                                            <label>Current Price</label>
                                            <input
                                                type="number"
                                                name="current_price"
                                                value={formData.current_price}
                                                onChange={handleInputChange}
                                                placeholder="e.g. 100.00"
                                            />
                                        </div>
                                        <div className={styles['form-group']}>
                                            <label>Banner Image (Max 2MB)</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                            {formData.banner_image && (
                                                <img src={formData.banner_image} alt="Preview" className={styles['image-preview']} style={{ marginTop: '10px', maxHeight: '100px', borderRadius: '8px' }} />
                                            )}
                                        </div>
                                        <div className={styles['form-group']}>
                                            <label>Interest From Date</label>
                                            <input
                                                type="date"
                                                name="interest_from_date"
                                                value={formData.interest_from_date}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className={styles['form-group']}>
                                            <label>Interest To Date</label>
                                            <input
                                                type="date"
                                                name="interest_to_date"
                                                value={formData.interest_to_date}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className={styles['form-group']}>
                                            <label>Discount Start Date</label>
                                            <input
                                                type="date"
                                                name="discount_start_date"
                                                value={formData.discount_start_date}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className={styles['form-group']}>
                                            <label>Discount End Date</label>
                                            <input
                                                type="date"
                                                name="discount_end_date"
                                                value={formData.discount_end_date}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className={styles['form-group']}>
                                            <label>Required Interest Count</label>
                                            <input
                                                type="number"
                                                name="required_interest_count"
                                                value={formData.required_interest_count}
                                                onChange={handleInputChange}
                                                placeholder="e.g. 10"
                                                required
                                            />
                                        </div>
                                        {/* Removed Current Interest Count field as requested */}
                                        <div className={`${styles['form-group']} ${styles['full-width']}`}>
                                            <label>Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                placeholder="Enter discount description..."
                                                rows="3"
                                            ></textarea>
                                        </div>
                                        <div className={`${styles['form-group']} ${styles['full-width']}`}>
                                            <label>Included Services</label>
                                            <ReactQuill
                                                value={formData.included_services}
                                                onChange={handleQuillChange}
                                                theme="snow"
                                            />
                                        </div>
                                        <div className={styles['form-group']}>
                                            <label>Country</label>
                                            <select name="country" value={formData.country} onChange={handleInputChange} required>
                                                <option value="">Select Country</option>
                                                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className={styles['form-group']}>
                                            <label>State</label>
                                            <select name="state" value={formData.state} onChange={handleInputChange} required disabled={!formData.country}>
                                                <option value="">Select State</option>
                                                {states.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className={styles['form-group']}>
                                            <label>City</label>
                                            <select name="city" value={formData.city} onChange={handleInputChange} required disabled={!formData.state}>
                                                <option value="">Select City</option>
                                                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className={styles['form-group']}>
                                            <label>Area</label>
                                            <select name="area" value={formData.area} onChange={handleInputChange} required disabled={!formData.city}>
                                                <option value="">Select Area</option>
                                                {areas.map(a => <option key={a} value={a}>{a}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className={styles['form-actions']}>
                                        <button type="submit" className={styles['btn-submit']}>Create Discount Offer</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className={styles.loading}>
                            <div className="spinner"></div>
                            <p>Loading discounts...</p>
                        </div>
                    ) : (
                        <>
                            {/* Regular Discounts Section */}
                            <div className={`${styles['discounts-grid']} ${styles['animate-up']}`}>
                                {discounts.length === 0 ? (
                                    <div className={styles['empty-state-card']}>
                                        <span className={styles['empty-icon']}>🏷️</span>
                                        <h3>No discounts created yet</h3>
                                        <p>Start by creating your first promotional offer!</p>
                                    </div>
                                ) : (
                                    discounts
                                        .filter(discount => {
                                            // Exclude approved discounts from main list
                                            if (discount.current_interest_count === discount.required_interest_count) {
                                                return false;
                                            }

                                            if (activeFilter === 'all') return true;
                                            const status = getInterestStatus(discount.interest_from_date, discount.interest_to_date);
                                            if (activeFilter === 'progress') return status.label === 'In Progress';
                                            if (activeFilter === 'pending') return status.label === 'Pending';
                                            if (activeFilter === 'disapproved') return status.label === 'Disapproved';
                                            return true;
                                        })
                                        .sort((a, b) => {
                                            switch (sortBy) {
                                                case 'newest':
                                                    return b.id - a.id;
                                                case 'oldest':
                                                    return a.id - b.id;
                                                case 'alpha-asc':
                                                    return (a.service?.name || '').localeCompare(b.service?.name || '');
                                                case 'alpha-desc':
                                                    return (b.service?.name || '').localeCompare(a.service?.name || '');
                                                case 'discount-high':
                                                    return b.discount_percentage - a.discount_percentage;
                                                case 'discount-low':
                                                    return a.discount_percentage - b.discount_percentage;
                                                default:
                                                    return 0;
                                            }
                                        })
                                        .map(discount => {
                                            const status = getInterestStatus(discount.interest_from_date, discount.interest_to_date);
                                            return (
                                                <div key={discount.id} className={styles['discount-card-modern']}>
                                                    {discount.banner_image && (
                                                        <div className={styles['card-banner']}>
                                                            <img src={discount.banner_image} alt="Discount Banner" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }} />
                                                            <div className={`${styles['status-badge-overlay']} ${styles[status.class]}`}>
                                                                {status.label}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className={styles['card-header']}>
                                                        <div className={styles['service-tag']}>{discount.service?.name}</div>
                                                        <div className={styles['percentage-badge']}>{discount.discount_percentage}% OFF</div>
                                                    </div>
                                                    <div className={styles['card-body']}>
                                                        {discount.current_price && (
                                                            <div className={styles['info-row']}>
                                                                <span className={styles.label}>Original Price:</span>
                                                                <span className={styles.val} style={{ textDecoration: 'line-through', color: '#94a3b8' }}>${discount.current_price}</span>
                                                            </div>
                                                        )}
                                                        {discount.price_after_discount && (
                                                            <div className={styles['info-row']}>
                                                                <span className={styles.label}>Discounted Price:</span>
                                                                <span className={styles.val} style={{ color: '#10b981', fontWeight: 'bold' }}>${discount.price_after_discount}</span>
                                                            </div>
                                                        )}
                                                        <div className={styles['info-row']}>
                                                            <span className={styles.label}>Views:</span>
                                                            <span className={styles.val}>{discount.view_count}</span>
                                                        </div>
                                                        <div className={styles['info-row']}>
                                                            <span className={styles.label}>Interest Period:</span>
                                                            <span className={styles.val}>{discount.interest_from_date} to {discount.interest_to_date}</span>
                                                        </div>
                                                        <div className={styles['info-row']}>
                                                            <span className={styles.label}>Offer Period:</span>
                                                            <span className={styles.val}>{discount.discount_start_date} to {discount.discount_end_date}</span>
                                                        </div>
                                                        <div className={styles['progress-section']}>
                                                            <div className={styles['progress-labels']}>
                                                                <span>Interest Progress</span>
                                                                <span>{discount.current_interest_count} / {discount.required_interest_count}</span>
                                                            </div>
                                                            <div className={styles['progress-bar-bg']}>
                                                                <div
                                                                    className={styles['progress-bar-fill']}
                                                                    style={{ width: `${Math.min(100, (discount.current_interest_count / discount.required_interest_count) * 100)}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        {discount.address && (
                                                            <div className={styles['address-box']}>
                                                                <span className={styles.label}>Location:</span>
                                                                <p>{discount.address.area}, {discount.address.city}, {discount.address.state}, {discount.address.country}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={styles['card-footer']}>
                                                        {/* Delete button removed as per requirement */}
                                                    </div>
                                                </div>
                                            )
                                        })

                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ManageDiscounts;
