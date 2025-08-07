import { Link } from "react-router-dom";
import Button from "./ui/button";
import type { MouseEvent } from "react";

export interface Article {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  summary: string;
  fullContent: string;
  tags: string[];
}

interface ArticleCardProps {
  article: Article;
  onAuthorClick?: (author: string) => void;
  onClick?: () => void;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ArticleCard({
  article,
  onAuthorClick,
  onClick,
  showActions = false,
  onEdit,
  onDelete,
}: ArticleCardProps) {
  const cardContent = (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 h-full flex flex-col">
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2 flex-grow">
            {article.title}
          </h3>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {new Date(article.date).toLocaleDateString()}
          </span>
        </div>

        <div className="mb-3">
          {onAuthorClick ? (
            <button
              className="text-sm text-blue-600 hover:underline focus:outline-none text-left"
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                onAuthorClick(article.author);
              }}
            >
              By {article.author}
            </button>
          ) : (
            <p className="text-sm text-gray-600">By {article.author}</p>
          )}
        </div>

        <p className="text-gray-700 text-base line-clamp-3 mb-4 flex-grow">
          {article.summary}
        </p>

        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {!showActions && (
          <div className="flex justify-center mt-auto">
            <span className="pointer-events-none">
              <Button variant="outline">Read More</Button>
            </span>
          </div>
        )}
      </div>

      {showActions && (
        <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              onEdit?.();
            }}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50"
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              onDelete?.();
            }}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );

  return showActions ? (
    <div onClick={onClick} className="h-full">
      {cardContent}
    </div>
  ) : (
    <Link
      to={`/articles/${article.id}`}
      className="block no-underline text-inherit h-full"
    >
      {cardContent}
    </Link>
  );
}
