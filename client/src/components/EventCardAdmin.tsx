import type { MouseEvent } from "react";
import type { Event } from "../models/Event";
import { format } from "date-fns";
import { DEFAULT_IMAGES } from "../constants/images";

interface EventCardAdminProps {
  event: Event;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  disabled?: boolean;
}

export default function EventCardAdmin({
  event,
  onEdit,
  onDelete,
  onClick,
  disabled = false,
}: EventCardAdminProps) {
  const formatDate = (dateString: string | Date) => {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  const getImageUrl = () => {
    if (!event.imageUrl) return DEFAULT_IMAGES.EVENT;
    if (event.imageUrl.startsWith("blob:") || event.imageUrl.startsWith("http"))
      return event.imageUrl;
    if (event.imageUrl.startsWith("/"))
      return `${import.meta.env.VITE_API_BASE_URL}${event.imageUrl}`;
    return `${import.meta.env.VITE_API_BASE_URL}/${event.imageUrl}`;
  };

  const resolvedImageUrl = getImageUrl();
  const isPastEvent = new Date(event.eventDate) < new Date();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = DEFAULT_IMAGES.EVENT;
  };

  const handleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && onEdit) onEdit();
  };

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      !disabled &&
      onDelete &&
      window.confirm(`Are you sure you want to delete "${event.title}"?`)
    ) {
      onDelete();
    }
  };

  const handleClick = () => {
    if (!disabled && onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full transition hover:shadow-xl ${
        disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
      }`}
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
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-[#6A8B57] line-clamp-2">
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
          <div className="flex items-center text-sm text-[#6A8B57]/70 mb-3">
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
          <div className="flex items-center text-sm text-[#6A8B57]/70 mb-4">
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

        <p className="text-[#4a5c3a] text-sm line-clamp-3 mb-4 flex-grow">
          {event.description}
        </p>
      </div>

      <div className="p-4 border-t border-[#6A8B57]/20 flex justify-center gap-3">
        <button
          onClick={handleEdit}
          disabled={disabled}
          className="px-4 py-1 bg-[#6A8B57] text-white text-sm rounded hover:bg-[#567544] shadow"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={disabled}
          className="px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 shadow"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
