import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './layouts/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

import Login from './pages/Login';
import CustomerDashboard from './pages/CustomerDashboard';
import RequestToken from './pages/RequestToken';
import MyTokens from './pages/MyTokens';
import TrackToken from './pages/TrackToken';
import StaffDashboard from './pages/StaffDashboard';
import StaffQueue from './pages/StaffQueue';
import AdminDashboard from './pages/AdminDashboard';

// Smart Home Redirection
const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'STAFF') return <Navigate to="/staff/dashboard" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/customer/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<Login />} />

          {/* Customer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']} />}>
            <Route element={<MainLayout title="Customer Dashboard" />}>
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/request-token" element={<RequestToken />} />
              <Route path="/my-tokens" element={<MyTokens />} />
              <Route path="/track/:id" element={<TrackToken />} />
            </Route>
          </Route>

          {/* Staff Routes */}
          <Route element={<ProtectedRoute allowedRoles={['STAFF', 'ADMIN']} />}>
            <Route element={<MainLayout title="Staff Queue Desk" />}>
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              <Route path="/staff/queue" element={<StaffQueue />} />
            </Route>
          </Route>

          {/* Administrator Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<MainLayout title="Administrator Portal" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* Root and Fallback */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
