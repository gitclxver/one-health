// src/pages/admin/ManageArticles.tsx
import { useEffect, useState } from "react";
import {
  addArticle,
  deleteArticle,
  getArticles,
  updateArticle,
} from "../../data/articles";
import ArticleForm from "./articles/ArticleForm";
import ArticleCard from "../../components/ArticleCard";
import type { Article } from "../../components/ArticleCard";
import AdminHeader from "../../components/admin/AdminHeader";

export default function ManageArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  useEffect(() => {
    setArticles(getArticles());
  }, []);

  const handleSave = (article: Article) => {
    if (articles.find((a) => a.id === article.id)) {
      updateArticle(article);
    } else {
      addArticle(article);
    }
    setArticles(getArticles());
    setEditingArticle(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      deleteArticle(id);
      setArticles(getArticles());
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex-grow p-6 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Manage Articles</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <ArticleForm
            article={editingArticle}
            onSave={handleSave}
            onCancel={() => setEditingArticle(null)}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Articles</h2>
          {articles.length === 0 ? (
            <p className="text-gray-500">No articles added yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article) => (
                <div key={article.id} className="relative group">
                  <ArticleCard
                    article={article}
                    showActions
                    onEdit={() => setEditingArticle(article)}
                    onDelete={() => handleDelete(article.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
