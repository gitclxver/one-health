import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/image/getImageUrl";
import { formatPublishedDate, formatReadingTime } from "@/lib/utils/format";
import type { PublicNewsletter } from "@/lib/types/api";

interface ArticleCardProps {
  article: PublicNewsletter;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const imageUrl = getImageUrl(article.featuredImage);

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="bg-white/60 backdrop-blur-md border border-slate-100 rounded-[32px] overflow-hidden group cursor-pointer hover:shadow-xl hover:border-[#B3DEE2] hover:shadow-[#B3DEE2]/20 transition-all flex flex-col"
    >
      <div className="relative w-full aspect-[16/9] md:aspect-[16/10] overflow-hidden">
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-1 space-y-3 md:space-y-4">
        <span className="text-xs md:text-sm font-semibold tracking-wide uppercase text-[#6aabaf]">
          Publication
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-tight group-hover:text-[#6aabaf] transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <div className="text-xs md:text-sm font-medium text-slate-400 pt-2 flex items-center gap-2 md:gap-4 mt-auto">
          <span>Published {formatPublishedDate(article.publishedAt)}</span>
          <span>•</span>
          <span>{formatReadingTime(article.readingTime)}</span>
        </div>
      </div>
    </Link>
  );
}
