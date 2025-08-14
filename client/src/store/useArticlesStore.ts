import { create } from "zustand";
import type { Article } from "../models/Article";
import {
  getArticleById,
  getAdminArticles,
  createArticle,
  updateArticle,
  deleteArticle as deleteArticleApi,
  toggleFeatureArticle as toggleFeatureArticleApi,
  publishArticle as publishArticleApi,
  unpublishArticle as unpublishArticleApi,
} from "../services/admin/adminArticleService";

interface ArticlesState {
  articles: Article[];
  currentArticle: Article | null;
  loading: boolean;
  saving: boolean;
  error: string | null;

  loadArticleById: (id: string) => Promise<void>;
  fetchAdminArticles: () => Promise<void>;
  saveArticle: (
    article: Omit<Article, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ) => Promise<Article | null>;
  deleteArticle: (id: string) => Promise<void>;

  toggleFeatureArticle: (id: string, newStatus: boolean) => Promise<boolean>;
  togglePublishArticle: (id: string, newStatus: boolean) => Promise<boolean>;

  clearError: () => void;
  clearCurrentArticle: () => void;
}

export const useArticlesStore = create<ArticlesState>((set, get) => ({
  articles: [],
  currentArticle: null,
  loading: false,
  saving: false,
  error: null,

  loadArticleById: async (id) => {
    set({ loading: true, error: null, currentArticle: null });
    try {
      const article = await getArticleById(id);
      set({ currentArticle: article, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : String(err),
        currentArticle: null,
      });
    }
  },

  fetchAdminArticles: async () => {
    set({ loading: true, error: null });
    try {
      const articles = await getAdminArticles();
      set({ articles, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      });
    }
  },

  saveArticle: async (article) => {
    set({ saving: true, error: null });
    try {
      let saved: Article;
      if (article.id) {
        saved = await updateArticle(article.id, article);
      } else {
        saved = await createArticle(article);
      }
      // Refresh list after save
      await get().fetchAdminArticles();
      set({ saving: false });
      return saved;
    } catch (error) {
      set({ saving: false });
      throw error;
    }
  },

  deleteArticle: async (id) => {
    set({ saving: true, error: null });
    try {
      await deleteArticleApi(id);
      // Refresh list after delete
      await get().fetchAdminArticles();
      set({ saving: false });
    } catch (error) {
      set({ saving: false });
      throw error;
    }
  },

  togglePublishArticle: async (id, newStatus) => {
    set({ saving: true, error: null });
    try {
      if (newStatus) {
        await publishArticleApi(id);
      } else {
        await unpublishArticleApi(id);
      }
      // Refresh list after publish toggle
      await get().fetchAdminArticles();
      set({ saving: false });
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(errorMsg);
      set({ saving: false });
      return false;
    }
  },

  toggleFeatureArticle: async (id, newStatus) => {
    set({ saving: true, error: null });
    try {
      await toggleFeatureArticleApi(id, newStatus);
      // Refresh list after feature toggle
      await get().fetchAdminArticles();
      set({ saving: false });
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(errorMsg);
      set({ saving: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),

  clearCurrentArticle: () => set({ currentArticle: null }),
}));
