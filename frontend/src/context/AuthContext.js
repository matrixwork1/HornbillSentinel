import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { makeAuthenticatedRequest } from '../utils/csrf';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios to include cookies
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Check if user is logged in by making a request to a protected endpoint
    const checkAuth = async () => {
      try {
        const response = await makeAuthenticatedRequest('get', '/api/auth/me');
        setUser(response.data.user);
      } catch (error) {
        // User is not authenticated
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await makeAuthenticatedRequest('post', '/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  // Fixed refreshAuthState function
  const refreshAuthState = async () => {
    try {
      const response = await makeAuthenticatedRequest('get', '/api/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Auth refresh failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    refreshAuthState,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};