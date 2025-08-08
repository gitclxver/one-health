import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import NewsletterSignup from "../components/NewsletterSignup";
import { getFeaturedArticles } from "../services/public/articleService";
import { fetchCommitteeMembers } from "../services/public/memberService";
import type { Member } from "../models/Member";
import type { Article } from "../models/Article";
import LoadingSpinner from "../components/LoadingSpinner";

export default function HomePage() {
  const navigate = useNavigate();
  const [committeeMembers, setCommitteeMembers] = useState<Member[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [loading, setLoading] = useState({
    members: true,
    articles: true,
  });
  const [error, setError] = useState({
    members: null as string | null,
    articles: null as string | null,
  });

  // Fetch data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading({ members: true, articles: true });
        setError({ members: null, articles: null });

        const [membersData, articlesData] = await Promise.all([
          fetchCommitteeMembers(),
          getFeaturedArticles(),
        ]);

        setCommitteeMembers(membersData);
        setFeaturedArticles(articlesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError({
          members: "Failed to load team members",
          articles: "Failed to load articles",
        });
      } finally {
        setLoading({ members: false, articles: false });
      }
    };

    loadData();
  }, []);

  // Auto-advance leadership carousel
  useEffect(() => {
    if (committeeMembers.length === 0) return;
    const interval = setInterval(() => {
      setCurrentMemberIndex(
        (prevIndex) => (prevIndex + 1) % committeeMembers.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [committeeMembers]);

  const currentMember = committeeMembers[currentMemberIndex];

  const handleAuthorClick = (authorName: string) => {
    const matchedMember = committeeMembers.find(
      (member) => member.name.toLowerCase() === authorName.toLowerCase()
    );
    if (matchedMember) {
      navigate(`/about/${matchedMember.id}`);
    } else {
      alert("Author profile not found.");
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between text-center lg:text-left py-12 lg:py-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-lg mb-16 px-6 lg:px-12">
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 leading-tight mb-4">
            Advancing Health Together
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8">
            Fostering collaboration across human, animal, and environmental
            health.
          </p>
          <Link
            to="/about"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold shadow-md"
          >
            Learn More About Us
          </Link>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <img
            src="/images/one-health-hero.jpg"
            alt="One Health Concept"
            className="rounded-2xl shadow-2xl w-full max-w-md object-cover aspect-square"
          />
        </div>
      </section>

      {/* Committee Member Carousel */}
      <section className="mb-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Meet Our Leadership
        </h2>

        {loading.members ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : error.members ? (
          <div className="text-red-600 py-8">
            {error.members}
            <button
              onClick={() => window.location.reload()}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Try Again
            </button>
          </div>
        ) : committeeMembers.length === 0 ? (
          <p className="text-gray-500 py-8">No leadership members found</p>
        ) : (
          <Link
            to={`/about/${currentMember.id}`}
            className="relative overflow-hidden w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-shadow"
          >
            <div className="p-4 w-full text-center">
              <img
                src={currentMember.imageUrl || "/images/default-avatar.png"}
                alt={currentMember.name}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/default-avatar.png";
                }}
              />
              <h3 className="text-xl font-bold text-gray-800">
                {currentMember.name}
              </h3>
              <p className="text-blue-600 font-semibold">
                {currentMember.position}
              </p>
              <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                {currentMember.bio}
              </p>
            </div>
          </Link>
        )}
      </section>

      {/* Hero Section 2 */}
      <section className="flex flex-col lg:flex-row items-center justify-between py-12 lg:py-20 bg-gradient-to-r from-green-50 to-teal-50 rounded-3xl shadow-lg mb-16 px-6 lg:px-12">
        <div className="lg:w-1/2 flex justify-center order-2 lg:order-1 mb-10 lg:mb-0">
          <img
            src="/images/collaboration-hero.jpg"
            alt="Collaborative Effort"
            className="rounded-2xl shadow-2xl w-full max-w-md object-cover aspect-square"
          />
        </div>
        <div className="lg:w-1/2 lg:pl-12 text-center lg:text-left order-1 lg:order-2">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-800 leading-tight mb-4">
            A Unified Approach to Global Well-being
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 mb-8">
            Our initiatives bring together diverse perspectives to tackle the
            most pressing health issues of our time.
          </p>
          <Link
            to="/articles"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold shadow-md"
          >
            View Our Initiatives
          </Link>
        </div>
      </section>

      {/* Article Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Featured Articles
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover insights from our latest research and community initiatives
          </p>
        </div>

        {loading.articles ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : error.articles ? (
          <div className="text-red-600 py-8 text-center">
            {error.articles}
            <button
              onClick={() => window.location.reload()}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Try Again
            </button>
          </div>
        ) : featuredArticles.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">
            No articles available
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.slice(0, 3).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onAuthorClick={handleAuthorClick}
              />
            ))}
          </div>
        )}
        {featuredArticles.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/articles"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View all articles
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
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </Link>
          </div>
        )}
      </section>

      <NewsletterSignup />
    </div>
  );
}
