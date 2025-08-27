import api from "../../utils/api";
import type { Article } from "../../models/Article";
import { uploadImageToSupabase } from "../../utils/uploadImage";

// ======== GET all admin articles ========
export const getAdminArticles = async (): Promise<Article[]> => {
  const response = await api.get("/articles/admin");
  return response.data;
};

// ======== CREATE new article ========
export const createArticle = async (
  articleData: Partial<Article>
): Promise<Article> => {
  const response = await api.post("/articles/admin", articleData);
  return response.data;
};

// ======== UPDATE article ========
export const updateArticle = async (
  id: string,
  articleData: Partial<Article>
): Promise<Article> => {
  const response = await api.put(`/articles/admin/${id}`, articleData);
  return response.data;
};

// ======== DELETE article ========
export const deleteArticle = async (id: string): Promise<void> => {
  await api.delete(`/articles/admin/${id}`);
};

// ======== GET article by ID ========
export const getArticleById = async (id: string): Promise<Article> => {
  const response = await api.get(`/articles/${id}`);
  return response.data;
};

// ======== PUBLISH article ========
export const publishArticle = async (id: string): Promise<Article> => {
  const response = await api.post(`/articles/admin/publish/${id}`);
  return response.data;
};

// ======== UNPUBLISH article (optional) ========
export const unpublishArticle = async (id: string): Promise<Article> => {
  const response = await api.put(`/articles/admin/${id}/unpublish`);
  return response.data;
};

// ======== Upload article image (Supabase flow) ========
export const uploadArticleImage = async (
  articleId: string,
  imageFile: File
): Promise<Article> => {
  // 1. Upload to Supabase
  const imageUrl = await uploadImageToSupabase(imageFile, "articles");

  // 2. Save URL in backend
  const response = await api.put(`/articles/admin/${articleId}/image`, {
    imageUrl,
  });

  return response.data;
};
