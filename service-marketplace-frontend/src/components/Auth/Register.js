import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'customer',
        phone: '',
        area_ids: []
    });

    // Location Data States
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);

    // Selection States
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Focus states for floating labels
    const [nameFocused, setNameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [phoneFocused, setPhoneFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

    // Password visibility states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    // Create animated background particles
    useEffect(() => {
        const createParticles = () => {
            const container = document.querySelector('.auth-container');
            if (!container) return;

            // Clear existing particles
            const existingParticles = container.querySelectorAll('.particle');
            existingParticles.forEach(p => p.remove());

            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 20 + 's';
                particle.style.animationDuration = (15 + Math.random() * 10) + 's';
                container.appendChild(particle);
            }
        };

        createParticles();
    }, []);

    // Fetch Countries on Mount
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await api.get('/countries');
                setCountries(response.data.countries || []);
            } catch (error) {
                console.error('Failed to fetch countries:', error);
            }
        };
        fetchCountries();
    }, []);

    // Handle Country Change
    const handleCountryChange = async (e) => {
        const countryId = e.target.value;
        setSelectedCountry(countryId);
        setSelectedState('');
        setSelectedCity('');
        setStates([]);
        setCities([]);
        setAreas([]);
        setFormData(prev => ({ ...prev, area_ids: [] }));

        if (countryId) {
            try {
                const response = await api.get(`/countries/${countryId}/states`);
                setStates(response.data.states || []);
            } catch (error) {
                console.error('Failed to fetch states:', error);
            }
        }
    };

    // Handle State Change
    const handleStateChange = async (e) => {
        const stateId = e.target.value;
        setSelectedState(stateId);
        setSelectedCity('');
        setCities([]);
        setAreas([]);
        setFormData(prev => ({ ...prev, area_ids: [] }));

        if (stateId) {
            try {
                const response = await api.get(`/states/${stateId}/cities`);
                setCities(response.data.cities || []);
            } catch (error) {
                console.error('Failed to fetch cities:', error);
            }
        }
    };

    // Handle City Change
    const handleCityChange = async (e) => {
        const cityId = e.target.value;
        setSelectedCity(cityId);
        setAreas([]);
        setFormData(prev => ({ ...prev, area_ids: [] }));

        if (cityId) {
            try {
                const response = await api.get(`/cities/${cityId}/areas`);
                setAreas(response.data.areas || []);
            } catch (error) {
                console.error('Failed to fetch areas:', error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAreaChange = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(parseInt(options[i].value));
            }
        }
        setFormData(prev => ({ ...prev, area_ids: selected }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match');
            return;
        }

        if (formData.role === 'provider' && formData.area_ids.length === 0) {
            setError('Please select at least one service area');
            return;
        }

        setLoading(true);
        const result = await register(formData);

        if (result.success) {
            if (result.user.role === 'provider') {
                navigate('/provider/dashboard');
            } else if (result.user.role === 'customer') {
                navigate('/customer/dashboard');
            }
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card register-card">
                <div className="auth-header">
                    <div className="logo-container">
                        <div className="logo-circle">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M8 8V6C8 4.89543 8.89543 4 10 4H14C15.1046 4 16 4.89543 16 6V8" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 12V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M10 14H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                    <h1>Service Marketplace</h1>
                    <p className="subtitle">Create your account and get started</p>
                </div>

                {error && (
                    <div className="error-message">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="modern-form">
                    {/* Name Field */}
                    <div className={`form-group floating-label ${nameFocused || formData.name ? 'focused' : ''}`}>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setNameFocused(true)}
                            onBlur={() => setNameFocused(false)}
                            required
                            id="name"
                        />
                        <label htmlFor="name">Full Name</label>
                        <div className="input-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className={`form-group floating-label ${emailFocused || formData.email ? 'focused' : ''}`}>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                            required
                            id="email"
                        />
                        <label htmlFor="email">Email Address</label>
                        <div className="input-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 8L10.89 13.26C11.5 13.67 12.5 13.67 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    {/* Phone Field */}
                    <div className={`form-group floating-label ${phoneFocused || formData.phone ? 'focused' : ''}`}>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onFocus={() => setPhoneFocused(true)}
                            onBlur={() => setPhoneFocused(false)}
                            id="phone"
                        />
                        <label htmlFor="phone">Phone Number (Optional)</label>
                        <div className="input-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="form-group select-group">
                        <label className="select-label">I am a:</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="modern-select">
                            <option value="customer">Customer</option>
                            <option value="provider">Service Provider</option>
                        </select>
                        <div className="select-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    {/* Provider Location Fields */}
                    {formData.role === 'provider' && (
                        <div className="provider-fields">
                            <div className="section-divider">
                                <span>Service Location</span>
                            </div>

                            <div className="form-group select-group">
                                <label className="select-label">Country</label>
                                <select value={selectedCountry} onChange={handleCountryChange} required className="modern-select">
                                    <option value="">Select Country</option>
                                    {countries.map(country => (
                                        <option key={country.id} value={country.id}>{country.name}</option>
                                    ))}
                                </select>
                                <div className="select-icon">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            {selectedCountry && (
                                <div className="form-group select-group">
                                    <label className="select-label">State</label>
                                    <select value={selectedState} onChange={handleStateChange} required className="modern-select">
                                        <option value="">Select State</option>
                                        {states.map(state => (
                                            <option key={state.id} value={state.id}>{state.name}</option>
                                        ))}
                                    </select>
                                    <div className="select-icon">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            )}

                            {selectedState && (
                                <div className="form-group select-group">
                                    <label className="select-label">City</label>
                                    <select value={selectedCity} onChange={handleCityChange} required className="modern-select">
                                        <option value="">Select City</option>
                                        {cities.map(city => (
                                            <option key={city.id} value={city.id}>{city.name}</option>
                                        ))}
                                    </select>
                                    <div className="select-icon">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            )}

                            {selectedCity && (
                                <div className="form-group">
                                    <label className="select-label">Service Areas</label>
                                    <select
                                        multiple
                                        onChange={handleAreaChange}
                                        className="area-select modern-select"
                                        size="5"
                                        required
                                    >
                                        {areas.map(area => (
                                            <option key={area.id} value={area.id}>
                                                {area.name}
                                            </option>
                                        ))}
                                    </select>
                                    <small className="field-hint">Hold Ctrl/Cmd to select multiple areas</small>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Password Field */}
                    <div className={`form-group floating-label ${passwordFocused || formData.password ? 'focused' : ''}`}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            required
                            minLength="8"
                            id="password"
                        />
                        <label htmlFor="password">Password</label>
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex="-1"
                        >
                            {showPassword ? (
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 3L21 21M10.5 10.5C10.1872 10.8128 10 11.2444 10 11.7143C10 12.7376 10.8954 13.5714 12 13.5714C12.5 13.5714 12.9605 13.3929 13.3146 13.0986M17.357 17.357C15.726 18.449 13.942 19 12 19C8.686 19 5.939 17.12 3.757 13.243C3.41 12.614 3.41 11.814 3.757 11.186C4.697 9.471 5.853 8.121 7.143 7.143M9.878 5.121C10.582 4.949 11.291 4.857 12 4.857C15.314 4.857 18.061 6.737 20.243 10.614C20.59 11.243 20.59 12.043 20.243 12.671C19.878 13.329 19.463 13.914 19 14.429" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5C8.24 5 5.04 7.14 3 10.5C5.04 13.86 8.24 16 12 16C15.76 16 18.96 13.86 21 10.5C18.96 7.14 15.76 5 12 5ZM12 14C10.34 14 9 12.66 9 11C9 9.34 10.34 8 12 8C13.66 8 15 9.34 15 11C15 12.66 13.66 14 12 14ZM12 9.5C11.17 9.5 10.5 10.17 10.5 11C10.5 11.83 11.17 12.5 12 12.5C12.83 12.5 13.5 11.83 13.5 11C13.5 10.17 12.83 9.5 12 9.5Z" fill="currentColor" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <small className="field-hint">Minimum 8 characters</small>

                    {/* Confirm Password Field */}
                    <div className={`form-group floating-label ${confirmPasswordFocused || formData.password_confirmation ? 'focused' : ''}`}>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            onFocus={() => setConfirmPasswordFocused(true)}
                            onBlur={() => setConfirmPasswordFocused(false)}
                            required
                            id="password_confirmation"
                        />
                        <label htmlFor="password_confirmation">Confirm Password</label>
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            tabIndex="-1"
                        >
                            {showConfirmPassword ? (
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 3L21 21M10.5 10.5C10.1872 10.8128 10 11.2444 10 11.7143C10 12.7376 10.8954 13.5714 12 13.5714C12.5 13.5714 12.9605 13.3929 13.3146 13.0986M17.357 17.357C15.726 18.449 13.942 19 12 19C8.686 19 5.939 17.12 3.757 13.243C3.41 12.614 3.41 11.814 3.757 11.186C4.697 9.471 5.853 8.121 7.143 7.143M9.878 5.121C10.582 4.949 11.291 4.857 12 4.857C15.314 4.857 18.061 6.737 20.243 10.614C20.59 11.243 20.59 12.043 20.243 12.671C19.878 13.329 19.463 13.914 19 14.429" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5C8.24 5 5.04 7.14 3 10.5C5.04 13.86 8.24 16 12 16C15.76 16 18.96 13.86 21 10.5C18.96 7.14 15.76 5 12 5ZM12 14C10.34 14 9 12.66 9 11C9 9.34 10.34 8 12 8C13.66 8 15 9.34 15 11C15 12.66 13.66 14 12 14ZM12 9.5C11.17 9.5 10.5 10.17 10.5 11C10.5 11.83 11.17 12.5 12 12.5C12.83 12.5 13.5 11.83 13.5 11C13.5 10.17 12.83 9.5 12 9.5Z" fill="currentColor" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Creating Account...
                            </>
                        ) : (
                            <>
                                Create Account
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 7L18 12M18 12L13 17M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                <div className="divider">
                    <span>or</span>
                </div>

                <p className="auth-link">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
