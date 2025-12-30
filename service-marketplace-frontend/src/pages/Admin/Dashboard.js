import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-brand">Service Marketplace Admin</div>
                <div className="nav-links">
                    <span>Welcome, Admin {user?.name}</span>
                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="welcome-section">
                    <h1>Admin Dashboard</h1>
                    <p>Manage users, services, and platform settings.</p>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>User Management</h3>
                        <p>View and manage customers and providers.</p>
                        <button className="btn-action">Manage Users</button>
                    </div>

                    <div className="dashboard-card">
                        <h3>Service Verification</h3>
                        <p>Approve or reject new service listings.</p>
                        <button className="btn-action">Verify Services</button>
                    </div>

                    <div className="dashboard-card">
                        <h3>Platform Stats</h3>
                        <p>View bookings, revenue, and growth.</p>
                        <button className="btn-action">View Stats</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
