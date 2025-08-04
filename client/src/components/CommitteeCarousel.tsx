// src/components/CommitteeCarousel.tsx

import React, { useState, useEffect } from "react";
import type { CommitteeMember } from "../types";
import { useNavigate } from "react-router-dom";

interface CommitteeCarouselProps {
  members: CommitteeMember[];
}

const CommitteeCarousel: React.FC<CommitteeCarouselProps> = ({ members }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (members.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % members.length);
    }, 4000); // Change member every 4 seconds
    return () => clearInterval(interval);
  }, [members]);

  const handleMemberClick = (memberId: string) => {
    // This will redirect to the generic about page for now.
    // In the future, you can extend this to dynamic profile pages like /about/members/:id
    navigate("/about", { state: { highlightMember: memberId } }); // Pass state to potentially highlight member on About page
  };

  if (members.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        No committee members to display yet.
      </div>
    );
  }

  const currentMember = members[currentIndex];

  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-indigo-50 py-16 px-4 overflow-hidden rounded-lg shadow-inner my-12">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12 animate-fade-in-up">
        Meet Our Committee
      </h2>
      <div
        className="relative w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center transition-all duration-700 ease-in-out transform hover:scale-105 cursor-pointer border border-blue-200"
        onClick={() => handleMemberClick(currentMember.id)}
      >
        <div className="absolute top-4 right-4 text-blue-400 text-sm font-semibold">
          {currentIndex + 1} / {members.length}
        </div>
        <img
          src={currentMember.imageUrl}
          alt={currentMember.name}
          className="w-40 h-40 object-cover rounded-full border-4 border-blue-400 shadow-md mb-6 transition-transform duration-500 ease-in-out animate-fade-in-out"
        />
        <h3 className="text-3xl font-bold text-gray-900 mb-2 text-center animate-fade-in-out">
          {currentMember.name}
        </h3>
        <p className="text-xl text-blue-600 font-semibold text-center animate-fade-in-out">
          {currentMember.position}
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
          Learn More About Us
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-2 mt-8">
        {members.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentIndex
                ? "bg-blue-600 scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to member ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default CommitteeCarousel;
