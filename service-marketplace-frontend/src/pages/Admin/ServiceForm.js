import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ServiceForm = ({ service, onClose, onSubmit }) => {
    const isEdit = !!service;
    const [formData, setFormData] = useState({
        name: service?.name || '',
        image: service?.image || '',
        is_active: service?.is_active !== undefined ? parseInt(service.is_active) : 1
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
                setErrors(prev => ({ ...prev, image: ['Image size must be less than 2MB'] }));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
                setErrors(prev => ({ ...prev, image: null }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, image: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (isEdit) {
                await api.put(`/services/${service.id}`, formData);
                toast.success('Service updated successfully');
            } else {
                await api.post('/services', formData);
                toast.success('Service created successfully');
            }
            onSubmit();
        } catch (error) {
            console.error('Error saving service:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'Error: Connection failed or unauthorized.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-overlay">
            <div className="form-modal service-modal">
                <div className="modal-header">
                    <h3>{isEdit ? 'Update Service Details' : 'Create New Service'}</h3>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="modern-form">
                    {errors.general && <div className="error-alert">{errors.general}</div>}

                    <div className="form-group">
                        <label>Service Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Professional Home Cleaning"
                        />
                        {errors.name && <span className="field-error">{errors.name[0]}</span>}
                    </div>

                    <div className="form-group">
                        <label>Service Image</label>
                        {!formData.image ? (
                            <div className="image-uploader">
                                <input
                                    type="file"
                                    id="service_image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="service_image" className="upload-placeholder">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Upload Service Image</span>
                                    <small>Max size: 2MB (JPG, PNG)</small>
                                </label>
                            </div>
                        ) : (
                            <div className="image-preview-container">
                                <img src={formData.image} alt="Preview" />
                                <button type="button" className="btn-remove-img" onClick={handleRemoveImage}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        {errors.image && <span className="field-error">{errors.image[0]}</span>}
                    </div>

                    <div className="form-group">
                        <label>Platform Status</label>
                        <select
                            name="is_active"
                            value={formData.is_active}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_active: parseInt(e.target.value) }))}
                        >
                            <option value={1}>Active (Visible)</option>
                            <option value={0}>Inactive (Hidden)</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
                            Discard
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-small"></span>
                                    Processing...
                                </>
                            ) : (
                                isEdit ? 'Save Changes' : 'Publish Service'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceForm;
