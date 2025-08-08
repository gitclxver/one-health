import { useEffect, useState } from "react";
import {
  getAdminArticles,
  createArticle,
  updateArticle,
  deleteArticle as deleteArticleApi,
  featureArticle,
  publishArticle,
} from "../../services/admin/adminArticleService";
import ArticleForm from "./articles/ArticleForm";
import ArticleCard from "../../components/ArticleCard";
import type { Article } from "../../models/Article";
import AdminHeader from "../../components/admin/AdminHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "react-toastify";

export default function ManageArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState({
    articles: true,
    saving: false,
    deleting: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading((prev) => ({ ...prev, articles: true }));
    setError(null);
    try {
      const data = await getAdminArticles();
      setArticles(data);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
      setError("Failed to load articles");
      toast.error("Failed to load articles");
    } finally {
      setLoading((prev) => ({ ...prev, articles: false }));
    }
  };

  const handleSave = async (
    article: Omit<Article, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ) => {
    setLoading((prev) => ({ ...prev, saving: true }));
    try {
      if (article.id) {
        // Existing article - update
        const updatedArticle = await updateArticle(article.id, article);
        setArticles((prev) =>
          prev.map((a) =>
            a.id === article.id ? { ...a, ...updatedArticle } : a
          )
        );
        toast.success("Article updated successfully");
      } else {
        // New article - create
        const newArticle = await createArticle(article);
        setArticles((prev) => [...prev, newArticle]);
        toast.success("Article created successfully");
      }
      setEditingArticle(null);
    } catch (err) {
      console.error("Failed to save article:", err);
      toast.error("Failed to save article");
    } finally {
      setLoading((prev) => ({ ...prev, saving: false }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    setLoading((prev) => ({ ...prev, deleting: true }));
    try {
      await deleteArticleApi(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast.success("Article deleted successfully");
    } catch (err) {
      console.error("Failed to delete article:", err);
      toast.error("Failed to delete article");
    } finally {
      setLoading((prev) => ({ ...prev, deleting: false }));
    }
  };

  const handleFeatureToggle = async (id: string) => {
    try {
      await featureArticle(id);
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isFeatured: !a.isFeatured } : a))
      );
      toast.success("Article feature status updated");
    } catch (err) {
      console.error("Failed to toggle feature status:", err);
      toast.error("Failed to update feature status");
    }
  };

  const handlePublishToggle = async (id: string) => {
    try {
      await publishArticle(id);
      setArticles((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, isPublished: !a.isPublished } : a
        )
      );
      toast.success("Article publish status updated");
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
      toast.error("Failed to update publish status");
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
            isSubmitting={loading.saving}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Articles</h2>
            <button
              onClick={fetchArticles}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              disabled={loading.articles}
            >
              {loading.articles ? "Refreshing..." : "Refresh Articles"}
            </button>
          </div>

          {loading.articles ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              {error}
              <button
                onClick={fetchArticles}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Retry
              </button>
            </div>
          ) : articles.length === 0 ? (
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
                    onFeatureToggle={() => handleFeatureToggle(article.id)}
                    onPublishToggle={() => handlePublishToggle(article.id)}
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
