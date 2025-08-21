import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css'; // ✅ this imports tailwind styles


import { Signup } from './pages/commonPages/Signup';
import { LoginForm } from './pages/commonPages/Login';
import { Home } from './components/common/Home';
import { Role } from './pages/commonPages/Role';
import { ForgotPassword } from './pages/commonPages/ForgotPassword';
import { VerifyEmailOrMobile } from './pages/commonPages/VerifyEmailOrMobile'
import { ResetPassword } from './pages/commonPages/ResetPassword';
// import { ProfileStepper } from "./pages/influencer/influencerProfileCreation/ProfileStepper"
import { BrowseCampaign } from './components/users/browseCampaign';
import DashboardLayout from './components/users/deshboardLayout/DashboardLayout';
import AppliedLayout from './components/users/browseCampaignLayout/AppliedLayout';
import SavedLayout from './components/users/browseCampaignLayout/SavedLayout';
import DescriptionLayout from './components/users/browseCampaignLayout/DescriptionLayout';
import CampaignsLayout from './components/users/MyCampaignsLayout/CampaignsLayout';
import Payment from './components/users/payment/PaymentLayout';
import Analytics from './components/users/analytics/AnalyticsLayout';
import Details from './components/users/MyCampaignsLayout/Details';
import Activity from './components/users/MyCampaignsLayout/Activity';
import Message from './components/users/MyCampaignsLayout/Message';
import FilesMedia from './components/users/MyCampaignsLayout/FilesMedia';
import EditLayout from './components/users/browseCampaignLayout/EditLayout';
import ApplyNow from './components/users/browseCampaignLayout/ApplyNow';
import { ProfileStepper } from "./pages/influencer/influencerProfileCreation/ProfileStepper"
import CreateCampaign from "./pages/vendor/dashboard/CreateCampaign"
import CampaignWizard from './pages/vendor/dashboard/CampaignWizard';
import VenderDashboardLayout from './pages/vendor/dashboard/VenderDashboardLayout';
import { VendorProfileStepper } from './pages/vendor/venderProfileCreation/VendorProfileStepper';
import DashboardPage from './pages/influencer/dashboard/DashboardPage';
import VenderDashboardPage from './pages/vendor/dashboard/VenderDashboardPage';
import BrowseInfluencerPage from './pages/vendor/dashboard/BrowseInfluencerPage';


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
                                {/* Influencer Dashboard*/}
                                <Route path='/dashboard' element={<DashboardLayout />}>

                                        <Route path='' element={<DashboardPage />} />
                                        <Route path='browse' element={<BrowseCampaign />} />
                                        <Route path='browse/applied' element={<AppliedLayout />} />
                                        <Route path='browse/saved' element={<SavedLayout />} />
                                        <Route path='browse/description' element={<DescriptionLayout />} />

                                        <Route path='browse/edit' element={<EditLayout />} />
                                        <Route path='browse/apply-now' element={<ApplyNow />} />
                                        
                                        <Route path='my-campaigns' element={<CampaignsLayout />} />
                                        <Route path='my-campaigns/details' element={<Details />} />
                                        <Route path='my-campaigns/activity' element={<Activity />} />
                                        <Route path='my-campaigns/message' element={<Message />} />
                                        <Route path='my-campaigns/filesmedia' element={<FilesMedia />} />

                                        <Route path='payment' element={<Payment />} />

                                        <Route path='analytics' element={<Analytics/>} />

                                </Route>


                                {/* Vendor Deshboard */}
                                <Route path='/vendor-dashboard' element={<VenderDashboardLayout />}>
                                        <Route path='' element={<VenderDashboardPage />} />
                                        <Route path='browse-influencers' element={<BrowseInfluencerPage />} />
                                        <Route path='my-campaigns' element={<CreateCampaign />} />
                                        <Route path='my-campaigns/create-campaign' element={<CampaignWizard />} />
                                </Route>

                                <Route path='/dashboard/browse' element={<BrowseCampaign />} />
                                <Route path='/complate-profile' element={<ProfileStepper />} />
                                <Route path='/complate-vendor-profile' element={<VendorProfileStepper />} />
                        </Routes>
                </Router>
        );
};

export default App;
