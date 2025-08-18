import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { unsubscribeByEmail } from "../services/public/newsletterService";

export default function UnsubscribePage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = async () => {
      if (!email) {
        setStatus("error");
        setMessage("Missing email address in the unsubscribe link.");
        return;
      }

      try {
        const res = await unsubscribeByEmail(email);
        setStatus("success");
        setMessage(res.message || "You have been unsubscribed.");
      } catch {
        setStatus("error");
        setMessage(
          "Unsubscription failed. This link may be invalid or expired."
        );
      }
    };

    unsubscribe();
  }, [email]);

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg text-center">
      <h1 className="text-2xl font-bold mb-4">Unsubscribe</h1>
      {status === "loading" ? (
        <p>Processing your request...</p>
      ) : (
        <p className={`text-${status === "success" ? "green" : "red"}-600`}>
          {message}
        </p>
      )}
    </div>
  );
}
