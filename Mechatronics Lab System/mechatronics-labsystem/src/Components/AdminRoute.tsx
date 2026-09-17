import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function AdminRoute() {
  const { user, isAuthenticated } = useAuth();

  // Check if user is authenticated AND has admin role
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (user?.role !== "admin") {
    // Redirect non-admin users to dashboard with an alert
    alert("Access denied. This page is only available to administrators.");
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
