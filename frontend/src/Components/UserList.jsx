import { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get('https://your-api-url/admin/users', config);
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleAdminStatus = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.patch(`https://your-api-url/admin/user/${userId}/toggle-admin`, {}, config);
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return {...user, is_admin: !user.is_admin};
        }
        return user;
      });
      setUsers(updatedUsers);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`https://your-api-url/admin/user/${userId}`, config);
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <div className="user-list">
      <h2>Список пользователей</h2>
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Логин</th>
            <th>Email</th>
            <th>Админ</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.first_name}</td>
              <td>{user.second_name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.is_admin ? 'Да' : 'Нет'}</td>
              <td>
                <button onClick={() => toggleAdminStatus(user.id)}>
                  {user.is_admin ? 'Отменить админа' : 'Сделать админом'}
                </button>
                <button onClick={() => deleteUser(user.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;