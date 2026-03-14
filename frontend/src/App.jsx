import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import ExpertDashboard from './pages/ExpertDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white italic">Chargement...</div>;
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
      
      <Route path="/client/dashboard" element={
        <ProtectedRoute allowedRoles={['client']}>
          <ClientDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/expert/dashboard" element={
        <ProtectedRoute allowedRoles={['expert']}>
          <ExpertDashboard />
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
