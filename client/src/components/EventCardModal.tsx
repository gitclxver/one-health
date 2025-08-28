import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useEventStore } from "../store/useEventStore";
import { format } from "date-fns";
import { DEFAULT_IMAGES } from "../constants/images";

export default function EventModal() {
  const { selectedEvent: event, isModalOpen, closeModal } = useEventStore();
  if (!event) return null;

  const getImageUrl = () => {
    if (!event.imageUrl) return DEFAULT_IMAGES.EVENT;
    if (event.imageUrl.startsWith("blob:") || event.imageUrl.startsWith("http"))
      return event.imageUrl;
    return event.imageUrl.startsWith("/")
      ? `${import.meta.env.VITE_API_BASE_URL}${event.imageUrl}`
      : `${import.meta.env.VITE_API_BASE_URL}/${event.imageUrl}`;
  };

  const resolvedImageUrl = getImageUrl();
  const isPastEvent = new Date(event.eventDate) < new Date();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = DEFAULT_IMAGES.EVENT;
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
  };

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <Dialog.Panel
              className="w-full max-w-3xl bg-white/70 backdrop-blur-md border border-[#6A8B57]/30 rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden relative"
              style={{ minHeight: "28rem" }}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-[#6A8B57]/70 hover:text-[#6A8B57] transition text-2xl font-bold z-10"
                aria-label="Close"
              >
                &times;
              </button>

              <div className="flex-shrink-0 md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img
                  src={resolvedImageUrl}
                  alt={event.title || "Event"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onError={handleImageError}
                />
              </div>

              <div className="md:w-1/2 flex flex-col p-6 text-left">
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      isPastEvent
                        ? "bg-gray-200 text-gray-700"
                        : "bg-[#6A8B57]/10 text-[#6A8B57]"
                    }`}
                  >
                    {isPastEvent ? "Past Event" : "Upcoming Event"}
                  </span>
                </div>

                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold text-[#14180f] mb-2"
                >
                  {event.title}
                </Dialog.Title>

                <div className="mb-6">
                  {event.eventDate && (
                    <div className="flex items-center mb-2 text-[#38491f]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#6A8B57] mr-2"
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
                    <div className="flex items-center text-[#38491f]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#6A8B57] mr-2"
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
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>

                <div className="text-[#38491f] text-base leading-relaxed mb-6 max-h-60 overflow-y-auto w-full pr-2">
                  {event.description.split("\n").map((p, i) => (
                    <p key={i} className="mb-4">
                      {p}
                    </p>
                  ))}
                </div>

                <div className="mt-auto flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 border border-[#6A8B57] text-[#6A8B57] rounded hover:bg-[#6A8B57] hover:text-white transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
