// src/components/ArticlesCarousel.tsx

import React, { useState, useEffect } from "react";
import type { Article } from "../types";
import { Link } from "react-router-dom";

interface ArticlesCarouselProps {
  articles: Article[];
}

const ArticlesCarousel: React.FC<ArticlesCarouselProps> = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (articles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
    }, 5000); // Change article every 5 seconds
    return () => clearInterval(interval);
  }, [articles]);

  if (articles.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        No articles to display yet.
      </div>
    );
  }

  const currentArticle = articles[currentIndex];

  return (
    <section className="bg-gray-50 py-16 px-4 relative overflow-hidden my-12 rounded-lg shadow-inner">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12 animate-fade-in-up">
        Featured Articles
      </h2>
      <div className="relative max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center transition-all duration-700 ease-in-out transform hover:scale-[1.02] border border-gray-200">
        <div className="md:w-1/2 flex justify-center mb-6 md:mb-0 md:pr-8">
          <img
            src={currentArticle.imageUrl}
            alt={currentArticle.title}
            className="w-full h-auto max-h-64 object-cover rounded-lg shadow-md transition-transform duration-500 ease-in-out animate-fade-in-out"
          />
        </div>
        <div className="md:w-1/2 text-center md:text-left animate-fade-in-out">
          <h3 className="text-3xl font-bold text-gray-900 mb-3">
            {currentArticle.title}
          </h3>
          <p className="text-lg text-gray-600 mb-2">
            By{" "}
            <span className="font-semibold text-blue-600">
              {currentArticle.author}
            </span>
          </p>
          <p className="text-md text-gray-700 mb-4 line-clamp-3">
            {currentArticle.summary}
          </p>
          <Link
            to={`/articles/${currentArticle.id}`} // Link to a specific article page (placeholder for now)
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Read Full Article
          </Link>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-2 mt-8">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentIndex
                ? "bg-blue-600 scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to article ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default ArticlesCarousel;
