// src/components/ArticleCard.tsx

import React from "react";
import type { Article } from "../types";
import { Link } from "react-router-dom";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-1 hover:scale-102">
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-52 object-cover" // Slightly taller image
      />
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          By <span className="font-medium text-blue-600">{article.author}</span>{" "}
          on {article.date}
        </p>
        <p className="text-gray-700 text-base mb-4 line-clamp-3 flex-grow">
          {article.summary}{" "}
          {/* Changed from description to summary based on types.ts */}
        </p>
        <div className="mt-auto">
          <Link
            to={`/articles/${article.id}`}
            className="inline-flex items-center justify-center px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 text-sm font-medium shadow-md hover:shadow-lg"
          >
            Read More
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
