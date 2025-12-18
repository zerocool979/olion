import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../context/AuthContext';

/**
 * =====================================================
 * Login Page
 * -----------------------------------------------------
 * - Entry auth
 * - Redirect jika sudah login
 * =====================================================
 */

const LoginPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto' }}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
