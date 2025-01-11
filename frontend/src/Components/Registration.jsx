import { useState } from 'react';
import axios from 'axios'; 

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validateFields();

      const response = await axios.post('https://your-api-url/register', {
        username,
        firstName,
        secondName,
        email,
        password,
      });

      if (response.status === 201) {
        alert('Регистрация прошла успешно!');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка при регистрации');
    }
  };

  const validateFields = () => {
    let errors = {};

    if (!username.match(/^[a-zA-Z][a-zA-Z0-9]{3,19}$/)) {
      errors.username = 'Логин должен начинаться с буквы и содержать от 4 до 20 символов.';
    }

    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      errors.email = 'Неверный формат email.';
    }

    if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/)) {
      errors.password = 'Пароль должен содержать не менее 6 символов, включая одну заглавную букву, одну цифру и один специальный символ.';
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Логин:</label>
      <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      {errors.username && <span style={{ color: 'red' }}>{errors.username}</span>}

      <label htmlFor="fullname">Полное имя:</label>
      <input type="text" id="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <input type="text" id="secondname" value={firstName} onChange={(e) => setSecondName(e.target.value)} />

      <label htmlFor="email">Email:</label>
      <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}

      <label htmlFor="password">Пароль:</label>
      <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}

      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default RegisterForm;