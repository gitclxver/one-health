import { ApiError } from "@/lib/api/client";

export function getUserMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return "Please sign in to continue.";
    if (error.status === 403) return "You don't have permission to do that.";
    if (error.status === 404) return "We couldn't find what you're looking for.";
    if (error.status >= 500) return "Unable to load content right now. Please try again later.";
    if (error.message && !error.message.toLowerCase().includes("internal server")) {
      return error.message;
    }
    return fallback;
  }

  if (error instanceof TypeError || (error instanceof Error && error.message.includes("fetch"))) {
    return "Unable to connect. Please check your connection and try again.";
  }

  return fallback;
}

export const EMPTY_MESSAGES = {
  articles: "No publications yet. Check back soon.",
  events: "No events scheduled yet.",
  exco: "Executive committee information is not available yet.",
  subscribers: "No subscribers yet.",
  users: "No users found.",
  applications: "No membership applications yet.",
} as const;
