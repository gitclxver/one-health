export interface TeamMember {
  id: string;
  name: string;
  position: string;
  description: string;
  imageUrl: string;
  hierarchyOrder: number;
}

interface TeamMemberCardProps {
  member: TeamMember;
  onClick?: (member: TeamMember) => void; // optional for flexibility
  showDescription?: boolean; // optional to show truncated description
}

export default function TeamMemberCard({
  member,
  onClick,
  showDescription = false,
}: TeamMemberCardProps) {
  return (
    <div
      onClick={onClick ? () => onClick(member) : undefined}
      className={`${
        onClick ? "cursor-pointer hover:scale-105 hover:shadow-xl" : ""
      } bg-white rounded-lg shadow-md overflow-hidden text-center transform transition-all duration-300 p-6`}
    >
      <img
        src={member.imageUrl}
        alt={member.name}
        className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-lg"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
        <p className="text-sm text-blue-600">{member.position}</p>

        {showDescription && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {member.description}
          </p>
        )}
      </div>
    </div>
  );
}
