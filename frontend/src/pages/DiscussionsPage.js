import { useEffect, useState } from 'react';
import { getDiscussions } from '../api/discussion';
import ProtectedRoute from '../components/ProtectedRoute';
import DiscussionCard from '../components/DiscussionCard';

/**
 * =====================================================
 * Discussions Page
 * -----------------------------------------------------
 * Menampilkan daftar diskusi
 * =====================================================
 */

const DiscussionsPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDiscussions = async () => {
      try {
        const data = await getDiscussions();
        if (isMounted) {
          setDiscussions(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              'Failed to load discussions'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDiscussions();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p>Loading discussions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Discussions</h1>

      {discussions.length === 0 ? (
        <p>No discussions found.</p>
      ) : (
        discussions.map((discussion) => (
          <DiscussionCard
            key={discussion.id}
            discussion={discussion}
          />
        ))
      )}
    </div>
  );
};

const WrappedDiscussionsPage = () => (
  <ProtectedRoute>
    <DiscussionsPage />
  </ProtectedRoute>
);

export default WrappedDiscussionsPage;
