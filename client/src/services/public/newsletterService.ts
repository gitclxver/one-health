import api from "../../utils/api";
import type { NewsletterSubscriber } from "../../models/NewsletterSubscriber";

export const subscribeToNewsletter = async (
  email: string
): Promise<NewsletterSubscriber> => {
  const response = await api.post("/newsletter/subscribe", { email });
  return response.data;
};
