import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import CustomerForm from './CustomerForm';
import './CustomerManagement.css';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchCustomers = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get('/admin/customers', {
                params: {
                    search: searchTerm,
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                    page: page,
                    per_page: pagination.per_page
                }
            });

            // Handle Laravel-style pagination response
            console.log(response);
            if (response.data && response.data.data) {

                setCustomers(response.data.data || []);
                setPagination({
                    current_page: response.data.current_page,
                    last_page: response.data.last_page,
                    per_page: response.data.per_page,
                    total: response.data.total
                });
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            // Fallback for demonstration if API fails or is empty
            const mockData = [
                { id: 1, name: 'Dr. Julianne Powlowski', email: 'sporer.carolanne@example.com', mobile_no: '432.668.8311', role: 'customer', status: 'active', created_at: '2025-12-30T07:02:53.000000Z', profile_image: 'https://via.placeholder.com/640x480.png/005577?text=quis' },
                { id: 2, name: 'Miss Danika Wintheiser DVM', email: 'zboncak.karson@example.com', mobile_no: '(251) 568-0259', role: 'customer', status: 'inactive', created_at: '2025-12-30T07:02:53.000000Z' },
            ];
            setCustomers(mockData);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, statusFilter, pagination.per_page]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCustomers(1);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, statusFilter, fetchCustomers]);

    const handleAddClick = () => {
        setEditingCustomer(null);
        setShowForm(true);
    };

    const handleEditClick = (customer) => {
        setEditingCustomer(customer);
        setShowForm(true);
    };

    const handleFormSubmit = () => {
        setShowForm(false);
        fetchCustomers(pagination.current_page);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            fetchCustomers(newPage);
        }
    };

    return (
        <div className="customer-management">
            <div className="management-header">
                <h2>Customer Management</h2>
                <button className="btn-add-customer" onClick={handleAddClick}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Add New Customer
                </button>
            </div>

            <div className="filters-bar">
                <div className="search-group">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
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
                        <span>Loading customers...</span>
                    </div>
                ) : (
                    <table className="data-grid">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile No</th>
                                <th>Status</th>
                                <th>Address</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length > 0 ? (
                                customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>
                                            <div className="customer-info">
                                                {customer.profile_image ? (
                                                    <img
                                                        src={
                                                            (customer.profile_image.startsWith('data:') || customer.profile_image.startsWith('http'))
                                                                ? customer.profile_image
                                                                : `data:image/jpeg;base64,${customer.profile_image}`
                                                        }
                                                        alt={customer.name}
                                                        className="avatar-small"
                                                    />
                                                ) : (
                                                    <div className="avatar-small">
                                                        {customer.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>{customer.email}</td>
                                        <td>{customer.mobile_no || 'N/A'}</td>
                                        <td>
                                            <span className={`status-badge ${(Number(customer.status) === 1 || customer.status === 'active') ? 'active' : 'inactive'}`}>
                                                {(Number(customer.status) === 1 || customer.status === 'active') ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="address-cell">
                                                {customer.address?.city && customer.address?.country ? (
                                                    <span>{customer.address.city}, {customer.address.country}</span>
                                                ) : (
                                                    <span>{'N/A'}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-edit" onClick={() => handleEditClick(customer)} title="Edit">
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L11 16L7 17L8 13L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="no-data">
                                    <td colSpan="7">No customers found matching your criteria.</td>
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
                <CustomerForm
                    customer={editingCustomer}
                    onClose={() => setShowForm(false)}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
};

export default CustomerManagement;
