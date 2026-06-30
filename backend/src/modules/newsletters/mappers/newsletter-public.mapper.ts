import type { OpenGraphMeta } from '../../../common/helpers/seo.helper.js';

export interface PublicNewsletterListItem {
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: Date | null;
  readingTime: number | null;
}

export interface PublicNewsletterDetail extends PublicNewsletterListItem {
  id: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImage: string | null;
  openGraph: OpenGraphMeta;
}

export function toPublicListItem(newsletter: {
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: Date | null;
  readingTime: number | null;
}): PublicNewsletterListItem {
  return {
    title: newsletter.title,
    slug: newsletter.slug,
    excerpt: newsletter.excerpt,
    featuredImage: newsletter.featuredImage,
    publishedAt: newsletter.publishedAt,
    readingTime: newsletter.readingTime,
  };
}
