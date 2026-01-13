import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './index.css';

/* =========================================================
   COMMON / AUTH PAGES
========================================================= */
import { LoginForm } from './pages/commonPages/Login';
import Signup from './pages/commonPages/Signup';
import { Role } from './pages/commonPages/Role';
import { RoleDefault } from './pages/commonPages/RoleDefault';
import { SetPassword } from './pages/commonPages/SetPassword';
import { ForgotPassword } from './pages/commonPages/ForgotPassword';
import { VerifyEmailOrMobile } from './pages/commonPages/VerifyEmailOrMobile';
import { ResetPassword } from './pages/commonPages/ResetPassword';
import Unauthorized from './pages/commonPages/Unauthorized';
import BlockedUserPage from './pages/commonPages/BlockedUserPage';
import Maintenance from './pages/commonPages/Maintenance';
import ComingSoon from './pages/commonPages/ComingSoon';

/* =========================================================
   LANDING / HOME
========================================================= */
import HomePage from './pages/LandingPage/HomePage';

/* =========================================================
   GUARDS & PROVIDERS
========================================================= */
import PrivateRoute from './routes/PrivateRoute';
import DashboardGuard from './routes/DashboardGuard';
import MaintenanceProvider from './routes/MaintenanceProvider';
import MaintenanceGuard from './routes/MaintenanceGuard';
import SocketProvider from './sockets/SocketProvider';

/* =========================================================
   INFLUENCER DASHBOARD
========================================================= */
import DashboardLayout from './components/users/deshboardLayout/DashboardLayout';
import DashboardPage from './pages/influencer/dashboard/DashboardPage';

import { BrowseCampaign } from './components/users/BrowseCampaign';
import AppliedLayout from './components/users/browseCampaignLayout/AppliedLayout';
import SavedLayout from './components/users/browseCampaignLayout/SavedLayout';
import DescriptionLayout from './components/users/browseCampaignLayout/DescriptionLayout';
import EditLayout from './components/users/browseCampaignLayout/EditLayout';
import ApplyNow from './components/users/browseCampaignLayout/ApplyNow';

import CampaignsLayout from './components/users/MyCampaignsLayout/CampaignsLayout';
import Details from './components/users/MyCampaignsLayout/Details';

import Payment from './components/users/payment/PaymentLayout';
import Analytics from './components/users/analytics/AnalyticsLayout';

import ChatAppPage from './components/chatApp/ChatAppPage';
import InfluencerMessagePage from './components/influencerChat/ConversationPage';

import Profile from './components/users/EditProfile/Profile';
import EditProfile from './components/users/EditProfile/editProfile';
import Settings from './components/users/Settings/SettingLayout';

import FeedbacksPage from "./components/users/InfluencerDashboardHome/FeedbacksPage";
import { ProfileStepper } from "./pages/influencer/influencerProfileCreation/ProfileStepper";

/* =========================================================
   VENDOR DASHBOARD
========================================================= */
import VenderDashboardLayout from './pages/vendor/dashboard/VenderDashboardLayout';
import VenderDashboardPage from './pages/vendor/dashboard/VenderDashboardPage';

import BrowseInfluencerPage from './components/users/browseInfluencers/BrowseInfluencersLayout';
import FavoritesLayout from './components/users/browseInfluencers/FavoritesLayout'; 

import CreateCampaign from './pages/vendor/dashboard/CreateCampaign';
import CampaignWizard from './pages/vendor/dashboard/CampaignWizard';

import VendorCampaign from './components/users/vendorCampaign/VendorCampaignsLayout';
import CampaignDetails from './components/users/vendorCampaign/CampaignDetails';

import ChatAppPageVendor from './components/chatAppVendor/ChatAppPageVendor';
import VendorConversationPage from './components/vendorChat/VendorConversationPage';

import BrandAnalyticsDashboard from './components/vendor/analytics/BrandAnalyticsDashboard';
import EditVendorProfile from './components/users/EditProfile/EditVendorProfile';
import VendorMyProfile from './pages/vendor/dashboard/VendorMyProfile';

import InfluencerProfile from './components/vendor/offers/InfluencerProfile';
import { VendorProfileStepper } from './pages/vendor/venderProfileCreation/VendorProfileStepper';

/* =========================================================
   ADMIN DASHBOARD
========================================================= */
import AdminDashboardLayout from './components/admin/dashboard/AdminDashboardLayout';
import DashboardHomePage from './components/admin/pages/DashboardHomePage';
import InfluencersRequests from './components/admin/pages/InfluencersRequests';
import InfluencerDetailView from './components/admin/pages/InfluencerDetailView';
import CampaignRequests from './components/admin/pages/CampaignRequests';
import CampaignDetailsView from './components/admin/pages/CampaignDetailsView';
import AdminContentLinks from './components/admin/pages/AdminContentLinks';
import AdminImproperMsg from './components/admin/pages/AdminImproperMsg';
import AdminMessagePage from './components/admin/adminChat/AdminConversationPage';
import { AdminShippment } from './components/admin/pages/AdminShippment';

/* =========================================================
   Chat Module
========================================================= */
import ChatAppPageUser from './components/ChatAppPageUser/ChatAppPageUser';

/* =========================================================
   APP COMPONENT
========================================================= */
const App = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  axios.defaults.baseURL = BASE_URL;

  return (
    <Router>
      <MaintenanceProvider>
        <MaintenanceGuard>

          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{ top: '80px' }}
          />

          <SocketProvider>
            <Routes>

              {/* ================= PUBLIC ROUTES ================= */}
              <Route path='/' element={<HomePage />} />
              <Route path='/login' element={<LoginForm />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/role' element={<Role />} />
              <Route path='/roledefault' element={<RoleDefault />} />
              <Route path='/setPassword' element={<SetPassword />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/verify-email-or-mobile' element={<VerifyEmailOrMobile />} />
              <Route path='/reset-password' element={<ResetPassword />} />
              <Route path='/unauthorized' element={<Unauthorized />} />
              <Route path='/User' element={<BlockedUserPage />} />
              <Route path='/maintenance' element={<Maintenance />} />


              {/* ================= INFLUENCER (ROLE 1) ================= */}
              <Route element={<PrivateRoute allowedRoles={[1]} />}>
                <Route element={<DashboardGuard />}>
                  <Route path='/dashboard' element={<DashboardLayout />}>
                    <Route path='' element={<DashboardPage />} />
                    <Route path='browse' element={<BrowseCampaign />} />
                    <Route path='browse/applied' element={<AppliedLayout />} />
                    <Route path='browse/saved' element={<SavedLayout />} />
                    <Route path='browse/description/:campaignId' element={<DescriptionLayout />} />
                    <Route path='browse/applied-campaign-details/:campaignId' element={<EditLayout />} />
                    <Route path='browse/apply-now/:campaignId' element={<ApplyNow />} />
                    <Route path='my-contract' element={<CampaignsLayout />} />
                    <Route path='my-contract/details/:campaignId' element={<Details />} />
                    <Route path='payment' element={<Payment />} />
                    <Route path='analytics' element={<Analytics />} />
                    {/* <Route path='messages' element={<ChatAppPage />} /> */}
                    <Route path="messages" element={<ChatAppPageUser />} />
                    <Route path='messagepage' element={<InfluencerMessagePage />} />
                    <Route path='my-profile' element={<Profile />} />
                    <Route path='editProfile' element={<EditProfile />} />
                    <Route path='setting' element={<Settings />} />
                    <Route path='feedbacks' element={<FeedbacksPage />} />
                    <Route path='referrals' element={<ComingSoon />} />
                  </Route>
                </Route>
                <Route path='/dashboard/browse' element={<BrowseCampaign />} />
                <Route path='/complate-profile' element={<ProfileStepper />} />
              </Route>

              {/* ================= VENDOR (ROLE 2) ================= */}
              <Route element={<PrivateRoute allowedRoles={[2]} />}>
                <Route element={<DashboardGuard />}>
                  <Route path='/vendor-dashboard' element={<VenderDashboardLayout />}>
                    <Route path='' element={<VenderDashboardPage />} />
                    <Route path='browse-influencers' element={<BrowseInfluencerPage />} />
                    <Route path='browse-influencers/favorites' element={<FavoritesLayout />} />
                    {/* <Route path='browse-influencers/invited' element={<Invited />} /> */}
                    <Route path='browse-influencers/influencer-details/:userId' element={<InfluencerProfile />} />
                    <Route path='vendor-campaign/my-campaigns' element={<CreateCampaign />} />
                    <Route path='vendor-campaign/create-campaign' element={<CampaignWizard />} />
                    <Route path='vendor-campaign/edit-campaign/:campaignId' element={<CampaignWizard />} />
                    <Route path='vendor-campaign' element={<VendorCampaign />} />
                    <Route path='vendor-campaign/campaignDetails/:campaignId' element={<CampaignDetails />} />
                    {/* <Route path='messages' element={<ChatAppPageVendor />} /> */}
                     <Route path="messages" element={<ChatAppPageUser />} />
                    <Route path='vendorMessagepage' element={<VendorConversationPage />} />
                    <Route path='analytics' element={<BrandAnalyticsDashboard />} />
                    <Route path='edit-profile' element={<EditVendorProfile />} />
                    <Route path='my-profile' element={<VendorMyProfile />} />
                    <Route path='payment' element={<ComingSoon />} />
                    <Route path='setting' element={<Settings />} />
                  </Route>
                </Route>
                <Route path='/complate-vendor-profile' element={<VendorProfileStepper />} />
              </Route>

              {/* ================= ADMIN (ROLE 4) ================= */}
              <Route element={<PrivateRoute allowedRoles={[4]} />}>
                <Route path='/admin-dashboard' element={<AdminDashboardLayout />}>
                  <Route path='' element={<DashboardHomePage />} />
                  <Route path='influencers' element={<InfluencersRequests />} />
                  <Route path='influencers/details/:userId' element={<InfluencerDetailView />} />
                  <Route path='campaigns' element={<CampaignRequests />} />
                  <Route path='campaigns/details/:campaignId' element={<CampaignDetailsView />} />
                  <Route path='analytics' element={<AdminContentLinks />} />
                  <Route path='shippment' element={<AdminShippment />}/>
                  <Route path='improper-massages' element={<AdminImproperMsg />} />
                  <Route path='support' element={<AdminMessagePage />} />
                  <Route path='settings' element={<ComingSoon />} />
                </Route>
              </Route>
            </Routes>
          </SocketProvider>
        </MaintenanceGuard>
      </MaintenanceProvider>
    </Router>
  );
};

export default App;
