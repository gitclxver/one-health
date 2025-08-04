// src/pages/About.tsx
import React from "react";
import { mockCommitteeMembers } from "../data/mockData";
import MemberCard from "../components/MemberCard";

const About: React.FC = () => {
  // Sort members by hierarchyOrder
  const sortedMembers = [...mockCommitteeMembers].sort(
    (a, b) => a.hierarchyOrder - b.hierarchyOrder
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen pt-12 pb-16">
      {/* Hero Section 1: Our Mission */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-800 mb-6 animate-fade-in-up drop-shadow-md">
          About Our Society
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto animate-fade-in-up delay-100">
          We are dedicated to advancing the **One Health** approach, recognizing
          the profound interconnectedness of human, animal, and environmental
          well-being. Our mission is to foster collaborative solutions for
          complex global health challenges.
        </p>
      </section>

      {/* Hero Section 2: Our Vision & Goals */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white shadow-xl rounded-lg mx-auto max-w-6xl my-12 animate-fade-in-up delay-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Our Vision & Goals
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              We envision a world where integrated health strategies create
              resilient communities, thriving ecosystems, and optimal health for
              all species. We strive to be a leading voice in interdisciplinary
              health advocacy and research.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-3 pl-5">
              <li>
                **Promote Research:** Drive innovation in One Health through
                cutting-edge research.
              </li>
              <li>
                **Educate & Empower:** Equip communities with knowledge on
                interconnected health issues.
              </li>
              <li>
                **Advocate for Policy:** Influence policies that support
                collaborative health solutions.
              </li>
              <li>
                **Build Networks:** Foster a robust network of interdisciplinary
                professionals.
              </li>
            </ul>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="https://images.unsplash.com/photo-1542838686-374662450890?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Our Vision"
              className="rounded-xl shadow-lg w-full h-auto object-cover border-4 border-blue-200"
            />
          </div>
        </div>
      </section>

      {/* Hero Section 3: Our Journey & Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto my-12 animate-fade-in-up delay-300">
        <h2 className="text-4xl sm:text-5xl font-bold text-blue-800 mb-10 drop-shadow-sm">
          Our Journey & Core Values
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-12 max-w-3xl mx-auto">
          Founded on the principle of holistic health, our society is built upon
          a foundation of shared values that guide our actions and aspirations.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 transform hover:scale-105 transition-transform duration-300">
            <h3 className="font-extrabold text-2xl text-blue-700 mb-3">
              Integrity
            </h3>
            <p className="text-gray-700 text-base">
              Upholding the highest ethical standards in all our endeavors,
              ensuring transparency and trust.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 transform hover:scale-105 transition-transform duration-300">
            <h3 className="font-extrabold text-2xl text-blue-700 mb-3">
              Collaboration
            </h3>
            <p className="text-gray-700 text-base">
              Working seamlessly across disciplines for truly integrated and
              holistic solutions.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 transform hover:scale-105 transition-transform duration-300">
            <h3 className="font-extrabold text-2xl text-blue-700 mb-3">
              Innovation
            </h3>
            <p className="text-gray-700 text-base">
              Embracing new ideas, technologies, and approaches to drive
              continuous progress.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 transform hover:scale-105 transition-transform duration-300">
            <h3 className="font-extrabold text-2xl text-blue-700 mb-3">
              Community Impact
            </h3>
            <p className="text-gray-700 text-base">
              Making a tangible positive difference in the lives of people,
              animals, and the planet at large.
            </p>
          </div>
        </div>
      </section>

      {/* Members Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white shadow-xl rounded-lg mx-auto max-w-6xl my-12 animate-fade-in-up delay-400">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 text-center mb-12">
          Meet Our Leadership
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sortedMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
