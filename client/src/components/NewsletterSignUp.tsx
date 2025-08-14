import { useState } from "react";
import { subscribeToNewsletter } from "../services/public/newsletterService";
import { AxiosError } from "axios";

interface ApiError {
  message?: string;
}

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({
        text: "Please enter a valid email address.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      await subscribeToNewsletter(email);
      setMessage({
        text: "✅ Subscribed! Please check your inbox for future updates.",
        type: "success",
      });
      setEmail("");
    } catch (error) {
      let errorMessage = "Subscription failed. Please try again later.";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Newsletter subscription error:", error);
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  function isAxiosError(error: unknown): error is AxiosError<ApiError> {
    return (error as AxiosError).isAxiosError !== undefined;
  }

  return (
    <section
      className="flex flex-col md:flex-row items-center justify-between py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 rounded-3xl shadow-lg w-full max-w-7xl mx-auto my-8 sm:my-12 md:my-16"
      style={{
        background: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
      }}
    >
      <div className="w-full md:w-1/2 text-center md:text-left mb-6 sm:mb-8 md:mb-0 px-2 sm:px-4">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-2 sm:mb-3 text-[#456033]">
          Stay Ahead in One Health
        </h3>
        <p className="text-base sm:text-lg lg:text-xl text-gray-800 max-w-md sm:max-w-lg mx-auto md:mx-0">
          Get research highlights, event invites, and key insights—delivered
          straight to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full md:w-1/2 px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full flex-grow px-4 sm:px-5 py-2 sm:py-3 rounded-full border border-[#6A8B57] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6A8B57] shadow-sm transition text-sm sm:text-base"
            disabled={isSubmitting}
            aria-label="Email address for newsletter subscription"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className={`w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold shadow-md whitespace-nowrap transition-colors text-sm sm:text-base ${
              isSubmitting
                ? "bg-[#a0b589] cursor-not-allowed text-white"
                : "bg-[#6A8B57] hover:bg-[#567544] text-white"
            }`}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </div>

        {message && (
          <div
            role="alert"
            className={`mt-2 sm:mt-3 text-xs sm:text-sm ${
              message.type === "success"
                ? "text-green-700 font-semibold"
                : "text-red-600 font-medium"
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </section>
  );
}
