import { useState, useEffect, useCallback } from "react";
import { AdminAuthService } from "../services/admin/adminAuthService";
import { toast } from "react-toastify";

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true); // start loading true
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Runs only once on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await AdminAuthService.verifyToken();
        setIsAuthenticated(isValid);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []); // empty deps → runs once

  const login = async (identifier: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await AdminAuthService.login({
        usernameOrEmail: identifier,
        password,
      });

      if (!response?.token) {
        throw new Error("Authentication failed");
      }

      setIsAuthenticated(true);
      toast.success("Login successful!");
      return true;
    } catch (err) {
      setIsAuthenticated(false);
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    AdminAuthService.logout();
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  }, []);

  return {
    login,
    logout,
    loading,
    error,
    isAuthenticated,
  };
};
