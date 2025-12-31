// frontend/src/context/AuthContext.js
'use client'; // Wajib untuk Next.js 13+ karena menggunakan hooks

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
// import { useRouter } from 'next/router'; // Untuk Pages Router
import { useRouter } from 'next/navigation'; // Untuk App Router
import api from '../api/base';

/**
 * =====================================================
 * AuthContext - Next.js 13+ Compatible
 * -----------------------------------------------------
 * - Single source of truth for authentication
 * - Menggunakan useRouter() dari Next.js untuk routing
 * - SSR compatible dengan pengecekan typeof window
 * - Role-based redirect setelah login
 * =====================================================
 */

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider />');
  }
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * ---------------------------------------------------
   * Token handler
   * ---------------------------------------------------
   */
  const setToken = useCallback((token) => {
    if (typeof window === 'undefined') return;

    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, []);

  /**
   * ---------------------------------------------------
   * Fetch current user
   * ---------------------------------------------------
   */
  const fetchMe = useCallback(async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }, []);

  /**
   * ---------------------------------------------------
   * Logout - Menggunakan router.push() untuk Next.js
   * ---------------------------------------------------
   */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    router.push('/login');
  }, [setToken, router]);

  /**
   * ---------------------------------------------------
   * Init auth on mount
   * ---------------------------------------------------
   */
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      if (typeof window === 'undefined') {
        if (isMounted) setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const me = await fetchMe();
        if (isMounted) setUser(me);
      } catch (error) {
        console.warn('[Auth] Invalid token, clearing session');
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();
    return () => {
      isMounted = false;
    };
  }, [fetchMe, setToken]);

  /**
   * ---------------------------------------------------
   * Login - Menggunakan router.push() untuk Next.js
   * ---------------------------------------------------
   */
  const login = useCallback(
    async ({ email, password }) => {
      setLoading(true);

      try {
        const res = await api.post('/auth/login', {
          email,
          password,
        });

        const token = res.data?.token;
        if (!token) {
          throw new Error('Token not returned from login');
        }

        setToken(token);

        const me = await fetchMe();
        setUser(me);

        // Role-based redirect setelah login berhasil
        if (me.role === 'admin' || me.role === 'moderator') {
          router.push('/admin'); // Redirect admin/moderator ke admin dashboard
        } else {
          router.push('/dashboard'); // Regular users ke general dashboard
        }

        return me;
      } catch (error) {
        // ⬅️ PENTING: propagate error ke UI
        setUser(null);
        setToken(null);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchMe, setToken, router]
  );

  /**
   * ---------------------------------------------------
   * Register - Menggunakan router.push() untuk Next.js
   * ---------------------------------------------------
   */
  const register = useCallback(
    async ({ email, password }) => {
      setLoading(true);

      try {
        const res = await api.post('/auth/register', {
          email,
          password,
        });

        const token = res.data?.token;
        if (!token) {
          throw new Error('Token not returned from register');
        }

        setToken(token);

        const me = await fetchMe();
        setUser(me);

        // Redirect setelah register berhasil
        router.push('/dashboard');

        return me;
      } catch (error) {
        setUser(null);
        setToken(null);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchMe, setToken, router]
  );

  /**
   * ---------------------------------------------------
   * Manual login dengan token (untuk external auth)
   * ---------------------------------------------------
   */
  const loginWithToken = useCallback((token, userData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Role-based redirect
      if (userData.role === 'admin' || userData.role === 'moderator') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [router]);

  /**
   * ---------------------------------------------------
   * Manual redirect function untuk komponen lain
   * ---------------------------------------------------
   */
  const redirectTo = useCallback((path) => {
    router.push(path);
  }, [router]);

  /**
   * ---------------------------------------------------
   * Update user data (setelah edit profile, dll)
   * ---------------------------------------------------
   */
  const updateUser = useCallback((userData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
  }, []);

  /**
   * ---------------------------------------------------
   * Context value
   * ---------------------------------------------------
   */
  const value = useMemo(
    () => ({
      // state
      user,
      loading,
      isAuthenticated: !!user,
      role: user?.role || null,

      // actions
      login,
      register,
      logout,
      loginWithToken,
      updateUser,
      setUser,
      setToken,

      // router helper (optional)
      redirectTo,
    }),
    [user, loading, login, register, logout, loginWithToken, updateUser, setToken, redirectTo]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
