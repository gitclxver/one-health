import { Link } from "react-router-dom";
import Button from "./ui/button";

interface Article {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  summary: string;
  tags: string[];
}

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="article-card bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-102 hover:shadow-xl transition-all duration-300">
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 text-left">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">By {article.author}</p>
        <p className="text-gray-700 text-base line-clamp-3">
          {article.summary}
        </p>
        <div className="flex justify-center mt-4">
          <Link to={`/articles/${article.id}`}>
            <Button variant="outline">Read More</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
