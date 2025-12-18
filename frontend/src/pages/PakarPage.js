import { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import PakarCard from '../components/PakarCard';
import { getPakars } from '../api/pakar';

/**
 * =====================================================
 * Pakar Page
 * -----------------------------------------------------
 * Menampilkan daftar pakar
 * =====================================================
 */

const PakarPage = () => {
  const [pakars, setPakars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPakars = async () => {
      try {
        const data = await getPakars();
        if (isMounted) {
          setPakars(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              'Failed to load pakars'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPakars();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p>Loading pakars...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Pakar</h1>

      {pakars.length === 0 ? (
        <p>No pakars found.</p>
      ) : (
        pakars.map((pakar) => (
          <PakarCard
            key={pakar.id}
            pakar={pakar}
          />
        ))
      )}
    </div>
  );
};

const WrappedPakarPage = () => (
  <ProtectedRoute>
    <PakarPage />
  </ProtectedRoute>
);

export default WrappedPakarPage;
