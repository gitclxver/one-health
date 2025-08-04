export default function NewsletterSignup() {
  return (
    <section className="py-12">
      <div className="bg-blue-200 p-8 rounded-lg shadow-xl max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-300">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 text-center md:text-left mb-6 md:mb-0">
            <h3 className="text-3xl font-extrabold text-blue-900 mb-2">
              Join Our Community
            </h3>
            <p className="text-blue-800">
              Subscribe to our newsletter for the latest insights, events, and
              news.
            </p>
          </div>
          <div className="md:w-1/3">
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
