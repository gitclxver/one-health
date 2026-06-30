import type { ApiResponse } from "@/lib/types/api";
import { api, apiData } from "./client";

export interface UploadedMedia {
  id: string;
  filename: string;
  storageKey: string;
  publicUrl: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  altText?: string | null;
}

export type MediaContext = "newsletters" | "events" | "exco";

export const mediaApi = {
  upload: async (
    file: File,
    options?: { altText?: string; newsletterId?: string; context?: MediaContext },
  ): Promise<UploadedMedia> => {
    const form = new FormData();
    form.append("file", file);
    if (options?.altText) form.append("altText", options.altText);
    if (options?.newsletterId) form.append("newsletterId", options.newsletterId);
    if (options?.context) form.append("context", options.context);

    const response = await api<ApiResponse<UploadedMedia>>("/api/v1/media/upload", {
      method: "POST",
      body: form,
    });
    return response.data as UploadedMedia;
  },

  list: (page = 1, limit = 20) =>
    apiData<UploadedMedia[]>(`/api/v1/media?page=${page}&limit=${limit}`),

  remove: (id: string) => api<void>(`/api/v1/media/${id}`, { method: "DELETE" }),
};
