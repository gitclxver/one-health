import { Link } from "react-router-dom";
import type { Article } from "../models/Article";
import defaultArticleImage from "../assets/default-article-image.png";

interface ArticleCardProps {
  article: Article & { excerpt?: string };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getImageUrl = () => {
    if (!article.imageUrl) return defaultArticleImage;

    if (article.imageUrl.startsWith("blob:")) {
      return article.imageUrl;
    }

    if (
      article.imageUrl.startsWith("http://") ||
      article.imageUrl.startsWith("https://")
    ) {
      return article.imageUrl;
    }

    if (article.imageUrl.startsWith("/")) {
      return `${import.meta.env.VITE_API_BASE_URL}${article.imageUrl}`;
    }

    return `${import.meta.env.VITE_API_BASE_URL}/${article.imageUrl}`;
  };

  const resolvedImageUrl = getImageUrl();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== defaultArticleImage) {
      target.src = defaultArticleImage;
    }
  };

  return (
    <Link
      to={`/articles/${article.id}`}
      className="block no-underline text-inherit h-full bg-white/20 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 flex flex-col"
      style={{ border: "1px solid rgba(106, 139, 87, 0.3)" }}
    >
      <img
        src={resolvedImageUrl}
        alt={article.title}
        className="w-full h-48 object-cover"
        loading="lazy"
        onError={handleImageError}
      />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-xl font-semibold text-[#6A8B57] line-clamp-2 flex-grow">
            {article.title}
          </h3>
          <span className="text-sm text-[#6A8B57]/70 whitespace-nowrap">
            {formatDate(article.publishedAt || article.createdAt)}
          </span>
        </div>

        <p className="text-sm text-[#6A8B57]/90 mb-3">
          By One Health Student Society
        </p>

        <p className="text-[#4a5c3a] text-base line-clamp-3 mb-4 flex-grow">
          {article.excerpt ?? article.description}
        </p>

        <div className="flex justify-center mt-auto">
          <Link
            to={`/articles/${article.id}`}
            className="border border-[#6A8B57] text-[#6A8B57] px-4 py-2 rounded hover:bg-[#6A8B57] hover:text-white transition"
          >
            Read More
          </Link>
        </div>
      </div>
    </Link>
  );
}
