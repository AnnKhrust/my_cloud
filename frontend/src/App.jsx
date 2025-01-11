import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import RegisterForm from './Components/Registration';
import LoginForm from './Components/Login';
import PrivateRoute from './routes/PrivateRoute';

const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute isAdmin>
            <AdminPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/files"
        element={
          <PrivateRoute>
            <FileManager />
          </PrivateRoute>
        }
      />
    </Routes>
  </Router>
  );
};

export default App;

