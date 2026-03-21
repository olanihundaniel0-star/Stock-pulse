import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';

interface User {
  id: string;
  email: string;
  fullName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (authService.isAuthenticated()) {
        // In a real app, you might fetch user profile from the API here
        // For now, we'll just mark as authenticated
        const token = authService.getToken();
        if (token) {
          try {
            // Decode JWT to get basic user info
            // In production, fetch user profile from /auth/me endpoint
            const decoded = JSON.parse(atob(token.split('.')[1]));
            setUser({
              id: decoded.sub || decoded.id || '',
              email: decoded.email || '',
              fullName: decoded.fullName || '',
            });
          } catch (err) {
            // Invalid token, clear it
            authService.logout();
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      const userData: User = {
        id: response.user?.id || '',
        email: response.user?.email || email,
        fullName: response.user?.fullName || '',
      };
      setUser(userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(email, password, fullName);
      const userData: User = {
        id: response.user?.id || '',
        email: response.user?.email || email,
        fullName: response.user?.fullName || fullName,
      };
      setUser(userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && authService.isAuthenticated(),
    isLoading,
    login,
    register,
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
