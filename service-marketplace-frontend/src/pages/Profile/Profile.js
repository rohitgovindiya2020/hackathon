import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './Profile.css';
import { toast } from 'react-hot-toast';
import {
    FiEdit2, FiUser, FiMapPin, FiBriefcase, FiGrid,
    FiCamera, FiX, FiPhone, FiMail, FiCalendar, FiStar
} from 'react-icons/fi';
import { Header, Footer } from '../../components/Common';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modals state
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);

    // Form data state
    const [profileForm, setProfileForm] = useState({
        name: '',
        mobile_no: '',
    });

    const [addressForm, setAddressForm] = useState({
        country: '',
        state: '',
        city: '',
        area: '',
        address: ''
    });

    // Location Data for Dropdowns
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        fetchProfile();
        fetchCountries();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/profile');
            const userData = response.data.user;
            setUser(userData);

            setProfileForm({
                name: userData.name || '',
                mobile_no: userData.mobile_no || ''
            });

            if (userData.address) {
                setAddressForm({
                    country: userData.address.country || '',
                    state: userData.address.state || '',
                    city: userData.address.city || '',
                    area: userData.address.area || '',
                    address: userData.address.address || ''
                });
                if (userData.address.country) fetchStates(userData.address.country);
                if (userData.address.state) fetchCities(userData.address.state);
                if (userData.address.city) fetchAreas(userData.address.city);
            }

        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile details');
        } finally {
            setLoading(false);
        }
    };

    const fetchCountries = async () => {
        try {
            const res = await api.get('/countries');
            setCountries(res.data.countries);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchStates = async (countryName) => {
        try {
            const res = await api.get(`/countries/${countryName}/states`);
            setStates(res.data.states);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCities = async (stateName) => {
        try {
            const res = await api.get(`/states/${stateName}/cities`);
            setCities(res.data.cities);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAreas = async (cityName) => {
        try {
            const res = await api.get(`/cities/${cityName}/areas`);
            setAreas(res.data.areas);
        } catch (error) {
            console.error(error);
        }
    };

    // --- Handlers for Address Form Cascading ---

    const handleCountryChange = (e) => {
        const country = e.target.value;
        setAddressForm(prev => ({ ...prev, country, state: '', city: '', area: '' }));
        setStates([]); setCities([]); setAreas([]);
        if (country) fetchStates(country);
    };

    const handleStateChange = (e) => {
        const state = e.target.value;
        setAddressForm(prev => ({ ...prev, state, city: '', area: '' }));
        setCities([]); setAreas([]);
        if (state) fetchCities(state);
    };

    const handleCityChange = (e) => {
        const city = e.target.value;
        setAddressForm(prev => ({ ...prev, city, area: '' }));
        setAreas([]);
        if (city) fetchAreas(city);
    };

    const handleAreaChange = (e) => {
        const areaId = e.target.value;
        const selectedArea = areas.find(a => a.id.toString() === areaId);
        setAddressForm(prev => ({ ...prev, area: selectedArea ? selectedArea.name : '' }));
    };

    // --- Submit Handlers ---

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/profile', profileForm);
            setUser(res.data.user);
            setIsEditProfileOpen(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile');
        }
    };

    const handleAddressUpdate = async (e) => {
        e.preventDefault();
        try {
            const payload = { address: addressForm };
            const res = await api.post('/profile', payload);
            setUser(res.data.user);
            setIsEditAddressOpen(false);
            toast.success('Address updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update address');
        }
    };

    if (loading) {
        return (
            <div className="profile-page-wrapper">
                <Header />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <div className="loading-spinner">Loading...</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) return null;

    const isProvider = user.role === 'provider';

    return (
        <div className="profile-page-wrapper">
            <Header />
            <div className="profile-content-container">

                {/* Hero Section */}
                <div className="profile-hero">
                    <div className="hero-cover"></div>
                    <div className="hero-content">
                        <div className="profile-avatar-wrapper">
                            {user.profile_image ? (
                                <img src={user.profile_image} alt={user.name} className="profile-avatar" />
                            ) : (
                                <div className="avatar-placeholder">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <button className="edit-avatar-btn" title="Change Avatar">
                                <FiCamera size={18} />
                            </button>
                        </div>

                        <div className="profile-main-info">
                            <h1 className="profile-name">
                                {user.name}
                                <span className="role-badge">{isProvider ? 'Provider' : 'Customer'}</span>
                            </h1>
                            <div className="profile-contact">
                                <span className="contact-item"><FiMail /> {user.email}</span>
                                <span className="contact-item"><FiCalendar /> Joined {new Date(user.created_at).toLocaleDateString()}</span>
                                {user.mobile_no && <span className="contact-item"><FiPhone /> {user.mobile_no}</span>}
                            </div>
                        </div>

                        {/* Stats for Provider */}
                        {isProvider && (
                            <div className="profile-stats">
                                <div className="stat">
                                    <span className="stat-value">{user.average_rating || 0}</span>
                                    <span className="stat-label"><FiStar style={{ color: '#f59e0b', marginBottom: '-2px' }} /> Rating</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{user.review_count || 0}</span>
                                    <span className="stat-label">Reviews</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="profile-grid">

                    {/* Column 1: Personal Info & Bio */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title"><FiUser /> Personal Information</h2>
                                <button className="edit-link" onClick={() => setIsEditProfileOpen(true)}>
                                    <FiEdit2 /> Edit
                                </button>
                            </div>
                            <div className="info-list">
                                <div className="info-row">
                                    <span className="info-label">Full Name</span>
                                    <span className="info-value">{user.name}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Mobile Number</span>
                                    <span className="info-value">{user.mobile_no || 'Not provided'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Account Status</span>
                                    <span className="info-value" style={{ textTransform: 'capitalize' }}>{user.status || 'Active'}</span>
                                </div>
                            </div>
                        </div>

                        {isProvider && user.description && (
                            <div className="card">
                                <div className="card-header">
                                    <h2 className="card-title"><FiBriefcase /> About Me</h2>
                                </div>
                                <p className="bio-text">{user.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Column 2: Address & Services */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title"><FiMapPin /> Address Details</h2>
                                <button className="edit-link" onClick={() => setIsEditAddressOpen(true)}>
                                    <FiEdit2 /> Edit
                                </button>
                            </div>
                            {user.address ? (
                                <div className="info-list">
                                    <div className="info-row">
                                        <span className="info-label">Country</span>
                                        <span className="info-value">{user.address.country}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">State</span>
                                        <span className="info-value">{user.address.state}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">City</span>
                                        <span className="info-value">{user.address.city}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Area</span>
                                        <span className="info-value">{user.address.area || '-'}</span>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-light)' }}>
                                    <p>No address details added yet.</p>
                                    <button className="btn-primary" style={{ marginTop: '10px' }} onClick={() => setIsEditAddressOpen(true)}>
                                        Add Address
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Services (Provider Only) */}
                        {isProvider && (
                            <>
                                {user.services && user.services.length > 0 && (
                                    <div className="card">
                                        <div className="card-header">
                                            <h2 className="card-title"><FiGrid /> Services</h2>
                                        </div>
                                        <div className="tags-container">
                                            {user.services.map(s => (
                                                <span key={s.id} className="tag">{s.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {user.areas && user.areas.length > 0 && (
                                    <div className="card">
                                        <div className="card-header">
                                            <h2 className="card-title"><FiMapPin /> Service Areas</h2>
                                        </div>
                                        <div className="tags-container">
                                            {user.areas.map(a => (
                                                <span key={a.id} className="tag">{a.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                </div>
            </div>

            {/* Modals */}
            {isEditProfileOpen && (
                <div className="modal-overlay" onClick={() => setIsEditProfileOpen(false)}>
                    <div className="modal-container" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Personal Info</h3>
                            <button className="close-modal-btn" onClick={() => setIsEditProfileOpen(false)}>
                                <FiX />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form id="profileForm" onSubmit={handleProfileUpdate}>
                                <div className="form-field">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={profileForm.name}
                                        onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Mobile Number</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={profileForm.mobile_no}
                                        onChange={e => setProfileForm({ ...profileForm, mobile_no: e.target.value })}
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setIsEditProfileOpen(false)}>Cancel</button>
                            <button type="submit" form="profileForm" className="btn-primary">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {isEditAddressOpen && (
                <div className="modal-overlay" onClick={() => setIsEditAddressOpen(false)}>
                    <div className="modal-container" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Update Address</h3>
                            <button className="close-modal-btn" onClick={() => setIsEditAddressOpen(false)}>
                                <FiX />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form id="addressForm" onSubmit={handleAddressUpdate}>
                                <div className="form-field">
                                    <label>Country</label>
                                    <select
                                        className="form-select"
                                        value={addressForm.country}
                                        onChange={handleCountryChange}
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-field">
                                    <label>State</label>
                                    <select
                                        className="form-select"
                                        value={addressForm.state}
                                        onChange={handleStateChange}
                                        disabled={!addressForm.country}
                                    >
                                        <option value="">Select State</option>
                                        {states.map(s => (
                                            <option key={s.id} value={s.name}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-field">
                                    <label>City</label>
                                    <select
                                        className="form-select"
                                        value={addressForm.city}
                                        onChange={handleCityChange}
                                        disabled={!addressForm.state}
                                    >
                                        <option value="">Select City</option>
                                        {cities.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-field">
                                    <label>Area</label>
                                    <select
                                        className="form-select"
                                        value={areas.find(a => a.name === addressForm.area)?.id || ''}
                                        onChange={handleAreaChange}
                                        disabled={!addressForm.city}
                                    >
                                        <option value="">Select Area</option>
                                        {areas.map(a => (
                                            <option key={a.id} value={a.id}>{a.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setIsEditAddressOpen(false)}>Cancel</button>
                            <button type="submit" form="addressForm" className="btn-primary">Save Address</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Profile;
