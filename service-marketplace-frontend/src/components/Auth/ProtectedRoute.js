import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles, redirectPath }) => {
    const { isAuthenticated, isAdminAuthenticated, user, adminUser } = useAuth();

    // Determine which auth to check
    const isAdminRoute = allowedRoles && allowedRoles.includes('admin') && allowedRoles.length === 1;
    const currentIsAuthenticated = isAdminRoute ? isAdminAuthenticated : isAuthenticated;
    const currentUser = isAdminRoute ? adminUser : user;

    if (!currentIsAuthenticated) {
        const defaultRedirect = isAdminRoute ? "/admin/login" : "/login";
        return <Navigate to={redirectPath || defaultRedirect} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
