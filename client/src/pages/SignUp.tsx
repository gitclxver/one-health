// src/pages/SignUpPage.tsx

import React from "react";

const SignUpPage: React.FC = () => {
  return (
    <div className="container mx-auto p-8 min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          Sign Up for Our Newsletter!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Enter your email below to receive our latest updates directly to your
          inbox.
        </p>
        <form className="flex flex-col items-center">
          <input
            type="email"
            placeholder="your.email@example.com"
            className="w-full max-w-sm px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-gray-800"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Subscribe
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-4">
          We respect your privacy. No spam, ever.
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
