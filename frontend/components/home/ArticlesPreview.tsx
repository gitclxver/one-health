import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { fetchNewsletters } from "@/lib/api/newsletters.server";
import { getImageUrl } from "@/lib/image/getImageUrl";
import { formatReadingTime } from "@/lib/utils/format";
import { EMPTY_MESSAGES } from "@/lib/user-messages";
import { ContentMessage } from "@/components/ui/ContentMessage";

export const revalidate = 60;

export default async function ArticlesPreview() {
  let articles: Awaited<ReturnType<typeof fetchNewsletters>>["data"] = [];
  let offline = false;

  try {
    const response = await fetchNewsletters({ limit: 3 });
    articles = response.data;
  } catch {
    offline = true;
  }

  return (
    <section id="articles" className="py-16 md:py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 mb-10 md:mb-16">
          <div>
            <span className="text-sm font-bold tracking-wide text-[#8a9478] uppercase block">
              Academic Journal
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-800 mt-2">
              Latest Student Publications
            </h2>
          </div>
          <Link
            href="/articles"
            className="group text-sm font-semibold text-[#6aabaf] flex items-center gap-2 border-b-2 border-[#B3DEE2] pb-1 shrink-0"
          >
            Read the student journal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {offline && (
          <ContentMessage message="Unable to load articles right now. Please try again later." variant="error" />
        )}

        {!offline && articles.length === 0 && <ContentMessage message={EMPTY_MESSAGES.articles} />}

        {articles.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative w-full aspect-[16/10] rounded-[24px] bg-slate-100 border border-slate-100 overflow-hidden mb-6 shadow-sm">
                <Image
                  src={getImageUrl(article.featuredImage)}
                  alt={article.title}
                  fill
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              </div>
              <div className="space-y-2 flex flex-col flex-1">
                <span className="text-sm font-semibold tracking-wide text-[#6aabaf] uppercase">
                  {formatReadingTime(article.readingTime)}
                </span>
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#6aabaf] transition-colors line-clamp-2">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-base text-slate-600 font-normal line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
