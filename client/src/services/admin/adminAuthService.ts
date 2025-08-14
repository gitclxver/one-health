import api from "../../utils/api";
import { AxiosError } from "axios";

interface AuthResponse {
  token: string;
}

interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export const AdminAuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        "/admin/login",
        {
          usernameOrEmail: credentials.usernameOrEmail,
          password: credentials.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      api.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
      localStorage.setItem("adminToken", response.data.token);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message || "Login failed");
      }
      throw error;
    }
  },

  verifyToken: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return false;

      const response = await api.get("/admin/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.status === 200;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  },

  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem("adminToken");
      if (token) {
        await api.post("/admin/logout", null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      localStorage.removeItem("adminToken");
      delete api.defaults.headers.common.Authorization;
    }
  },

  initializeAuth: (): void => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem("adminToken");
  },
};
