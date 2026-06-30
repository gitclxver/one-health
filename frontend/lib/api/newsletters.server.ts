import { getServerApiBase } from "./client";
import type {
  NewsletterDetail,
  PaginatedApiResponse,
  PublicNewsletter,
} from "@/lib/types/api";

const REVALIDATE_SECONDS = 60;

export async function fetchNewsletters(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedApiResponse<PublicNewsletter>> {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  const qs = search.toString();

  const res = await fetch(
    `${getServerApiBase()}/api/v1/newsletters${qs ? `?${qs}` : ""}`,
    { next: { revalidate: REVALIDATE_SECONDS } },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch newsletters: ${res.statusText}`);
  }

  return res.json() as Promise<PaginatedApiResponse<PublicNewsletter>>;
}

export async function fetchNewsletterBySlug(
  slug: string,
): Promise<NewsletterDetail> {
  const res = await fetch(`${getServerApiBase()}/api/v1/newsletters/${slug}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch newsletter: ${res.statusText}`);
  }

  const body = (await res.json()) as { data: NewsletterDetail };
  return body.data;
}
