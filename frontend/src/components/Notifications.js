import React, { useEffect, useState } from 'react';
import { getNotifications } from '../api/notification';
// import socket from '../socket'; 
// ⚠️ socket belum jelas implementasinya → NONAKTIFKAN
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetch = async () => {
      const data = await getNotifications();
      setNotifications(data);
    };

    fetch();

    // ❌ BELUM ADA BACKEND SOCKET
    // socket.on('notification', (data) => {
    //   setNotifications((prev) => [data, ...prev]);
    // });

    // return () => socket.off('notification');
  }, [user]);

  if (!user) {
    return <p>Login untuk melihat notifikasi</p>;
  }

  return (
    <div className="notifications">
      <h3>Notifications</h3>

      {notifications.length === 0 && (
        <p>Tidak ada notifikasi</p>
      )}

      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            <strong>{n.title}</strong>
            <br />
            <span>{n.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
