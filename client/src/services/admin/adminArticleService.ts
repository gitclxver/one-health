import api from "../../utils/api";
import type { Article } from "../../models/Article";

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

// ======== TOGGLE FEATURE article (matches your backend) ========
export const toggleFeatureArticle = async (
  id: string,
  featured: boolean
): Promise<Article> => {
  try {
    console.log(
      `Making request to feature article ${id} with featured: ${featured}`
    );
    const response = await api.put(`/articles/admin/${id}/feature`, null, {
      params: { featured },
    });
    console.log("Feature toggle response:", response);
    console.log("Feature toggle response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Toggle feature error:", error);
    throw error;
  }
};

// in ../services/admin/adminArticleService.ts
export const getArticleById = async (id: string): Promise<Article> => {
  const response = await api.get(`/articles/${id}`);
  return response.data;
};



// ======== PUBLISH article ========
export const publishArticle = async (id: string): Promise<Article> => {
  try {
    console.log(`Making POST request to /articles/admin/publish/${id}`);
    const response = await api.post(`/articles/admin/publish/${id}`);
    console.log("Publish response:", response);
    console.log("Publish response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Publish article error:", error);
    throw error;
  }
};


export const publishArticleApi = async (
  id: string,
  publish: boolean
): Promise<Article> => {
  try {
    const endpoint = publish ? "publish" : "unpublish";
    const response = await api.put<Article>(
      `/articles/admin/${id}/${endpoint}`
    );

    if (!response.data) {
      throw new Error("No data returned from publish API");
    }

    return response.data;
  } catch (error: unknown) {
    let errorMessage = "Failed to update publish status";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Publish article error:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const unpublishArticle = async (id: string): Promise<Article> => {
  return publishArticleApi(id, false);
};


// For backward compatibility
export const featureArticle = toggleFeatureArticle;

// ======== Upload image for existing article ========
export const uploadArticleImage = async (
  articleId: string,
  imageFile: File
): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await api.post(
    `/articles/admin/upload-image/${articleId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

// ======== Upload a temporary image ========
export const uploadTempImage = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await api.post("/articles/admin/upload-temp", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ======== Finalize temporary image ========
export const finalizeTempImage = async (
  tempImagePath: string,
  articleId: string
): Promise<string> => {
  const response = await api.post(
    `/articles/admin/finalize-image/${articleId}`,
    {
      tempPath: tempImagePath,
    }
  );

  return response.data;
};


