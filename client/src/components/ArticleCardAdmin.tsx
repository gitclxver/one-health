import type { MouseEvent } from "react";
import type { Article } from "../models/Article";
import { DEFAULT_IMAGES } from "../constants/images";

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
    if (!article.imageUrl) return DEFAULT_IMAGES.ARTICLE;
    if (article.imageUrl.startsWith("blob:")) return article.imageUrl;
    if (
      article.imageUrl.startsWith("http://") ||
      article.imageUrl.startsWith("https://")
    )
      return article.imageUrl;
    if (article.imageUrl.startsWith("/"))
      return `${import.meta.env.VITE_API_BASE_URL}${article.imageUrl}`;
    return `${import.meta.env.VITE_API_BASE_URL}/${article.imageUrl}`;
  };

  const resolvedImageUrl = getImageUrl();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = DEFAULT_IMAGES.ARTICLE;
  };

  const handleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && onEdit) onEdit();
  };

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && onDelete && window.confirm(`Delete "${article.title}"?`))
      onDelete();
  };

  const handleClick = () => {
    if (!disabled && onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white/20 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden flex flex-col h-full transform transition hover:scale-[1.02] hover:shadow-2xl ${
        disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
      }`}
      style={{ border: "1px solid rgba(106, 139, 87, 0.3)", minWidth: "280px" }}
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
          onClick={handleEdit}
          disabled={disabled}
          className="px-4 py-1 bg-[#6A8B57] text-white text-sm rounded hover:bg-[#567544] disabled:bg-gray-400 disabled:cursor-not-allowed shadow"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={disabled}
          className="px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
