import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Leads from './pages/sales/Leads';
import Opportunities from './pages/sales/Opportunities';
import Contacts from './pages/sales/Contacts';
import Accounts from './pages/sales/Accounts';
import Activities from './pages/sales/Activities';
import Settings from './pages/settings/Settings';
import AdminUsers from './pages/admin/Users';
import './styles/index.css';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={
                <AuthLayout>
                  <Login />
                </AuthLayout>
              } />
              <Route path="/register" element={
                <AuthLayout>
                  <Register />
                </AuthLayout>
              } />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              } />
              <Route path="/dashboard" element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              } />
              <Route path="/leads" element={
                <DashboardLayout>
                  <Leads />
                </DashboardLayout>
              } />
              <Route path="/opportunities" element={
                <DashboardLayout>
                  <Opportunities />
                </DashboardLayout>
              } />
              <Route path="/contacts" element={
                <DashboardLayout>
                  <Contacts />
                </DashboardLayout>
              } />
              <Route path="/accounts" element={
                <DashboardLayout>
                  <Accounts />
                </DashboardLayout>
              } />
              <Route path="/activities" element={
                <DashboardLayout>
                  <Activities />
                </DashboardLayout>
              } />
              <Route path="/settings" element={
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              } />
              <Route path="/admin/users" element={
                <DashboardLayout>
                  <AdminUsers />
                </DashboardLayout>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;