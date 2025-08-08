import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import ArticleCard from "../../components/ArticleCard";
import type { Article } from "../../models/Article";
import TeamMemberCard from "../../components/TeamMemberCard";
import type { Member } from "../../models/Member";
import { getAdminArticles } from "../../services/admin/adminArticleService";
import { getAllCommitteeMembers } from "../../services/admin/adminMemberService";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"articles" | "committee">(
    "articles"
  );
  const [articles, setArticles] = useState<Article[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<{
    articles: boolean;
    members: boolean;
  }>({
    articles: true,
    members: true,
  });
  const [error, setError] = useState<{
    articles: string | null;
    members: string | null;
  }>({
    articles: null,
    members: null,
  });

  // Fetch articles when tab is active or when component mounts
  useEffect(() => {
    if (activeTab === "articles" && articles.length === 0) {
      fetchArticles();
    }
  }, [activeTab, articles.length]);

  // Fetch members when tab is active or when component mounts
  useEffect(() => {
    if (activeTab === "committee" && members.length === 0) {
      fetchMembers();
    }
  }, [activeTab, members.length]);

  const fetchArticles = async () => {
    setLoading((prev) => ({ ...prev, articles: true }));
    setError((prev) => ({ ...prev, articles: null }));
    try {
      const data = await getAdminArticles();
      setArticles(data);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
      setError((prev) => ({ ...prev, articles: "Failed to load articles" }));
    } finally {
      setLoading((prev) => ({ ...prev, articles: false }));
    }
  };

  const fetchMembers = async () => {
    setLoading((prev) => ({ ...prev, members: true }));
    setError((prev) => ({ ...prev, members: null }));
    try {
      const data = await getAllCommitteeMembers();
      setMembers(data);
    } catch (err) {
      console.error("Failed to fetch committee members:", err);
      setError((prev) => ({
        ...prev,
        members: "Failed to load committee members",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, members: false }));
    }
  };

  const refreshData = () => {
    if (activeTab === "articles") {
      fetchArticles();
    } else {
      fetchMembers();
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6 overflow-y-auto">
        <AdminLayout />

        {/* Tab Navigation */}
        <div className="mb-6 flex justify-between items-center">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("articles")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "articles"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Articles
              </button>
              <button
                onClick={() => setActiveTab("committee")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "committee"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Committee Members
              </button>
            </nav>
          </div>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Refresh Data
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === "articles" ? (
            <>
              {loading.articles ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : error.articles ? (
                <div className="text-center py-12 text-red-600">
                  {error.articles}
                  <button
                    onClick={fetchArticles}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      showActions={true}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {loading.members ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : error.members ? (
                <div className="text-center py-12 text-red-600">
                  {error.members}
                  <button
                    onClick={fetchMembers}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {members.map((member) => (
                    <TeamMemberCard
                      key={member.id}
                      member={member}
                      showDescription={true}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
