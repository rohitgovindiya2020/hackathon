import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

const CustomerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <h1>Service Marketplace - Customer</h1>
                <div className="nav-user">
                    <span>Welcome, {user?.name}</span>
                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h2>Customer Dashboard</h2>
                    <p>Find services, track interests, and manage bookings</p>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>🔍 Search Services</h3>
                        <p>Find services in your area</p>
                        <button className="btn-secondary" onClick={() => navigate('/services')}>Browse Services</button>
                    </div>

                    <div className="dashboard-card">
                        <h3>⭐ My Interests</h3>
                        <p>Track your discount interests (Max 3)</p>
                        <button className="btn-secondary">View Interests</button>
                    </div>

                    <div className="dashboard-card">
                        <h3>🎟️ Promo Codes</h3>
                        <p>View your activated promo codes</p>
                        <button className="btn-secondary">My Codes</button>
                    </div>

                    <div className="dashboard-card">
                        <h3>📅 My Bookings</h3>
                        <p>View and track your service bookings</p>
                        <button className="btn-secondary">View Bookings</button>
                    </div>

                    <div className="dashboard-card">
                        <h3>📜 Service History</h3>
                        <p>View past services and photos</p>
                        <button className="btn-secondary">View History</button>
                    </div>

                    <div className="dashboard-card">
                        <h3>⚙️ Preferences</h3>
                        <p>Manage your service preferences</p>
                        <button className="btn-secondary">Edit Preferences</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
