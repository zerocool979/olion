// src/components/ProtectedRoute.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(`/login?redirect=${router.asPath}`);
      return;
    }

    if (
      roles.length &&
      !roles.map(r => r.toLowerCase()).includes(user.role?.toLowerCase())
    ) {
      router.replace('/unauthorized');
      return;
    }

    setReady(true);
  }, [loading, user]);

  if (loading || !ready) {
    return (
      <Box sx={{ minHeight: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return children;
}
