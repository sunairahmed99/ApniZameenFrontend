import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './app/queryClient';
import ChatWidget from './Components/Chat/ChatWidget';

// Lazy load pages
const Homepage = lazy(() => import('./Pages/Homepage'));
const Agents = lazy(() => import('./Pages/Agents'));
const NewProjects = lazy(() => import('./Pages/NewProjects'));
const PlotFinder = lazy(() => import('./Pages/PlotFinder'));
const AreaGuide = lazy(() => import('./Pages/AreaGuide'));
const ProjectDetail = lazy(() => import('./Pages/ProjectDetail'));
const PropertyDetail = lazy(() => import('./Pages/PropertyDetail'));
const ZameenProjectDetail = lazy(() => import('./Pages/ZameenProjectDetail'));
const SearchResults = lazy(() => import('./Pages/SearchResults'));
const AgencyDetail = lazy(() => import('./Pages/AgencyDetail'));
const Blog = lazy(() => import('./Pages/Blog'));
const BlogDetail = lazy(() => import('./Pages/BlogDetail'));
const About = lazy(() => import('./Pages/About'));
const Contact = lazy(() => import('./Pages/Contact'));
const Advertise = lazy(() => import('./Pages/Advertise'));
const TermsOfUse = lazy(() => import('./Pages/TermsOfUse'));
const HelpSupport = lazy(() => import('./Pages/HelpSupport'));
const Jobs = lazy(() => import('./Pages/Jobs'));

// Admin Blog Pages
const Blogs = lazy(() => import('./Pages/Backend/Admin/Blogs/Blogs'));
const AddBlog = lazy(() => import('./Pages/Backend/Admin/Blogs/AddBlog'));
const EditBlog = lazy(() => import('./Pages/Backend/Admin/Blogs/EditBlog'));


// Admin Pages
const AdminLayout = lazy(() => import('./Components/Backend/Admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./Pages/Backend/Admin/AdminDashboard'));
const HomeBanner = lazy(() => import('./Pages/Backend/Admin/HomeBanner'));
const BrowseSections = lazy(() => import('./Pages/Backend/Admin/BrowseSections/BrowseSections'));
const Projects = lazy(() => import('./Pages/Backend/Admin/Projects/Projects'));
const AddProject = lazy(() => import('./Pages/Backend/Admin/Projects/AddProject'));
const EditProject = lazy(() => import('./Pages/Backend/Admin/Projects/EditProject'));
const Agencies = lazy(() => import('./Pages/Backend/Admin/Agencies/Agencies'));
const AdminChat = lazy(() => import('./Pages/Backend/Admin/AdminChat'));
const BannerRequests = lazy(() => import('./Pages/Backend/Admin/BannerRequests'));
const AdminPlans = lazy(() => import('./Pages/Backend/Admin/Plans/AdminPlans'));
const AdminProjectPlans = lazy(() => import('./Pages/Backend/Admin/Plans/AdminProjectPlans'));
const AdminUpgradeRequests = lazy(() => import('./Pages/Backend/Admin/Agencies/AdminUpgradeRequests'));
const AdminBannerPlans = lazy(() => import('./Pages/Backend/Admin/Plans/AdminBannerPlans'));
const AdminJobs = lazy(() => import('./Pages/Backend/Admin/Jobs/AdminJobs'));
const PropertyManagement = lazy(() => import('./Pages/Backend/Admin/PropertyManagement'));
const LocationManagement = lazy(() => import('./Pages/Backend/Admin/LocationManagement'));
const Inquiries = lazy(() => import('./Pages/Backend/Admin/Inquiries'));
const ManageDeals = lazy(() => import('./Pages/Backend/Admin/ManageDeals'));
const SubscriptionApprovals = lazy(() => import('./Pages/Backend/Admin/SubscriptionApprovals'));
const ApprovedSubscriptions = lazy(() => import('./Pages/Backend/Admin/ApprovedSubscriptions'));
const AgencyPlans = lazy(() => import('./Pages/Backend/Admin/AgencyPlans'));
const AgencyUpgradeRequests = lazy(() => import('./Pages/Backend/Admin/AgencyUpgradeRequests'));
const PendingPayments = lazy(() => import('./Pages/Backend/Admin/PendingPayments'));
const PriceListing = lazy(() => import('./Pages/Backend/Admin/PriceListing'));
const AdminPaymentPrices = lazy(() => import('./Pages/Backend/Admin/AdminPaymentPrices'));
const SiteSettings = lazy(() => import('./Pages/Backend/Admin/SiteSettings'));

// Seller Pages
const SellerLayout = lazy(() => import('./Components/Backend/Seller/SellerLayout'));
const SellerDashboard = lazy(() => import('./Pages/Backend/Seller/SellerDashboard'));
const BannerRequest = lazy(() => import('./Pages/Backend/Seller/BannerRequest'));
const AddProperty = lazy(() => import('./Pages/Backend/Seller/AddProperty'));
const MyProperties = lazy(() => import('./Pages/Backend/Seller/MyProperties'));
const SellerAgencies = lazy(() => import('./Pages/Backend/Seller/SellerAgencies'));
const SellerPackages = lazy(() => import('./Pages/Backend/Seller/SellerPackages'));
const AgencyUpgrade = lazy(() => import('./Pages/Backend/Seller/AgencyUpgrade'));
const SellerChat = lazy(() => import('./Pages/Backend/Seller/SellerChat'));
const SellerInquiries = lazy(() => import('./Pages/Backend/Seller/SellerInquiries'));
const ExpiredProperties = lazy(() => import('./Pages/Backend/Seller/ExpiredProperties'));
const SoldRentedProperties = lazy(() => import('./Pages/Backend/Seller/SoldRentedProperties'));
const SellerScoreboard = lazy(() => import('./Pages/Backend/Seller/SellerScoreboard'));
const SellerProjectRequests = lazy(() => import('./Pages/Backend/Seller/SellerProjectRequests'));
const MySubscriptions = lazy(() => import('./Pages/Backend/Seller/MySubscriptions'));
const EditProperty = lazy(() => import('./Pages/Backend/Seller/EditProperty'));

import ProtectedRoute from './Components/Auth/ProtectedRoute';
import { trackSessionVisit } from './utils/analytics';
import NetworkStatus from './Components/NetworkStatus';

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '140px', height: '100vh', fontSize: '1.2rem', color: '#3b82f6' }}>
    <div className="spinner-border text-light" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default function App() {
  useEffect(() => {
    trackSessionVisit();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: false }}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/new-projects" element={<NewProjects />} />
            <Route path="/plot-finder" element={<PlotFinder />} />
            <Route path="/area-guides" element={<AreaGuide />} />
            <Route path="/project/:slug" element={<ProjectDetail />} />
            <Route path="/property/:slug" element={<PropertyDetail />} />
            <Route path="/project-zameen/:id" element={<ZameenProjectDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/agency/:id" element={<AgencyDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/advertise" element={<Advertise />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/support" element={<HelpSupport />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/:type/:city" element={<SearchResults />} />


            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="home-banner" element={<HomeBanner />} />
              <Route path="banner-requests" element={<BannerRequests />} />
              <Route path="browse-sections" element={<BrowseSections />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/add" element={<AddProject />} />
              <Route path="projects/edit/:id" element={<EditProject />} />
              <Route path="agencies" element={<Agencies />} />
              <Route path="plans" element={<AdminPlans />} />
              <Route path="project-plans" element={<AdminProjectPlans />} />
              <Route path="banner-plans" element={<AdminBannerPlans />} />
              <Route path="properties" element={<PropertyManagement />} />
              <Route path="locations" element={<LocationManagement />} />
              <Route path="upgrade-requests" element={<AdminUpgradeRequests />} />
              <Route path="inquiries" element={<Inquiries />} />
              <Route path="deals" element={<ManageDeals />} />
              <Route path="approvals" element={<SubscriptionApprovals />} />
              <Route path="approved-deals" element={<ApprovedSubscriptions />} />
              <Route path="agency-plans" element={<AgencyPlans />} />
              <Route path="agency-upgrades" element={<AgencyUpgradeRequests />} />
              <Route path="pricelisting" element={<PriceListing />} />
              <Route path="payment-prices" element={<AdminPaymentPrices />} />
              <Route path="chat" element={<AdminChat />} />
              <Route path="pending-payments" element={<PendingPayments />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="settings" element={<SiteSettings />} />

              {/* Blog Management */}
              <Route path="blogs" element={<Blogs />} />
              <Route path="blogs/add" element={<AddBlog />} />
              <Route path="blogs/edit/:id" element={<EditBlog />} />
            </Route>

            {/* Seller Routes */}
            <Route path="/seller" element={
              <ProtectedRoute role="seller">
                <SellerLayout />
              </ProtectedRoute>
            }>
              <Route index element={<SellerDashboard />} />
              <Route path="dashboard" element={<SellerDashboard />} />
              <Route path="banner-request" element={<BannerRequest />} />
              <Route path="my-properties" element={<MyProperties />} />
              <Route path="add-property" element={<AddProperty />} />
              <Route path="agency" element={<SellerAgencies />} />
              <Route path="packages" element={<SellerPackages />} />
              <Route path="agency-upgrade" element={<AgencyUpgrade />} />
              <Route path="chat" element={<SellerChat />} />
              <Route path="inquiries" element={<SellerInquiries />} />
              <Route path="expired-properties" element={<ExpiredProperties />} />
              <Route path="sold-rented-properties" element={<SoldRentedProperties />} />
              <Route path="scoreboard" element={<SellerScoreboard />} />
              <Route path="project-requests" element={<SellerProjectRequests />} />
              <Route path="my-subscriptions" element={<MySubscriptions />} />
              <Route path="edit-property/:id" element={<EditProperty />} />
            </Route>
          </Routes>
        </Suspense>
        <ChatWidget />
        <NetworkStatus />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
