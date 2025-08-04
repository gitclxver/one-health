// src/components/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Section 1: About Us */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-blue-300">
            About OneHealth Society
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Dedicated to fostering integrated approaches to human, animal, and
            environmental health for a healthier, sustainable future.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-blue-300">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/articles"
                className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
              >
                Articles
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
              >
                Sign Up
              </Link>
            </li>
            {/* Add more links as needed */}
          </ul>
        </div>

        {/* Section 3: Contact */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-blue-300">Contact Us</h3>
          <p className="text-gray-300 text-sm">
            Email:{" "}
            <a
              href="mailto:info@onehealthsociety.org"
              className="hover:text-blue-400 transition-colors"
            >
              info@onehealthsociety.org
            </a>
          </p>
          <p className="text-gray-300 text-sm mt-2">
            Follow Us:
            <div className="flex justify-center md:justify-start gap-4 mt-2">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>{" "}
              {/* Placeholder for social icons */}
              <a href="#" className="hover:text-blue-400 transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} OneHealth Society. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
