import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Settings = () => {
    const [settings, setSettings] = useState({
        max_services_per_user: '3',
        smtp_host: '',
        smtp_port: '587',
        smtp_username: '',
        smtp_password: '',
        smtp_encryption: 'tls',
        smtp_from_address: '',
        smtp_from_name: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testingEmail, setTestingEmail] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/settings');
            if (response.data) {
                setSettings({
                    max_services_per_user: response.data.max_services_per_user || '3',
                    smtp_host: response.data.smtp_host || '',
                    smtp_port: response.data.smtp_port || '587',
                    smtp_username: response.data.smtp_username || '',
                    smtp_password: response.data.smtp_password || '',
                    smtp_encryption: response.data.smtp_encryption || 'tls',
                    smtp_from_address: response.data.smtp_from_address || '',
                    smtp_from_name: response.data.smtp_from_name || ''
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

    const handleTestEmail = async () => {
        if (!settings.smtp_from_address) {
            setMessage({ type: 'error', text: 'Please enter a "From Email Address" to test.' });
            return;
        }

        setTestingEmail(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await api.post('/admin/settings/test-email', {
                email: settings.smtp_from_address,
                settings: settings
            });
            setMessage({ type: 'success', text: response.data.message });
        } catch (error) {
            console.error('Error testing email:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to send test email. Please check your SMTP settings.'
            });
        } finally {
            setTestingEmail(false);
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

                    <div className="settings-section">
                        <h3>Email Settings (SMTP)</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="smtp_host">SMTP Host</label>
                                <input
                                    type="text"
                                    id="smtp_host"
                                    name="smtp_host"
                                    value={settings.smtp_host}
                                    onChange={handleChange}
                                    className="settings-input full-width"
                                    placeholder="smtp.gmail.com"
                                />
                                <p className="field-help">
                                    Your email server hostname.
                                </p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="smtp_port">SMTP Port</label>
                                <input
                                    type="number"
                                    id="smtp_port"
                                    name="smtp_port"
                                    value={settings.smtp_port}
                                    onChange={handleChange}
                                    className="settings-input"
                                    placeholder="587"
                                />
                                <p className="field-help">
                                    Common ports: 587 (TLS), 465 (SSL), 25 (None).
                                </p>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="smtp_username">SMTP Username</label>
                                <input
                                    type="text"
                                    id="smtp_username"
                                    name="smtp_username"
                                    value={settings.smtp_username}
                                    onChange={handleChange}
                                    className="settings-input full-width"
                                    placeholder="your-email@example.com"
                                />
                                <p className="field-help">
                                    Your SMTP authentication username.
                                </p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="smtp_password">SMTP Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="smtp_password"
                                        name="smtp_password"
                                        value={settings.smtp_password}
                                        onChange={handleChange}
                                        className="settings-input full-width"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                                <p className="field-help">
                                    Your SMTP authentication password.
                                </p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="smtp_encryption">Encryption</label>
                            <select
                                id="smtp_encryption"
                                name="smtp_encryption"
                                value={settings.smtp_encryption}
                                onChange={handleChange}
                                className="settings-input"
                            >
                                <option value="tls">TLS</option>
                                <option value="ssl">SSL</option>
                                <option value="none">None</option>
                            </select>
                            <p className="field-help">
                                Encryption method for secure connection.
                            </p>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="smtp_from_address">From Email Address</label>
                                <input
                                    type="email"
                                    id="smtp_from_address"
                                    name="smtp_from_address"
                                    value={settings.smtp_from_address}
                                    onChange={handleChange}
                                    className="settings-input full-width"
                                    placeholder="noreply@example.com"
                                />
                                <p className="field-help">
                                    Email address that appears as sender.
                                </p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="smtp_from_name">From Name</label>
                                <input
                                    type="text"
                                    id="smtp_from_name"
                                    name="smtp_from_name"
                                    value={settings.smtp_from_name}
                                    onChange={handleChange}
                                    className="settings-input full-width"
                                    placeholder="Service Marketplace"
                                />
                                <p className="field-help">
                                    Name that appears as sender.
                                </p>
                            </div>
                        </div>

                        <div className="smtp-test-action">
                            <button
                                type="button"
                                className="btn-test"
                                onClick={handleTestEmail}
                                disabled={testingEmail || saving}
                            >
                                {testingEmail ? (
                                    <>
                                        <span className="button-spinner"></span>
                                        Sending Test...
                                    </>
                                ) : (
                                    'Test Connection'
                                )}
                            </button>
                            <p className="test-help">
                                Sends a test email to <strong>{settings.smtp_from_address || 'the from address'}</strong> to verify settings.
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
                    max-width: 900px;
                }
                .settings-card {
                    background: white;
                    border-radius: 16px;
                    padding: 2.5rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .settings-section {
                    margin-bottom: 3rem;
                    padding-bottom: 3rem;
                    border-bottom: 2px solid #f7fafc;
                }
                .settings-section:last-of-type {
                    border-bottom: none;
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
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
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
                .settings-input.full-width {
                    max-width: 100%;
                }
                .settings-input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
                select.settings-input {
                    cursor: pointer;
                }
                .password-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .password-toggle {
                    position: absolute;
                    right: 10px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1.2rem;
                    padding: 0.5rem;
                    opacity: 0.6;
                    transition: opacity 0.2s;
                }
                .password-toggle:hover {
                    opacity: 1;
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
                .smtp-test-action {
                    background: #f8fafc;
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 1px dashed #cbd5e0;
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .btn-test {
                    background: white;
                    color: #4a5568;
                    border: 1px solid #e2e8f0;
                    padding: 0.75rem 1.5rem;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    white-space: nowrap;
                }
                .btn-test:hover:not(:disabled) {
                    background: #edf2f7;
                    border-color: #cbd5e0;
                    color: #2d3748;
                }
                .btn-test:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .test-help {
                    font-size: 0.875rem;
                    color: #718096;
                    margin: 0;
                }
                .button-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(0, 0, 0, 0.1);
                    border-top: 2px solid currentColor;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
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
                
                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 0;
                    }
                    .settings-container {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Settings;
