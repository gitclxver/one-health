import type { Member } from "../models/Member";
import { DEFAULT_IMAGES } from "../constants/images";

interface TeamMemberCardProps {
  member: Member;
  onClick?: (member: Member) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  showDescription?: boolean;
  disabled?: boolean;
}

export default function TeamMemberCard({
  member,
  onClick,
  onEdit,
  onDelete,
  showActions = false,
  showDescription = false,
  disabled = false,
}: TeamMemberCardProps) {
  const getImageUrl = () => {
    if (!member.imageUrl) return DEFAULT_IMAGES.AVATAR;
    if (
      member.imageUrl.startsWith("blob:") ||
      member.imageUrl.startsWith("http")
    )
      return member.imageUrl;
    if (member.imageUrl.startsWith("/"))
      return `${import.meta.env.VITE_API_BASE_URL}${member.imageUrl}`;
    return `${import.meta.env.VITE_API_BASE_URL}/${member.imageUrl}`;
  };

  const resolvedImageUrl = getImageUrl();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = DEFAULT_IMAGES.AVATAR;
  };

  const handleClick = () => {
    if (!disabled) onClick?.(member);
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white/20 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden text-center transform transition-all duration-300 cursor-pointer hover:scale-[1.03] hover:shadow-2xl border border-[#6A8B57]/40 p-6`}
      style={{ minWidth: "280px" }}
    >
      <div className="relative w-36 h-36 mx-auto mb-4">
        <img
          src={resolvedImageUrl}
          alt={member.name}
          onError={handleImageError}
          loading="lazy"
          className="w-36 h-36 rounded-full object-cover mx-auto shadow-lg border border-white/30 transform transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="px-2">
        <h3 className="text-lg font-semibold text-[#6A8B57]">{member.name}</h3>
        <p className="text-sm text-[#567544]">{member.position}</p>
        {showDescription && member.bio && (
          <p className="text-sm text-[#4a5c3a] mt-2 line-clamp-3">
            {member.bio}
          </p>
        )}
      </div>

      {showActions && (
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            disabled={disabled}
            className="px-4 py-1 bg-[#6A8B57] text-white text-sm rounded hover:bg-[#567544] shadow"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            disabled={disabled}
            className="px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 shadow"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
