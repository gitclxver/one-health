import { useEffect } from "react";
import { Link } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import TeamMemberCard from "../components/TeamMemberCard";
import NewsletterSignup from "../components/NewsletterSignUp";
import LoadingSpinner from "../components/LoadingSpinner";
import { useArticlesStore } from "../store/useArticlesStore";
import { useMembersStore } from "../store/useMembersStore";

import heroGlobeImage from "../assets/hero-globe-image.svg";
import aimImage from "../assets/aim-image.jpg";

export default function HomePage() {
  const {
    committeeMembers,
    currentMemberIndex,
    loading: membersLoading,
    error: membersError,
    fetchAndSetMembers,
    rotateCurrentMember,
  } = useMembersStore();

  const {
    articles,
    loading: articlesLoading,
    error: articlesError,
    fetchAdminArticles,
  } = useArticlesStore();

  useEffect(() => {
    fetchAndSetMembers();
    fetchAdminArticles();
  }, [fetchAdminArticles, fetchAndSetMembers]);

  useEffect(() => {
    const interval = setInterval(rotateCurrentMember, 5000);
    return () => clearInterval(interval);
  }, [rotateCurrentMember]);

  const currentMember = committeeMembers?.[currentMemberIndex] ?? null;
  const displayArticles = articles.slice(0, 3);

  // --- Helper components for conditional rendering ---

  const CommitteeSection = () => {
    if (membersLoading) {
      return (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      );
    }

    if (membersError) {
      return (
        <div className="text-red-600 py-8">
          {membersError}
          <button
            onClick={fetchAndSetMembers}
            className="ml-4 px-4 py-2 bg-[#6A8B57] text-white rounded hover:bg-[#567544] text-sm"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!committeeMembers.length) {
      return <p className="text-gray-500 py-8">No Committee Members found</p>;
    }

    return (
      <div className="max-w-sm mx-auto w-full">
        <TeamMemberCard member={currentMember} showDescription={false} />
      </div>
    );
  };

  const ArticlesSection = () => {
    if (articlesLoading) {
      return (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      );
    }

    if (articlesError) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{articlesError}</p>
          <button
            onClick={fetchAdminArticles}
            className="px-4 py-2 bg-[#6A8B57] text-white rounded hover:bg-[#567544] text-sm"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!articles.length) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No articles available</p>
          <Link
            to="/articles"
            className="inline-flex items-center text-[#6A8B57] hover:text-[#567544] transition-colors text-lg font-semibold"
          >
            View All Articles
            <svg
              className="ml-2 w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {displayArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Background Gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #A7CFE1 0%, #6A8B57 100%)",
        }}
      />

      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col">
        {/* Welcome Section */}
        <section
          className="flex flex-col lg:flex-row items-center justify-between py-12 lg:py-20 mb-12 lg:mb-16 px-4 sm:px-6 lg:px-12 rounded-3xl shadow-lg w-full"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          <div className="lg:w-1/2 mb-8 lg:mb-0 flex flex-col items-center text-center px-2 sm:px-4">
            <p className="text-base sm:text-lg text-[#6A8B57] font-semibold uppercase tracking-wide mb-2 animate-fade-in-up">
              Welcome to the NUST
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#6A8B57] leading-tight mb-4 animate-fade-in-up">
              One Health Student Society
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 font-light animate-fade-in-up delay-100">
              Connecting Health, Science &amp; People
            </p>
            <Link
              to="/about"
              className="inline-block bg-[#6A8B57] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#567544] transition-colors text-base sm:text-lg font-semibold shadow-md animate-fade-in-up delay-200"
            >
              Explore Our Community
            </Link>
          </div>

          <div className="lg:w-1/2 flex justify-center w-full">
            <div
              className="rounded-full overflow-hidden shadow-2xl w-full max-w-xs sm:max-w-sm relative"
              style={{ filter: "drop-shadow(0 0 15px rgba(106,139,87,0.5))" }}
            >
              <img
                src={heroGlobeImage}
                alt="One Health Concept"
                className="w-full h-auto rounded-full object-cover"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(106,139,87,0.4))",
                  transition: "transform 0.6s ease",
                  animation: "fadeInUp 1s ease forwards",
                }}
              />
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow: "0 0 30px 10px rgba(106,139,87,0.3)",
                  filter: "blur(10px)",
                  zIndex: -1,
                }}
              />
            </div>
          </div>
        </section>

        {/* Committee Section */}
        <section className="mb-12 lg:mb-16 text-center px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
            Meet Our Committee
          </h2>
          <CommitteeSection />
        </section>

        {/* Movement Section */}
        <section
          className="flex flex-col lg:flex-row items-center justify-between py-12 lg:py-20 mb-12 lg:mb-16 px-4 sm:px-6 lg:px-12 rounded-3xl shadow-lg w-full"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          <div
            className="lg:w-1/2 flex justify-center mb-8 lg:mb-0 order-2 lg:order-1 w-full"
            style={{ minWidth: "18rem", minHeight: "18rem" }}
          >
            <div
              className="rounded-full overflow-hidden shadow-2xl relative"
              style={{
                width: "18rem",
                height: "18rem",
                filter: "drop-shadow(0 0 15px rgba(167,207,225,0.5))",
              }}
            >
              <img
                src={aimImage}
                alt="Collaborative Effort"
                className="w-full h-full rounded-full object-cover"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(167,207,225,0.4))",
                  transition: "transform 0.6s ease",
                  animation: "fadeInUp 1s ease forwards",
                }}
              />
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow: "0 0 30px 10px rgba(167,207,225,0.3)",
                  filter: "blur(10px)",
                  zIndex: -1,
                }}
              />
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col items-center text-center px-2 sm:px-4 order-1 lg:order-2 mb-8 lg:mb-0">
            <p className="text-base sm:text-lg text-[#6A8B57] font-semibold uppercase tracking-wide mb-2 animate-fade-in-up">
              Protecting Health
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#6A8B57] leading-tight mb-4 animate-fade-in-up">
              <span>For People</span>
              <br />
              <span>Animals</span>
              <br />
              <span>&amp;</span>
              <br />
              <span>Our Planet</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 font-light animate-fade-in-up delay-100">
              It's Not Just a Concept, It's a Movement
            </p>
            <Link
              to="/articles"
              className="inline-block bg-[#6A8B57] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#567544] transition-colors text-base sm:text-lg font-semibold shadow-md animate-fade-in-up delay-200"
            >
              View Our Articles
            </Link>
          </div>
        </section>

        {/* Articles Section */}
        <section className="mb-12 lg:mb-16 px-2 sm:px-0">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
              Latest Articles
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Discover insights from our latest research and community
              initiatives
            </p>
          </div>
          <ArticlesSection />
        </section>

        <NewsletterSignup />
      </div>

      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease forwards;
        }
        .animate-fade-in-up.delay-100 {
          animation-delay: 0.1s;
        }
        .animate-fade-in-up.delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </>
  );
}
