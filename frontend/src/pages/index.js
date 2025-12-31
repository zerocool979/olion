// src/pages/index.js

// ==============================
// ORIGINAL CODE (DO NOT DELETE)
// ==============================
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardPage from './DashboardPage';

/**
 * =====================================================
 * Root Page (/)
 * -----------------------------------------------------
 * - Protected
 * - Redirect handled by ProtectedRoute
 * =====================================================
 */

const HomePage = () => {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
};

export default HomePage;

// ==============================
// FINAL IMPLEMENTATION
// ==============================
/*
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

/**
 * Root Page (/)
 *
 * Alur:
 * - Belum login   → /login
 * - ADMIN         → /admin
 * - MODERATOR     → /dashboard/moderator
 * - PAKAR         → /dashboard/pakar
 * - USER          → /dashboard/user
 */
/*
export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    const role = user.role?.toUpperCase();

    if (role === 'ADMIN') {
      router.replace('/admin');
    } else if (role === 'MODERATOR') {
      router.replace('/dashboard/moderator');
    } else if (role === 'PAKAR') {
      router.replace('/dashboard/pakar');
    } else {
      router.replace('/dashboard/user');
    }
  }, [user, loading, router]);

  // Loading sementara sebelum redirect
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}
    >
      <CircularProgress />
    </Box>
  );
}
*/
