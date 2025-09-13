import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import JudgeDashboard from './pages/JudgeDashboard';
import AdminPanel from './pages/AdminPanel';
import VolunteerDashboard from './pages/VolunteerDashboard';
import LiveResults from './pages/LiveResults';

function AppContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  /*app.post("/auth/google", (req, res) => {
  // handle token verification and login here
  });*/

  // Check if current route is login page or landing page
  const isLoginPage = location.pathname === '/login';
  const isLandingPage = location.pathname === '/';

  // Read auth state from localStorage on each render
  const isAuthenticated = Boolean(localStorage.getItem('access_token'));

  // Simple protected route wrapper
  const ProtectedRoute = ({ element }) => (
    isAuthenticated ? element : <Navigate to="/login" replace />
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoginPage && !isLandingPage && <Header changeLanguage={changeLanguage} />}
      <main className={isLoginPage || isLandingPage ? "" : "container mx-auto px-4 py-8"}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/student" element={<ProtectedRoute element={<StudentDashboard />} />} />
          <Route path="/judge" element={<ProtectedRoute element={<JudgeDashboard />} />} />
          <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} />} />
          <Route path="/admin/:section" element={<ProtectedRoute element={<AdminPanel />} />} />
          <Route path="/volunteer" element={<ProtectedRoute element={<VolunteerDashboard />} />} />
          <Route path="/results" element={<LiveResults />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;