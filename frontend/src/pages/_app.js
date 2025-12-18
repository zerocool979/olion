import '../styles/globals.css';
import { AuthProvider, useAuth } from '../context/AuthContext';

/**
 * =====================================================
 * AuthGuard
 * -----------------------------------------------------
 * - Menahan render halaman sampai auth ready
 * - TIDAK redirect
 * =====================================================
 */
const AuthGuard = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  return children;
};

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AuthGuard>
        <Component {...pageProps} />
      </AuthGuard>
    </AuthProvider>
  );
}

export default MyApp;
