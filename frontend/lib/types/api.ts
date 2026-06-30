export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export interface PublicNewsletter {
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: string | null;
  readingTime: number | null;
}

export interface NewsletterDetail extends PublicNewsletter {
  id: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImage: string | null;
  openGraph?: Record<string, string>;
}

export interface SearchResultItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  score: number;
}

export interface SearchResponse {
  results: SearchResultItem[];
  total: number;
  took: number;
}

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "EDITOR"
  | "AUTHOR"
  | "USER";

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  avatarUrl: string | null;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  imageUrl: string | null;
  startsAt: string;
  endsAt: string | null;
  status: "UPCOMING" | "PAST" | "CANCELLED";
  isFeatured: boolean;
}

export interface ExcoMember {
  id: string;
  name: string;
  role: string;
  description: string;
  initials: string | null;
  avatarUrl: string | null;
  colorClass: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface MembershipApplication {
  id: string;
  fullName: string;
  email: string;
  interest: string;
  status: "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";
  notes: string | null;
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
}
