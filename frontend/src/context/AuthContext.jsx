import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('bankq_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('bankq_token');
      const storedUser = localStorage.getItem('bankq_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Refresh user data from backend
          const res = await authApi.me();
          setUser(res.data);
          localStorage.setItem('bankq_user', JSON.stringify(res.data));
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token: jwtToken, user: userData } = res.data;

    localStorage.setItem('bankq_token', jwtToken);
    localStorage.setItem('bankq_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, role = 'CUSTOMER') => {
    const res = await authApi.register({ name, email, password, role });
    const { token: jwtToken, user: userData } = res.data;

    localStorage.setItem('bankq_token', jwtToken);
    localStorage.setItem('bankq_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('bankq_token');
    localStorage.removeItem('bankq_user');
    setToken(null);
    setUser(null);
  };

  const hasRole = (role) => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true; // Admins have super-access
    return user.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
