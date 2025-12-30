import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [adminUser, setAdminUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            const parsedUser = JSON.parse(storedUser);
            // Cleanup: If the main session has an admin (legacy bug), clear it
            if (parsedUser.role === 'admin') {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            } else {
                setUser(parsedUser);
            }
        }

        const storedAdmin = localStorage.getItem('admin_user');
        const adminToken = localStorage.getItem('admin_token');
        if (storedAdmin && adminToken) {
            setAdminUser(JSON.parse(storedAdmin));
        }

        setLoading(false);
    }, []);

    // Register function (Main Portal)
    const register = async (userData) => {
        try {
            const response = await api.post('/register', userData);
            const { user, access_token } = response.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            return { success: true, user };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    // Login function (Main Portal)
    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            const { user, access_token } = response.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            return { success: true, user };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    // Admin Login function (Admin Portal)
    const adminLogin = async (email, password) => {
        try {
            const response = await api.post('/admin/login', { email, password });
            const { user, access_token } = response.data;

            localStorage.setItem('admin_token', access_token);
            localStorage.setItem('admin_user', JSON.stringify(user));
            setAdminUser(user);

            return { success: true, user };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Admin login failed'
            };
        }
    };

    // Logout function (Main Portal)
    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    // Admin Logout function
    const adminLogout = async () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setAdminUser(null);
    };

    const value = {
        user,
        adminUser,
        loading,
        register,
        login,
        adminLogin,
        logout,
        adminLogout,
        isAuthenticated: !!user,
        isAdminAuthenticated: !!adminUser,
        isProvider: user?.role === 'provider',
        isCustomer: user?.role === 'customer',
        isAdmin: adminUser?.role === 'admin',
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
