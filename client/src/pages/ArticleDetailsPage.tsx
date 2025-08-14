import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useArticlesStore } from "../store/useArticlesStore";
import defaultArticleImage from "../assets/default-article-image.png";

export default function ArticleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const {
    currentArticle: article,
    loading,
    error,
    loadArticleById,
  } = useArticlesStore();

  useEffect(() => {
    if (id) {
      loadArticleById(id);
    }
  }, [id, loadArticleById]);

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return defaultArticleImage;
    if (imageUrl.startsWith("blob:")) return imageUrl;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))
      return imageUrl;
    if (imageUrl.startsWith("/"))
      return `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`;
    return `${import.meta.env.VITE_API_BASE_URL}/${imageUrl}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== defaultArticleImage) {
      target.src = defaultArticleImage;
    }
  };

  const getDisplayDate = (): string => {
    if (!article) return "";
    const dateToUse = article.publishedAt || article.createdAt;
    if (!dateToUse) return "Date unavailable";
    return new Date(dateToUse).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const backgroundElement = (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background: "linear-gradient(135deg, #A7CFE1 0%, #6A8B57 100%)",
      }}
    />
  );

  if (loading) {
    return (
      <>
        {backgroundElement}
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {backgroundElement}
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center bg-white/20 backdrop-blur-md rounded-3xl shadow-lg p-6 sm:p-8 md:p-12 max-w-lg w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              {error.toLowerCase().includes("not found")
                ? "Article Not Found"
                : "Error"}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/articles"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-white/30 hover:bg-white/40 rounded-lg text-sm sm:text-base font-medium"
              >
                <svg
                  className="mr-2 w-4 h-4 sm:w-5 sm:h-5"
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
                  />
                </svg>
                Back to All Articles
              </Link>
              <button
                onClick={() => loadArticleById(id!)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-[#6A8B57] text-white rounded-lg hover:bg-[#567544] text-sm sm:text-base font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!article) {
    return (
      <>
        {backgroundElement}
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center bg-white/20 backdrop-blur-md rounded-3xl shadow-lg p-6 sm:p-8 md:p-12 max-w-lg w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              Article Not Found
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
              The article you're looking for doesn't exist or is not available.
            </p>
            <Link
              to="/articles"
              className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-white/30 hover:bg-white/40 rounded-lg text-sm sm:text-base font-medium"
            >
              <svg
                className="mr-2 w-4 h-4 sm:w-5 sm:h-5"
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
                />
              </svg>
              Back to All Articles
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {backgroundElement}

      <div className="relative min-h-screen w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <article
          className="bg-white bg-opacity-30 backdrop-blur-md rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto"
          style={{ border: "1px solid rgba(255, 255, 255, 0.18)" }}
        >
          <Link
            to="/articles"
            className="inline-flex items-center text-[#6A8B57] hover:text-[#567544] mb-4 sm:mb-6 text-sm sm:text-base font-medium"
          >
            <svg
              className="mr-2 w-4 h-4 sm:w-5 sm:h-5"
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
              />
            </svg>
            Back to All Articles
          </Link>

          <img
            src={getImageUrl(article.imageUrl)}
            alt={article.title}
            className="w-full h-auto max-h-64 sm:max-h-80 md:max-h-96 object-cover rounded-3xl shadow-md mb-4 sm:mb-6"
            loading="lazy"
            onError={handleImageError}
          />

          <div className="mb-4 sm:mb-6">
            {article.isFeatured && (
              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full mb-2 sm:mb-3">
                Featured Article
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#6A8B57] mb-2 sm:mb-3 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm sm:text-base text-[#567544]">
              <span>{getDisplayDate()}</span>
              <span className="text-xs sm:text-sm text-[#567544]/70">
                By One Health Student Society
              </span>
            </div>
          </div>

          <div className="mb-3 sm:mb-4">
            <p className="text-base sm:text-lg text-[#567544] italic">
              {article.description}
            </p>
          </div>

          <div
            className="prose prose-sm sm:prose-base max-w-none text-[#567544] leading-relaxed mb-6 sm:mb-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </div>
    </>
  );
}
