// src/pages/dashboard/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

export default function DashboardIndex() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // belum login
    if (!user) {
      router.replace('/login');
      return;
    }

    const role = (user.role || 'user').toLowerCase();

    if (role === 'admin' || role === 'moderator') {
      router.replace('/dashboard/admin');
    } else if (role === 'pakar') {
      router.replace('/dashboard/pakar');
    } else {
      router.replace('/dashboard/user');
    }
  }, [user, loading, router]);

  return null;
}
