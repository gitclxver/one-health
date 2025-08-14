import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useArticlesStore } from "../store/useArticlesStore";
import { FiSearch, FiArrowLeft } from "react-icons/fi";

export default function ArticlesPage() {
  const { articles, loading, error, fetchAdminArticles } = useArticlesStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAdminArticles();
  }, [fetchAdminArticles]);

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Background gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #A7CFE1 0%, #6A8B57 100%)",
        }}
      />

      {/* Main container */}
      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page header */}
        <section
          className="text-center mb-12 sm:mb-16 py-12 sm:py-16 px-4 sm:px-6 lg:px-12 rounded-3xl shadow-lg"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#6A8B57] mb-3 sm:mb-4">
            Our Articles
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our latest insights on One Health, research findings, and
            community initiatives
          </p>
        </section>

        {/* Articles section */}
        <section
          className="rounded-3xl p-6 sm:p-8 shadow-lg mb-8"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          {/* Search bar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search Articles"
                className="block w-full pl-10 pr-3 py-3 sm:py-4 border border-[#6A8B57] rounded-full bg-white bg-opacity-70 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6A8B57] focus:border-transparent text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12 sm:py-16">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-12 sm:py-16">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                Something went wrong
              </h3>
              <p className="text-base sm:text-lg text-red-600 mb-4 sm:mb-6">
                {error}
              </p>
              <button
                onClick={fetchAdminArticles}
                className="px-5 sm:px-6 py-2 sm:py-3 bg-[#6A8B57] text-white rounded-lg hover:bg-[#567544] transition-colors font-medium text-sm sm:text-base"
              >
                Try Again
              </button>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                {searchTerm
                  ? "No matching articles found"
                  : "No Articles Available"}
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                {searchTerm
                  ? "Try a different search term"
                  : "We haven't published any articles yet. Check back soon!"}
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-5 sm:px-6 py-2 sm:py-3 bg-[#6A8B57] text-white rounded-lg hover:bg-[#567544] transition-colors font-medium text-sm sm:text-base"
                >
                  Clear Search
                </button>
              ) : (
                <Link
                  to="/"
                  className="inline-flex items-center text-[#6A8B57] hover:text-[#567544] transition-colors font-semibold text-sm sm:text-base"
                >
                  <FiArrowLeft className="mr-2 w-5 h-5" />
                  Back to Home
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                  {searchTerm ? "Search Results" : "All Articles"}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {filteredArticles.length} article
                  {filteredArticles.length !== 1 ? "s" : ""} found
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Call to action */}
        <section className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-[#6A8B57] hover:text-[#567544] transition-colors font-semibold text-sm sm:text-base"
          >
            <FiArrowLeft className="mr-2 w-5 h-5" />
            Back to Home
          </Link>
        </section>
      </div>
    </>
  );
}
