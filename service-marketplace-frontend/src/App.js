import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ProviderDashboard from './pages/Provider/Dashboard';
import CustomerDashboard from './pages/Customer/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';
import ServiceList from './pages/Customer/ServiceList';
import ServiceDetail from './pages/Customer/ServiceDetail';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes - Provider */}
            <Route
              path="/provider/dashboard"
              element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <ProviderDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected routes - Customer */}
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <ServiceList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/:id"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <ServiceDetail />
                </ProtectedRoute>
              }
            />

            {/* Protected routes - Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Unauthorized page */}
            <Route
              path="/unauthorized"
              element={
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <h1>Unauthorized</h1>
                  <p>You don't have permission to access this page.</p>
                </div>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
