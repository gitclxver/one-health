"use client";

import { useEffect, useState } from "react";
import { adminNewslettersApi } from "@/lib/api/admin";
import { getUserMessage, EMPTY_MESSAGES } from "@/lib/user-messages";
import { notifyError, notifySuccess } from "@/lib/toast";
import { ContentMessage } from "@/components/ui/ContentMessage";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import { Loader2 } from "lucide-react";

interface ArticleRow {
  id?: string;
  title: string;
  slug: string;
  status?: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await adminNewslettersApi.list({ limit: 50 });
      setArticles(res.data as ArticleRow[]);
    } catch (err) {
      setError(getUserMessage(err, "Unable to load articles."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await adminNewslettersApi.create({
        title,
        content,
        excerpt,
        ...(featuredImage ? { featuredImage } : {}),
      });
      setTitle("");
      setContent("");
      setExcerpt("");
      setFeaturedImage("");
      notifySuccess("Article saved as draft");
      await load();
    } catch (err) {
      notifyError(getUserMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish(id: string) {
    try {
      await adminNewslettersApi.publish(id);
      notifySuccess("Article published");
      await load();
    } catch (err) {
      notifyError(getUserMessage(err));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Articles</h1>

      <form
        onSubmit={handleCreate}
        className="bg-white/70 border border-slate-100 rounded-2xl p-5 mb-8 space-y-4"
      >
        <h2 className="font-semibold text-slate-800">New article</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#6aabaf]"
        />
        <input
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short excerpt"
          className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#6aabaf]"
        />
        <ImageUpload
          label="Featured image"
          value={featuredImage}
          onChange={setFeaturedImage}
          context="newsletters"
          altText={title || "Article featured image"}
        />
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Content</label>
          <RichTextEditor value={content} onChange={setContent} placeholder="Write your article…" />
        </div>
        <button
          type="submit"
          disabled={saving || !content.trim()}
          className="px-4 py-2 rounded-full bg-slate-700 text-white text-sm font-semibold disabled:opacity-60 flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save draft
        </button>
      </form>

      {error && <ContentMessage message={error} variant="error" />}
      {loading && <Loader2 className="w-6 h-6 animate-spin text-[#6aabaf] mx-auto" />}
      {!loading && !error && articles.length === 0 && (
        <ContentMessage message={EMPTY_MESSAGES.articles} />
      )}

      <div className="space-y-3">
        {articles.map((article) => (
          <div
            key={article.slug}
            className="bg-white/70 border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <p className="font-semibold text-slate-800">{article.title}</p>
              <p className="text-xs text-slate-500">
                {article.status ?? "PUBLISHED"} · /{article.slug}
              </p>
            </div>
            {article.id && article.status !== "PUBLISHED" && (
              <button
                type="button"
                onClick={() => void handlePublish(article.id!)}
                className="px-4 py-2 rounded-full bg-[#6aabaf] text-white text-xs font-semibold shrink-0"
              >
                Publish
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
