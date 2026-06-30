import { api, apiData } from "./client";
import type {
  NewsletterDetail,
  PaginatedApiResponse,
  PublicNewsletter,
} from "@/lib/types/api";

export const newslettersApi = {
  getAll: (page = 1, limit = 20) =>
    api<PaginatedApiResponse<PublicNewsletter>>(
      `/api/v1/newsletters?page=${page}&limit=${limit}`,
    ),

  getBySlug: (slug: string) =>
    apiData<NewsletterDetail>(`/api/v1/newsletters/${slug}`),
};

export { fetchNewsletters, fetchNewsletterBySlug } from "./newsletters.server";
