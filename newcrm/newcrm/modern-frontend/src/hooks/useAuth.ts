import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginMutation } from '../services/authApi';
import { loginStart, loginSuccess, loginFailure, logout, setUser } from '../store/slices/authSlice';
import { RootState } from '../store';
import { User } from '../types';

export const useAuth = () => {
  const { user, token, loading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [loginApi] = useLoginMutation();

  useEffect(() => {
    // Check if user is already logged in from localStorage or session
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch(setUser(parsedUser));
        dispatch(loginSuccess({ user: parsedUser, token: storedToken }));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    } else {
      // Auto-login admin user in development mode
      if (process.env.NODE_ENV === 'development') {
        autoLoginAdmin();
      }
    }
  }, [dispatch]);

  const autoLoginAdmin = () => {
    // Pre-configured admin user data
    const adminUser: User = {
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

    // Mock token - in real scenario, you'd need a valid JWT
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4LTEyMzQtMTIzNC0xMjM0LTEyMzQ1Njc4OTAxMiIsImVtYWlsIjoiYWRtaW5AYXdjcm0uY29tIiwiaWF0IjoxNzY2OTEwODg4LCJleHAiOjE3Njc1MTU2ODh9.wS2kSYCE04GYDlBYDwPRlFF7-g6QYh0g9Rh1keBvTv0';

    dispatch(loginSuccess({ user: adminUser, token: mockToken }));
    localStorage.setItem('user', JSON.stringify(adminUser));
    localStorage.setItem('token', mockToken);
  };

  const login = async (email: string, password: string) => {
    dispatch(loginStart());
    try {
      const result = await loginApi({ email, password }).unwrap();
      if (result.user && result.token) {
        const { user, token } = result;
        dispatch(loginSuccess({ user, token }));
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        return { success: true, user };
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    logout: logoutUser,
    isAuthenticated: !!token,
  };
};