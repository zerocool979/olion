import { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { getNotifications } from '../api/notification';

/**
 * =====================================================
 * Notifications Page
 * -----------------------------------------------------
 * Menampilkan notifikasi user
 * =====================================================
 */

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        if (isMounted) {
          setNotifications(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              'Failed to load notifications'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li key={notif.id}>
              {notif.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const WrappedNotificationsPage = () => (
  <ProtectedRoute>
    <NotificationsPage />
  </ProtectedRoute>
);

export default WrappedNotificationsPage;
