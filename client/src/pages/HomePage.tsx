import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import NewsletterSignup from "../components/NewsletterSignup";
import { mockArticles } from "../data/mockData";
import { fetchCommitteeMembers } from "../data/committeeApi";
import type { TeamMember } from "../components/TeamMemberCard";

export default function HomePage() {
  const navigate = useNavigate();
  const [committeeMembers, setCommitteeMembers] = useState<TeamMember[]>([]);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [loadingMembers, setLoadingMembers] = useState(true);

  // Fetch members from backend
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await fetchCommitteeMembers();
        const sorted = [...data].sort(
          (a, b) => a.hierarchyOrder - b.hierarchyOrder
        );
        setCommitteeMembers(sorted);
        setLoadingMembers(false);
      } catch (error) {
        console.error("Error fetching committee members:", error);
        setLoadingMembers(false);
      }
    };

    loadMembers();
  }, []);

  // Auto-advance leadership carousel
  useEffect(() => {
    if (committeeMembers.length === 0) return;
    const interval = setInterval(() => {
      setCurrentMemberIndex(
        (prevIndex) => (prevIndex + 1) % committeeMembers.length
      );
    }, 3000);
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
    <div className="py-12">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between text-center lg:text-center py-20 bg-white rounded-xl shadow-xl mb-16 px-8">
        <div className="lg:w-1/2">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 leading-tight mb-4 animate-fade-in-up">
            Advancing Health Together
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 animate-fade-in-up delay-100">
            Fostering collaboration across human, animal, and environmental
            health.
          </p>
          <Link
            to="/about"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors text-lg font-semibold shadow-md animate-fade-in-up delay-200"
          >
            Learn More About Us
          </Link>
        </div>
        <div className="mt-12 lg:mt-0 lg:w-1/2 flex justify-center">
          <img
            src="https://placehold.co/400x400/60a5fa/ffffff?text=One+Health"
            alt="One Health Concept"
            className="rounded-full shadow-2xl w-full max-w-sm"
          />
        </div>
      </section>

      {/* Committee Member Carousel */}
      <section className="mb-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Meet Our Leadership
        </h2>

        {loadingMembers || !currentMember ? (
          <p className="text-gray-500">Loading leadership...</p>
        ) : (
          <Link
            to={`/about/${currentMember.id}`}
            className="relative overflow-hidden w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8 cursor-pointer"
          >
            <div className="p-4 w-full text-center carousel-fade">
              <img
                src={currentMember.imageUrl}
                alt={currentMember.name}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-lg"
              />
              <h3 className="text-xl font-bold text-gray-800">
                {currentMember.name}
              </h3>
              <p className="text-blue-600 font-semibold">
                {currentMember.position}
              </p>
              <p className="mt-2 text-gray-600 text-sm italic">
                {currentMember.description}
              </p>
            </div>
          </Link>
        )}
      </section>

      {/* Hero Section 2 */}
      <section className="flex flex-col lg:flex-row items-center justify-between py-20 bg-white rounded-xl shadow-xl mb-16 px-8">
        <div className="mt-12 lg:mt-0 lg:w-1/2 flex justify-center order-2 lg:order-1">
          <img
            src="https://placehold.co/400x400/34d399/ffffff?text=Collaboration"
            alt="Collaborative Effort"
            className="rounded-full shadow-2xl w-full max-w-sm"
          />
        </div>
        <div className="lg:w-1/2 lg:pl-12 text-center order-1 lg:order-2">
          <h2 className="text-5xl md:text-6xl font-extrabold text-blue-800 leading-tight mb-4 animate-fade-in-up">
            A Unified Approach to Global Well-being
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 animate-fade-in-up delay-100">
            Our initiatives bring together diverse perspectives to tackle the
            most pressing health issues of our time.
          </p>
          <button className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors text-lg font-semibold shadow-md animate-fade-in-up delay-200">
            View Our Initiatives
          </button>
        </div>
      </section>

      {/* Article Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Latest Articles
        </h2>

        {mockArticles.length === 0 ? (
          <p className="text-xl text-gray-600 py-10 text-center">
            No articles available.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockArticles.slice(0, 3).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onAuthorClick={handleAuthorClick}
              />
            ))}
          </div>
        )}
      </section>

      <NewsletterSignup />
    </div>
  );
}
