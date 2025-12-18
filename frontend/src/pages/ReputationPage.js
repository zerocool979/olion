import { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { getReputation } from '../api/reputation';
import ReputationCard from '../components/ReputationCard';

/**
 * =====================================================
 * Reputation Page
 * -----------------------------------------------------
 * Menampilkan reputasi user
 * =====================================================
 */

const ReputationPage = () => {
  const [reputation, setReputation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchReputation = async () => {
      try {
        const data = await getReputation();
        if (isMounted) {
          setReputation(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              'Failed to load reputation'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReputation();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p>Loading reputation...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!reputation) {
    return <p>No reputation data.</p>;
  }

  return (
    <div>
      <h1>Reputation</h1>
      <ReputationCard reputation={reputation} />
    </div>
  );
};

const WrappedReputationPage = () => (
  <ProtectedRoute>
    <ReputationPage />
  </ProtectedRoute>
);

export default WrappedReputationPage;
