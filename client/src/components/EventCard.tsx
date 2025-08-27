import type { Event } from "../models/Event";
import { useEventStore } from "../store/useEventStore";
import defaultEventImage from "../assets/default-event-image.png";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const { selectEvent } = useEventStore();

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  const getImageUrl = () => {
    if (!event.imageUrl) return defaultEventImage;
    if (event.imageUrl.startsWith("blob:")) return event.imageUrl;
    if (
      event.imageUrl.startsWith("http://") ||
      event.imageUrl.startsWith("https://")
    )
      return event.imageUrl;
    if (event.imageUrl.startsWith("/"))
      return `${import.meta.env.VITE_API_BASE_URL}${event.imageUrl}`;
    return `${import.meta.env.VITE_API_BASE_URL}/${event.imageUrl}`;
  };

  const resolvedImageUrl = getImageUrl();
  const isPastEvent = new Date(event.eventDate) < new Date();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== defaultEventImage) target.src = defaultEventImage;
  };

  return (
    <div
      className="block h-full bg-white/20 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
      style={{ border: "1px solid rgba(106, 139, 87, 0.3)" }}
    >
      <img
        src={resolvedImageUrl}
        alt={event.title}
        className="w-full h-48 object-cover"
        loading="lazy"
        onError={handleImageError}
      />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-xl font-semibold text-[#6A8B57] line-clamp-2 flex-grow">
            {event.title}
          </h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              isPastEvent
                ? "bg-gray-200 text-gray-700"
                : "bg-[#6A8B57]/10 text-[#6A8B57]"
            }`}
          >
            {isPastEvent ? "Past" : "Upcoming"}
          </span>
        </div>

        {event.eventDate && (
          <div className="flex items-center text-sm text-[#6A8B57]/70 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formatDate(event.eventDate)}</span>
          </div>
        )}

        {event.location && (
          <div className="flex items-center text-sm text-[#6A8B57]/90 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="line-clamp-1">{event.location}</span>
          </div>
        )}
        
        <div className="flex justify-center mt-auto">
          <button
            onClick={() => selectEvent(event)}
            className="border border-[#6A8B57] text-[#6A8B57] px-4 py-2 rounded hover:bg-[#6A8B57] hover:text-white transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
