import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getArticle } from "../services/public/articleService";
import { fetchCommitteeMembers } from "../services/public/memberService";
import type { Article } from "../models/Article";
import type { Member } from "../models/Member";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ArticleDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error("Article ID is missing");
        }

        const [articleData, membersData] = await Promise.all([
          getArticle(id),
          fetchCommitteeMembers(),
        ]);

        setArticle(articleData);
        setMembers(membersData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load article. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAuthorClick = () => {
    if (!article) return;

    const matchedMember = members.find(
      (member) => member.name.toLowerCase() === article.author.toLowerCase()
    );

    if (matchedMember) {
      navigate(`/about/${matchedMember.id}`);
    } else {
      alert("Author profile not found.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Error</h1>
        <p className="text-xl text-gray-600 mb-6">{error}</p>
        <Link
          to="/articles"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-lg font-semibold"
        >
          Back to All Articles
        </Link>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Article Not Found
        </h1>
        <Link
          to="/articles"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-lg font-semibold"
        >
          Back to All Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 lg:p-12 my-12 max-w-5xl mx-auto">
      <Link
        to="/articles"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors text-lg font-semibold"
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

      {article.featuredImage && (
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md mb-8"
        />
      )}

      <div className="mb-8">
        {article.isFeatured && (
          <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
            Featured Article
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          {article.title}
        </h1>
        <p className="text-xl text-gray-600">
          By{" "}
          <button
            onClick={handleAuthorClick}
            className="font-semibold text-blue-700 hover:underline focus:outline-none"
          >
            {article.author}
          </button>{" "}
          on{" "}
          {new Date(
            article.publishedAt || article.createdAt
          ).toLocaleDateString()}
        </p>
      </div>

      <div
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-10"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
