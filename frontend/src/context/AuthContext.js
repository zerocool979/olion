'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo
} from 'react';
import api from '../api/base';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ======================
     TOKEN HANDLING
  ====================== */
  const setToken = (token) => {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  };

  /* ======================
     FETCH CURRENT USER
  ====================== */
  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      return res.data?.data || res.data || null;
    } catch (error) {
      console.error('fetchMe failed:', error);
      return null;
    }
  }, []);

  /* ======================
     CHECK AUTH ON INIT
  ====================== */
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const me = await fetchMe();
      setUser(me);
      return !!me;
    } catch (error) {
      console.error('Auth check failed:', error);
      setToken(null);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchMe]);

  useEffect(() => {
    let active = true;
    const initAuth = async () => {
      if (active) await checkAuth();
    };
    initAuth();
    return () => (active = false);
  }, [checkAuth]);

  /* ======================
     LOGIN
  ====================== */
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token } = res.data?.data || {};

      if (!token) throw new Error('No token returned from backend');

      setToken(token);

      // Fetch current user immediately after login
      const me = await fetchMe();
      setUser(me);

      return { success: true, user: me };
    } catch (error) {
      console.error('Login failed:', error);
      let msg = 'Login failed';
      if (error.response?.data?.message) msg = error.response.data.message;
      else if (error.message) msg = error.message;
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     LOGOUT
  ====================== */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Backend logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
  };

  /* ======================
     UPDATE & REFRESH USER
  ====================== */
  const updateUser = useCallback((updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await fetchMe();
    setUser(me);
    return me;
  }, [fetchMe]);

  /* ======================
     PROVIDER VALUE
  ====================== */
  const value = useMemo(() => ({
    user,
    role: user?.role?.toLowerCase() || null,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    refreshUser,
    checkAuth
  }), [user, loading, login, logout, updateUser, refreshUser, checkAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
