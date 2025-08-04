// src/components/SearchBar.tsx

import React from "react";
import { Input } from "./ui/Input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search articles by title, author, or keywords...",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <Input
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent text-lg bg-white"
      />
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
    </div>
  );
};

export default SearchBar;
