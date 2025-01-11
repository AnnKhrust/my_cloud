import { Link } from 'react-router-dom';
import styles from './Home.module.css'; 

const Home = () => {
  return (
    <div className={styles['home-container']}>
      <h1>Добро пожаловать</h1>
      <p>Храните файлы удобно</p>
      <Link to="/register">Зарегистрироваться</Link>
      <br />
      <Link to="/login">Войти</Link>
    </div>
  );
};

export default Home;