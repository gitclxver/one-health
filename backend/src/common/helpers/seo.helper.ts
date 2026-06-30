export interface SeoMetadata {
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImage: string | null;
}

export interface OpenGraphMeta {
  'og:title': string;
  'og:description': string;
  'og:image'?: string;
  'og:url': string;
  'og:type': string;
}

export interface ResolvedSeoFields {
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImage: string | null;
}

export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3).trim()}...`;
}

export function resolveSeoFields(input: {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
  featuredImage?: string | null;
  siteUrl: string;
}): ResolvedSeoFields {
  const plainExcerpt =
    input.excerpt?.trim() ||
    truncate(stripHtml(input.content ?? ''), 160);

  const seoTitle = input.seoTitle?.trim() || input.title;
  const seoDescription = input.seoDescription?.trim() || plainExcerpt;
  const canonicalUrl =
    input.canonicalUrl?.trim() ||
    `${input.siteUrl.replace(/\/$/, '')}/newsletters/${input.slug}`;
  const ogImage = input.ogImage || input.featuredImage || null;

  return { seoTitle, seoDescription, canonicalUrl, ogImage };
}

export function buildOpenGraphMeta(resolved: ResolvedSeoFields): OpenGraphMeta {
  const meta: OpenGraphMeta = {
    'og:title': resolved.seoTitle,
    'og:description': resolved.seoDescription,
    'og:url': resolved.canonicalUrl,
    'og:type': 'article',
  };
  if (resolved.ogImage) {
    meta['og:image'] = resolved.ogImage;
  }
  return meta;
}
