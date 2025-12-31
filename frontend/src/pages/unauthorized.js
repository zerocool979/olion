// src/pages/unauthorized.js

// ==============================
// FILE INI SUDAH FIX - TIDAK PERLU DIUBAH
// ==============================
'use client';

import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert
} from '@mui/material';
import { Warning, Home, ArrowBack, Dashboard } from '@mui/icons-material';

const UnauthorizedPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Warning sx={{ fontSize: 80, color: 'warning.main', mb: 3 }} />
        <Typography variant="h4" gutterBottom fontWeight="bold">
          403 - Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          You don't have permission to access this page.
        </Typography>

        {user && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Logged in as: <strong>{user.email}</strong> (Role: {user.role})
          </Alert>
        )}

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => router.back()}>
            <ArrowBack sx={{ mr: 1 }} /> Go Back
          </Button>

          {user?.role === 'admin' || user?.role === 'moderator' ? (
            <Button variant="outlined" onClick={() => router.push('/admin')}>
              <Dashboard sx={{ mr: 1 }} /> Admin Dashboard
            </Button>
          ) : (
            <Button variant="outlined" onClick={() => router.push('/dashboard')}>
              <Dashboard sx={{ mr: 1 }} /> User Dashboard
            </Button>
          )}

          <Button variant="outlined" onClick={() => router.push('/')}>
            <Home sx={{ mr: 1 }} /> Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UnauthorizedPage;
