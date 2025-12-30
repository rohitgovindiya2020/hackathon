import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ProviderView = ({ providerId, onBack }) => {
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProviderDetails = async () => {
            try {
                const response = await api.get(`/admin/service-providers/${providerId}`);
                if (response.data && response.data.success) {
                    setProvider(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching provider details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (providerId) {
            fetchProviderDetails();
        }
    }, [providerId]);

    if (loading) {
        return (
            <div className="view-loading">
                <div className="spinner"></div>
                <span>Loading provider details...</span>
            </div>
        );
    }

    if (!provider) {
        return <div className="error-state">Provider not found</div>;
    }

    return (
        <div className="provider-view">
            <div className="view-header">
                <button onClick={onBack} className="btn-back">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to List
                </button>
                <div className="header-content">
                    <div className="provider-identity">
                        {provider.profile_image ? (
                            <img src={provider.profile_image} alt={provider.name} className="avatar-large" />
                        ) : (
                            <div className="avatar-large placeholder">
                                {provider.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h2>{provider.name}</h2>
                            <span className={`status-badge ${parseInt(provider.status) === 1 ? 'active' : 'inactive'}`}>
                                {parseInt(provider.status) === 1 ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="view-content">
                <div className="info-card contact-info">
                    <h3>Contact Information</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">Email</span>
                            <span className="value">{provider.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Mobile</span>
                            <span className="value">{provider.mobile_no}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Address</span>
                            <span className="value">
                                {provider.address ? (
                                    <>
                                        {provider.address.address_line1} <br />
                                        {provider.address.city}, {provider.address.state} <br />
                                        {provider.address.country} - {provider.address.pincode}
                                    </>
                                ) : 'No address provided'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="info-card">
                    <h3>Services Offered ({provider.services?.length || 0})</h3>
                    <div className="services-list">
                        {provider.services && provider.services.length > 0 ? (
                            provider.services.map(service => (
                                <div key={service.id} className="service-tag">
                                    {service.name}
                                </div>
                            ))
                        ) : (
                            <p className="no-data-text">No services listed</p>
                        )}
                    </div>
                </div>

                <div className="info-card">
                    <h3>Service Areas ({provider.areas?.length || 0})</h3>
                    <div className="areas-list">
                        {provider.areas && provider.areas.length > 0 ? (
                            provider.areas.map(area => (
                                <div key={area.id} className="area-tag">
                                    {area.name} - {area.pincode}
                                </div>
                            ))
                        ) : (
                            <p className="no-data-text">No service areas defined</p>
                        )}
                    </div>
                </div>

                {provider.description && (
                    <div className="info-card">
                        <h3>About</h3>
                        <p className="description-text">{provider.description}</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .provider-view {
                    animation: fadeIn 0.3s ease;
                }
                .view-header {
                    margin-bottom: 2rem;
                }
                .btn-back {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: none;
                    border: none;
                    color: #64748b;
                    font-weight: 500;
                    cursor: pointer;
                    margin-bottom: 1.5rem;
                    padding: 0;
                    font-size: 0.95rem;
                }
                .btn-back:hover {
                    color: #1a202c;
                }
                .btn-back svg {
                    width: 20px;
                    height: 20px;
                }
                .provider-identity {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .avatar-large {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 4px solid white;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .avatar-large.placeholder {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    font-weight: 600;
                }
                .provider-identity h2 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.75rem;
                    color: #1a202c;
                }
                .view-content {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 1.5rem;
                }
                .info-card {
                    background: white;
                    border-radius: 12px;
                    padding: 1.5rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    border: 1px solid #e2e8f0;
                }
                .info-card h3 {
                    margin: 0 0 1rem 0;
                    font-size: 1.1rem;
                    color: #4a5568;
                    border-bottom: 1px solid #edf2f7;
                    padding-bottom: 0.75rem;
                }
                .info-grid {
                    display: grid;
                    gap: 1rem;
                }
                .info-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .label {
                    font-size: 0.85rem;
                    color: #718096;
                    font-weight: 500;
                }
                .value {
                    color: #2d3748;
                    font-weight: 500;
                }
                .services-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                .service-tag {
                    background: #ebf8ff;
                    color: #2b6cb0;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                .areas-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                .area-tag {
                    background: #f0fff4;
                    color: #276749;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    border: 1px solid #c6f6d5;
                }
                .description-text {
                    color: #4a5568;
                    line-height: 1.5;
                }
                .status-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 999px;
                    font-size: 0.875rem;
                    font-weight: 600;
                }
                .status-badge.active {
                    background: #def7ec;
                    color: #03543f;
                }
                .status-badge.inactive {
                    background: #fde8e8;
                    color: #9b1c1c;
                }
                .view-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem;
                    color: #64748b;
                    gap: 1rem;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #e2e8f0;
                    border-top-color: #3b82f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ProviderView;
