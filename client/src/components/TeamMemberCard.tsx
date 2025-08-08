import type { Member } from "../models/Member";

interface TeamMemberCardProps {
  member: Member;
  onClick?: (member: Member) => void;
  showDescription?: boolean;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function TeamMemberCard({
  member,
  onClick,
  showDescription = false,
  showActions = false,
  onEdit,
  onDelete,
}: TeamMemberCardProps) {
  return (
    <div className="relative group">
      <div
        onClick={onClick ? () => onClick(member) : undefined}
        className={`${
          onClick ? "cursor-pointer hover:scale-105 hover:shadow-xl" : ""
        } bg-white rounded-lg shadow-md overflow-hidden text-center transform transition-all duration-300 p-6`}
      >
        <img
          src={member.imageUrl || "/default-avatar.png"}
          alt={member.name}
          className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/default-avatar.png";
          }}
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
          <p className="text-sm text-blue-600">{member.position}</p>

          {showDescription && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {member.bio}
            </p>
          )}
        </div>
      </div>

      {showActions && (
        <div className="absolute top-2 right-2 flex gap-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="bg-blue-100 text-blue-600 p-1 rounded-full hover:bg-blue-200 transition"
              aria-label="Edit member"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200 transition"
              aria-label="Delete member"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
