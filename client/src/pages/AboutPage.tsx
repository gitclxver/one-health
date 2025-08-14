import { useEffect } from "react";
import TeamMemberCard from "../components/TeamMemberCard";
import TeamMemberModal from "../components/TeamMemberModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";
import globeImage from "../assets/globe-image.jpg";
import { animateScroll as scroller } from "react-scroll";
import { useMembersStore } from "../store/useMembersStore";
import type { Member } from "../models/Member";

export default function AboutPage() {
  const { committeeMembers, fetchAndSetMembers, loading, error, openModal } =
    useMembersStore();

  useEffect(() => {
    fetchAndSetMembers();
  }, [fetchAndSetMembers]);

  const handleMemberClick = (member: Member) => {
    openModal(member);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #A7CFE1 0%, #6A8B57 100%)",
        }}
      />

      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col">
        {/* Hero Section */}
        <section
          className="flex flex-col lg:flex-row items-center justify-between py-12 lg:py-20 mb-12 lg:mb-16 px-4 sm:px-6 lg:px-12 rounded-3xl shadow-lg w-full"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          <div className="lg:w-1/2 mb-8 lg:mb-0 flex flex-col items-center text-center lg:text-left px-2 sm:px-4">
            <p className="text-base sm:text-lg text-[#6A8B57] font-semibold uppercase tracking-wide mb-2">
              Future Health Leaders
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#6A8B57] leading-tight mb-4">
              The One Health Student Society
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 font-light">
              Empowering Students to Shape the Future of Health
            </p>
            <button
              onClick={() => {
                const membersSection =
                  document.getElementById("members-section");
                if (membersSection) {
                  scroller.scrollTo(membersSection.offsetTop, {
                    smooth: true,
                    duration: 800,
                    offset: -80,
                  });
                }
              }}
              className="inline-block bg-[#6A8B57] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#567544] transition-colors text-base sm:text-lg font-semibold shadow-md"
            >
              Explore Our Community
            </button>
          </div>

          <div className="lg:w-1/2 flex justify-center w-full">
            <div
              className="relative"
              style={{
                width: "100%",
                maxWidth: "400px",
                aspectRatio: "1/1", // Ensures perfect circle
              }}
            >
              <div
                className="rounded-full overflow-hidden w-full h-full shadow-2xl relative"
                style={{
                  filter: "drop-shadow(0 0 15px rgba(106,139,87,0.5))",
                }}
              >
                <img
                  src={globeImage}
                  alt="One Health Concept"
                  className="w-full h-full object-cover"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(106,139,87,0.4))",
                    transition: "transform 0.6s ease",
                  }}
                />
              </div>
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow: "0 0 30px 10px rgba(106,139,87,0.3)",
                  filter: "blur(10px)",
                  zIndex: -1,
                }}
              />
            </div>
          </div>
        </section>

        {/* Team Section */}
        <motion.section
          id="members-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 lg:mb-16 px-2 sm:px-0"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Our dedicated team brings together expertise from diverse fields
              to advance the One Health approach through research, education,
              and collaboration.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => fetchAndSetMembers()}
                className="px-6 py-3 bg-[#6A8B57] text-white rounded-lg hover:bg-[#567544] text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          ) : committeeMembers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No committee members available.
            </p>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {[...committeeMembers]
                .sort((a, b) => a.position.localeCompare(b.position))
                .map((member) => (
                  <motion.div
                    key={member.id}
                    variants={item}
                    className="flex justify-center"
                  >
                    <TeamMemberCard
                      member={member}
                      onClick={() => handleMemberClick(member)}
                      showDescription={false}
                    />
                  </motion.div>
                ))}
            </motion.div>
          )}
        </motion.section>
      </div>

      <TeamMemberModal />
    </>
  );
}
