import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home'
import RegisterForm from './Components/Registration';
import Login from './Components/Login';
import PrivateRoute from './routes/PrivatRoutes';
import AdminPage from './Components/AdminPage';
import FileManager from './Components/FileManager';

const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<Login />} />
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

