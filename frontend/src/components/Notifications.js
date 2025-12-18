import React, { useEffect, useState } from 'react';
import { getNotifications } from '../api/notification';
import socket from '../socket';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
  const { user } = useAuth(); // ⬅️ AMBIL USER
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return; // ⬅️ JANGAN HIT API JIKA BELUM LOGIN

    getNotifications().then(setNotifications);

    if (!socket) return;

    socket.on('notification', (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off('notification');
    };
  }, [user]);

  if (!user) {
    return <p>Login untuk melihat notifikasi</p>;
  }

  return (
    <div className="notifications">
      <h3>Notifications</h3>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            {n.title}: {n.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
