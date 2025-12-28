import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call
    // For now, we'll simulate a successful login
    const response = {
      user: {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        createdAt: new Date().toISOString()
      },
      token: 'fake-jwt-token',
      refreshToken: 'fake-refresh-token'
    };

    setUser(response.user);
    setToken(response.token);
    
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
    
    navigate('/dashboard');
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    // In a real app, this would be an API call
    // For now, we'll simulate a successful registration
    const response = {
      user: {
        id: '2',
        email,
        firstName,
        lastName,
        role: 'user',
        createdAt: new Date().toISOString()
      },
      token: 'fake-jwt-token',
      refreshToken: 'fake-refresh-token'
    };

    setUser(response.user);
    setToken(response.token);
    
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
    
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    navigate('/login');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};