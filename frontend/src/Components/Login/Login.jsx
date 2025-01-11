import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../actions'
import styles from './Login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://your-api-url/login', {
        username,
        password,
      });

      if (response.status === 200) {
        const userInfo = response.data.user;

        dispatch(setCurrentUser(userInfo));

        if (userInfo.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      }
    } catch (error) {
      setErrorMessage('Неверный логин или пароль.');
    }
  };

  return (
    <form className={styles['login']} onSubmit={handleSubmit}>
      <label htmlFor="username">Логин:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="password">Пароль:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {errorMessage && <p>{errorMessage}</p>}

      <button type="submit">Войти</button>
    </form>
  );
};

export default Login;