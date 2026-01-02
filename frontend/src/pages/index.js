import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
    } else if (['admin', 'moderator'].includes(user.role)) {
      router.replace('/admin');
    } else {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  return null;
}
