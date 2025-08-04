import { useState } from 'react'
//import { Link } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import { mockArticles } from '../data/mockData'

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredArticles = mockArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  
  return (
    <div className="py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">Our Latest Articles</h1>
        <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
          Dive deep into research, community initiatives, and expert insights.
        </p>
        <div className="flex justify-center mt-8">
          <input
            type="text"
            placeholder="Search articles..."
            className="px-4 py-2 border border-gray-300 rounded-full w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-lg p-8 mb-12 transform hover:scale-105 transition-transform duration-300">
        <div className="max-w-lg mx-auto">
          <h3 className="text-3xl font-extrabold text-gray-900 mb-2">Subscribe to Our Newsletter</h3>
          <p className="text-gray-600 mb-6">Get the latest One Health insights delivered to your inbox.</p>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Articles'}
        </h2>
        {filteredArticles.length === 0 ? (
          <p className="text-center text-xl text-gray-600 py-10">No articles found matching your search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}