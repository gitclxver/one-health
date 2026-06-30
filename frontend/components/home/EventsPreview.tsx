import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { fetchEvents } from "@/lib/api/content.server";
import { EMPTY_MESSAGES } from "@/lib/user-messages";
import { ContentMessage } from "@/components/ui/ContentMessage";

export const revalidate = 60;

function formatEventDate(iso: string) {
  const d = new Date(iso);
  return {
    month: d.toLocaleString("en-US", { month: "short" }),
    day: d.getDate(),
  };
}

export default async function EventsPreview() {
  let upcoming: Awaited<ReturnType<typeof fetchEvents>> = [];
  let past: Awaited<ReturnType<typeof fetchEvents>> = [];
  let offline = false;

  try {
    [upcoming, past] = await Promise.all([
      fetchEvents({ status: "UPCOMING", limit: 2 }),
      fetchEvents({ status: "PAST", limit: 2 }),
    ]);
  } catch {
    offline = true;
  }

  return (
    <section id="events-preview" className="py-16 md:py-24 bg-white/40 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 mb-10 md:mb-16">
          <div>
            <span className="text-sm font-bold tracking-wide text-indigo-500 uppercase block">
              Symposiums & Presentations
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-800 mt-2">
              Academic Events & Field Studies
            </h2>
          </div>
          <Link
            href="/events"
            className="group text-sm font-semibold text-indigo-500 flex items-center gap-2 border-b-2 border-indigo-200 pb-1 shrink-0"
          >
            View full academic calendar <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {offline && (
          <ContentMessage message="Unable to load events right now. Please try again later." variant="error" />
        )}

        {!offline && upcoming.length === 0 && past.length === 0 && (
          <ContentMessage message={EMPTY_MESSAGES.events} />
        )}

        {(upcoming.length > 0 || past.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-4 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-500" /> Upcoming
              </h3>
              <div className="space-y-4">
                {upcoming.map((event) => {
                  const { month, day } = formatEventDate(event.startsAt);
                  return (
                    <Link
                      key={event.id}
                      href="/events"
                      className="bg-white border border-slate-100 p-4 md:p-5 rounded-2xl flex flex-col sm:flex-row gap-4 md:gap-5 hover:border-indigo-200 transition-colors group cursor-pointer"
                    >
                      <div className="flex sm:flex-col items-center justify-between sm:justify-center bg-indigo-50 text-indigo-600 rounded-xl px-4 py-3 sm:py-2 min-w-[70px] shrink-0 h-fit">
                        <span className="text-xs font-bold uppercase tracking-wider">{month}</span>
                        <span className="text-lg sm:text-2xl font-bold leading-none sm:mt-1">{day}</span>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {event.title}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{event.description}</p>
                      </div>
                    </Link>
                  );
                })}
                {upcoming.length === 0 && <ContentMessage message="No upcoming events scheduled." />}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-400" /> Past Archives
              </h3>
              <div className="space-y-4">
                {past.map((event) => {
                  const { month, day } = formatEventDate(event.startsAt);
                  return (
                    <div
                      key={event.id}
                      className="bg-slate-50/80 border border-slate-100 p-4 md:p-5 rounded-2xl flex flex-col sm:flex-row gap-4 md:gap-5 opacity-80"
                    >
                      <div className="flex sm:flex-col items-center justify-between sm:justify-center bg-slate-200 text-slate-600 rounded-xl px-4 py-3 sm:py-2 min-w-[70px] shrink-0 h-fit grayscale">
                        <span className="text-xs font-bold uppercase tracking-wider">{month}</span>
                        <span className="text-lg sm:text-2xl font-bold leading-none sm:mt-1">{day}</span>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-800">{event.title}</h4>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{event.description}</p>
                      </div>
                    </div>
                  );
                })}
                {past.length === 0 && <ContentMessage message="No past events to show yet." />}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
