import api from "../../utils/api";
import type { NewsletterSubscriber } from "../../models/NewsletterSubscriber";

// ======== Get all subscribers ========
export const getNewsletterSubscribers = async (): Promise<
  NewsletterSubscriber[]
> => {
  const response = await api.get("/newsletter/admin/subscribers");
  return response.data;
};

// ======== Toggle subscriber status (active/inactive) ========
export const toggleSubscriberStatus = async (
  id: number
): Promise<NewsletterSubscriber> => {
  const response = await api.patch(
    `/newsletter/admin/subscribers/${id}/toggle`
  );
  return response.data;
};

// ======== Send newsletter for a specific article ========
export const sendNewsletter = async (
  articleId: number
): Promise<{ message: string }> => {
  const response = await api.post(`/newsletter/admin/send/${articleId}`);
  return response.data;
};
