import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useMembersStore } from "../store/useMembersStore";
import { DEFAULT_IMAGES } from "../constants/images";

export default function TeamMemberModal() {
  const { selectedMember: member, isModalOpen, closeModal } = useMembersStore();
  if (!member) return null;

  const getImageUrl = () => {
    if (!member.imageUrl) return DEFAULT_IMAGES.AVATAR;
    if (
      member.imageUrl.startsWith("blob:") ||
      member.imageUrl.startsWith("http")
    )
      return member.imageUrl;
    return member.imageUrl.startsWith("/")
      ? `${import.meta.env.VITE_API_BASE_URL}${member.imageUrl}`
      : `${import.meta.env.VITE_API_BASE_URL}/${member.imageUrl}`;
  };

  const resolvedImageUrl = getImageUrl();
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = DEFAULT_IMAGES.AVATAR;
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
              style={{ minHeight: "24rem" }}
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
                  alt={member.name || "Team member"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  onError={handleImageError}
                />
              </div>

              <div className="md:w-1/2 flex flex-col justify-center items-center text-center p-6">
                <Dialog.Title
                  as="h3"
                  className="text-3xl font-semibold text-[#14180f] mb-2"
                >
                  {member.name}
                </Dialog.Title>
                <p className="text-[#29331e] font-medium text-lg mb-4">
                  {member.position}
                </p>

                <div className="text-[#38491f] text-base leading-relaxed max-h-60 overflow-y-auto w-full px-1">
                  {member.bio.split("\n").map((p, i) => (
                    <p key={i} className="mb-4">
                      {p}
                    </p>
                  ))}
                </div>

                <button
                  onClick={closeModal}
                  className="mt-6 px-6 py-2 border border-[#6A8B57] text-[#6A8B57] rounded hover:bg-[#6A8B57] hover:text-white transition"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
