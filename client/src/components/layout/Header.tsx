import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-extrabold text-blue-700">
              One Health Society
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex space-x-8">
              <Link
                to="/about"
                className="text-gray-600 hover:text-blue-700 font-semibold transition-colors"
              >
                About
              </Link>
              <Link
                to="/articles"
                className="text-gray-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Articles
              </Link>
            </div>
          </div>
          <div className="flex space-x-4">
            <button className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
              Login
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors font-semibold">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
