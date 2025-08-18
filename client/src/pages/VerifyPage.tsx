import { useEffect, useCallback, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyNewsletterSubscriber } from "../services/public/newsletterService";

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const verificationAttempted = useRef(false); // Track if we've attempted verification

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const verifyToken = useCallback(async () => {
    if (!token || verificationAttempted.current) return; // Skip if no token or already attempted

    verificationAttempted.current = true; // Mark as attempted
    setStatus("loading");
    setMessage("Verifying your subscription...");

    try {
      const result = await verifyNewsletterSubscriber(token);
      console.log("Verification result:", result);

      if (result.status === "success" || result.verified) {
        setStatus("success");
        setMessage(result.message || "Email successfully verified!");
        setTimeout(() => navigate("/"), 3000);
      } else {
        setStatus("error");
        setMessage(result.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
      setMessage(
        "An error occurred during verification. Please try again later."
      );
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token && status === "idle") {
      verifyToken();
    }
  }, [token, status, verifyToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
        {/* Status display remains the same */}
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-blue-600">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-green-600">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-lg">{message}</p>
            <p className="text-sm mt-2 text-gray-500">
              You'll be redirected shortly...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="text-red-600">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <p className="text-lg">{message}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition"
            >
              Return to Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
