import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const AreaForm = ({ area, onClose, onSubmit }) => {
    const isEdit = !!area;
    const [formData, setFormData] = useState({
        country: area?.country || '',
        state: area?.state || '',
        city: area?.city || '',
        area: area?.area || '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (isEdit) {
                await api.put(`/admin/service-areas/${area.id}`, formData);
                toast.success('Service area updated successfully');
            } else {
                await api.post('/admin/service-areas', formData);
                toast.success('Service area created successfully');
            }
            onSubmit();
        } catch (error) {
            console.error('Error saving area:', error);
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
                    <h3>{isEdit ? 'Edit Service Area' : 'Add New Service Area'}</h3>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="customer-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                                placeholder="e.g. India"
                            />
                            {errors.country && <span className="field-error">{errors.country[0]}</span>}
                        </div>
                        <div className="form-group">
                            <label>State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Gujarat"
                            />
                            {errors.state && <span className="field-error">{errors.state[0]}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Ahmedabad"
                            />
                            {errors.city && <span className="field-error">{errors.city[0]}</span>}
                        </div>
                        <div className="form-group">
                            <label>Area Name</label>
                            <input
                                type="text"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Satellite"
                            />
                            {errors.area && <span className="field-error">{errors.area[0]}</span>}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Saving...' : (isEdit ? 'Update Area' : 'Create Area')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AreaForm;
