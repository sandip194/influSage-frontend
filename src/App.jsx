import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './index.css'; // ✅ this imports tailwind styles


import { Signup } from './pages/commonPages/Signup';
import { LoginForm } from './pages/commonPages/Login';
import { Home } from './components/common/Home';
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
import BrowseInfluencerPage from './pages/vendor/dashboard/BrowseInfluencerPage';
import ChatAppPage from './components/chatApp/ChatAppPage';
import Profile from './components/users/EditProfile/Profile';
import EditProfile from './components/users/EditProfile/editProfile';
import Settings from './components/users/Settings/SettingLayout';
import Unauthorized from './pages/commonPages/Unauthorized';
import PrivateRoute from './routes/PrivateRoute';
import VendorCampaign from './components/users/vendorCampaign/VendorCampaignsLayout';
import CampaignDetails from './components/users/vendorCampaign/CampaignDetails';
import VendorActivity from './components/users/vendorCampaign/VendorActivity';
import VendorMessage from './components/users/vendorCampaign/VendorMessage';
import VendorFilesMedia from './components/users/vendorCampaign/VendorFilesMedia';
import VendorPayment from './components/users/vendorCampaign/VendorPayment';
import OffersLayout from './components/vendor/offers/OffersLayout';
import ViewAllOffers from './components/vendor/offers/ViewAllOffers';

const App = () => {

        const BASE_URL = import.meta.env.VITE_API_BASE_URL ;
        axios.defaults.baseURL = BASE_URL
        return (
                <Router>
                        {/* <h1 className="text-3xl font-bold text-green-500">Tailwind is Working ✅</h1> */}
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
                        />
                        <Routes>
                                <Route path='/' element={<Home />} />
                                <Route path='/signup' element={<Signup />} />
                                <Route path='/role' element={<Role />} />
                                <Route path='/roledefault' element={<RoleDefault />} />
                                <Route path='/setPassword' element={<SetPassword />} />
                                <Route path='/login' element={<LoginForm />} />
                                <Route path='/forgot-password' element={<ForgotPassword />} />
                                <Route path='/verify-email-or-mobile' element={<VerifyEmailOrMobile />} />
                                <Route path='/reset-password' element={<ResetPassword />} />
                                <Route path='/unauthorized' element={<Unauthorized />} />




                                {/* Influencer Dashboard*/}
                                <Route element={<PrivateRoute allowedRoles={[1]} />}>
                                        <Route path='/dashboard' element={<DashboardLayout />}>

                                                <Route path='' element={<DashboardPage />} />
                                                <Route path='browse' element={<BrowseCampaign />} />
                                                <Route path='browse/applied' element={<AppliedLayout />} />
                                                <Route path='browse/saved' element={<SavedLayout />} />
                                                <Route path='browse/description/:campaignId' element={<DescriptionLayout />} />

                                                <Route path='browse/applied-campaign-details/:campaignId' element={<EditLayout />} />
                                                <Route path='browse/apply-now/:campaignId' element={<ApplyNow />} />

                                                <Route path='my-campaigns' element={<CampaignsLayout />} />
                                                <Route path='my-campaigns/details' element={<Details />} />

                                                <Route path='my-campaigns/activity' element={<Activity />} />
                                                <Route path='my-campaigns/message' element={<Message />} />
                                                <Route path='my-campaigns/filesmedia' element={<FilesMedia />} />

                                                <Route path='payment' element={<Payment />} />

                                                <Route path='analytics' element={<Analytics />} />

                                                <Route path='messages' element={<ChatAppPage />} />

                                                <Route path='profile' element={<Profile />} />

                                                <Route path='editProfile' element={<EditProfile />} />

                                                <Route path='setting' element={<Settings />} />

                                        </Route>

                                        <Route path='/dashboard/browse' element={<BrowseCampaign />} />
                                        <Route path='/complate-profile' element={<ProfileStepper />} />
                                </Route>


                                {/* Vendor Deshboard */}
                                <Route element={<PrivateRoute allowedRoles={[2]} />}>
                                        <Route path='/vendor-dashboard' element={<VenderDashboardLayout />}>
                                                <Route path='' element={<VenderDashboardPage />} />
                                                <Route path='browse-influencers' element={<BrowseInfluencerPage />} />
                                                <Route path='vendor-campaign/my-campaigns' element={<CreateCampaign />} />
                                                <Route path='vendor-campaign/create-campaign' element={<CampaignWizard />} />
                                                <Route path='vendor-campaign' element={ <VendorCampaign/>} />
                                                <Route path='vendor-campaign/campaignDetails/' element={<CampaignDetails />} />
                                                <Route path='vendor-campaign/vendoractivity/' element={<VendorActivity />} />
                                                <Route path='vendor-campaign/vendorMessage/' element={<VendorMessage />} />
                                                <Route path='vendor-campaign/vendorFilesMedia/' element={<VendorFilesMedia />} />
                                                <Route path='vendor-campaign/payment/' element={<VendorPayment />} />
                                                <Route path='messages' element={<ChatAppPage />} />


                                                <Route path='offers' element={<OffersLayout/>}/>
                                                <Route path='offers/view-all-offers' element={<ViewAllOffers/>}/>
                                        </Route>
                                        <Route path='/complate-vendor-profile' element={<VendorProfileStepper />} />
                                </Route>

                        </Routes>
                </Router>
        );
};

export default App;
