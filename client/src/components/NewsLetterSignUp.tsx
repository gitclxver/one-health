import React from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

const NewsletterSignup: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here (e.g., send email to backend)
    alert("Thank you for signing up!");
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8 rounded-xl shadow-xl flex flex-col items-center text-center max-w-lg w-full">
      <h3 className="text-3xl font-bold mb-4">Join Our Newsletter!</h3>
      <p className="text-base mb-6 opacity-90">
        Get the latest health articles, society updates, and exclusive content
        directly to your inbox.
      </p>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col sm:flex-row gap-3"
      >
        <Input
          type="email"
          placeholder="Your email address"
          className="flex-grow bg-white text-gray-800 placeholder-gray-400 border-none rounded-full py-3 px-5 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-600 shadow-sm text-base"
          required
        />
        <Button
          type="submit"
          className="bg-white text-blue-700 hover:bg-gray-100 font-semibold shadow-md hover:shadow-lg rounded-full px-6 py-3 text-base"
        >
          Subscribe Now
        </Button>
      </form>
      <p className="text-xs mt-4 opacity-70">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
};

export default NewsletterSignup;
