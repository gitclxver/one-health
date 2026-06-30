import { api, apiData } from "./client";
import type { ApiResponse, User } from "@/lib/types/api";

export const authApi = {
  me: () => apiData<User>("/api/v1/users/me"),

  login: (email: string, password: string) =>
    api<ApiResponse<{ user: User }>>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    api<ApiResponse<null>>("/api/v1/auth/logout", { method: "POST" }),
};
