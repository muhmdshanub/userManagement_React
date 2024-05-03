import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminPrivateRoute = () => {
  const { adminInfo } = useSelector((state) => state.adminAuth); // Assuming your admin authentication state is stored in adminAuth slice
  return adminInfo ? <Outlet /> : <Navigate to='/admin/login' replace />;
};

export default AdminPrivateRoute;