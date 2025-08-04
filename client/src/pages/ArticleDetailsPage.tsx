import { Link, useParams } from "react-router-dom";
import { mockArticles } from "../data/mockData";

export default function ArticleDetailsPage() {
  const { id } = useParams();
  const article = mockArticles.find((a) => a.id === id);

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
    <div className="bg-white rounded-lg shadow-xl p-8 lg:p-12 my-12">
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
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md mb-8"
      />
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
        {article.title}
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        By <span className="font-semibold text-blue-700">{article.author}</span>{" "}
        on {article.date}
      </p>
      <div
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-10"
        dangerouslySetInnerHTML={{ __html: article.fullContent }}
      />
    </div>
  );
}
