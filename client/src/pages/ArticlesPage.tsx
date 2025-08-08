import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import NewsletterSignup from "../components/NewsletterSignup";
import { getPublishedArticles, getFeaturedArticles } from "../services/public/articleService";
import { fetchCommitteeMembers } from "../services/public/memberService";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Article } from "../models/Article";
import type { Member } from "../models/Member";

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeatured, setShowFeatured] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [publishedArticles, committeeMembers] = await Promise.all([
          showFeatured ? getFeaturedArticles() : getPublishedArticles(),
          fetchCommitteeMembers()
        ]);

        setArticles(publishedArticles);
        setMembers(committeeMembers);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [showFeatured]);

  const handleAuthorClick = (authorName: string) => {
    const matchedMember = members.find(
      (member) => member.name.toLowerCase() === authorName.toLowerCase()
    );

    if (matchedMember) {
      navigate(`/about/${matchedMember.id}`);
    } else {
      alert("Author profile not found.");
    }
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.tags && article.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
      )
  );

  if (error) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Error</h1>
        <p className="text-xl text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero / Search */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
          {showFeatured ? "Featured Articles" : "Our Latest Articles"}
        </h1>
        <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
          Dive deep into research, community initiatives, and expert insights.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search articles..."
              className="px-4 py-3 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          
          <button
            onClick={() => setShowFeatured(!showFeatured)}
            className={`px-6 py-3 rounded-full transition-colors ${
              showFeatured
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {showFeatured ? "Show All Articles" : "Show Featured"}
          </button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mb-12">
        <NewsletterSignup />
      </section>

      {/* Articles */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {searchQuery ? `Search Results for "${searchQuery}"` : 
           showFeatured ? "Featured Articles" : "All Articles"}
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600 mb-4">
              No articles found matching your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setShowFeatured(false);
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search and filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onAuthorClick={handleAuthorClick}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}