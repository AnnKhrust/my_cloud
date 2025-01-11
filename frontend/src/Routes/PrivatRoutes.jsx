import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ isAdmin }) => {
  const token = localStorage.getItem('token');

  if (!token || !isAdmin) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;