import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import api from '../api/base';

/**
 * =====================================================
 * AuthContext
 * -----------------------------------------------------
 * - Single source of truth for authentication
 * - NO routing, NO redirect
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
   * Logout
   * ---------------------------------------------------
   */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, [setToken]);

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
   * Login
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
    [fetchMe, setToken]
  );

  /**
   * ---------------------------------------------------
   * Register
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

        return me;
      } catch (error) {
        setUser(null);
        setToken(null);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchMe, setToken]
  );

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
      setUser,
      setToken,
    }),
    [user, loading, login, register, logout, setToken]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
