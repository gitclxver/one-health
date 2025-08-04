// src/pages/HomePage.tsx

import React from "react";
import { Link } from "react-router-dom";
import CommitteeCarousel from "../components/CommitteeCarousel";
import ArticlesCarousel from "../components/ArticlesCarousel";
import { mockCommitteeMembers, mockArticles } from "../data/mockData";

const HomePage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Hero Section 1 */}
      <section className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 md:py-32 overflow-hidden shadow-xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542838686-374662450890?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        ></div>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 z-10 relative">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
              Welcome to Our Health Society Newsletter
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light opacity-90">
              Stay informed, get inspired, and join a community passionate about
              global health and wellness.
            </p>
            <Link
              to="/signup"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 transform"
            >
              Join Our Newsletter Today!
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center animate-fade-in-up delay-200">
            <img
              src="https://www.freeiconspng.com/uploads/globe-icon-png-6.png" // Simple globe illustration placeholder
              alt="Globe Illustration"
              className="w-64 h-64 md:w-80 md:h-80 object-contain animate-spin-slow"
            />
          </div>
        </div>
      </section>

      {/* Committee Members Carousel */}
      <div className="container mx-auto px-4 py-8">
        <CommitteeCarousel members={mockCommitteeMembers} />
      </div>

      {/* Hero Section 2 - Explaining the Society */}
      <section className="bg-blue-100 py-20 md:py-28 px-4 my-12 shadow-inner">
        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 flex justify-center animate-fade-in-up delay-300">
            <img
              src="https://images.unsplash.com/photo-1579586119156-f4327f123f14?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Placeholder for people collaborating
              alt="Collaborative meeting"
              className="w-full max-w-lg h-auto object-cover rounded-xl shadow-lg border border-blue-200"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left animate-fade-in-up">
            <h2 className="text-4xl font-extrabold text-gray-800 leading-tight mb-6">
              Empowering Future Health Leaders
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8 font-light">
              We are a student-led society dedicated to fostering knowledge,
              engagement, and action in critical health issues. Through our
              initiatives, we aim to inspire and equip students to make a real
              impact in the health sector.
            </p>
            <Link
              to="/about"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 transform"
            >
              Discover Our Mission
            </Link>
          </div>
        </div>
      </section>

      {/* Articles Preview Carousel */}
      <div className="container mx-auto px-4 py-8">
        <ArticlesCarousel articles={mockArticles} />
      </div>

      {/* Final Call to Action - Sign Up */}
      <section className="bg-blue-700 text-white py-16 text-center shadow-lg my-12">
        <div className="container mx-auto px-4 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Don't Miss Out!
          </h2>
          <p className="text-xl md:text-2xl mb-8 font-light opacity-90">
            Get the latest health insights, society updates, and event
            invitations directly in your inbox.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-blue-700 px-10 py-5 rounded-full text-xl font-semibold shadow-2xl hover:bg-gray-100 hover:scale-110 transition-all duration-300 transform"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
