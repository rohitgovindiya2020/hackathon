import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from './Profile.module.css';
import { toast } from 'react-hot-toast';
import {
    FiEdit2, FiUser, FiMapPin, FiBriefcase, FiGrid,
    FiCamera, FiX, FiPhone, FiMail, FiCalendar, FiStar
} from 'react-icons/fi';
import { Header, Footer } from '../../components/Common';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
    const { updateUser } = useAuth();
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
            updateUser(res.data.user);
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
            updateUser(res.data.user);
            setIsEditAddressOpen(false);
            toast.success('Address updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update address');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size should be less than 2MB');
            return;
        }

        const formData = new FormData();
        formData.append('profile_image', file);

        try {
            const uploadToast = toast.loading('Uploading image...');
            const res = await api.post('/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUser(res.data.user);
            updateUser(res.data.user);
            toast.success('Profile image updated successfully', { id: uploadToast });
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error(error.response?.data?.message || 'Failed to upload image');
        }
    };

    if (loading) {
        return (
            <div className={styles.profilePageWrapper}>
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
        <div className={styles.profilePageWrapper}>
            <Header />
            <div className={styles.profileContentContainer}>

                {/* Hero Section */}
                <div className={styles.profileHero}>
                    <div className={styles.heroCover}></div>
                    <div className={styles.heroContent}>
                        <div className={styles.profileAvatarWrapper}>
                            <input
                                type="file"
                                id="avatar-upload"
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            {user.profile_image ? (
                                <img
                                    src={
                                        (user.profile_image.startsWith('data:') || user.profile_image.startsWith('http'))
                                            ? user.profile_image
                                            : `data:image/jpeg;base64,${user.profile_image}`
                                    }
                                    alt={user.name}
                                    className={styles.profileAvatar}
                                />
                            ) : (
                                <div className={styles.avatarPlaceholder}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <button
                                className={styles.editAvatarBtn}
                                title="Change Avatar"
                                onClick={() => document.getElementById('avatar-upload').click()}
                            >
                                <FiCamera size={20} />
                            </button>
                        </div>

                        <div className={styles.profileMainInfo}>
                            <h1 className={styles.profileName}>
                                {user.name}
                                <span className={styles.roleBadge}>{isProvider ? 'Provider' : 'Customer'}</span>
                            </h1>
                            <div className={styles.profileContact}>
                                <span className={styles.contactItem}><FiMail size={18} /> {user.email}</span>
                                <span className={styles.contactItem}><FiCalendar size={18} /> Joined {new Date(user.created_at).toLocaleDateString()}</span>
                                {user.mobile_no && <span className={styles.contactItem}><FiPhone size={18} /> {user.mobile_no}</span>}
                            </div>
                        </div>

                        {/* Stats for Provider */}
                        {isProvider && (
                            <div className={styles.profileStats}>
                                <div className={styles.stat}>
                                    <span className={styles.statValue}>{user.average_rating || 0}</span>
                                    <span className={styles.statLabel}><FiStar size={16} /> Rating</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.statValue}>{user.review_count || 0}</span>
                                    <span className={styles.statLabel}>Reviews</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Grid */}
                <div className={styles.profileGrid}>

                    {/* Left Column: Personal Info & Bio */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}><FiUser /> Personal Details</h2>
                                <button className={styles.editLink} onClick={() => setIsEditProfileOpen(true)}>
                                    <FiEdit2 size={16} /> Edit
                                </button>
                            </div>
                            <div className={styles.infoList}>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Full Name</span>
                                    <span className={styles.infoValue}>{user.name}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Mobile Number</span>
                                    <span className={styles.infoValue}>{user.mobile_no || 'Not provided'}</span>
                                </div>
                            </div>
                        </div>

                        {isProvider && user.description && (
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}><FiBriefcase /> Professional Bio</h2>
                                </div>
                                <p className={styles.bioText}>{user.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Address & Services */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}><FiMapPin /> Primary Address</h2>
                                <button className={styles.editLink} onClick={() => setIsEditAddressOpen(true)}>
                                    <FiEdit2 size={16} /> Update
                                </button>
                            </div>
                            {user.address ? (
                                <div className={styles.infoList}>
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Country</span>
                                        <span className={styles.infoValue}>{user.address.country}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>State</span>
                                        <span className={styles.infoValue}>{user.address.state}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>City</span>
                                        <span className={styles.infoValue}>{user.address.city}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Area</span>
                                        <span className={styles.infoValue}>{user.address.area || '-'}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.noAddressContent}>
                                    <p>Your address information is missing.</p>
                                    <button className={styles.btnPrimary} onClick={() => setIsEditAddressOpen(true)}>
                                        Setup Address
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Services & Areas (Provider Only) */}
                        {isProvider && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                {user.services && user.services.length > 0 && (
                                    <div className={styles.card}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={styles.cardTitle}><FiGrid /> Offered Services</h2>
                                        </div>
                                        <div className={styles.tagsContainer}>
                                            {user.services.map(s => (
                                                <span key={s.id} className={styles.tag}>{s.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {user.areas && user.areas.length > 0 && (
                                    <div className={styles.card}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={styles.cardTitle}><FiMapPin /> Covered Service Areas</h2>
                                        </div>
                                        <div className={styles.tagsContainer}>
                                            {user.areas.map(a => (
                                                <span key={a.id} className={styles.tag}>{a.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Modals */}
            {isEditProfileOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsEditProfileOpen(false)}>
                    <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Edit Profile</h3>
                            <button className={styles.closeModalBtn} onClick={() => setIsEditProfileOpen(false)}>
                                <FiX />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <form id="profileForm" onSubmit={handleProfileUpdate}>
                                <div className={styles.formField}>
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        value={profileForm.name}
                                        onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className={styles.formField}>
                                    <label>Mobile Number</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        value={profileForm.mobile_no}
                                        onChange={e => setProfileForm({ ...profileForm, mobile_no: e.target.value })}
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </form>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.btnSecondary} onClick={() => setIsEditProfileOpen(false)}>Cancel</button>
                            <button type="submit" form="profileForm" className={styles.btnPrimary}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {isEditAddressOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsEditAddressOpen(false)}>
                    <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Update Location</h3>
                            <button className={styles.closeModalBtn} onClick={() => setIsEditAddressOpen(false)}>
                                <FiX />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <form id="addressForm" onSubmit={handleAddressUpdate}>
                                <div className={styles.formField}>
                                    <label>Country</label>
                                    <select
                                        className={styles.formSelect}
                                        value={addressForm.country}
                                        onChange={handleCountryChange}
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formField}>
                                    <label>State</label>
                                    <select
                                        className={styles.formSelect}
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
                                <div className={styles.formField}>
                                    <label>City</label>
                                    <select
                                        className={styles.formSelect}
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
                                <div className={styles.formField}>
                                    <label>Area</label>
                                    <select
                                        className={styles.formSelect}
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
                        <div className={styles.modalFooter}>
                            <button className={styles.btnSecondary} onClick={() => setIsEditAddressOpen(false)}>Discard</button>
                            <button type="submit" form="addressForm" className={styles.btnPrimary}>Save Address</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Profile;
