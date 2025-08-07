import { Link, useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex-shrink-0">
            <Link to="/admin" className="text-2xl font-extrabold text-blue-700">
              One Health Dashboard
            </Link>
          </div>

          {/* Center - Navigation links */}
          <div className="flex flex-1 justify-center">
            <div className="flex space-x-8">
              <Link
                to="/admin/articles"
                className="text-gray-600 hover:text-blue-700 font-semibold transition-colors px-3 py-2 rounded-md text-sm"
              >
                Manage Articles
              </Link>
              <Link
                to="/admin/committee"
                className="text-gray-600 hover:text-blue-700 font-semibold transition-colors px-3 py-2 rounded-md text-sm"
              >
                Manage Committee Members
              </Link>
            </div>
          </div>

          {/* Right - Logout button */}
          <div className="flex items-center">
            <button
              onClick={() => {
                localStorage.removeItem("currentUser");
                navigate("/");
              }}
              className="text-gray-600 hover:text-red-600 font-semibold transition-colors px-3 py-2 rounded-md text-sm cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
