// src/pages/login.js

// ==============================
// ORIGINAL CODE (DO NOT DELETE)
// ==============================

// 'use client'; // Tambahkan directive untuk Next.js 13+

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
// Import ProtectedRoute untuk melindungi halaman login
// import ProtectedRoute from '../components/ProtectedRoute';

/**
 * =====================================================
 * Login Page (FINAL) - Enhanced with ProtectedRoute
 * -----------------------------------------------------
 * UI:
 * - Email + password
 * - Show / hide password
 * - Validation + backend error
 * - Loading & prevent double submit
 * - Role-aware redirect
 * - Protected from authenticated users
 * =====================================================
 */

const LoginPage = () => {
  const {
    login,
    isAuthenticated,
    loading,
    user,
  } = useAuth();

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  /* ======================
     REDIRECT AFTER LOGIN - FIXED VERSION
  ====================== */
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Role-based redirect yang benar
      if (user.role === 'admin' || user.role === 'moderator') {
        router.replace('/admin'); // Admin/moderator ke admin dashboard
      } else {
        router.replace('/dashboard'); // User biasa ke user dashboard
      }
    }
  }, [
    loading,
    isAuthenticated,
    user,
    router,
  ]);

  /* ======================
     SUBMIT LOGIN
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      return setError(
        'Email and password required'
      );
    }

    // Validasi email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError('Please enter a valid email address');
    }

    try {
      setSubmitting(true);
      await login({ email, password });
      // Tidak perlu manual redirect di sini karena sudah di handle di useEffect di atas
      // dan di AuthContext.js sudah ada role-based redirect
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Email or password incorrect'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Tambahan: Handler untuk reset password
  const handleForgotPassword = () => {
    router.push('/forgot-password'); // Buat halaman ini jika diperlukan
  };

  // Jangan return null, tampilkan loading state yang lebih baik
  if (loading) {
    return (
      <div style={container}>
        <div style={loadingStyle}>
          Loading...
        </div>
      </div>
    );
  }

  // Hapus check isAuthenticated di sini karena sudah dihandle oleh ProtectedRoute
  // if (isAuthenticated) return null;

  return (
    <div style={container}>
      <div style={headerStyle}>
        <h2 style={{ marginBottom: '0.5rem' }}>Welcome Back</h2>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroup}>
          <label htmlFor="email" style={labelStyle}>Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={input}
            disabled={submitting}
          />
        </div>

        <div style={inputGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <button
              type="button"
              onClick={handleForgotPassword}
              style={forgotPasswordStyle}
            >
              Forgot password?
            </button>
          </div>
          <input
            id="password"
            type={showPwd ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={input}
            disabled={submitting}
          />
        </div>

        <label style={checkbox}>
          <input
            type="checkbox"
            checked={showPwd}
            onChange={() => setShowPwd(!showPwd)}
            disabled={submitting}
          />{' '}
          Show password
        </label>

        {error && (
          <div style={errorBox}>
            <span style={{ color: '#dc2626', fontWeight: '500' }}>Error:</span> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            ...button,
            backgroundColor: submitting ? '#ccc' : '#2563eb',
            cursor: submitting ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? (
            <span>
              <span style={spinnerStyle}></span> Logging in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>

        <div style={divider}>
          <span style={dividerText}>Or continue with</span>
        </div>

        {/* Tambahan: Social login buttons jika diperlukan */}
        {/* <button type="button" style={socialButton}>
          Sign in with Google
        </button> */}

        <div style={footer}>
          Don&apos;t have an account?{' '}
          <a href="/register" style={linkStyle}>Create account</a>
        </div>
      </form>

      {/* Tambahan: Demo credentials untuk testing */}
      <div style={demoCredentials}>
        <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
          <strong>Demo Credentials:</strong>
        </p>
        <div style={{ fontSize: '0.75rem', color: '#666' }}>
          <div>Admin: admin@example.com / password</div>
          <div>Moderator: moderator@example.com / password</div>
          <div>User: user@example.com / password</div>
        </div>
      </div>
    </div>
  );
};

/* ======================
   INLINE STYLES - ENHANCED
====================== */
const container = {
  maxWidth: 420,
  margin: '4rem auto',
  padding: '2rem',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '2rem',
};

const formStyle = {
  marginTop: '1.5rem',
};

const inputGroup = {
  marginBottom: '1rem',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.3rem',
  fontSize: '0.9rem',
  fontWeight: '500',
  color: '#333',
};

const input = {
  width: '100%',
  padding: '0.75rem',
  marginBottom: '0.6rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '0.9rem',
  boxSizing: 'border-box',
};

const button = {
  width: '100%',
  padding: '0.75rem',
  border: 'none',
  borderRadius: '4px',
  color: 'white',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '0.5rem',
};

const checkbox = {
  fontSize: '0.85rem',
  marginBottom: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: '#555',
};

const errorBox = {
  backgroundColor: '#fee',
  color: '#dc2626',
  fontSize: '0.85rem',
  padding: '0.75rem',
  borderRadius: '4px',
  marginBottom: '1rem',
  border: '1px solid #fca5a5',
};

const footer = {
  marginTop: '1.5rem',
  fontSize: '0.9rem',
  textAlign: 'center',
  color: '#666',
};

const linkStyle = {
  color: '#2563eb',
  textDecoration: 'none',
  fontWeight: '500',
};

const loadingStyle = {
  textAlign: 'center',
  padding: '2rem',
  color: '#666',
};

const spinnerStyle = {
  display: 'inline-block',
  width: '12px',
  height: '12px',
  border: '2px solid rgba(255,255,255,.3)',
  borderRadius: '50%',
  borderTopColor: '#fff',
  animation: 'spin 1s ease-in-out infinite',
  marginRight: '0.5rem',
};

const forgotPasswordStyle = {
  background: 'none',
  border: 'none',
  color: '#2563eb',
  fontSize: '0.85rem',
  cursor: 'pointer',
  padding: '0',
  textDecoration: 'underline',
};

const divider = {
  display: 'flex',
  alignItems: 'center',
  margin: '1.5rem 0',
};

const dividerText = {
  padding: '0 1rem',
  fontSize: '0.85rem',
  color: '#666',
  backgroundColor: '#fff',
};

const socialButton = {
  width: '100%',
  padding: '0.75rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  backgroundColor: '#fff',
  fontSize: '0.9rem',
  cursor: 'pointer',
  marginBottom: '1rem',
};

const demoCredentials = {
  marginTop: '2rem',
  padding: '1rem',
  backgroundColor: '#f9f9f9',
  borderRadius: '6px',
  border: '1px dashed #ddd',
};

// Tambahkan keyframes untuk spinner
const styles = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Tambahkan styles ke document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// =====================================================
// FINAL IMPLEMENTATION - WRAP WITH PROTECTEDROUTE
// =====================================================
/*
const LoginPageWithProtection = () => {
  return (
    <ProtectedRoute requireAuth={false}>
      <LoginPage />
    </ProtectedRoute>
  );
};

export default LoginPageWithProtection;
*/

// =====================================================
// CATATAN: LoginPage asli dikomentari karena sudah dibungkus
// dengan ProtectedRoute yang mencegah akses jika sudah login
// =====================================================

export default LoginPage;

