import ArticleCard from "@/components/articles/ArticleCard";
import ErrorState from "@/components/ui/ErrorState";
import { fetchNewsletters } from "@/lib/api/newsletters.server";

export const revalidate = 60;

export default async function ArticlesPage() {
  let articles: Awaited<ReturnType<typeof fetchNewsletters>>["data"] = [];
  let error: string | null = null;

  try {
    const response = await fetchNewsletters({ limit: 20 });
    articles = response.data;
  } catch {
    error = "Unable to load publications. The API may be offline.";
  }

  return (
    <div className="w-full pt-28 md:pt-40 pb-16 md:pb-24 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 space-y-10 md:space-y-12 relative">
      <div className="relative z-10 space-y-4">
        <span className="text-sm font-semibold tracking-wide text-[#6aabaf] block">
          Academic Journal Archive
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-800">
          Peer-Reviewed Student Research
        </h1>
        <p className="text-slate-600 text-base font-normal">
          Empirical findings and literature reviews published by society members under faculty
          supervision.
        </p>
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : articles.length === 0 ? (
        <p className="text-slate-500 text-center py-12">No publications yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
