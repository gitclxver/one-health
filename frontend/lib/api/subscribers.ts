import { api } from "./client";
import type { ApiResponse } from "@/lib/types/api";

export const subscribersApi = {
  subscribe: (email: string) =>
    api<ApiResponse<{ id: string }>>("/api/v1/subscribers", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};
