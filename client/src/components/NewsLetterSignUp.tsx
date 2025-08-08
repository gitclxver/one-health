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
      setMessage({ text: "Please enter a valid email address", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      await subscribeToNewsletter(email);
      setMessage({
        text: "Thank you for subscribing to our newsletter!",
        type: "success",
      });
      setEmail(""); // Clear the form on success
    } catch (error) {
      let errorMessage = "Subscription failed. Please try again later.";

      // Type guard to check if it's an AxiosError
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      // Regular Error type check
      else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("Newsletter subscription error:", error);
      setMessage({
        text: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Type guard for AxiosError
  function isAxiosError(error: unknown): error is AxiosError<ApiError> {
    return (error as AxiosError).isAxiosError !== undefined;
  }

  return (
    <section className="py-20 relative overflow-hidden px-4">
      {/* Background Dot Pattern */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(59, 130, 246, 0.5) 1.5px, transparent 1.5px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Glass Panel */}
      <div className="relative z-10 max-w-6xl mx-auto bg-white/70 backdrop-blur-2xl border border-blue-200 p-10 md:p-14 rounded-3xl shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Text Block */}
          <div className="md:w-2/3 text-center md:text-left">
            <h3 className="text-4xl font-extrabold text-blue-800 mb-3">
              Stay Updated
            </h3>
            <p className="text-gray-700 text-lg">
              Join our newsletter to receive the latest articles and updates
              directly in your inbox.
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="md:w-1/3 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="flex-grow px-5 py-3 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800 placeholder:text-gray-500 w-full"
                required
                disabled={isSubmitting}
                aria-label="Email address for newsletter subscription"
              />
              <button
                type="submit"
                className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors whitespace-nowrap ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800 text-white"
                }`}
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </div>

            {/* Status message */}
            {message && (
              <div
                className={`mt-3 text-sm ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
                role="alert"
              >
                {message.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
