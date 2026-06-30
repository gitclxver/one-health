import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service.js';
import { resolveSeoFields, buildOpenGraphMeta } from '../../common/helpers/seo.helper.js';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
}

@Injectable()
export class SeoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private get siteUrl(): string {
    return (this.configService.get<string>('app.frontendUrl') ?? 'http://localhost:3000').replace(
      /\/$/,
      '',
    );
  }

  async generateSitemap(): Promise<string> {
    const newsletters = await this.prisma.newsletter.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' },
    });

    const urls: SitemapUrl[] = [
      {
        loc: this.siteUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '1.0',
      },
      {
        loc: `${this.siteUrl}/newsletters`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '0.9',
      },
      ...newsletters.map((n) => ({
        loc: `${this.siteUrl}/newsletters/${n.slug}`,
        lastmod: n.updatedAt.toISOString(),
        changefreq: 'weekly',
        priority: '0.8',
      })),
    ];

    const body = urls
      .map(
        (u) => `  <url>
    <loc>${this.escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
  }

  async generateRssFeed(): Promise<string> {
    const siteName =
      (
        await this.prisma.setting.findFirst({ select: { siteName: true } })
      )?.siteName ?? 'One Health';

    const newsletters = await this.prisma.newsletter.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        seoDescription: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 50,
    });

    const items: RssItem[] = newsletters.map((n) => ({
      title: n.title,
      link: `${this.siteUrl}/newsletters/${n.slug}`,
      description: this.escapeXml(n.excerpt ?? n.seoDescription ?? n.title),
      pubDate: (n.publishedAt ?? new Date()).toUTCString(),
      guid: `${this.siteUrl}/newsletters/${n.slug}`,
    }));

    const itemXml = items
      .map(
        (item) => `    <item>
      <title>${this.escapeXml(item.title)}</title>
      <link>${this.escapeXml(item.link)}</link>
      <description>${item.description}</description>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="true">${this.escapeXml(item.guid)}</guid>
    </item>`,
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${this.escapeXml(siteName)}</title>
    <link>${this.siteUrl}</link>
    <description>Latest publications</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemXml}
  </channel>
</rss>`;
  }

  buildNewsletterSeo(newsletter: {
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    seoTitle: string | null;
    seoDescription: string | null;
    canonicalUrl: string | null;
    ogImage: string | null;
    featuredImage: string | null;
  }) {
    const resolved = resolveSeoFields({
      title: newsletter.title,
      slug: newsletter.slug,
      excerpt: newsletter.excerpt,
      content: newsletter.content,
      seoTitle: newsletter.seoTitle,
      seoDescription: newsletter.seoDescription,
      canonicalUrl: newsletter.canonicalUrl,
      ogImage: newsletter.ogImage,
      featuredImage: newsletter.featuredImage,
      siteUrl: this.siteUrl,
    });

    return {
      ...resolved,
      openGraph: buildOpenGraphMeta(resolved),
    };
  }

  resolvePublishSeoFields(newsletter: {
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    seoTitle: string | null;
    seoDescription: string | null;
    canonicalUrl: string | null;
    ogImage: string | null;
    featuredImage: string | null;
  }) {
    const resolved = resolveSeoFields({
      title: newsletter.title,
      slug: newsletter.slug,
      excerpt: newsletter.excerpt,
      content: newsletter.content,
      seoTitle: newsletter.seoTitle,
      seoDescription: newsletter.seoDescription,
      canonicalUrl: newsletter.canonicalUrl,
      ogImage: newsletter.ogImage,
      featuredImage: newsletter.featuredImage,
      siteUrl: this.siteUrl,
    });

    return {
      seoTitle: resolved.seoTitle,
      seoDescription: resolved.seoDescription,
      canonicalUrl: resolved.canonicalUrl,
      ogImage: resolved.ogImage,
    };
  }

  private escapeXml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
