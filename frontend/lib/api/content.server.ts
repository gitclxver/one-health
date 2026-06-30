import { getServerApiBase } from "./client";
import type { ApiResponse, EventItem, ExcoMember } from "@/lib/types/api";

const REVALIDATE_SECONDS = 60;

async function fetchApiData<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${getServerApiBase()}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as ApiResponse<T>;
    return body.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchEvents(params?: {
  status?: string;
  featuredOnly?: boolean;
  limit?: number;
}): Promise<EventItem[]> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.featuredOnly) search.set("featuredOnly", "true");
  if (params?.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return (await fetchApiData<EventItem[]>(`/api/v1/events${qs ? `?${qs}` : ""}`)) ?? [];
}

export async function fetchExcoMembers(): Promise<ExcoMember[]> {
  return (await fetchApiData<ExcoMember[]>("/api/v1/exco-members")) ?? [];
}
