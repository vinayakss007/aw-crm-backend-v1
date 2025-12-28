import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './store/slices/authSlice';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Leads from './pages/Leads';
import Accounts from './pages/Accounts';
import Contacts from './pages/Contacts';
import Opportunities from './pages/Opportunities';
import Activities from './pages/Activities';
import Reports from './pages/Reports';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const { user, loading } = useAuth();
  const dispatch = useDispatch();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            user ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/leads/*" element={
                    <PrivateRoute>
                      <Leads />
                    </PrivateRoute>
                  } />
                  <Route path="/accounts/*" element={
                    <PrivateRoute>
                      <Accounts />
                    </PrivateRoute>
                  } />
                  <Route path="/contacts/*" element={
                    <PrivateRoute>
                      <Contacts />
                    </PrivateRoute>
                  } />
                  <Route path="/opportunities/*" element={
                    <PrivateRoute>
                      <Opportunities />
                    </PrivateRoute>
                  } />
                  <Route path="/activities/*" element={
                    <PrivateRoute>
                      <Activities />
                    </PrivateRoute>
                  } />
                  <Route path="/reports/*" element={
                    <PrivateRoute>
                      <Reports />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/*" element={
                    <PrivateRoute roles={['admin', 'super_admin']}>
                      <Admin />
                    </PrivateRoute>
                  } />
                  <Route path="/settings/*" element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  } />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            ) : (
              // Auto-login admin user if not authenticated
              (() => {
                // Auto-login admin user in development mode
                if (process.env.NODE_ENV === 'development') {
                  const adminUser = {
                    id: '12345678-1234-1234-1234-123456789012',
                    email: 'admin@awcrm.com',
                    firstName: 'Admin',
                    lastName: 'User',
                    role: 'admin',
                    permissions: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    isActive: true,
                    department: 'Admin',
                    position: 'Administrator',
                    phone: '',
                    avatar: '',
                  };

                  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4LTEyMzQtMTIzNC0xMjM0LTEyMzQ1Njc4OTAxMiIsImVtYWlsIjoiYWRtaW5AYXdjcm0uY29tIiwiaWF0IjoxNzY2OTEwODg4LCJleHAiOjE3Njc1MTU2ODh9.wS2kSYCE04GYDlBYDwPRlFF7-g6QYh0g9Rh1keBvTv0';

                  // Dispatch login success to Redux store
                  dispatch(loginSuccess({ user: adminUser, token: mockToken }));
                  localStorage.setItem('user', JSON.stringify(adminUser));
                  localStorage.setItem('token', mockToken);

                  // Navigate to dashboard
                  return <Navigate to="/dashboard" replace />;
                } else {
                  // In production, redirect to login
                  return <Navigate to="/login" replace />;
                }
              })()
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;