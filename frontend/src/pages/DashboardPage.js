// src/pages/DashboardPage.js
'use client';

/* =========================
   ORIGINAL IMPORTS (KEEP)
========================= */
// import { useEffect, useState, useMemo } from 'react';
// import { useRouter } from 'next/router'; // Untuk Pages Router
// import { useAuth } from '../context/AuthContext';
// import api from '../api/base';
// import Navbar from '../components/Navbar';
// import ProtectedRoute from '../components/ProtectedRoute';

import { useEffect, useState /* useMemo */ } from 'react'; // useMemo tidak dipakai
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import api from '../api/base';
import Navbar from '../components/Navbar';

import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Alert,
  LinearProgress,
  Stack
  // ⚠️ Komponen lain tidak dipakai (KEEP, JANGAN HAPUS)
  // Paper, CardActions, Chip, IconButton, Tooltip,
  // Avatar, Skeleton, Snackbar, Fade, Zoom
} from '@mui/material';

// ⚠️ Icon imports tidak dipakai saat ini (KEEP)
// import {
//   AddCircle, Forum, Comment, ThumbUp, Warning,
//   CheckCircle, Cancel, AccessTime, Person, BarChart,
//   Notifications, ArrowForward, Visibility, Shield,
//   VerifiedUser, QuestionAnswer, Timeline, Group,
//   Refresh, Settings
// } from '@mui/icons-material';

// ⚠️ Chart library belum digunakan (KEEP)
// import {
//   LineChart, Line,
//   BarChart as RechartsBarChart,
//   Bar, XAxis, YAxis,
//   CartesianGrid, Tooltip as RechartsTooltip,
//   Legend, ResponsiveContainer
// } from 'recharts';

/**
 * =====================================================
 * DashboardPage - FINAL STABLE VERSION
 * =====================================================
 * - Auth dicek oleh root (/)
 * - Tidak redirect role lagi
 * - Role dinormalisasi
 * =====================================================
 */

const DashboardPage = () => {
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout; // ⚠️ guard jika undefined
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =========================
     ROLE NORMALIZATION (FIX)
  ========================= */
  const userRole = (user?.role || 'USER').toUpperCase();

  const isAdmin = userRole === 'ADMIN';
  const isModerator = userRole === 'MODERATOR' || isAdmin;
  const isPakar = userRole === 'PAKAR';

  /* =========================
     FETCH DASHBOARD
  ========================= */
  const fetchDashboardData = async (signal) => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
        signal // ✅ abort-safe
      });

      setDashboardData(res?.data || {});
    } catch (err) {
      if (err.name === 'CanceledError') return;

      if (err.response?.status === 401) {
        if (logout) logout(); // guard
        router.replace('/login');
      } else {
        setError('Gagal memuat dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();
    fetchDashboardData(controller.signal);

    return () => controller.abort();
  }, [user]);

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 6, textAlign: 'center' }}>
          <LinearProgress />
          <Typography sx={{ mt: 2 }}>Memuat dashboard...</Typography>
        </Container>
      </>
    );
  }

  /* =========================
     ERROR STATE
  ========================= */
  if (error) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 6 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </>
    );
  }

  /* =========================
     SAFE DATA
  ========================= */
  const stats = dashboardData?.stats || {};

  return (
    <>
      <Navbar />

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          Selamat datang, <strong>{user?.name || user?.email}</strong>
        </Typography>

        {/* =========================
            SUMMARY
        ========================= */}
        <Grid container spacing={3}>
          {[
            ['Total Diskusi', stats.totalDiscussions],
            ['Total Jawaban', stats.totalAnswers],
            ['Total Komentar', stats.totalComments],
            ['Total Reputasi', stats.totalReputation]
          ].map(([label, value]) => (
            <Grid item xs={12} md={3} key={label}>
              <Card>
                <CardContent>
                  <Typography>{label}</Typography>
                  <Typography variant="h4">{value || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* =========================
            ROLE AWARE ACTIONS
        ========================= */}
        <Box sx={{ mt: 4 }}>
          <Stack spacing={2} direction="row" flexWrap="wrap">
            <Button
              variant="contained"
              onClick={() => router.push('/discussions')}
            >
              Diskusi
            </Button>

            {isAdmin && (
              <Button color="error" onClick={() => router.push('/admin')}>
                Admin Panel
              </Button>
            )}

            {(isAdmin || isModerator) && (
              <Button
                color="warning"
                onClick={() => router.push('/admin/content-moderation')}
              >
                Moderasi
              </Button>
            )}

            {isPakar && (
              <Button
                color="success"
                onClick={() => router.push('/dashboard/pakar')}
              >
                Mode Pakar
              </Button>
            )}
          </Stack>
        </Box>
      </Container>
    </>
  );
};

/* =========================
   ORIGINAL WRAPPER (DISABLED)
========================= */
// const DashboardPage = () => {
//   return (
//     <ProtectedRoute>
//       <DashboardPageContent />
//     </ProtectedRoute>
//   );
// };

export default DashboardPage;

// =====================================================
// CATATAN: 
// 1. File ini adalah orchestrator utama untuk dashboard
// 2. Routing role sudah ditangani di index.js
// 3. Button action sudah mengarah ke route yang sesuai
// =====================================================
