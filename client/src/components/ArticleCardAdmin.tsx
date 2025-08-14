import type { MouseEvent } from "react";
import type { Article } from "../models/Article";
import defaultArticleImage from "../assets/default-article-image.png";

interface ArticleCardAdminProps {
  article: Article & { excerpt?: string };
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  disabled?: boolean;
}

export default function ArticleCardAdmin({
  article,
  onEdit,
  onDelete,
  onClick,
  disabled = false,
}: ArticleCardAdminProps) {
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

  const handleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || !onEdit) return;
    onEdit();
  };

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || !onDelete) return;
    if (window.confirm(`Are you sure you want to delete "${article.title}"?`)) {
      onDelete();
    }
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(); // ✅ Trigger the onClick from parent (which includes navigate)
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full transition hover:shadow-xl ${
        disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
      }`}
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
        <h3 className="text-xl font-semibold text-[#6A8B57] line-clamp-2 mb-4">
          {article.title}
        </h3>

        <p className="text-[#4a5c3a] text-base line-clamp-4 flex-grow">
          {article.excerpt ?? article.description}
        </p>
      </div>

      <div className="p-4 border-t border-[#6A8B57]/20 flex justify-center gap-3">
        <button
          className="px-4 py-1 bg-[#6A8B57] text-white text-sm rounded hover:bg-[#567544] disabled:bg-gray-400 disabled:cursor-not-allowed shadow"
          onClick={handleEdit}
          disabled={disabled}
        >
          Edit
        </button>
        <button
          className="px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow"
          onClick={handleDelete}
          disabled={disabled}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
