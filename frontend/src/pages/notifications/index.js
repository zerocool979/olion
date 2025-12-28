import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { getNotifications } from '../../api/notification';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        if (active) setNotifications(data);
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
            'Failed to load notifications'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchNotifications();

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li key={n.id}>
              <strong>{n.title}</strong>
              <br />
              {n.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function Wrapped() {
  return (
    <ProtectedRoute>
      <NotificationsPage />
    </ProtectedRoute>
  );
}
