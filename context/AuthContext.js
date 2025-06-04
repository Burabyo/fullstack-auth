import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

// Create the context
export const AuthContext = createContext();

// Provide the context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user info (optional)
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [loading, setLoading] = useState(false);

  // When token changes, store or remove from localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      setToken(response.data.token);
      setUser(response.data.user); // if API returns user info
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // Register function (optional)
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/register', { name, email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
