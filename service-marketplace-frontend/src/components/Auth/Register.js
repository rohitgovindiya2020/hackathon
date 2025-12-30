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

    const { register } = useAuth();
    const navigate = useNavigate();

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
            <div className="auth-card">
                <h1>Service Marketplace</h1>
                <h2>Register</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div className="form-group">
                        <label>I am a:</label>
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="customer">Customer</option>
                            <option value="provider">Service Provider</option>
                        </select>
                    </div>

                    {formData.role === 'provider' && (
                        <>
                            <div className="form-group">
                                <label>Country</label>
                                <select value={selectedCountry} onChange={handleCountryChange} required>
                                    <option value="">Select Country</option>
                                    {countries.map(country => (
                                        <option key={country.id} value={country.id}>{country.name}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedCountry && (
                                <div className="form-group">
                                    <label>State</label>
                                    <select value={selectedState} onChange={handleStateChange} required>
                                        <option value="">Select State</option>
                                        {states.map(state => (
                                            <option key={state.id} value={state.id}>{state.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {selectedState && (
                                <div className="form-group">
                                    <label>City</label>
                                    <select value={selectedCity} onChange={handleCityChange} required>
                                        <option value="">Select City</option>
                                        {cities.map(city => (
                                            <option key={city.id} value={city.id}>{city.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {selectedCity && (
                                <div className="form-group">
                                    <label>Service Areas (Hold Ctrl/Cmd to select multiple)</label>
                                    <select
                                        multiple
                                        onChange={handleAreaChange}
                                        className="area-select"
                                        size="5"
                                        required
                                    >
                                        {areas.map(area => (
                                            <option key={area.id} value={area.id}>
                                                {area.name}
                                            </option>
                                        ))}
                                    </select>
                                    <small>Select the areas where you provide services</small>
                                </div>
                            )}
                        </>
                    )}

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="8"
                            placeholder="Enter password (min 8 characters)"
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="auth-link">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
