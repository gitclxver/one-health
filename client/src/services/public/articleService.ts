import api from "../../utils/api";

export const getArticle = async (id: string) => {
  const response = await api.get(`/articles/${id}`);
  return response.data;
};

export const getFeaturedArticles = async () => {
  const response = await api.get("/articles/featured");
  return response.data;
};

export const getPublishedArticles = async () => {
  const response = await api.get("/articles/published");
  return response.data;
};
