import { apiData } from "./client";
import type { SearchResponse } from "@/lib/types/api";

export const searchApi = {
  search: (q: string, limit = 20) =>
    apiData<SearchResponse>(
      `/api/v1/search?q=${encodeURIComponent(q)}&limit=${limit}`,
    ),
};
