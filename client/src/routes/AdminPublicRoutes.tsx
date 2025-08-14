import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AdminPublicRoute() {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // If authenticated, redirect to dashboard
  return isAuthenticated ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Outlet />
  );
}
