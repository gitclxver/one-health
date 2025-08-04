import TeamMemberCard from "../components/TeamMemberCard";
import { mockCommitteeMembers } from "../data/mockData";

export default function AboutPage() {
  const sortedMembers = [...mockCommitteeMembers].sort(
    (a, b) => a.hierarchyOrder - b.hierarchyOrder
  );

  return (
    <div className="py-12">
      {/* Hero Section for About Page */}
      <section className="flex flex-col lg:flex-row items-center justify-between text-center lg:text-left py-20 bg-white rounded-xl shadow-xl mb-16 px-8">
        <div className="lg:w-1/2">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 leading-tight mb-4 animate-fade-in-up">
            Our Mission
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 animate-fade-in-up delay-100">
            We are dedicated to the One Health approach, uniting professionals
            from diverse fields to create a healthier, more sustainable world
            for everyone.
          </p>
        </div>
        <div className="mt-12 lg:mt-0 lg:w-1/2 flex justify-center">
          <img
            src="https://placehold.co/400x400/60a5fa/ffffff?text=Our+Mission"
            alt="Our Mission"
            className="rounded-full shadow-2xl w-full max-w-sm"
          />
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Our vision is a future where collaborative solutions and
          interdisciplinary partnerships are the standard for addressing complex
          global health challenges, ensuring a resilient planet for generations
          to come.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sortedMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
}
