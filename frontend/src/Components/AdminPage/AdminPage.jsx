import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AdminPage.module.css'; 

const AdminPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get('https://your-api-url/admin/users', config);
        setUsers(response.data.users);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles['admin-page']}>
      <h1>Панель администратора</h1>
      <h2>Список пользователей</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.first_name} {user.second_name} ({user.username})</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;