import { api, apiData } from "./client";
import type { ApiResponse, EventItem, ExcoMember } from "@/lib/types/api";

export const eventsApi = {
  list: (params?: { status?: string; featuredOnly?: boolean; limit?: number }) => {
    const search = new URLSearchParams();
    if (params?.status) search.set("status", params.status);
    if (params?.featuredOnly) search.set("featuredOnly", "true");
    if (params?.limit) search.set("limit", String(params.limit));
    const qs = search.toString();
    return apiData<EventItem[]>(`/api/v1/events${qs ? `?${qs}` : ""}`);
  },
};

export const excoApi = {
  list: () => apiData<ExcoMember[]>("/api/v1/exco-members"),
};

export const applicationsApi = {
  submit: (body: { fullName: string; email: string; interest: string }) =>
    api<ApiResponse<{ id: string }>>("/api/v1/membership-applications", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
