import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/layout/DashboardLayout';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import OtpVerification from './pages/OtpVerification';
import Fees from './pages/Fees';
import AdminFees from './pages/admin/AdminFees';
import Leaves from './pages/Leaves';
import AdminLeaves from './pages/admin/AdminLeaves';
import RoomBooking from './pages/RoomBooking';
import AdminAllocation from './pages/admin/AdminAllocation';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminManagement from './pages/admin/AdminManagement';
import Complaints from './pages/Complaints';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import MessCard from './pages/MessCard';
import Feedback from './pages/Feedback';

// Placeholder Pages
const PlaceholderPage = ({ title }) => (
  <div className="flex h-[80vh] items-center justify-center">
    <div className="text-center space-y-4">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{title}</h2>
      <p className="text-text-muted">This module is under construction.</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{
        className: 'bg-surface-elevated text-text-primary border border-border-default shadow-lg',
        style: {
          background: 'var(--surface-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-default)',
        },
      }} />
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="fees" element={<Fees />} />
          <Route path="admin-fees" element={<AdminFees />} />
          <Route path="leaves" element={<Leaves />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="admin-leaves" element={<AdminLeaves />} />
          <Route path="room-booking" element={<RoomBooking />} />
          <Route path="admin-allocation" element={<AdminAllocation />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="admin-management" element={<AdminManagement />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Feedback />} />
          <Route path="mess-card" element={<MessCard />} />
          <Route path="feedback" element={<Feedback />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verify" element={<OtpVerification />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
