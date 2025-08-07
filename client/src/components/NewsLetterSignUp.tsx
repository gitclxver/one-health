export default function NewsletterSignup() {
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
              Stay Connected
            </h3>
            <p className="text-gray-700 text-lg">
              Subscribe to get the latest articles, updates, and insights
              directly to your inbox.
            </p>
          </div>

          {/* Signup Form */}
          <form className="md:w-1/3 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="email"
                placeholder="you@example.com"
                className="flex-grow px-5 py-3 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800 placeholder:text-gray-500 w-full"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
