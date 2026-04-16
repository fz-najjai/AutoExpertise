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
import ClientLayout from './layouts/ClientLayout';
import ClientOverview from './pages/dashboard/client/Overview';
import ExpertSearch from './pages/dashboard/client/ExpertSearch';
import ExpertProfile from './pages/dashboard/client/ExpertProfile';
import BookingTunnel from './pages/dashboard/client/BookingTunnel';
import BookingHistory from './pages/dashboard/client/BookingHistory';
import ManageReservation from './pages/dashboard/client/ManageReservation';
import BookingConfirmation from './pages/dashboard/client/BookingConfirmation';
import ClientProfile from './pages/dashboard/client/ClientProfile';

import AdminLayout from './layouts/AdminLayout';
import AdminOverview from './pages/dashboard/admin/AdminOverview';
import AdminExperts from './pages/dashboard/admin/AdminExperts';
import AdminUsers from './pages/dashboard/admin/AdminUsers';

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
              <Route path="experts" element={<ExpertSearch />} />
              <Route path="experts/:id" element={<ExpertProfile />} />
              <Route path="book/:id" element={<BookingTunnel />} />
              <Route path="history" element={<BookingHistory />} />
              <Route path="appointments/:id" element={<ManageReservation />} />
              <Route path="confirmation" element={<BookingConfirmation />} />
              <Route path="profile" element={<ClientProfile />} />
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
              <Route path="profile" element={<ExpertProfileEdit />} />
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
              <Route path="experts" element={<AdminExperts />} />
              <Route path="users" element={<AdminUsers />} />
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
