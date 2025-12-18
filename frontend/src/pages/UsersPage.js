import { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { getUsers } from '../api/user';
import UserTable from '../components/UserTable';

/**
 * =====================================================
 * Users Page (Admin)
 * -----------------------------------------------------
 * Menampilkan daftar user
 * =====================================================
 */

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        if (isMounted) {
          setUsers(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              'Failed to load users'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Users</h1>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <UserTable users={users} />
      )}
    </div>
  );
};

const WrappedUsersPage = () => (
  <ProtectedRoute>
    <UsersPage />
  </ProtectedRoute>
);

export default WrappedUsersPage;
