import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TeamMemberCard from "../components/TeamMemberCard";
import TeamMemberModal from "../components/TeamMemberModal";
import { fetchCommitteeMembers } from "../data/committeeApi";
import type { TeamMember } from "../components/TeamMemberCard";

export default function AboutPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await fetchCommitteeMembers();
        const sorted = [...data].sort(
          (a, b) => a.hierarchyOrder - b.hierarchyOrder
        );
        setMembers(sorted);
        setLoading(false);

        // If there's a member ID in the URL, try to open their modal
        if (id) {
          const found = sorted.find((m) => m.id === id);
          if (found) {
            setSelectedMember(found);
            setIsModalOpen(true);
          }
        }
      } catch (err) {
        console.error("Error loading committee members:", err);
        setLoading(false);
      }
    };

    loadMembers();
  }, [id]);

  const openModal = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
    navigate(`/about/${member.id}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    navigate("/about");
  };

  return (
    <div className="py-12">
      {/* Hero Section */}
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

      {/* Vision Section */}
      <section className="bg-white rounded-lg shadow-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Our vision is a future where collaborative solutions and
          interdisciplinary partnerships are the standard for addressing complex
          global health challenges, ensuring a resilient planet for generations
          to come.
        </p>
      </section>

      {/* Team Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Meet Our Team
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading members...</p>
        ) : members.length === 0 ? (
          <p className="text-center text-gray-500">
            No committee members available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {members.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                onClick={openModal}
              />
            ))}
          </div>
        )}
      </section>

      {/* Member Detail Modal */}
      <TeamMemberModal
        isOpen={isModalOpen}
        onClose={closeModal}
        member={selectedMember}
      />
    </div>
  );
}
