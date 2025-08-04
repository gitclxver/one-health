// src/components/MemberCard.tsx
import React from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import type { CommitteeMember } from "../types";
import { cn } from "../lib/utils";

interface MemberCardProps {
  member: CommitteeMember;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <HoverCard.Root openDelay={200} closeDelay={300}>
      {" "}
      {/* Adjusted delays for smoother feel */}
      <HoverCard.Trigger asChild>
        <div className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-102 bg-white border border-gray-200">
          <img
            src={member.imageUrl}
            alt={member.name}
            className="w-full h-48 object-cover rounded-t-xl group-hover:opacity-90 transition-opacity duration-300"
          />
          <div className="p-4 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 text-center">
              {member.name}
            </h3>
            <p className="text-sm text-blue-600 text-center">
              {member.position}
            </p>
          </div>
        </div>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className={cn(
            "data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade",
            "bg-white p-6 rounded-lg shadow-2xl z-50",
            "max-w-xs sm:max-w-sm w-full",
            "border border-gray-200"
          )}
          sideOffset={10} // Increased distance for better separation
          align="center" // Center the hover card relative to the trigger
        >
          <img
            src={member.imageUrl}
            alt={member.name}
            className="w-28 h-28 object-cover rounded-full mx-auto mb-4 border-4 border-blue-500 shadow-md"
          />
          <h4 className="text-xl font-bold text-center text-gray-900 mb-1">
            {member.name}
          </h4>
          <p className="text-md text-blue-600 text-center mb-3">
            {member.position}
          </p>
          <p className="text-gray-700 text-sm leading-relaxed text-center">
            {member.description}
          </p>
          <HoverCard.Arrow className="fill-white w-4 h-2" />{" "}
          {/* Styled arrow */}
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

export default MemberCard;
