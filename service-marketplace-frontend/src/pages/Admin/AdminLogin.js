import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const { adminLogin, adminUser } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in as admin
    useEffect(() => {
        if (adminUser?.role === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [adminUser, navigate]);

    // Create animated background particles
    useEffect(() => {
        const createParticles = () => {
            const container = document.querySelector('.admin-auth-container');
            if (!container) return;

            const existingParticles = container.querySelectorAll('.particle');
            existingParticles.forEach(p => p.remove());

            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 20 + 's';
                particle.style.animationDuration = (15 + Math.random() * 10) + 's';
                container.appendChild(particle);
            }
        };

        createParticles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await adminLogin(email, password);

        if (result.success) {
            if (result.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                setError('Access denied. Admin credentials required.');
                setLoading(false);
            }
        } else {
            setError(result.error || 'Login failed. Please check your credentials.');
            setLoading(false);
        }
    };

    return (
        <div className="admin-auth-container">
            <div className="admin-auth-card">
                <div className="admin-auth-header">
                    <div className="admin-logo-container">
                        <div className="admin-logo-circle">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M8 8V6C8 4.89543 8.89543 4 10 4H14C15.1046 4 16 4.89543 16 6V8" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 12V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M10 14H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                    <h1>Service Marketplace</h1>
                    <p className="admin-subtitle">Service Marketplace Administration</p>
                </div>

                {error && (
                    <div className="admin-error-message">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="admin-modern-form">
                    <div className={`admin-form-group admin-floating-label ${emailFocused || email ? 'focused' : ''}`}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                            required
                            id="admin-email"
                        />
                        <label htmlFor="admin-email">Admin Email</label>
                        <div className="admin-input-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div className={`admin-form-group admin-floating-label ${passwordFocused || password ? 'focused' : ''}`}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            required
                            id="admin-password"
                        />
                        <label htmlFor="admin-password">Password</label>
                        <button
                            type="button"
                            className="admin-password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex="-1"
                        >
                            {showPassword ? (
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 3L21 21M10.5 10.5C10.1872 10.8128 10 11.2444 10 11.7143C10 12.7376 10.8954 13.5714 12 13.5714C12.5 13.5714 12.9605 13.3929 13.3146 13.0986M17.357 17.357C15.726 18.449 13.942 19 12 19C8.686 19 5.939 17.12 3.757 13.243C3.41 12.614 3.41 11.814 3.757 11.186C4.697 9.471 5.853 8.121 7.143 7.143M9.878 5.121C10.582 4.949 11.291 4.857 12 4.857C15.314 4.857 18.061 6.737 20.243 10.614C20.59 11.243 20.59 12.043 20.243 12.671C19.878 13.329 19.463 13.914 19 14.429" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5C8.24 5 5.04 7.14 3 10.5C5.04 13.86 8.24 16 12 16C15.76 16 18.96 13.86 21 10.5C18.96 7.14 15.76 5 12 5ZM12 14C10.34 14 9 12.66 9 11C9 9.34 10.34 8 12 8C13.66 8 15 9.34 15 11C15 12.66 13.66 14 12 14ZM12 9.5C11.17 9.5 10.5 10.17 10.5 11C10.5 11.83 11.17 12.5 12 12.5C12.83 12.5 13.5 11.83 13.5 11C13.5 10.17 12.83 9.5 12 9.5Z" fill="currentColor" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <button type="submit" disabled={loading} className="admin-btn-primary">
                        {loading ? (
                            <>
                                <span className="admin-spinner"></span>
                                Authenticating...
                            </>
                        ) : (
                            <>
                                Sign In
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 7L18 12M18 12L13 17M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                <div className="admin-footer">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Secure Admin Access</span>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
