import { useEffect, useState, useRef } from "react";
import type { Member } from "../../../models/Member";
import {
  uploadTempImage,
  finalizeTempImage,
} from "../../../services/admin/adminMemberService";

interface Props {
  onSave: (
    member: Omit<Member, "id" | "joinDate"> & { id?: number },
    onSaved?: (id: number) => void
  ) => void;
  editingMember?: Member | null;
  onCancelEdit: () => void;
  saving: boolean;
}

const DESCRIPTION_LIMIT = 250;

export default function CommitteeForm({
  onSave,
  editingMember,
  onCancelEdit,
  saving,
}: Props) {
  const [member, setMember] = useState<Member>({
    id: 0,
    name: "",
    position: "",
    bio: "",
    imageUrl: "",
    isActive: true,
    joinDate: new Date().toISOString(),
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when not editing
  const resetForm = () => {
    setMember({
      id: 0,
      name: "",
      position: "",
      bio: "",
      imageUrl: "",
      isActive: true,
      joinDate: new Date().toISOString(),
    });
    setPreviewUrl(null);
    setUploadError(null);
  };

  useEffect(() => {
    if (editingMember) {
      setMember(editingMember);
      setPreviewUrl(null); // don't use blob in edit mode
    } else {
      resetForm();
    }
  }, [editingMember]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "bio") {
      // Enforce character limit
      if (value.length > DESCRIPTION_LIMIT) return;
    }

    setMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB");
      return;
    }

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const uploadedPath = await uploadTempImage(file);
      setMember((prev) => ({ ...prev, imageUrl: uploadedPath }));

      const blobUrl = URL.createObjectURL(file);
      setPreviewUrl(blobUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!member.name || !member.position) {
      alert("Name and position are required");
      return;
    }

    const memberData = {
      ...member,
      id: member.id || undefined,
    };

    const isTemp = member.imageUrl?.includes("temp-");

    const onSavedCallback = async (savedId: number) => {
      if (isTemp && savedId && member.imageUrl) {
        try {
          await finalizeTempImage(member.imageUrl, savedId);
        } catch {
          // Silent catch for finalizing image
        }
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };

    onSave(memberData, onSavedCallback);
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    resetForm();
    onCancelEdit();
  };

  const handleImageClick = () => {
    if (!isUploadingImage && !saving) {
      fileInputRef.current?.click();
    }
  };

  const resolvedImageUrl = previewUrl
    ? previewUrl
    : member.imageUrl?.startsWith("http") || member.imageUrl?.startsWith("/")
    ? member.imageUrl
    : member.imageUrl
    ? `${import.meta.env.VITE_API_BASE_URL}/${member.imageUrl}`
    : "";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-8 rounded-3xl"
      style={{
        background: "rgba(255, 255, 255, 0.25)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
      }}
    >
      <div className="flex justify-center mb-8">
        <div
          className={`w-32 h-32 rounded-full overflow-hidden bg-gray-200 cursor-pointer hover:opacity-80 transition relative ${
            isUploadingImage || saving ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleImageClick}
        >
          {resolvedImageUrl ? (
            <img
              src={resolvedImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
              {isUploadingImage ? "Uploading..." : "Add Image"}
            </div>
          )}
          {isUploadingImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-white text-xs">Uploading...</div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            hidden
            disabled={isUploadingImage || saving}
          />
        </div>
      </div>

      {uploadError && (
        <div className="text-red-500 text-sm text-center mb-4 px-4">
          {uploadError}
        </div>
      )}

      <div className="space-y-6">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={member.name}
          onChange={handleChange}
          className="w-full border border-[#6A8B57] p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A8B57] transition"
          disabled={saving}
          required
          maxLength={50}
        />

        <input
          type="text"
          name="position"
          placeholder="Position"
          value={member.position}
          onChange={handleChange}
          className="w-full border border-[#6A8B57] p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A8B57] transition"
          disabled={saving}
          required
          maxLength={50}
        />

        <div>
          <div className="flex justify-end mb-1 pr-2 text-xs text-[#4f6d33] select-none">
            {member.bio.length} / {DESCRIPTION_LIMIT}
          </div>
          <textarea
            name="bio"
            placeholder="Description"
            value={member.bio}
            onChange={handleChange}
            className="w-full border border-[#6A8B57] p-3 rounded-lg resize-none text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A8B57] transition"
            disabled={saving}
            rows={5}
            maxLength={DESCRIPTION_LIMIT}
          />
        </div>
      </div>

      <div className="flex justify-center space-x-6 pt-6">
        <button
          type="submit"
          disabled={saving || isUploadingImage}
          className={`px-6 py-2 rounded-full text-white font-semibold transition-colors ${
            saving || isUploadingImage
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#6A8B57] hover:bg-[#567544]"
          }`}
        >
          {saving ? "Saving..." : editingMember ? "Update" : "Add"} Member
        </button>
        {editingMember && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="text-[#6A8B57] font-semibold hover:text-[#4f6d33] disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
