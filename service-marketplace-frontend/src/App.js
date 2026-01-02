import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LocationProvider } from './contexts/LocationContext';
import Home from './pages/Home/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ProviderDashboard from './pages/Provider/Dashboard';
import ManageServices from './pages/Provider/ManageServices';
import ManageDiscounts from './pages/Provider/ManageDiscounts';
import ApprovedDiscounts from './pages/Provider/ApprovedDiscounts';
import InterestedCustomers from './pages/Provider/InterestedCustomers';
import CustomerDetails from './pages/Provider/CustomerDetails';
import CustomerDashboard from './pages/Customer/Dashboard';
import MyInterests from './pages/Customer/MyInterests';
import DiscountHistory from './pages/Customer/DiscountHistory';
import Settings from './pages/Customer/Settings';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminLogin from './pages/Admin/AdminLogin';
import ServiceList from './pages/Customer/ServiceList';
import ServiceDetail from './pages/Customer/ServiceDetail';
import ServicesByName from './pages/Customer/ServicesByName';
import ProviderList from './pages/Customer/ProviderList';
import ProviderDetail from './pages/Customer/ProviderDetail';
import ServiceDiscountDetail from './pages/Customer/ServiceDiscountDetail';
import About from './pages/About/About';
import Profile from './pages/Profile/Profile';
import MyAreaDiscounts from './pages/Customer/MyAreaDiscounts';
import Search from './pages/Customer/Search';
import NotFound from './pages/NotFound/NotFound';
import GlobalChat from './components/Chat/GlobalChat';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Shared Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'provider']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Protected routes - Provider */}
              <Route
                path="/provider/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <ProviderDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/services"
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <ManageServices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/discounts"
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <ManageDiscounts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/approved-discounts"
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <ApprovedDiscounts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/discounts/:id/interests"
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <InterestedCustomers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/discounts/:discountId/customers/:customerId"
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <CustomerDetails />
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
                path="/customer/interests"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <MyInterests />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/customer/history"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <DiscountHistory />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/customer/settings"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <Settings />
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
                path="/services/by-name/:serviceName"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <ServicesByName />
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
              <Route
                path="/providers/:id"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <ProviderDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/providers/:providerId/discount/:discountId"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <ServiceDiscountDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/providers"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <ProviderList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/discounts/my-area"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <MyAreaDiscounts />
                  </ProtectedRoute>
                }
              />

              <Route path="/search" element={<Search />} />

              {/* Protected routes - Admin */}
              <Route
                path="/admin/:section"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

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

              {/* Catch-all 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <GlobalChat />
          </div>
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
