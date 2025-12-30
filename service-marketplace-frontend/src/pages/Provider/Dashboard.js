import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

const ProviderDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <h1>Service Marketplace - Provider</h1>
                <div className="nav-user">
                    <span>Welcome, {user?.name}</span>
                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h2>Provider Dashboard</h2>
                    <p>Manage your services, discounts, and bookings</p>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>📋 My Services</h3>
                        <p>Create and manage your services</p>
                        <button className="btn-secondary">Manage Services</button>
                    </div>

                    <div className="dashboard-card">
                        <h3>🎯 Discounts & Offers</h3>
                        <p>Create time-based discounts with interest tracking</p>
                        <button className="btn-secondary">Create Discount</button>
                    </div>

                    <div className="dashboard-card">
                        <h3>📅 Availability Calendar</h3>
                        <p>Set your service availability dates</p>
                        <button className="btn-secondary">Manage Calendar</button>
                    </div>

                    <div className="dashboard-card">
                        <h3>📜 Certifications</h3>
                        <p>Upload and manage your certifications</p>
                        <button className="btn-secondary">Upload Certificate</button>
                    </div>

                    <div className="dashboard-card">
                        <h3>📊 Bookings</h3>
                        <p>View and manage service bookings</p>
                        <button className="btn-secondary">View Bookings</button>
                    </div>

                    <div className="dashboard-card">
                        <h3>📈 Performance</h3>
                        <p>View your response score and insights</p>
                        <button className="btn-secondary">View Stats</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
