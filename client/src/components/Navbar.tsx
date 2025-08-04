// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white bg-opacity-90 shadow-lg backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-blue-700 hover:text-blue-800 transition-colors"
            >
              OneHealth Society
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium transition-colors ${
                  isActive ? "text-blue-700 border-b-2 border-blue-700" : ""
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/articles"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium transition-colors ${
                  isActive ? "text-blue-700 border-b-2 border-blue-700" : ""
                }`
              }
            >
              Articles
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium transition-colors ${
                  isActive ? "text-blue-700 border-b-2 border-blue-700" : ""
                }`
              }
            >
              About
            </NavLink>
            {/* Add other NavLinks as needed */}
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                `text-blue-700 hover:text-blue-800 px-3 py-2 rounded-md text-lg font-medium transition-colors ${
                  isActive ? "text-blue-700 border-b-2 border-blue-700" : ""
                }`
              }
            >
              Sign Up
            </NavLink>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </NavLink>
            <NavLink
              to="/articles"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Articles
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </NavLink>
            {/* Add other NavLinks as needed */}
            <NavLink
              to="/signup"
              onClick={() => setIsOpen(false)}
              className="text-blue-700 hover:bg-blue-50 hover:text-blue-800 block px-3 py-2 rounded-md text-base font-medium"
            >
              Sign Up
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
