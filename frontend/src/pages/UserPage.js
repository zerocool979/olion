// src/pages/UserPage.js
import React, { useEffect, useState } from 'react';
import { listUsers } from '../api/user';
import UserTable from '../components/UserTable';

const UserPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    listUsers().then(setUsers);
  }, []);

  return (
    <div className="user-page">
      <h2>User Management</h2>
      <UserTable users={users} />
    </div>
  );
};

export default UserPage;
