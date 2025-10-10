
// import DashboardHomePage from '../admin/pages/DashboardHomePage';

// export const Home = () => {

//   return (
//    <DashboardHomePage/>
//   );
// } 


import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return null; // Don't render anything
};
