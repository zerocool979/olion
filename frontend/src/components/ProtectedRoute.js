import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

/**
 * =====================================================
 * ProtectedRoute
 * -----------------------------------------------------
 * - Melindungi halaman dari user tidak login
 * - Sinkron dengan AuthContext
 * =====================================================
 */

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Sambil redirect
    return null;
  }

  return children;
};

export default ProtectedRoute;
