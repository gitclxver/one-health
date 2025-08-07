import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import type { TeamMember } from "./TeamMemberCard";

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
}

export default function TeamMemberModal({
  isOpen,
  onClose,
  member,
}: TeamMemberModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay with blur and transparency */}
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

        {/* Centered modal */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-center align-middle shadow-2xl transition-all relative">
                {member && (
                  <>
                    {/* Close button (top right) */}
                    <button
                      onClick={onClose}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                      aria-label="Close"
                    >
                      &times;
                    </button>

                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md"
                    />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 font-medium mb-4">
                      {member.position}
                    </p>
                    <p className="text-gray-600 text-sm whitespace-pre-line">
                      {member.description}
                    </p>

                    <button
                      onClick={onClose}
                      className="mt-6 px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Close
                    </button>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
