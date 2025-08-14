import { useEffect, useState } from "react";
import ArticleFormContainer from "./ArticleFormContainer";
import ArticleCard from "../../components/ArticleCardAdmin";
import AdminHeader from "../../components/admin/AdminHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "react-toastify";
import { useArticlesStore } from "../../store/useArticlesStore";
import type { Article } from "../../models/Article";

export default function ManageArticles() {
  const {
    articles,
    loading,
    saving,
    error,
    fetchAdminArticles,
    saveArticle,
    deleteArticle,
  } = useArticlesStore();

  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    fetchAdminArticles();
  }, [fetchAdminArticles]);

  const onSaveDone = () => {
    setEditingArticle(null);
  };

  const handleSave = async (
    article: Omit<Article, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ) => {
    try {
      await saveArticle(article);
      toast.success(
        `Article ${article.id ? "updated" : "created"} successfully`
      );
      onSaveDone();
    } catch {
      toast.error("Failed to save article");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      await deleteArticle(id);
      toast.success("Article deleted successfully");
      if (editingArticle?.id === id) {
        setEditingArticle(null);
        setResetTrigger((prev) => prev + 1);
      }
    } catch {
      toast.error("Failed to delete article");
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateNew = () => {
    setEditingArticle(null);
    setResetTrigger((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #A7CFE1 0%, #6A8B57 100%)",
        }}
      />

      <AdminHeader />

      <main className="min-h-screen max-w-5xl mx-auto px-6 py-10">
        <section
          className="mb-8 rounded-3xl p-6 text-center"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          <h1 className="text-4xl font-extrabold text-[#6A8B57]">
            Manage Articles
          </h1>
          <p className="mt-2 text-green-900 font-medium">
            Add, Edit, or Remove Articles Here.
          </p>
        </section>

        <section
          className="mb-12 rounded-3xl p-8"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#4f6d33]">
              {editingArticle ? "Edit Article" : "Create New Article"}
            </h2>
            {editingArticle && (
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                disabled={saving}
              >
                Create New Article
              </button>
            )}
          </div>

          <ArticleFormContainer
            article={editingArticle || undefined}
            onDone={onSaveDone}
            saving={saving}
            onCancel={() => setEditingArticle(null)}
            onSave={handleSave}
            resetTrigger={resetTrigger}
          />

          {saving && (
            <p className="mt-2 text-gray-600">Saving article, please wait...</p>
          )}
        </section>

        <section
          className="rounded-3xl p-6"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#4f6d33]">
              Articles ({articles.length})
            </h2>
            <div className="flex gap-3">
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                disabled={loading}
              >
                New Article
              </button>
              <button
                onClick={fetchAdminArticles}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh Articles"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              {error}
              <button
                onClick={fetchAdminArticles}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Retry
              </button>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12 text-gray-700">
              <p className="mb-4">No articles found.</p>
              <button
                onClick={handleCreateNew}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Create Your First Article
              </button>
            </div>
          ) : (
            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              }}
            >
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => handleEdit(article)}
                  onEdit={() => handleEdit(article)}
                  onDelete={() => handleDelete(article.id)}
                  disabled={saving}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
