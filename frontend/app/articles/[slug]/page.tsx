import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchNewsletterBySlug } from "@/lib/api/newsletters.server";
import { getImageUrl } from "@/lib/image/getImageUrl";
import { formatPublishedDate, formatReadingTime } from "@/lib/utils/format";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const article = await fetchNewsletterBySlug(slug);
    return {
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.excerpt ?? undefined,
      openGraph: {
        title: article.seoTitle ?? article.title,
        description: article.seoDescription ?? article.excerpt ?? undefined,
        images: article.ogImage ? [getImageUrl(article.ogImage)] : undefined,
        url: article.canonicalUrl,
        type: "article",
      },
    };
  } catch {
    return { title: "Article not found" };
  }
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let article;
  try {
    article = await fetchNewsletterBySlug(slug);
  } catch {
    notFound();
  }

  const imageUrl = getImageUrl(article.featuredImage ?? article.ogImage);

  return (
    <article className="w-full pt-28 md:pt-40 pb-16 md:pb-24 max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
      <Link
        href="/articles"
        className="text-sm font-semibold text-[#6aabaf] hover:underline mb-8 inline-block"
      >
        ← Back to articles
      </Link>

      <header className="space-y-6 mb-10">
        <div className="text-sm text-slate-400 flex gap-3">
          <span>{formatPublishedDate(article.publishedAt)}</span>
          <span>•</span>
          <span>{formatReadingTime(article.readingTime)}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-800 leading-tight">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-lg text-slate-600 leading-relaxed">{article.excerpt}</p>
        )}
      </header>

      <div className="relative w-full aspect-[16/9] rounded-[32px] overflow-hidden mb-10 border border-slate-100">
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>

      <div className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-p:leading-relaxed whitespace-pre-wrap">
        {article.content.startsWith("{") ? (
          <pre className="text-sm bg-slate-50 p-4 rounded-xl overflow-x-auto">{article.content}</pre>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        )}
      </div>
    </article>
  );
}
