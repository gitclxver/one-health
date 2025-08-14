import { Link } from "react-router-dom";
import logoImage from "../../assets/logo-image.jpg";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 shadow-lg"
      style={{
        background: "linear-gradient(90deg, #A7CFE1 0%, #6a8b57 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src={logoImage}
                alt="One Health Society Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-white font-extrabold text-xl select-none hidden sm:inline">
                One Health
              </span>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-4 lg:space-x-8">
              <Link
                to="/"
                className="text-white hover:text-[#cde3c7] font-semibold transition-colors px-3 py-2 rounded-md text-sm lg:text-base"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-white hover:text-[#cde3c7] font-semibold transition-colors px-3 py-2 rounded-md text-sm lg:text-base"
              >
                About
              </Link>
              <Link
                to="/articles"
                className="text-white hover:text-[#cde3c7] font-semibold transition-colors px-3 py-2 rounded-md text-sm lg:text-base"
              >
                Articles
              </Link>
            </div>
          </div>

          {/* Desktop Join Button */}
          <div className="hidden md:flex items-center">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeWJGyDt76QY3FjPzcREUjfyJ_yfIo9g34Vdid3jT5h3l3ILg/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#6A8B57] px-4 py-2 rounded-full hover:bg-[#cde3c7] transition-colors font-semibold text-sm lg:text-base"
            >
              Join Society
            </a>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#6a8b57] bg-opacity-95 rounded-lg mt-2 py-2">
            <div className="flex flex-col space-y-2 px-4 pb-3">
              <Link
                to="/"
                className="text-white hover:text-[#cde3c7] font-semibold transition-colors px-3 py-2 rounded-md text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-white hover:text-[#cde3c7] font-semibold transition-colors px-3 py-2 rounded-md text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/articles"
                className="text-white hover:text-[#cde3c7] font-semibold transition-colors px-3 py-2 rounded-md text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Articles
              </Link>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeWJGyDt76QY3FjPzcREUjfyJ_yfIo9g34Vdid3jT5h3l3ILg/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#6A8B57] text-center px-4 py-2 rounded-full hover:bg-[#cde3c7] transition-colors font-semibold text-base mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Join Society
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
