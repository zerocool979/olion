import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/base';
import Navbar from '../components/Navbar';

/**
 * =====================================================
 * DashboardPage
 * -----------------------------------------------------
 * - Halaman utama setelah login
 * - Aman terhadap auth & fetch race condition
 * =====================================================
 */

const DashboardPage = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        if (isMounted) {
          setStats(res.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Gagal memuat dashboard');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        {error}
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: '2rem' }}>
        <h1>Dashboard</h1>

        <p>
          Selamat datang, <strong>{user?.email}</strong>
        </p>

        {stats ? (
          <pre>{JSON.stringify(stats, null, 2)}</pre>
        ) : (
          <p>Tidak ada data</p>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
