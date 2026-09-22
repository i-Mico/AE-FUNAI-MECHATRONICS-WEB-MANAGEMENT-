import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProtectedRoute } from './Components/ProtectedRoute';
import { SignIn } from './Page/SignIn';
import { SignUp } from './Page/SignUp';
import { ForgotPassword } from './Page/ForgotPassword';
import { Dashboard } from './Page/Dashboard';
import { Equipment } from './Page/Equipment';
import { Shop } from './Page/Shop';
import { Schedule } from './Page/Schedule';
import { Maintenance } from './Page/Maintenance';
import { Reports } from './Page/Reports';
import { Collaboration } from './Page/Collaboration';
import { NotificationsPage } from './Page/Notifications';
import { Profile } from './Page/Profile';
import { Settings } from './Page/Settings';
import { AdminRoute } from './Components/AdminRoute';
import { AdminDashboard } from './Page/Admin';
import './App.css';

const SETTINGS_STORAGE_KEY = 'labSettings';

function syncStoredAppearance() {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    document.body.classList.toggle('theme-dark', parsed?.appearance?.theme === 'dark');
    document.body.classList.toggle('compact-mode', Boolean(parsed?.appearance?.compactMode));
  } catch {
    document.body.classList.remove('theme-dark', 'compact-mode');
  }
}

function App() {
  useEffect(() => {
    // Restore the global appearance preference on refresh before the user
    // navigates to another page.
    syncStoredAppearance();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/collaboration" element={<Collaboration />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
            <Route path="/" element={<Navigate to="/signin" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
