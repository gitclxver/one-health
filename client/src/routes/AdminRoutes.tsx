// src/routes/AdminRoutes.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AdminRoutes() {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
