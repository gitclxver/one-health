import { Link, useNavigate } from "react-router-dom";
import logoImage from "../../assets/logo-image.jpg";
import { AdminAuthService } from "../../services/admin/adminAuthService";

export default function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await AdminAuthService.logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still navigate to login even if logout API fails
      navigate("/admin/login");
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 shadow-lg"
      style={{
        background: "linear-gradient(90deg, #A7CFE1  0%, #6a8b57 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo + Admin text */}
          <div className="flex items-center flex-shrink-0 space-x-3">
            <Link to="/admin" className="flex items-center space-x-3">
              <img
                src={logoImage}
                alt="One Health Society Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-white font-extrabold text-xl select-none">
                Admin
              </span>
            </Link>
          </div>

          {/* Center - Navigation links */}
          <div className="flex flex-1 justify-center">
            <div className="flex space-x-8">
              <Link
                to="/admin/articles"
                className="text-white hover:text-[#cde3c7] font-semibold transition-colors px-3 py-2 rounded-md text-sm"
              >
                Manage Articles
              </Link>
              <Link
                to="/admin/committee"
                className="text-white hover:text-[#cde3c7] font-semibold transition-colors px-3 py-2 rounded-md text-sm"
              >
                Manage Committee Members
              </Link>
              <Link
                to="/admin/events"
                className="text-white hover:text-[#cde3c7] font-semibold transition-colors px-3 py-2 rounded-md text-sm"
              >
                Manage Events
              </Link>
            </div>
          </div>

          {/* Right - Logout button */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="text-white hover:text-red-400 font-semibold transition-colors px-3 py-2 rounded-md text-sm cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
