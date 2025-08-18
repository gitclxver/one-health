import { create } from "zustand";
import { sendNewsletter } from "../services/admin/adminNewsletterService";

interface NewsletterStore {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  sendNewsletter: (articleId: number) => Promise<void>;
}

export const useNewsletterStore = create<NewsletterStore>((set) => ({
  loading: false,
  error: null,
  successMessage: null,

  sendNewsletter: async (articleId: number) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const response = await sendNewsletter(articleId);
      set({ successMessage: response.message, loading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to send newsletter";
      set({ error: message, loading: false });
    }
  },
}));
