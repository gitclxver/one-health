import { create } from "zustand";
import type { NewsletterSubscriber } from "../models/NewsletterSubscriber";
import {
  getNewsletterSubscribers,
  sendNewsletter,
} from "../services/admin/adminNewsletterService";

interface NewsletterStore {
  subscribers: NewsletterSubscriber[];
  loading: boolean;
  error: string | null;
  fetchSubscribers: () => Promise<void>;
  sendNewsletter: (articleId: number) => Promise<void>; // Keep as number to match service
}

export const useNewsletterStore = create<NewsletterStore>((set) => ({
  subscribers: [],
  loading: false,
  error: null,

  fetchSubscribers: async () => {
    set({ loading: true });
    try {
      const subs = await getNewsletterSubscribers();
      set({ subscribers: subs, loading: false });
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      set({
        error: error || "Please try again.",
        loading: false,
      });
    }
  },
  sendNewsletter: async (articleId) => {
    try {
      await sendNewsletter(articleId);
    } catch (err) {
      console.error("Sending newsletter failed", err);
      throw err;
    }
  },
}));
