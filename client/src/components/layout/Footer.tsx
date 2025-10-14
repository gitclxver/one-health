export default function Footer() {
  return (
    <footer className="bg-gray-900 text-[#cde3c7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-2xl font-bold tracking-wider">One Health Society</p>
        <p className="mt-2 text-gray-300 text-sm">
          Connecting students, professionals, and communities for a healthier
          future.
        </p>

        <div className="flex justify-center mt-6 space-x-6">
          <a
            href="https://www.instagram.com/onehealthstudentsociety_nust"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-transform transform hover:scale-110"
            aria-label="Instagram"
          >
            <svg
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.11 0-3.472.012-4.694.068-2.585.118-3.962 1.5-4.08 4.08-.056 1.222-.067 1.583-.067 4.694s.011 3.472.067 4.694c.118 2.583 1.496 3.962 4.08 4.08 1.222.056 1.583.067 4.694.067s3.472-.011 4.694-.067c2.583-.118 3.962-1.496 4.08-4.08.056-1.222.067-1.583.067-4.694s-.011-3.472-.067-4.694c-.118-2.582-1.496-3.962-4.08-4.08-1.222-.056-1.584-.068-4.694-.068zm0 4.398c-2.32 0-4.192 1.872-4.192 4.192s1.872 4.192 4.192 4.192 4.192-1.872 4.192-4.192-1.872-4.192-4.192-4.192zm0 6.588c-1.32 0-2.396-1.076-2.396-2.396s1.076-2.396 2.396-2.396 2.396 1.076 2.396 2.396-1.076 2.396-2.396 2.396zm4.65-6.78c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25z" />
            </svg>
          </a>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6">
          <p className="text-sm text-gray-400">
            Designed by{" "}
            <a
              href="https://github.com/gitclxver"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#cde3c7]"
            >
              Tinomuvongaishe Mpofu
            </a>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            © 2025 One Health Society. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
