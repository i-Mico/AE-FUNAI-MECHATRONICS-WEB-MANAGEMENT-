import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="auth-loading">Loading your lab session…</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace state={{ from: location.pathname }} />;
}
