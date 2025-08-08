import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TeamMemberCard from "../components/TeamMemberCard";
import TeamMemberModal from "../components/TeamMemberModal";
import { fetchCommitteeMembers } from "../services/public/memberService";
import type { Member } from "../models/Member";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";

export default function AboutPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCommitteeMembers();
        // Sort members by their position
        const sorted = [...data].sort((a, b) =>
          a.position.localeCompare(b.position)
        );
        setMembers(sorted);

        // If there's a member ID in the URL, try to open their modal
        if (id) {
          const found = sorted.find((m) => m.id.toString() === id);
          if (found) {
            setSelectedMember(found);
            setIsModalOpen(true);
          }
        }
      } catch (err) {
        console.error("Error loading committee members:", err);
        setError("Failed to load team members. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [id]);

  const openModal = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
    navigate(`/about/${member.id}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    navigate("/about");
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row items-center justify-between text-center lg:text-left py-12 lg:py-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-lg mb-16 px-6 lg:px-12"
      >
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 leading-tight mb-4">
            Our Mission
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8">
            We are dedicated to the One Health approach, uniting professionals
            from diverse fields to create a healthier, more sustainable world
            for everyone.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
              Learn More
            </button>
            <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
              Our Projects
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <img
            src="/images/mission-image.jpg"
            alt="Our Mission"
            className="rounded-2xl shadow-2xl w-full max-w-md object-cover aspect-square"
          />
        </div>
      </motion.section>

      {/* Vision Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-8 mb-16"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Vision</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Our vision is a future where collaborative solutions and
                interdisciplinary partnerships are the standard for addressing
                complex global health challenges, ensuring a resilient planet
                for generations to come.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mt-1 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Interdisciplinary collaboration</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mt-1 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Evidence-based solutions</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mt-1 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Sustainable practices</span>
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Core Values
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">Collaboration</h4>
                  <p className="text-gray-600 text-sm">
                    Working across disciplines to solve complex problems
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Innovation</h4>
                  <p className="text-gray-600 text-sm">
                    Developing creative solutions to emerging challenges
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Integrity</h4>
                  <p className="text-gray-600 text-sm">
                    Maintaining the highest ethical standards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Meet Our Team
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our dedicated team brings together expertise from diverse fields to
            advance the One Health approach through research, education, and
            collaboration.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            {error}
            <button
              onClick={() => window.location.reload()}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Try Again
            </button>
          </div>
        ) : members.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            No committee members available.
          </p>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {members.map((member) => (
              <motion.div key={member.id} variants={item}>
                <TeamMemberCard
                  member={member}
                  onClick={openModal}
                  showDescription={false}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Member Detail Modal */}
      <TeamMemberModal
        isOpen={isModalOpen}
        onClose={closeModal}
        member={selectedMember}
      />
    </div>
  );
}
