import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const ProviderForm = ({ provider, onClose, onSubmit }) => {
    const isEdit = !!provider;
    const [formData, setFormData] = useState({
        name: provider?.name || '',
        email: provider?.email || '',
        mobile_no: provider?.mobile_no || '',
        status: provider?.status !== undefined ? parseInt(provider.status) : 1,
        profile_image: provider?.profile_image || '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size must be less than 2MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profile_image: reader.result }));
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
                await api.put(`/admin/service-providers/${provider.id}`, formData);
                toast.success('Provider updated successfully');
            } else {
                await api.post('/admin/service-providers', formData);
                toast.success('Provider created successfully');
            }
            onSubmit();
        } catch (error) {
            console.error('Error saving provider:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error(error.response?.data?.message || 'An error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-overlay">
            <div className="form-modal">
                <div className="modal-header">
                    <h3>{isEdit ? 'Edit Provider' : 'Add New Provider'}</h3>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="customer-form">
                    <div className="form-group image-upload-section" style={{ marginBottom: '20px' }}>
                        <label>Profile Image</label>
                        {!formData.profile_image ? (
                            <div className="image-uploader">
                                <input
                                    type="file"
                                    id="provider_image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="provider_image" className="upload-placeholder">
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
                                placeholder="Enter provider name"
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
                                placeholder="provider@example.com"
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
                                placeholder="PhoneNumber"
                                required
                            />
                            {errors.mobile_no && <span className="field-error">{errors.mobile_no[0]}</span>}
                        </div>
                        <div className="form-group">
                            <label>Account Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: parseInt(e.target.value) }))}
                            >
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
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
                            {loading ? 'Saving...' : (isEdit ? 'Update Provider' : 'Create Provider')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProviderForm;
