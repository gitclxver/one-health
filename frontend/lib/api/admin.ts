import type {
  ApiResponse,
  EventItem,
  ExcoMember,
  MembershipApplication,
  PaginatedApiResponse,
  PublicNewsletter,
  Subscriber,
  User,
} from "@/lib/types/api";
import { api, apiData } from "./client";

export { eventsApi, excoApi, applicationsApi } from "./content";

export const adminEventsApi = {
  list: (params?: { status?: string; limit?: number }) => {
    const search = new URLSearchParams();
    if (params?.status) search.set("status", params.status);
    if (params?.limit) search.set("limit", String(params.limit));
    const qs = search.toString();
    return apiData<EventItem[]>(`/api/v1/events${qs ? `?${qs}` : ""}`);
  },
  create: (body: Record<string, unknown>) =>
    api<ApiResponse<EventItem>>("/api/v1/events", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: Record<string, unknown>) =>
    api<ApiResponse<EventItem>>(`/api/v1/events/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (id: string) => api<void>(`/api/v1/events/${id}`, { method: "DELETE" }),
};

export const adminExcoApi = {
  list: (all = false) => apiData<ExcoMember[]>(`/api/v1/exco-members${all ? "?all=true" : ""}`),
  create: (body: Record<string, unknown>) =>
    api<ApiResponse<ExcoMember>>("/api/v1/exco-members", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: Record<string, unknown>) =>
    api<ApiResponse<ExcoMember>>(`/api/v1/exco-members/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (id: string) => api<void>(`/api/v1/exco-members/${id}`, { method: "DELETE" }),
};

export const adminApplicationsApi = {
  list: (status?: string) => {
    const qs = status ? `?status=${status}` : "";
    return apiData<MembershipApplication[]>(`/api/v1/membership-applications${qs}`);
  },
  update: (id: string, body: Record<string, unknown>) =>
    api<ApiResponse<MembershipApplication>>(`/api/v1/membership-applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  remove: (id: string) => api<void>(`/api/v1/membership-applications/${id}`, { method: "DELETE" }),
};

export const adminNewslettersApi = {
  list: (params?: { page?: number; limit?: number; status?: string }) => {
    const search = new URLSearchParams();
    if (params?.page) search.set("page", String(params.page));
    if (params?.limit) search.set("limit", String(params.limit));
    if (params?.status) search.set("status", params.status);
    const qs = search.toString();
    return api<PaginatedApiResponse<PublicNewsletter & { id?: string; status?: string }>>(
      `/api/v1/newsletters${qs ? `?${qs}` : ""}`,
    );
  },
  create: (body: Record<string, unknown>) =>
    api<ApiResponse<unknown>>("/api/v1/newsletters", { method: "POST", body: JSON.stringify(body) }),
  publish: (id: string) =>
    api<ApiResponse<unknown>>(`/api/v1/newsletters/${id}/publish`, { method: "PATCH" }),
  archive: (id: string) =>
    api<ApiResponse<unknown>>(`/api/v1/newsletters/${id}/archive`, { method: "PATCH" }),
  remove: (id: string) => api<void>(`/api/v1/newsletters/${id}`, { method: "DELETE" }),
};

export const adminSubscribersApi = {
  list: (page = 1) => api<PaginatedApiResponse<Subscriber>>(`/api/v1/subscribers?page=${page}&limit=20`),
  remove: (id: string) => api<void>(`/api/v1/subscribers/${id}`, { method: "DELETE" }),
};

export const adminUsersApi = {
  list: (page = 1) => api<PaginatedApiResponse<User>>(`/api/v1/users?page=${page}&limit=20`),
};

export const adminAnalyticsApi = {
  dashboard: () => apiData<Record<string, number>>("/api/v1/analytics/dashboard"),
};
