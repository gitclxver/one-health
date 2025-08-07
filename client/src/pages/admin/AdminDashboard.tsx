import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import ArticleCard from "../../components/ArticleCard";
import type { Article } from "../../components/ArticleCard";
import TeamMemberCard from "../../components/TeamMemberCard";
import type { TeamMember } from "../../components/TeamMemberCard"; 
import { getArticles } from "../../data/articles";
import { getCommittee } from "../../data/committee";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"articles" | "committee">(
    "articles"
  );
  const [articles] = useState<Article[]>(getArticles());
  const [members] = useState<TeamMember[]>(getCommittee());

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6 overflow-y-auto">
        <AdminLayout />

        {/* Tab Navigation */}
        <div className="mb-6">
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
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === "articles" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  showActions={false}
                />
              ))}
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
        </div>
      </div>
    </div>
  );
}
