import { useEffect, useState, useRef } from "react";
import type { TeamMember } from "../../../components/TeamMemberCard";

interface Props {
  onSave: (member: TeamMember) => void;
  editingMember?: TeamMember | null;
  onCancelEdit: () => void;
}

export default function CommitteeForm({
  onSave,
  editingMember,
  onCancelEdit,
}: Props) {
  const [member, setMember] = useState<TeamMember>({
    id: "",
    name: "",
    position: "",
    description: "",
    imageUrl: "",
    hierarchyOrder: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingMember) {
      setMember(editingMember);
    }
  }, [editingMember]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMember((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!member.name || !member.position) return;
    onSave({
      ...member,
      id: member.id || crypto.randomUUID(),
      hierarchyOrder: Number(member.hierarchyOrder),
    });
    setMember({
      id: "",
      name: "",
      position: "",
      description: "",
      imageUrl: "",
      hierarchyOrder: 0,
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4 max-w-md mx-auto"
    >
      <div className="flex justify-center">
        <div
          className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 cursor-pointer hover:opacity-80 transition"
          onClick={handleImageClick}
        >
          {member.imageUrl ? (
            <img
              src={member.imageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
              Add Image
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            hidden
          />
        </div>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={member.name}
          onChange={handleChange}
          className="w-full max-w-xs border p-2 rounded mx-auto block"
        />

        <input
          type="text"
          name="position"
          placeholder="Position"
          value={member.position}
          onChange={handleChange}
          className="w-full max-w-xs border p-2 rounded mx-auto block"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={member.description}
          onChange={handleChange}
          className="w-full max-w-xs border p-2 rounded h-32 resize-none mx-auto block"
        />

        <input
          type="number"
          name="hierarchyOrder"
          placeholder="Hierarchy Order"
          value={member.hierarchyOrder}
          onChange={handleChange}
          className="w-full max-w-xs border p-2 rounded mx-auto block"
        />
      </div>

      <div className="flex justify-center space-x-4 pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingMember ? "Update" : "Add"} Member
        </button>
        {editingMember && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-gray-600 hover:text-red-600"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
