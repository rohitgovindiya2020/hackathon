import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import ServiceForm from './ServiceForm';
import toast from 'react-hot-toast';
import './ServiceManagement.css';

const ServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 8,
        total: 0
    });
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState(null);

    const fetchServices = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get('/services', {
                params: {
                    search: searchTerm,
                    page: page,
                    per_page: pagination.per_page
                }
            });

            if (response.data) {
                const data = response.data.data.data;
                console.log(data);

                if (data) {
                    setServices(data || []);
                    setPagination({
                        current_page: data.current_page,
                        last_page: data.last_page,
                        per_page: data.per_page,
                        total: data.total
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            // Mock data for initial development/demonstration
            const mockServices = [
                {
                    id: 1,
                    name: 'Premium Car Detailing',
                    category: 'Vehicle & Logistics Services',
                    description: 'Professional interior and exterior cleaning service.',
                    price: 150,
                    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=800',
                    status: 'active'
                },
                {
                    id: 2,
                    name: 'Therapeutic Massage',
                    category: 'Personal Care & Wellness (The At-Home Experience)',
                    description: 'Relaxing at-home massage therapy session.',
                    price: 80,
                    image: 'https://images.unsplash.com/photo-1544161515-4af6b1d8b159?auto=format&fit=crop&q=80&w=800',
                    status: 'active'
                },
                {
                    id: 3,
                    name: 'Electrical Repairs',
                    category: 'Home Maintenance & Repair',
                    description: 'Expert residential electrical maintenance and fixes.',
                    price: 120,
                    image: 'https://images.unsplash.com/photo-1621905252507-b354bcadcabc?auto=format&fit=crop&q=80&w=800',
                    is_active: 1
                }
            ];
            setServices(mockServices);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, pagination.per_page]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchServices(1);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchServices]);

    const handleAddClick = () => {
        setEditingService(null);
        setShowForm(true);
    };

    const handleEditClick = (service) => {
        setEditingService(service);
        setShowForm(true);
    };

    const handleFormSubmit = () => {
        setShowForm(false);
        fetchServices(pagination.current_page);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            fetchServices(newPage);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await api.delete(`/services/${id}`);
                toast.success('Service deleted successfully');
                fetchServices(pagination.current_page);
            } catch (error) {
                console.error('Error deleting service:', error);
                toast.error(error.response?.data?.message || 'Failed to delete service');
            }
        }
    };

    return (
        <div className="service-management">
            <div className="management-header">
                <div className="title-group">
                    <h2>Service Management</h2>
                    <p>Manage categories, descriptions and banner images</p>
                </div>
                <button className="btn-add-service" onClick={handleAddClick}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Add Business Service
                </button>
            </div>

            <div className="filters-bar">
                <div className="search-group">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search services by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid-loading">
                    <div className="spinner"></div>
                    <span>Loading platform services...</span>
                </div>
            ) : (
                <div className="table-container">
                    <table className="management-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Service Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.length > 0 ? (
                                services.map((service) => (
                                    <tr key={service.id}>
                                        <td>
                                            <div className="table-banner">
                                                <img src={service.image || 'https://via.placeholder.com/100x50?text=No+Img'} alt={service.name} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="service-name-cell">
                                                <span className="name-text">{service.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${parseInt(service.is_active) === 1 ? 'active' : 'inactive'}`}>
                                                {parseInt(service.is_active) === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-icon edit" onClick={() => handleEditClick(service)} title="Edit">
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L11 16L7 17L8 13L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                                <button className="btn-icon delete" onClick={() => handleDelete(service.id)} title="Delete">
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M3 6H21M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6M10 11V17M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="no-data-cell">
                                        <div className="no-data-content">
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p>No services found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {pagination.last_page > 1 && (
                <div className="pagination">
                    <button
                        disabled={pagination.current_page === 1 || loading}
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                    >
                        Previous
                    </button>
                    <div className="page-info">
                        Page {pagination.current_page} of {pagination.last_page}
                    </div>
                    <button
                        disabled={pagination.current_page === pagination.last_page || loading}
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

            {showForm && (
                <ServiceForm
                    service={editingService}
                    onClose={() => setShowForm(false)}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
};

export default ServiceManagement;
