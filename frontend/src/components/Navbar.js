import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

/**
 * =====================================================
 * Navbar Component
 * -----------------------------------------------------
 * Navigasi utama aplikasi (auth-aware)
 * =====================================================
 */

const Navbar = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav
      style={{
        padding: '1rem',
        borderBottom: '1px solid #ddd',
        marginBottom: '1rem',
      }}
    >
      <Link href="/">
        <strong style={{ cursor: 'pointer' }}>
          Olion
        </strong>
      </Link>

      {isAuthenticated && (
        <span style={{ marginLeft: '1rem' }}>
          Hello, {user?.email}
        </span>
      )}

      <div style={{ marginTop: '0.5rem' }}>
        {isAuthenticated ? (
          <>
            <Link href="/discussions">Discussions</Link>{' '}
            | <Link href="/notifications">Notifications</Link>{' '}
            | <Link href="/pakar">Pakar</Link>{' '}
            | <Link href="/reputation">Reputation</Link>{' '}
            | <Link href="/users">Users</Link>{' '}
            |{' '}
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: 'blue',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>{' '}
            | <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
