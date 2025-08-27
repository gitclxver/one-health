import { create } from "zustand";
import type { Article } from "../models/Article";
import {
  getArticleById,
  getAdminArticles,
  createArticle,
  updateArticle,
  deleteArticle as deleteArticleApi,
  publishArticle as publishArticleApi,
  uploadArticleImage as uploadArticleImageApi,
} from "../services/admin/adminArticleService";
import { useNewsletterStore } from "./useNewsletterStore";

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
  ) => Promise<Article>;
  deleteArticle: (id: string) => Promise<void>;
  publishArticle: (id: string) => Promise<void>;
  uploadArticleImage: (articleId: string, imageFile: File) => Promise<Article>;

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
    set({ loading: true, error: null });
    try {
      const article = await getArticleById(id);
      set({ currentArticle: article, loading: false });
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to load article";
      set({ error, loading: false, currentArticle: null });
      throw error;
    }
  },

  fetchAdminArticles: async () => {
    set({ loading: true, error: null });
    try {
      const articles = await getAdminArticles();
      set({ articles, loading: false });
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to load articles";
      set({ error, loading: false });
      throw error;
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
      await get().fetchAdminArticles();
      set({ saving: false });
      return saved;
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to save article";
      set({ error, saving: false });
      throw error;
    }
  },

  deleteArticle: async (id) => {
    set({ saving: true, error: null });
    try {
      await deleteArticleApi(id);
      await get().fetchAdminArticles();
      set({ saving: false });
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to delete article";
      set({ error, saving: false });
      throw error;
    }
  },

  publishArticle: async (id) => {
    set({ saving: true, error: null });
    try {
      await publishArticleApi(id);
      await useNewsletterStore.getState().sendNewsletter(Number(id));
      await get().fetchAdminArticles();
      set({ saving: false });
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to publish article";
      set({ error, saving: false });
      throw error;
    }
  },

  uploadArticleImage: async (articleId, imageFile) => {
    set({ saving: true, error: null });
    try {
      const updatedArticle = await uploadArticleImageApi(articleId, imageFile);
      await get().fetchAdminArticles();
      set({ saving: false });
      return updatedArticle;
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to upload image";
      set({ error, saving: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentArticle: () => set({ currentArticle: null }),
}));
