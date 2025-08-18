import api from "../../utils/api";
import type { NewsletterSubscriber } from "../../models/NewsletterSubscriber";

export const subscribeToNewsletter = async (
  email: string
): Promise<NewsletterSubscriber> => {
  const response = await api.post("/newsletter/subscribe", { email });
  return response.data;
};

export const unsubscribeByEmail = async (
  email: string
): Promise<{ message: string }> => {
  const response = await api.delete(
    `/newsletter/unsubscribe?email=${encodeURIComponent(email)}`
  );
  return response.data;
};

export const verifyNewsletterSubscriber = async (
  token: string
): Promise<{
  status: string;
  message: string;
  verified?: boolean;
}> => {
  try {
    const response = await api.get("/newsletter/verify", {
      params: { token },
    });

    // Ensure the response has the expected format
    if (!response.data.status) {
      console.warn("Unexpected response format:", response.data);
      return {
        status: "error",
        message: "Invalid response format from server",
      };
    }

    return response.data;
  } catch (error) {
    console.error("Verification error:", error);
    return {
      status: "error",
      message: "Verification failed. Please try again later.",
    };
  }
};
