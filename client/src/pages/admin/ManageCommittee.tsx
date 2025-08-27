import { useEffect } from "react";
import CommitteeForm from "./committee/CommitteeForm";
import TeamMemberCard from "../../components/TeamMemberCard";
import AdminHeader from "../../components/admin/AdminHeader";
import { useMembersStore } from "../../store/useMembersStore"; // Adjust path
import type { Member } from "../../models/Member";

export default function ManageCommittee() {
  const {
    committeeMembers,
    editingMember,
    saving,
    fetchAndSetMembers,
    setEditingMember,
    deleteMember,
  } = useMembersStore();

  useEffect(() => {
    fetchAndSetMembers();
  }, [fetchAndSetMembers]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      await deleteMember(id);
      await fetchAndSetMembers();
    } catch (error) {
      console.error("Error deleting member", error);
      alert("Failed to delete member. Please try again.");
    }
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
  };

  const sortedMembers = [...committeeMembers].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <>
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #A7CFE1 0%, #6A8B57 100%)",
        }}
      />

      <AdminHeader />

      <main className="min-h-screen max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <section
          className="mb-8 rounded-3xl p-6 text-center"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          <h1 className="text-4xl font-extrabold text-[#6A8B57]">
            Manage Committee Members
          </h1>
          <p className="mt-2 text-green-900 font-medium">
            Add, Edit, or Remove Committee Members Here.
          </p>
        </section>

        {/* Form Section */}
        <section
          className="mb-12 rounded-3xl p-8"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          <CommitteeForm
            editingMember={editingMember}
            onCancelEdit={handleCancelEdit}
          />
        </section>

        {/* Members List */}
        <section
          className="rounded-3xl p-6"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          <h2 className="text-2xl font-bold mb-6 text-[#4f6d33]">
            Committee Members ({committeeMembers.length})
          </h2>

          {sortedMembers.length === 0 ? (
            <p className="text-center text-gray-700">
              No committee members found.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {sortedMembers.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  onClick={() => handleEdit(member)}
                  onEdit={() => handleEdit(member)}
                  onDelete={() => handleDelete(member.id)}
                  showActions
                  disabled={saving}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
