import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Base API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    signup,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
