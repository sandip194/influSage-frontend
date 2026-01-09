import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './index.css'; // ✅ this imports tailwind styles


import { LoginForm } from './pages/commonPages/Login';
import Signup from './pages/commonPages/Signup'
import { Role } from './pages/commonPages/Role';
import { RoleDefault } from './pages/commonPages/RoleDefault';
import { SetPassword } from './pages/commonPages/SetPassword';
import { ForgotPassword } from './pages/commonPages/ForgotPassword';
import { VerifyEmailOrMobile } from './pages/commonPages/VerifyEmailOrMobile'
import { ResetPassword } from './pages/commonPages/ResetPassword';
// import { ProfileStepper } from "./pages/influencer/influencerProfileCreation/ProfileStepper"
import { BrowseCampaign } from './components/users/BrowseCampaign';
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
import CreateCampaign from './pages/vendor/dashboard/CreateCampaign'
import CampaignWizard from './pages/vendor/dashboard/CampaignWizard';
import VenderDashboardLayout from './pages/vendor/dashboard/VenderDashboardLayout';
import { VendorProfileStepper } from './pages/vendor/venderProfileCreation/VendorProfileStepper';
import DashboardPage from './pages/influencer/dashboard/DashboardPage';
import VenderDashboardPage from './pages/vendor/dashboard/VenderDashboardPage';
import BrowseInfluencerPage from './components/users/browseInfluencers/BrowseInfluencersLayout';
import FavoritesLayout from './components/users/browseInfluencers/FavoritesLayout';
import Invited from './components/users/browseInfluencers/Invited';
import ChatAppPage from './components/chatApp/ChatAppPage';
import ChatAppPageVendor from './components/chatAppVendor/ChatAppPageVendor';
import Profile from './components/users/EditProfile/Profile';
import EditProfile from './components/users/EditProfile/editProfile';
import Settings from './components/users/Settings/SettingLayout';
import Unauthorized from './pages/commonPages/Unauthorized';
import PrivateRoute from './routes/PrivateRoute';
import VendorCampaign from './components/users/vendorCampaign/VendorCampaignsLayout';
import CampaignDetails from './components/users/vendorCampaign/CampaignDetails';
import OffersLayout from './components/vendor/offers/OffersLayout';
import ViewAllOffers from './components/vendor/offers/ViewAllOffers';
import OfferDetails from './components/vendor/offers/OfferDetails';
import InfluencerProfile from './components/vendor/offers/InfluencerProfile';
import EditVendorProfile from './components/users/EditProfile/EditVendorProfile';
import SocketProvider from './sockets/SocketProvider';
import VendorMyProfile from './pages/vendor/dashboard/VendorMyProfile';
import DashboardHomePage from './components/admin/pages/DashboardHomePage';
import AdminDashboardLayout from './components/admin/dashboard/AdminDashboardLayout';
import InfluencersRequests from './components/admin/pages/InfluencersRequests';
import CampaignRequests from './components/admin/pages/CampaignRequests';
import DashboardGuard from './routes/DashboardGuard';
import InfluencerDetailView from './components/admin/pages/InfluencerDetailView';
import HomePage from './pages/LandingPage/HomePage';
import CampaignDetailsView from './components/admin/pages/CampaignDetailsView';
import BlockedUserPage from './pages/commonPages/BlockedUserPage';
// import MessagePage from './components/adminChat/ConversationPage';
import ComingSoon from './pages/commonPages/ComingSoon';
import InfluencerMessagePage from './components/influencerChat/ConversationPage';
import AdminMessagePage from './components/admin/adminChat/AdminConversationPage';
import VendorConversationPage from './components/vendorChat/VendorConversationPage';
import BrandAnalyticsDashboard from './components/vendor/analytics/BrandAnalyticsDashboard';
import AdminContentLinks from './components/admin/pages/AdminContentLinks';
import FeedbacksPage from "./components/users/InfluencerDashboardHome/FeedbacksPage";
import Maintenance from './pages/commonPages/Maintenance';


import MaintenanceProvider from './routes/MaintenanceProvider';
import MaintenanceGuard from './routes/MaintenanceGuard';
import AdminImproperMsg from './components/admin/pages/AdminImproperMsg';


const App = () => {

        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        axios.defaults.baseURL = BASE_URL
        return (
                <Router>

                        <MaintenanceProvider>
                                <MaintenanceGuard>


                                        {/* <h1 className="text-3xl font-bold text-green-500">Tailwind is Working ✅</h1> */}
                                        <ToastContainer
                                                position="top-right"  // Keep as is, or change to "top-center" for centering
                                                autoClose={4000}
                                                hideProgressBar={false}
                                                newestOnTop={false}
                                                closeOnClick
                                                pauseOnFocusLoss
                                                draggable
                                                pauseOnHover
                                                theme="light"
                                                style={{ top: '80px' }}  // ✅ Add this: Moves the toast container 60px down from the top (adjust as needed, e.g., 40px or 80px)
                                        />

                                        <SocketProvider>


                                                <Routes>
                                                        <Route path='/' element={<HomePage />} />

                                                        <Route path="/maintenance" element={<Maintenance />} />


                                                        <Route path='/signup' element={<Signup />} />
                                                        <Route path='/role' element={<Role />} />
                                                        <Route path='/roledefault' element={<RoleDefault />} />
                                                        <Route path='/setPassword' element={<SetPassword />} />
                                                        <Route path='/login' element={<LoginForm />} />
                                                        <Route path='/forgot-password' element={<ForgotPassword />} />
                                                        <Route path='/verify-email-or-mobile' element={<VerifyEmailOrMobile />} />
                                                        <Route path='/reset-password' element={<ResetPassword />} />
                                                        <Route path='/unauthorized' element={<Unauthorized />} />
                                                        <Route path='/User' element={<BlockedUserPage />} />



                                                        {/* Influencer Dashboard*/}
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

                                                                                {/* <Route path='my-campaigns/activity' element={<Activity />} />
                                                                                <Route path='my-campaigns/message' element={<Message />} />
                                                                                <Route path='my-campaigns/filesmedia' element={<FilesMedia />} /> */}

                                                                                <Route path='payment' element={<ComingSoon />} />

                                                                                <Route path='analytics' element={<Analytics />} />

                                                                                <Route path='messages' element={<ChatAppPage />} />

                                                                                <Route path='my-profile' element={<Profile />} />

                                                                                <Route path='editProfile' element={<EditProfile />} />

                                                                                <Route path='setting' element={<Settings />} />

                                                                                <Route path='messagepage' element={<InfluencerMessagePage />} />

                                                                                <Route path="referrals" element={<ComingSoon />} />

                                                                                <Route path="feedbacks" element={<FeedbacksPage />} />

                                                                        </Route>
                                                                </Route>
                                                                <Route path='/dashboard/browse' element={<BrowseCampaign />} />
                                                                <Route path='/complate-profile' element={<ProfileStepper />} />
                                                        </Route>


                                                        {/* Vendor Deshboard */}
                                                        <Route element={<PrivateRoute allowedRoles={[2]} />}>   

                                                                <Route element={<DashboardGuard />}>
                                                                        <Route path='/vendor-dashboard' element={<VenderDashboardLayout />}>
                                                                                <Route path='' element={<VenderDashboardPage />} />
                                                                                <Route path='browse-influencers' element={<BrowseInfluencerPage />} />

                                                                                <Route path='browse-influencers/favorites' element={<FavoritesLayout />} />
                                                                                <Route path='browse-influencers/invited' element={<Invited />} />
                                                                                <Route path='browse-influencers/influencer-details/:userId' element={<InfluencerProfile />} />

                                                                                <Route path='vendor-campaign/my-campaigns' element={<CreateCampaign />} />
                                                                                <Route path='vendor-campaign/create-campaign' element={<CampaignWizard />} />
                                                                                <Route path='vendor-campaign/edit-campaign/:campaignId' element={<CampaignWizard />} />

                                                                                <Route path='vendor-campaign' element={<VendorCampaign />} />
                                                                                <Route path='vendor-campaign/campaignDetails/:campaignId' element={<CampaignDetails />} />


                                                                                <Route path='messages' element={<ChatAppPageVendor />} />

                                                                                <Route path='analytics' element={<BrandAnalyticsDashboard />} />


                                                                                {/*  -- Removed From Sidebar bcs We Replace this things in Campaign Details Page
                                                                
                                                                <Route path='applications' element={<OffersLayout />} />
                                                                <Route path='applications/view-all-offers/:id' element={<ViewAllOffers />} />
                                                                <Route path="applications/:id" element={<OfferDetails />} />
                                                                <Route path='applications/influencer-details/:userId' element={<InfluencerProfile />} />
                                                                <Route path='applications/campaignDetails/:campaignId' element={<CampaignDetails />} /> 
                                                                
                                                                */}


                                                                                <Route path='edit-profile' element={<EditVendorProfile />} />
                                                                                <Route path='my-profile' element={<VendorMyProfile />} />



                                                                                <Route path="payment" element={<ComingSoon />} />
                                                                                <Route path="setting" element={<Settings />} />


                                                                                <Route path='vendorMessagepage' element={<VendorConversationPage />} />
                                                                        </Route>
                                                                </Route>
                                                                <Route path='/complate-vendor-profile' element={<VendorProfileStepper />} />
                                                        </Route>


                                                        {/* Admin Dashboard */}
                                                        <Route element={<PrivateRoute allowedRoles={[4]} />}>
                                                                <Route path='/admin-dashboard' element={<AdminDashboardLayout />}>
                                                                        <Route path='' element={<DashboardHomePage />} />
                                                                        <Route path='influencers' element={<InfluencersRequests />} />
                                                                        <Route path='influencers/details/:userId' element={<InfluencerDetailView />} />
                                                                        <Route path='campaigns' element={<CampaignRequests />} />
                                                                        <Route path='campaigns/details/:campaignId' element={<CampaignDetailsView />} />
                                                                        <Route path='analytics' element={<AdminContentLinks />} />
                                                                        <Route path='improper-massages' element={<AdminImproperMsg />} />
                                                                        <Route path="settings" element={<ComingSoon />} />
                                                                        <Route path='support' element={<AdminMessagePage />} />
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
