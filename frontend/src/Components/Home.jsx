import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Добро пожаловать</h1>
      <p>Храните файлы удобно</p>
      <Link to="/register">Зарегистрироваться</Link>
      <br />
      <Link to="/login">Войти</Link>
    </div>
  );
};

export default Home;