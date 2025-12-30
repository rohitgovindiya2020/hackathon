import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Settings = () => {
    const [settings, setSettings] = useState({
        max_services_per_user: '3'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/settings');
            if (response.data) {
                setSettings({
                    max_services_per_user: response.data.max_services_per_user || '3'
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            setMessage({ type: 'error', text: 'Failed to load settings' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await api.post('/admin/settings', settings);
            setMessage({ type: 'success', text: 'Settings updated successfully' });
        } catch (error) {
            console.error('Error updating settings:', error);
            setMessage({ type: 'error', text: 'Failed to update settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="settings-loading">
                <div className="spinner"></div>
                <span>Loading settings...</span>
            </div>
        );
    }

    return (
        <div className="settings-container">
            <div className="management-header">
                <h2>Platform Settings</h2>
            </div>

            <div className="settings-card">
                <form onSubmit={handleSubmit}>
                    <div className="settings-section">
                        <h3>General Settings</h3>
                        <div className="form-group">
                            <label htmlFor="max_services_per_user">
                                Number of services a user can use at one time
                            </label>
                            <input
                                type="number"
                                id="max_services_per_user"
                                name="max_services_per_user"
                                value={settings.max_services_per_user}
                                onChange={handleChange}
                                min="1"
                                className="settings-input"
                                required
                            />
                            <p className="field-help">
                                Limit the number of active service bookings per customer account.
                            </p>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`message-banner ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="settings-actions">
                        <button type="submit" className="btn-save" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .settings-container {
                    padding: 2.5rem;
                    max-width: 800px;
                }
                .settings-card {
                    background: white;
                    border-radius: 16px;
                    padding: 2.5rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .settings-section h3 {
                    margin-bottom: 2rem;
                    color: var(--text-dark);
                    font-size: 1.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .form-group {
                    margin-bottom: 2rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.75rem;
                    font-weight: 600;
                    color: #4a5568;
                }
                .settings-input {
                    padding: 0.75rem 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    width: 100%;
                    max-width: 200px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }
                .settings-input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
                .field-help {
                    margin-top: 0.5rem;
                    font-size: 0.875rem;
                    color: #718096;
                }
                .settings-actions {
                    margin-top: 3rem;
                    display: flex;
                    justify-content: flex-end;
                }
                .btn-save {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 1rem 2.5rem;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                }
                .btn-save:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                }
                .btn-save:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .message-banner {
                    padding: 1rem;
                    border-radius: 10px;
                    margin-bottom: 2rem;
                    font-weight: 500;
                }
                .message-banner.success {
                    background: #f0fff4;
                    color: #2f855a;
                    border: 1px solid #c6f6d5;
                }
                .message-banner.error {
                    background: #fff5f5;
                    color: #c53030;
                    border: 1px solid #fed7d7;
                }
                .settings-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem;
                    gap: 1.5rem;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(102, 126, 234, 0.1);
                    border-top: 4px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Settings;
