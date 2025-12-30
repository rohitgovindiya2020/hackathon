import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import ProviderForm from './ProviderForm';
import ProviderView from './ProviderView';
import './CustomerManagement.css'; // Reusing customer styles for now
import { toast } from 'react-hot-toast';

const ProviderManagement = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });
    const [showForm, setShowForm] = useState(false);
    const [editingProvider, setEditingProvider] = useState(null);
    const [viewingProviderId, setViewingProviderId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchProviders = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get('/admin/service-providers', {
                params: {
                    search: searchTerm,
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                    page: page,
                    per_page: pagination.per_page
                }
            });

            if (response.data && response.data.success) {
                setProviders(response.data.data || []);
                setPagination({
                    current_page: response.data.meta.current_page,
                    last_page: response.data.meta.last_page,
                    per_page: response.data.meta.per_page,
                    total: response.data.meta.total
                });
            }
        } catch (error) {
            console.error('Error fetching providers:', error);
            toast.error('Failed to load service providers');
        } finally {
            setLoading(false);
        }
    }, [searchTerm, statusFilter, pagination.per_page]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProviders(1);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, statusFilter, fetchProviders]);

    const handleAddClick = () => {
        setEditingProvider(null);
        setShowForm(true);
    };

    const handleEditClick = (provider) => {
        setEditingProvider(provider);
        setShowForm(true);
    };

    const handleViewClick = (id) => {
        setViewingProviderId(id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this provider? This action cannot be undone.')) {
            try {
                await api.delete(`/admin/service-providers/${id}`);
                toast.success('Provider deleted successfully');
                fetchProviders(pagination.current_page);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete provider');
            }
        }
    };

    const handleFormSubmit = () => {
        setShowForm(false);
        fetchProviders(pagination.current_page);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            fetchProviders(newPage);
        }
    };

    if (viewingProviderId) {
        return <ProviderView providerId={viewingProviderId} onBack={() => setViewingProviderId(null)} />;
    }

    return (
        <div className="customer-management"> {/* Reusing class for styles */}
            <div className="management-header">
                <h2>Service Provider Management</h2>
                <button className="btn-add-customer" onClick={handleAddClick}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Add New Provider
                </button>
            </div>

            <div className="filters-bar">
                <div className="search-group">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search providers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="data-grid-container">
                {loading ? (
                    <div className="grid-loading">
                        <div className="spinner"></div>
                        <span>Loading providers...</span>
                    </div>
                ) : (
                    <table className="data-grid">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {providers.length > 0 ? (
                                providers.map((provider) => (
                                    <tr key={provider.id}>
                                        <td>
                                            <div className="customer-info">
                                                {provider.profile_image ? (
                                                    <img src={provider.profile_image} alt={provider.name} className="avatar-small" />
                                                ) : (
                                                    <div className="avatar-small">
                                                        {provider.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span>{provider.name}</span>
                                            </div>
                                        </td>
                                        <td>{provider.email}</td>
                                        <td>{provider.mobile_no || 'N/A'}</td>
                                        <td>
                                            <span className={`status-badge ${parseInt(provider.status) === 1 ? 'active' : 'inactive'}`}>
                                                {parseInt(provider.status) === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-view" onClick={() => handleViewClick(provider.id)} title="View Details" style={{ background: '#e0f2fe', color: '#0ea5e9' }}>
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M2.45801 12C3.73228 7.94288 7.52257 5 12.0002 5C16.4778 5 20.2681 7.94291 21.5424 12C20.2681 16.0571 16.4778 19 12.0002 19C7.52256 19 3.73226 16.0571 2.45801 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                                <button className="btn-edit" onClick={() => handleEditClick(provider)} title="Edit">
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L11 16L7 17L8 13L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                                <button className="btn-edit delete" onClick={() => handleDelete(provider.id)} title="Delete" style={{ background: '#fee2e2', color: '#ef4444' }}>
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M3 6H5H21M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M10 11V17M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="no-data">
                                    <td colSpan="5">No providers found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

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

            {showForm && (
                <ProviderForm
                    provider={editingProvider}
                    onClose={() => setShowForm(false)}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
};

export default ProviderManagement;
