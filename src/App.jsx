import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import  {ProfileStepper} from "./components/users/complateProfile/ProfileStepper"
import { BrowseCampaign } from './components/users/browseCampaign';
import './index.css'; // ✅ this imports tailwind styles


import { UserDashboard } from './components/users/UserDashboard';
import { Signup } from './pages/commonPages/Signup';
import { LoginForm } from './pages/commonPages/Login';
import { Home } from './components/common/Home';
import { Role } from './pages/commonPages/Role';
import { ForgotPassword } from './pages/commonPages/ForgotPassword';
import { VerifyEmailOrMobile } from './pages/commonPages/VerifyEmailOrMobile'
import { ResetPassword } from './pages/commonPages/ResetPassword';
import { ProfileStepper } from "./pages/influencer/influencerProfileCreation/ProfileStepper"
import DashboardLayout from './components/users/deshboardLayout/DashboardLayout';
import CreateCampaign from "./pages/vendor/dashboard/CreateCampaign"
import CampaignWizard from './pages/vendor/dashboard/CampaignWizard';


const App = () => {

        axios.defaults.baseURL = "http://localhost:3001"
        return (

                <Router>
                        {/* <h1 className="text-3xl font-bold text-green-500">Tailwind is Working ✅</h1> */}
                        <Toaster />
                        <Routes>
                                <Route path='/' element={<Home />} />
                                <Route path='/signup' element={<Signup />} />
                                <Route path="/role" element={<Role />} />
                                <Route path='/login' element={<LoginForm />} />
                                <Route path='/forgot-password' element={<ForgotPassword />} />
                                <Route path='/verify-email-or-mobile' element={<VerifyEmailOrMobile />} />
                                <Route path='/reset-password' element={<ResetPassword />} />
                                <Route path='/dashboard' element={<DashboardLayout />}>

                                        <Route path='my-campaigns' element={<CreateCampaign />} />
                                        <Route path='my-campaigns/create-campaign' element={<CampaignWizard />} />
                                </Route>
                                <Route path='/dashboard/browse' element={<BrowseCampaign />} />
                                <Route path='/complate-profile' element={<ProfileStepper />} />


                        </Routes>
                </Router>
        );
};

export default App;
