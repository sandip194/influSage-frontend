import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Signup } from './components/common/Signup';
import { LoginForm } from './components/common/Login';
import { UserDashboard } from './components/users/UserDashboard';
import { Home } from './components/common/Home';
import './index.css'; // ✅ this imports tailwind styles
import { Role } from './components/common/Role';
import { ForgotPassword } from './components/common/ForgotPassword';
import { VerifyEmailOrMobile } from './components/common/VerifyEmailOrMobile'
import { ResetPassword } from './components/common/ResetPassword';
import { Toaster } from 'react-hot-toast';
import  {ProfileStepper} from "./components/users/complateProfile/ProfileStepper"



const App = () => {

  axios.defaults.baseURL = "http://localhost:3001"

  return (
    
    <Router>
      {/* <h1 className="text-3xl font-bold text-green-500">Tailwind is Working ✅</h1> */}
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/signup' element={<Signup />} />
        <Route path= "/role" element={<Role/>}/>
        <Route path='/login' element={<LoginForm />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/verify-email-or-mobile' element={<VerifyEmailOrMobile />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/dashboard' element={<UserDashboard/>}/>

        <Route path='/complate-profile' element={ <ProfileStepper /> }/>
      </Routes>
    </Router>
  );
};

export default App;
