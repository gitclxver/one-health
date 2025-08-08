import { useState, useEffect } from "react";
import type { Member } from "../../models/Member";
import CommitteeForm from "./committee/CommitteeForm";
import TeamMemberCard from "../../components/TeamMemberCard";
import AdminHeader from "../../components/admin/AdminHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "react-toastify";
import {
  getAllCommitteeMembers,
  createCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember,
} from "../../services/admin/adminMemberService";

export default function ManageCommittee() {
  const [members, setMembers] = useState<Member[]>([]);
  const [editing, setEditing] = useState<Member | null>(null);
  const [loading, setLoading] = useState({
    members: true,
    saving: false,
    deleting: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading((prev) => ({ ...prev, members: true }));
    setError(null);
    try {
      const data = await getAllCommitteeMembers();
      setMembers(data);
    } catch (err) {
      console.error("Failed to fetch members:", err);
      setError("Failed to load committee members");
      toast.error("Failed to load committee members");
    } finally {
      setLoading((prev) => ({ ...prev, members: false }));
    }
  };

  const handleSave = async (
    member: Omit<Member, "id" | "joinDate"> & { id?: number }
  ) => {
    setLoading((prev) => ({ ...prev, saving: true }));
    try {
      if (member.id) {
        // Existing member - update
        const updatedMember = await updateCommitteeMember(member.id, member);
        setMembers((prev) =>
          prev.map((m) => (m.id === member.id ? updatedMember : m))
        );
        toast.success("Member updated successfully");
      } else {
        // New member - create
        const newMember = await createCommitteeMember(member);
        setMembers((prev) => [...prev, newMember]);
        toast.success("Member created successfully");
      }
      setEditing(null);
    } catch (err) {
      console.error("Failed to save member:", err);
      toast.error("Failed to save member");
    } finally {
      setLoading((prev) => ({ ...prev, saving: false }));
    }
  };

  const handleEdit = (member: Member) => {
    setEditing(member);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    setLoading((prev) => ({ ...prev, deleting: true }));
    try {
      await deleteCommitteeMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      if (editing?.id === id) setEditing(null);
      toast.success("Member deleted successfully");
    } catch (err) {
      console.error("Failed to delete member:", err);
      toast.error("Failed to delete member");
    } finally {
      setLoading((prev) => ({ ...prev, deleting: false }));
    }
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Committee Members</h2>
              <button
                onClick={fetchMembers}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                disabled={loading.members}
              >
                {loading.members ? "Refreshing..." : "Refresh Members"}
              </button>
            </div>

            {loading.members ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">
                {error}
                <button
                  onClick={fetchMembers}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Retry
                </button>
              </div>
            ) : members.length === 0 ? (
              <p className="text-gray-500">No committee members added yet</p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {members.map((member) => (
                  <div key={member.id} className="relative group">
                    <TeamMemberCard
                      member={member}
                      onClick={() => handleEdit(member)}
                      showActions
                      onEdit={() => handleEdit(member)}
                      onDelete={() => handleDelete(member.id)}
                    />
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
