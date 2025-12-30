import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CustomerForm = ({ customer, onClose, onSubmit }) => {
    const isEdit = !!customer;
    const [formData, setFormData] = useState({
        name: customer?.name || '',
        email: customer?.email || '',
        mobile_no: customer?.mobile_no || '',
        role: customer?.role || 'customer',
        status: (Number(customer?.status) === 1 || customer?.status === 'active') ? 'active' : (customer?.status === 0 || customer?.status === 'inactive' ? 'inactive' : 'active'),
        profile_image: customer?.profile_image || '',
        password: '',
        password_confirmation: '',
        address: {
            country: customer?.address?.country || '',
            state: customer?.address?.state || '',
            city: customer?.address?.city || '',
            area: customer?.address?.area || '',
            area: customer?.address?.area || ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await api.get('/countries');
                setCountries(response.data.countries || []);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        if (formData.address.country) {
            const fetchStates = async () => {
                try {
                    const response = await api.get(`/countries/${formData.address.country}/states`);
                    setStates(response.data.states || []);
                } catch (error) {
                    console.error('Error fetching states:', error);
                }
            };
            fetchStates();
        } else {
            setStates([]);
        }
    }, [formData.address.country]);

    useEffect(() => {
        if (formData.address.state) {
            const fetchCities = async () => {
                try {
                    const response = await api.get(`/states/${formData.address.state}/cities`);
                    setCities(response.data.cities || []);
                } catch (error) {
                    console.error('Error fetching cities:', error);
                }
            };
            fetchCities();
        } else {
            setCities([]);
        }
    }, [formData.address.state]);

    useEffect(() => {
        if (formData.address.city) {
            const fetchAreas = async () => {
                try {
                    const response = await api.get(`/cities/${formData.address.city}/areas`);
                    setAreas(response.data.areas || []);
                } catch (error) {
                    console.error('Error fetching areas:', error);
                }
            };
            fetchAreas();
        } else {
            setAreas([]);
        }
    }, [formData.address.city]);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when field changes
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, profile_image: ['Image size must be less than 2MB'] }));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profile_image: reader.result }));
                setErrors(prev => ({ ...prev, profile_image: null }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, profile_image: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (isEdit) {
                await api.put(`/admin/customers/${customer.id}`, formData);
            } else {
                await api.post('/admin/customers', formData);
            }
            onSubmit();
        } catch (error) {
            console.error('Error saving customer:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: error.response?.data?.message || 'An error occurred while saving.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-overlay">
            <div className="form-modal">
                <div className="modal-header">
                    <h3>{isEdit ? 'Edit Customer' : 'Add New Customer'}</h3>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="customer-form">
                    {errors.general && (
                        <div className="error-alert">{errors.general}</div>
                    )}

                    <div className="form-group image-upload-section">
                        <label>Profile Image</label>
                        {!formData.profile_image ? (
                            <div className="image-uploader">
                                <input
                                    type="file"
                                    id="profile_image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="profile_image" className="upload-placeholder">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Upload Profile Image</span>
                                    <small>Max size: 2MB (JPG, PNG)</small>
                                </label>
                            </div>
                        ) : (
                            <div className="image-preview-container">
                                <img src={formData.profile_image} alt="Preview" />
                                <button type="button" className="btn-remove-img" onClick={handleRemoveImage}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        {errors.profile_image && <span className="field-error">{errors.profile_image[0]}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter full name"
                            />
                            {errors.name && <span className="field-error">{errors.name[0]}</span>}
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="customer@example.com"
                            />
                            {errors.email && <span className="field-error">{errors.email[0]}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input
                                type="tel"
                                name="mobile_no"
                                value={formData.mobile_no}
                                onChange={handleChange}
                                placeholder="123.456.7890"
                            />
                            {errors.mobile_no && <span className="field-error">{errors.mobile_no[0]}</span>}
                        </div>
                        <div className="form-group">
                            <label>Account Status</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="blocked">Blocked</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Country</label>
                            <select
                                name="country"
                                value={formData.address.country}
                                onChange={handleAddressChange}
                            >
                                <option value="">Select Country</option>
                                {countries.map((c) => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>State</label>
                            <select
                                name="state"
                                value={formData.address.state}
                                onChange={handleAddressChange}
                                disabled={!formData.address.country}
                            >
                                <option value="">Select State</option>
                                {states.map((s) => (
                                    <option key={s.id} value={s.name}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>City</label>
                            <select
                                name="city"
                                value={formData.address.city}
                                onChange={handleAddressChange}
                                disabled={!formData.address.state}
                            >
                                <option value="">Select City</option>
                                {cities.map((c) => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Area</label>
                            <select
                                name="area"
                                value={formData.address.area}
                                onChange={handleAddressChange}
                                disabled={!formData.address.city}
                            >
                                <option value="">Select Area</option>
                                {areas.map((a) => (
                                    <option key={a.id} value={a.name}>{a.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>



                    {!isEdit && (
                        <div className="form-row">
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required={!isEdit}
                                    placeholder="Minimum 8 characters"
                                />
                                {errors.password && <span className="field-error">{errors.password[0]}</span>}
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    required={!isEdit}
                                    placeholder="Repeat password"
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-small"></span>
                                    Saving...
                                </>
                            ) : (
                                isEdit ? 'Update Customer' : 'Create Customer'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerForm;
