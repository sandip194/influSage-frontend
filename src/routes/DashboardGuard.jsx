import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const DashboardGuard = () => {
  const { p_code, role } = useSelector((state) => state.auth);

  // if (p_code !== 'SUCCESS' && (Number(role) === 2)) {
  //   return <Navigate to="/complate-vendor-profile" replace />;
  // }
  if (p_code !== 'SUCCESS' && (Number(role) === 1)) {
    return <Navigate to="/complate-profile" replace />;
  }

  // else render nested routes
  return <Outlet />;
};

export default DashboardGuard;
