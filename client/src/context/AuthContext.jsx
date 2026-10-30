// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('sentinel_token');
      if (token) {
        try {
          const res = await authAPI.me();
          if (res.data?.success && res.data?.user) {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('sentinel_token');
          }
        } catch (err) {
          console.warn('[Auth] Session restoration failed:', err.message);
          localStorage.removeItem('sentinel_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    if (res.data?.token) {
      localStorage.setItem('sentinel_token', res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const register = async (email, password) => {
    const res = await authAPI.register(email, password);
    if (res.data?.token) {
      localStorage.setItem('sentinel_token', res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('sentinel_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

