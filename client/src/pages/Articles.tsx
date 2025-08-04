// src/pages/Articles.tsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { Article } from "../types";
import { mockArticles } from "../data/mockData";
import ArticleCard from "../components/ArticleCard";
import SearchBar from "../components/SearchBar";
import NewsletterSignup from "../components/NewsLetterSignUp";

const ArticlesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredArticles, setFilteredArticles] =
    useState<Article[]>(mockArticles);

  // If an article ID is in the URL, display the full article
  if (id) {
    const article = mockArticles.find((a) => a.id === id);
    if (!article) {
      return (
        <div className="container mx-auto p-8 text-center min-h-screen pt-20">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Article Not Found
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            The article you are looking for does not exist.
          </p>
          <Link
            to="/articles"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors text-lg font-semibold shadow-md"
          >
            Back to All Articles
          </Link>
        </div>
      );
    }

    return (
      <div className="container mx-auto p-8 py-12 max-w-4xl min-h-screen bg-white rounded-lg shadow-xl my-12">
        <Link
          to="/articles"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors duration-200 text-lg font-medium"
        >
          <svg
            className="mr-2 w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to All Articles
        </Link>
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md mb-8"
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          {article.title}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          By{" "}
          <span className="font-semibold text-blue-700">{article.author}</span>{" "}
          on {article.date}
        </p>
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-10">
          {/* Using dangerouslySetInnerHTML for content. For production, consider a markdown parser for security. */}
          <div dangerouslySetInnerHTML={{ __html: article.fullContent }} />
        </div>
        <Link
          to="/articles"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors text-lg font-semibold shadow-md"
        >
          Back to Articles Overview
        </Link>
      </div>
    );
  }

  // --- Displaying All Articles with Search and Popular Section ---

  const popularArticles = mockArticles.filter(
    (article) => article.tags.includes("Popular") || article.id === "1"
  ); // Assuming 'Popular' tag or specific ID
  const displayPopularArticle =
    popularArticles.length > 0 ? popularArticles[0] : null;

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const results = mockArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerCaseQuery) ||
        article.author.toLowerCase().includes(lowerCaseQuery) ||
        article.summary.toLowerCase().includes(lowerCaseQuery) ||
        article.fullContent.toLowerCase().includes(lowerCaseQuery) ||
        article.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
    );
    setFilteredArticles(results);
  }, [searchQuery]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen pt-12 pb-16">
      {/* Hero Section / Most Popular & Newsletter */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 text-blue-800 animate-fade-in-up drop-shadow-md">
              Explore Our Insights
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-6 animate-fade-in-up delay-100">
              Dive deep into health topics, cutting-edge research, and community
              initiatives.
            </p>
            {displayPopularArticle && (
              <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow-lg border border-blue-100 animate-fade-in-up delay-200">
                <h3 className="text-2xl font-bold mb-3 text-blue-700">
                  Most Popular Article:
                </h3>
                <Link
                  to={`/articles/${displayPopularArticle.id}`}
                  className="block"
                >
                  <img
                    src={displayPopularArticle.imageUrl}
                    alt={displayPopularArticle.title}
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-sm"
                  />
                  <p className="text-xl font-semibold text-gray-900 hover:text-blue-700 transition-colors line-clamp-2">
                    {displayPopularArticle.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    By {displayPopularArticle.author} on{" "}
                    {displayPopularArticle.date}
                  </p>
                </Link>
              </div>
            )}
          </div>
          <div className="flex justify-center animate-fade-in-up delay-300">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SearchBar onSearch={setSearchQuery} />
      </section>

      {/* All Articles Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-10 text-center animate-fade-in-up">
          {searchQuery ? `Search Results for "${searchQuery}"` : "All Articles"}
        </h2>
        {filteredArticles.length === 0 ? (
          <p className="text-center text-xl text-gray-600 py-10 bg-white rounded-lg shadow-md max-w-xl mx-auto">
            No articles found matching your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ArticlesPage;
