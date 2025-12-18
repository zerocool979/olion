import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

/**
 * =====================================================
 * Register Page
 * -----------------------------------------------------
 * - Entry registration
 * - Redirect jika sudah login
 * =====================================================
 */

const RegisterPage = () => {
  const { register, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await register({ email, password });
      // Redirect handled by effect
    } catch (error) {
      alert(error.message || 'Register gagal');
    }
  };

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
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
          />
        </div>

        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
