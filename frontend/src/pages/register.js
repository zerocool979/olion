// src/pages/register.js

// ==============================
// ORIGINAL CODE (DO NOT DELETE)
// ==============================
// 'use client'; // Tambahkan directive untuk Next.js 13+

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
// Import ProtectedRoute untuk melindungi halaman register
// import ProtectedRoute from '../components/ProtectedRoute';

/**
 * =====================================================
 * Register Page (FINAL) - Enhanced with ProtectedRoute
 * -----------------------------------------------------
 * UI:
 * - Email, password, confirm password
 * - Show / hide password
 * - Password strength indicator
 * - Validation + backend error
 * - Loading & prevent double submit
 * - Auto redirect after success
 * - Protected from authenticated users
 * =====================================================
 */

const RegisterPage = () => {
  const { register, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '', // Tambahkan field name
  });
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  /* ======================
     REDIRECT IF LOGGED IN - Diperbaiki
  ====================== */
  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Redirect ke dashboard sesuai role
      // Role ditentukan setelah registrasi berhasil
      router.replace('/dashboard');
    }
  }, [loading, isAuthenticated, router]);

  /* ======================
     HANDLE INPUT CHANGES
  ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  /* ======================
     PASSWORD STRENGTH CHECKER
  ====================== */
  const getPasswordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 'Empty', color: '#ccc', score: 0 };

    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety
    if (/[A-Z]/.test(password)) score += 1; // Uppercase
    if (/[a-z]/.test(password)) score += 1; // Lowercase
    if (/[0-9]/.test(password)) score += 1; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Special chars

    if (score <= 2) return { strength: 'Weak', color: '#ef4444', score };
    if (score <= 4) return { strength: 'Medium', color: '#f59e0b', score };
    return { strength: 'Strong', color: '#10b981', score };
  };

  /* ======================
     VALIDATION
  ====================== */
  const validateForm = () => {
    const { email, password, confirmPassword, name } = formData;

    if (!email || !password || !confirmPassword || !name) {
      return 'All fields are required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }

    // Name validation
    if (name.length < 2) {
      return 'Name must be at least 2 characters long';
    }

    // Password validation
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    const strength = getPasswordStrength();
    if (strength.strength === 'Weak') {
      return 'Password is too weak. Please use a stronger password.';
    }

    return null; // No errors
  };

  /* ======================
     SUBMIT REGISTER
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name // Kirim name ke backend
      });

      // Show success message
      setSuccess(true);

      // Auto redirect after 2 seconds
      setTimeout(() => {
        router.push('/login?registered=true'); // Redirect to login with success message
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div style={container}>
        <div style={loadingStyle}>
          <div style={spinnerStyle}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show if authenticated - handled by ProtectedRoute
  // if (isAuthenticated) return null;

  const passwordStrength = getPasswordStrength();

  return (
    <div style={container}>
      <div style={headerStyle}>
        <h2 style={{ marginBottom: '0.5rem' }}>Create Account</h2>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Join our community and start discussing today
        </p>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        {/* Name Field */}
        <div style={inputGroup}>
          <label htmlFor="name" style={labelStyle}>Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            style={input}
            disabled={submitting}
          />
        </div>

        {/* Email Field */}
        <div style={inputGroup}>
          <label htmlFor="email" style={labelStyle}>Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            style={input}
            disabled={submitting}
          />
        </div>

        {/* Password Field */}
        <div style={inputGroup}>
          <label htmlFor="password" style={labelStyle}>Password</label>
          <input
            id="password"
            name="password"
            type={showPwd ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            required
            style={input}
            disabled={submitting}
          />

          {/* Password Strength Indicator */}
          {formData.password && (
            <div style={strengthContainer}>
              <div style={strengthBar}>
                <div
                  style={{
                    ...strengthFill,
                    width: `${(passwordStrength.score / 6) * 100}%`,
                    backgroundColor: passwordStrength.color
                  }}
                ></div>
              </div>
              <span style={{
                fontSize: '0.8rem',
                color: passwordStrength.color,
                fontWeight: '600'
              }}>
                {passwordStrength.strength}
              </span>
            </div>
          )}

          {/* Password Requirements */}
          <div style={requirements}>
            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.3rem' }}>
              <strong>Password must include:</strong>
            </p>
            <ul style={{
              fontSize: '0.75rem',
              color: '#666',
              margin: '0',
              paddingLeft: '1.2rem'
            }}>
              <li style={{ color: formData.password.length >= 8 ? '#10b981' : '#9ca3af' }}>
                At least 8 characters
              </li>
              <li style={{ color: /[A-Z]/.test(formData.password) ? '#10b981' : '#9ca3af' }}>
                One uppercase letter
              </li>
              <li style={{ color: /[0-9]/.test(formData.password) ? '#10b981' : '#9ca3af' }}>
                One number
              </li>
            </ul>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div style={inputGroup}>
          <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPwd ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{
              ...input,
              borderColor: formData.confirmPassword && formData.password !== formData.confirmPassword
                ? '#ef4444'
                : '#ddd'
            }}
            disabled={submitting}
          />
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <div style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '0.3rem' }}>
              Passwords do not match
            </div>
          )}
        </div>

        {/* Show Password Checkbox */}
        <label style={checkbox}>
          <input
            type="checkbox"
            checked={showPwd}
            onChange={() => setShowPwd(!showPwd)}
            disabled={submitting}
          />{' '}
          Show password
        </label>

        {/* Terms & Conditions */}
        <label style={checkbox}>
          <input
            type="checkbox"
            required
            disabled={submitting}
          />{' '}
          I agree to the{' '}
          <a href="/terms" style={linkStyle}>Terms of Service</a> and{' '}
          <a href="/privacy" style={linkStyle}>Privacy Policy</a>
        </label>

        {/* Error Message */}
        {error && (
          <div style={errorBox}>
            <span style={{ color: '#dc2626', fontWeight: '500' }}>Error:</span> {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div style={successBox}>
            <span style={{ color: '#10b981', fontWeight: '500' }}>Success!</span>
            Account created successfully. Redirecting to login...
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || success}
          style={{
            ...button,
            backgroundColor: submitting || success ? '#ccc' : '#2563eb',
            cursor: submitting || success ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? (
            <span>
              <span style={spinnerStyle}></span> Creating Account...
            </span>
          ) : success ? (
            'Account Created!'
          ) : (
            'Create Account'
          )}
        </button>

        {/* Divider */}
        <div style={divider}>
          <span style={dividerText}>Already have an account?</span>
        </div>

        {/* Login Link */}
        <div style={footer}>
          <a href="/login" style={loginLinkStyle}>
            Sign in to your account
          </a>
        </div>
      </form>
    </div>
  );
};

/* ======================
   INLINE STYLES - ENHANCED
====================== */
const container = {
  maxWidth: 480,
  margin: '2rem auto',
  padding: '2.5rem',
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '2rem',
};

const formStyle = {
  marginTop: '1rem',
};

const inputGroup = {
  marginBottom: '1.5rem',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#374151',
};

const input = {
  width: '100%',
  padding: '0.875rem',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const button = {
  width: '100%',
  padding: '0.875rem',
  border: 'none',
  borderRadius: '6px',
  color: 'white',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '0.5rem',
  transition: 'background-color 0.2s',
};

const checkbox = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.85rem',
  marginBottom: '1rem',
  color: '#4b5563',
};

const errorBox = {
  backgroundColor: '#fef2f2',
  color: '#dc2626',
  fontSize: '0.9rem',
  padding: '0.875rem',
  borderRadius: '6px',
  marginBottom: '1rem',
  border: '1px solid #fecaca',
};

const successBox = {
  backgroundColor: '#f0fdf4',
  color: '#065f46',
  fontSize: '0.9rem',
  padding: '0.875rem',
  borderRadius: '6px',
  marginBottom: '1rem',
  border: '1px solid #a7f3d0',
};

const footer = {
  marginTop: '1.5rem',
  textAlign: 'center',
};

const linkStyle = {
  color: '#2563eb',
  textDecoration: 'none',
  fontWeight: '500',
};

const loginLinkStyle = {
  ...linkStyle,
  fontSize: '0.9rem',
  display: 'inline-block',
  padding: '0.5rem 1rem',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  transition: 'all 0.2s',
};

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem',
  color: '#666',
};

const spinnerStyle = {
  display: 'inline-block',
  width: '14px',
  height: '14px',
  border: '2px solid rgba(255,255,255,.3)',
  borderRadius: '50%',
  borderTopColor: '#fff',
  animation: 'spin 1s ease-in-out infinite',
  marginRight: '0.5rem',
};

const strengthContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginTop: '0.5rem',
};

const strengthBar = {
  flex: 1,
  height: '4px',
  backgroundColor: '#e5e7eb',
  borderRadius: '2px',
  overflow: 'hidden',
};

const strengthFill = {
  height: '100%',
  borderRadius: '2px',
  transition: 'width 0.3s ease',
};

const requirements = {
  marginTop: '0.75rem',
  padding: '0.75rem',
  backgroundColor: '#f9fafb',
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
};

const divider = {
  display: 'flex',
  alignItems: 'center',
  margin: '1.5rem 0',
};

const dividerText = {
  padding: '0 1rem',
  fontSize: '0.85rem',
  color: '#6b7280',
  backgroundColor: '#fff',
};

// Add spinner animation
const styles = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// =====================================================
// FINAL IMPLEMENTATION - WRAP WITH PROTECTEDROUTE
// =====================================================
const RegisterPageWithProtection = () => {
  return (
    <ProtectedRoute requireAuth={false}>
      <RegisterPage />
    </ProtectedRoute>
  );
};

export default RegisterPageWithProtection;

// =====================================================
// CATATAN: RegisterPage asli dikomentari karena sudah dibungkus
// dengan ProtectedRoute yang mencegah akses jika sudah login
// =====================================================
/*
export default RegisterPage;
*/
