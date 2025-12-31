// frontend/src/components/ProtectedRoute.js (Simple Version)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
      // CEGAH redirect loop ke /login
     if (!user) {
       if (router.pathname !== '/login') {
         router.push(`/login?redirect=${encodeURIComponent(router.pathname)}`);
       }
       return;
     }

    if (!loading) {
      // Check if user is authenticated
      if (!user) {
        router.push(`/login?redirect=${encodeURIComponent(router.pathname)}`);
        return;
      }

      // Check role permissions
      if (roles.length > 0 && !roles.includes(user.role)) {
        router.push('/unauthorized');
        return;
      }

      // User is authorized
      setIsAuthorized(true);
    }
  }, [user, loading, roles, router]);

  // Show loading while checking
  if (loading || !isAuthorized) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
