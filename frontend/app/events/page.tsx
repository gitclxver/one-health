"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Mic, Map, Loader2 } from "lucide-react";
import { eventsApi } from "@/lib/api/content";
import { getUserMessage, EMPTY_MESSAGES } from "@/lib/user-messages";
import { ContentMessage } from "@/components/ui/ContentMessage";
import type { EventItem } from "@/lib/types/api";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventsPage() {
  const [filter, setFilter] = useState("all");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    eventsApi
      .list()
      .then(setEvents)
      .catch((err) => setError(getUserMessage(err, "Unable to load events.")))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return event.status === "UPCOMING";
    if (filter === "past") return event.status === "PAST";
    return true;
  });

  return (
    <div className="w-full pt-28 md:pt-40 pb-16 md:pb-24 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 space-y-10 md:space-y-12">
      <div className="space-y-4">
        <span className="text-sm font-semibold tracking-wide text-[#6aabaf] block">Academic Calendar</span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-800">Symposiums & Field Projects</h1>
        <p className="text-slate-600 text-base font-normal">
          Join fellow society members for upcoming research events, workshops, and hands-on field studies.
        </p>
      </div>

      <div className="space-y-8 pt-6">
        <div className="flex flex-nowrap md:flex-wrap gap-2 md:gap-3 overflow-x-auto pb-4 md:pb-0 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {["all", "upcoming", "past"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`snap-start shrink-0 px-5 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
                filter === f
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {f === "all" ? "All Events" : f === "upcoming" ? "Upcoming" : "Past Archives"}
            </button>
          ))}
        </div>

        {loading && <Loader2 className="w-8 h-8 animate-spin text-[#6aabaf] mx-auto" />}
        {error && <ContentMessage message={error} variant="error" />}
        {!loading && !error && filteredEvents.length === 0 && (
          <ContentMessage message={EMPTY_MESSAGES.events} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const isPast = event.status === "PAST";
            const Icon = event.location?.toLowerCase().includes("field") ? Map : Mic;
            return (
              <div
                key={event.id}
                className={`bg-white/60 backdrop-blur-md border border-slate-100 rounded-[24px] overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-[#B3DEE2]/20 hover:border-[#B3DEE2] transition-all ${
                  isPast ? "opacity-80 hover:opacity-100 grayscale hover:grayscale-0" : ""
                }`}
              >
                <div className="relative w-full aspect-[16/10] bg-slate-200 border-b border-slate-100 overflow-hidden">
                  {event.imageUrl && (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className={`absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${isPast ? "text-slate-500" : "text-indigo-600"}`}>
                    <Icon className="w-3 h-3" /> {event.status === "UPCOMING" ? "Upcoming" : "Archive"}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className={`text-sm font-semibold tracking-wide mb-2 ${isPast ? "text-slate-500" : "text-[#6aabaf]"}`}>
                    {formatDate(event.startsAt)}
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{event.title}</h3>
                  <p className="text-base text-slate-600 font-normal line-clamp-3">{event.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
