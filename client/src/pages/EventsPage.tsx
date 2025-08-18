import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useEventStore } from "../store/useEventStore";
import { FiSearch, FiArrowLeft, FiCalendar } from "react-icons/fi";
import EventModal from "../components/EventCardModal";
import type { Event } from "../models/Event";

export default function EventsPage() {
  const navigate = useNavigate();
  const {
    allEvents = [], // Provide default empty array
    loading,
    error,
    fetchAllEvents,
    selectEvent,
  } = useEventStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past">(
    "all"
  );
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        await fetchAllEvents();
      } catch (err) {
        setLocalError("Failed to load events. Please try again later.");
        console.error("Error fetching events:", err);
      }
    };

    loadEvents();
  }, [fetchAllEvents]);

  // Safely handle cases where allEvents might not be an array
  const safeEvents = Array.isArray(allEvents) ? allEvents : [];

  const filteredEvents = safeEvents.filter((event: Event) => {
    try {
      const matchesSearch =
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const now = new Date();
      const eventDate = new Date(event.eventDate || "");

      if (activeTab === "upcoming") return matchesSearch && eventDate >= now;
      if (activeTab === "past") return matchesSearch && eventDate < now;
      return matchesSearch;
    } catch (e) {
      console.error("Error filtering event:", event, e);
      return false;
    }
  });

  const handleEventClick = (event: Event) => {
    selectEvent(event);
    navigate(`/events/${event.id}`);
  };

  // Combined error state
  const displayError = localError || error;

  return (
    <>
      {/* Background gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #A7CFE1 0%, #6A8B57 100%)",
        }}
      />

      {/* Main container */}
      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page header */}
        <section
          className="text-center mb-12 sm:mb-16 py-12 sm:py-16 px-4 sm:px-6 lg:px-12 rounded-3xl shadow-lg"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          <div className="flex justify-center mb-4">
            <FiCalendar className="h-10 w-10 text-[#6A8B57]" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#6A8B57] mb-3 sm:mb-4">
            Our Events
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover upcoming events, workshops, and past event highlights from
            One Health Student Society
          </p>
        </section>

        {/* Events section */}
        <section
          className="rounded-3xl p-6 sm:p-8 shadow-lg mb-8"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          {/* Search bar and tabs */}
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search Events"
                className="block w-full pl-10 pr-3 py-3 sm:py-4 border border-[#6A8B57] rounded-full bg-white bg-opacity-70 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6A8B57] focus:border-transparent text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-[#6A8B57] text-white"
                    : "bg-white/70 text-[#6A8B57] hover:bg-[#6A8B57]/10"
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === "upcoming"
                    ? "bg-[#6A8B57] text-white"
                    : "bg-white/70 text-[#6A8B57] hover:bg-[#6A8B57]/10"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === "past"
                    ? "bg-[#6A8B57] text-white"
                    : "bg-white/70 text-[#6A8B57] hover:bg-[#6A8B57]/10"
                }`}
              >
                Past Events
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12 sm:py-16">
              <LoadingSpinner />
            </div>
          ) : displayError ? (
            <div className="text-center py-12 sm:py-16">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                Something went wrong
              </h3>
              <p className="text-base sm:text-lg text-red-600 mb-4 sm:mb-6">
                {displayError}
              </p>
              <button
                onClick={fetchAllEvents}
                className="px-5 sm:px-6 py-2 sm:py-3 bg-[#6A8B57] text-white rounded-lg hover:bg-[#567544] transition-colors font-medium text-sm sm:text-base"
              >
                Try Again
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                {searchTerm
                  ? "No matching events found"
                  : `No ${
                      activeTab === "all" ? "" : activeTab
                    } events available`}
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                {searchTerm
                  ? "Try a different search term"
                  : activeTab === "upcoming"
                  ? "Check back later for upcoming events!"
                  : activeTab === "past"
                  ? "We haven't had any events yet."
                  : "We haven't scheduled any events yet."}
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-5 sm:px-6 py-2 sm:py-3 bg-[#6A8B57] text-white rounded-lg hover:bg-[#567544] transition-colors font-medium text-sm sm:text-base"
                >
                  Clear Search
                </button>
              ) : (
                <Link
                  to="/"
                  className="inline-flex items-center text-[#6A8B57] hover:text-[#567544] transition-colors font-semibold text-sm sm:text-base"
                >
                  <FiArrowLeft className="mr-2 w-5 h-5" />
                  Back to Home
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                  {activeTab === "all"
                    ? searchTerm
                      ? "Search Results"
                      : "All Events"
                    : activeTab === "upcoming"
                    ? "Upcoming Events"
                    : "Past Events"}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {filteredEvents.length} event
                  {filteredEvents.length !== 1 ? "s" : ""} found
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredEvents.map((event: Event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="cursor-pointer"
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Call to action */}
        <section className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-[#6A8B57] hover:text-[#567544] transition-colors font-semibold text-sm sm:text-base"
          >
            <FiArrowLeft className="mr-2 w-5 h-5" />
            Back to Home
          </Link>
        </section>

        {/* Event Modal */}
        <EventModal />
      </div>
    </>
  );
}
