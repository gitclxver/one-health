import { useState } from "react";
import type { TeamMember } from "../../components/TeamMemberCard";
import CommitteeForm from "./committee/CommitteeForm";
import TeamMemberCard from "../../components/TeamMemberCard";
import AdminHeader from "../../components/admin/AdminHeader";

export default function ManageCommittee() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [editing, setEditing] = useState<TeamMember | null>(null);

  const handleSave = (member: TeamMember) => {
    setMembers((prev) =>
      prev.some((m) => m.id === member.id)
        ? prev.map((m) => (m.id === member.id ? member : m))
        : [...prev, member]
    );
    setEditing(null);
  };

  const handleEdit = (member: TeamMember) => {
    setEditing(member);
  };

  const handleDelete = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex-grow p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Manage Committee Members</h1>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <CommitteeForm
              onSave={handleSave}
              editingMember={editing}
              onCancelEdit={() => setEditing(null)}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Committee Members</h2>
            {members.length === 0 ? (
              <p className="text-gray-500">No committee members added yet</p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {members.map((member) => (
                  <div key={member.id} className="relative group">
                    <TeamMemberCard member={member} onClick={handleEdit} />
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
