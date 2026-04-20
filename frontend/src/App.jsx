import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ExpertLayout from './layouts/ExpertLayout';
import ExpertOverview from './pages/dashboard/expert/Overview';
import RequestsManager from './pages/dashboard/expert/RequestsManager';
import AvailabilitiesManager from './pages/dashboard/expert/AvailabilitiesManager';
import ExpertProfileEdit from './pages/dashboard/expert/ExpertProfileEdit';
import EarningsDashboard from './pages/dashboard/expert/EarningsDashboard';
import CRMList from './pages/dashboard/expert/CRMList';
import Payouts from './pages/dashboard/expert/Payouts';
import PerformanceMetrics from './pages/dashboard/expert/PerformanceMetrics';

import ClientLayout from './layouts/ClientLayout';
import ClientOverview from './pages/dashboard/client/Overview';
import ExpertSearch from './pages/dashboard/client/ExpertSearch';
import ExpertProfile from './pages/dashboard/client/ExpertProfile';
import BookingTunnel from './pages/dashboard/client/BookingTunnel';
import BookingHistory from './pages/dashboard/client/BookingHistory';
import ManageReservation from './pages/dashboard/client/ManageReservation';
import BookingConfirmation from './pages/dashboard/client/BookingConfirmation';
import ClientProfile from './pages/dashboard/client/ClientProfile';
import FavoritesPage from './pages/dashboard/client/FavoritesPage';
import ChatPage from './pages/shared/ChatPage';

import AdminLayout from './layouts/AdminLayout';
import AdminOverview from './pages/dashboard/admin/AdminOverview';
import PendingExperts from './pages/dashboard/admin/PendingExperts';
import ApprovedExperts from './pages/dashboard/admin/ApprovedExperts';
import RejectedExperts from './pages/dashboard/admin/RejectedExperts';
import AdminUsers from './pages/dashboard/admin/AdminUsers';
import AdminAnalytics from './pages/dashboard/admin/AdminAnalytics';
import AdminReports from './pages/dashboard/admin/AdminReports';
import AdminSettings from './pages/dashboard/admin/AdminSettings';

import Placeholder from './pages/shared/Placeholder';
import SupportDesk from './pages/dashboard/client/SupportDesk';
import ClientWallet from './pages/dashboard/client/ClientWallet';
import SavedSearches from './pages/dashboard/client/SavedSearches';
import NearbyExperts from './pages/dashboard/client/NearbyExperts';
import ClientArchives from './pages/dashboard/client/ClientArchives';
import ClientRecentViews from './pages/dashboard/client/ClientRecentViews';
import ClientInvoices from './pages/dashboard/client/ClientInvoices';
import ClientSecuritySettings from './pages/dashboard/client/ClientSecuritySettings';

import PerformanceStats from './pages/dashboard/expert/PerformanceStats';
import ScheduleSettings from './pages/dashboard/expert/ScheduleSettings';
import AccountSettings from './pages/dashboard/expert/AccountSettings';

import AdminLedger from './pages/dashboard/admin/AdminLedger';
import AdminTrustSafety from './pages/dashboard/admin/AdminTrustSafety';
import AdminSystemLogs from './pages/dashboard/admin/AdminSystemLogs';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white text-slate-900 italic font-medium">Chargement...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role}/dashboard`} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={`/${user.role}/dashboard`} /> : <Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ResetPassword />} />
      
      {/* Client Routes */}
      <Route path="/client/*" element={
        <ProtectedRoute allowedRoles={['client']}>
          <ClientLayout>
            <Routes>
              <Route path="dashboard" element={<ClientOverview />} />
              <Route path="experts/:id" element={<ExpertProfile />} />
              <Route path="experts" element={<ExpertSearch />} />
              <Route path="nearby" element={<NearbyExperts />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="book/new" element={<Navigate to="/client/experts" />} />
              <Route path="book/:id" element={<BookingTunnel />} />
              <Route path="history" element={<BookingHistory />} />
              <Route path="history/archives" element={<ClientArchives />} />
              <Route path="history/views" element={<ClientRecentViews />} />
              <Route path="appointments/:id" element={<ManageReservation />} />
              <Route path="confirmation" element={<BookingConfirmation />} />
              <Route path="profile" element={<ClientProfile />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="support" element={<SupportDesk />} />
              <Route path="saved-searches" element={<SavedSearches />} />
              <Route path="invoices" element={<ClientInvoices />} />
              <Route path="wallet" element={<ClientWallet />} />
              <Route path="settings/security" element={<ClientSecuritySettings />} />
              <Route path="*" element={<Navigate to="dashboard" />} />
            </Routes>
          </ClientLayout>
        </ProtectedRoute>
      } />
      
      {/* Expert Routes */}
      <Route path="/expert/*" element={
        <ProtectedRoute allowedRoles={['expert']}>
          <ExpertLayout>
            <Routes>
              <Route path="dashboard" element={<ExpertOverview />} />
              <Route path="requests" element={<RequestsManager />} />
              <Route path="availabilities" element={<AvailabilitiesManager />} />
              <Route path="crm" element={<CRMList />} />
              <Route path="earnings" element={<EarningsDashboard />} />
              <Route path="payouts" element={<Payouts />} />
              <Route path="performance/reviews" element={<PerformanceMetrics />} />
              <Route path="performance/stats" element={<PerformanceStats />} />
              <Route path="settings/schedule" element={<ScheduleSettings />} />
              <Route path="settings/account" element={<AccountSettings />} />
              <Route path="profile" element={<ExpertProfileEdit />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="*" element={<Navigate to="dashboard" />} />
            </Routes>
          </ExpertLayout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout>
            <Routes>
              <Route path="dashboard" element={<AdminOverview />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="experts/pending" element={<PendingExperts />} />
              <Route path="experts/approved" element={<ApprovedExperts />} />
              <Route path="experts/rejected" element={<RejectedExperts />} />
              <Route path="experts" element={<Navigate to="pending" />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="finance/ledger" element={<AdminLedger />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="moderation/trust" element={<AdminTrustSafety />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="system/logs" element={<AdminSystemLogs />} />
              <Route path="*" element={<Navigate to="dashboard" />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
