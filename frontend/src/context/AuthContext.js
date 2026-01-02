// src/context/AuthContext.js
import {
  createContext, useContext, useEffect,
  useState, useCallback, useMemo
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

  const setToken = (token) => {
    if (typeof window === 'undefined') return;
    token
      ? localStorage.setItem('token', token)
      : localStorage.removeItem('token');
  };

  const fetchMe = async () => {
    const res = await api.get('/auth/me');
    return res.data;
  };

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      const me = await fetchMe();
      setUser(me);
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      setToken(null);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    
    const initAuth = async () => {
      if (active) {
        await checkAuth();
      }
    };
    
    initAuth();
    return () => (active = false);
  }, [checkAuth]);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: userData } = res.data;
      
      setToken(token);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Optional: Call backend logout endpoint if exists
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Backend logout error:', error);
      // Continue with client-side logout anyway
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  const updateUser = useCallback((updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await fetchMe();
      setUser(me);
      return me;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  }, []);

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
  }), [user, loading, updateUser, refreshUser, checkAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
