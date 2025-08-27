import api from "../../utils/api";
import type { Member } from "../../models/Member";
import { uploadImageToSupabase } from "../../utils/uploadImage";

export const fetchCommitteeMembers = async (): Promise<Member[]> => {
  const response = await api.get("/members/admin");
  return response.data;
};

export const createCommitteeMember = async (
  memberData: Omit<Member, "id" | "joinDate" | "isActive">
): Promise<Member> => {
  const response = await api.post("/members/admin", memberData);
  return response.data;
};

export const updateCommitteeMember = async (
  id: number,
  memberData: Partial<Member>
): Promise<Member> => {
  const response = await api.put(`/members/admin/${id}`, memberData);
  return response.data;
};

export const deleteCommitteeMember = async (id: number): Promise<void> => {
  await api.delete(`/members/admin/${id}`);
};

// ======== Upload member image (Supabase flow) ========
export const uploadMemberImage = async (
  memberId: number,
  imageFile: File
): Promise<Member> => {
  // 1. Upload to Supabase
  const imageUrl = await uploadImageToSupabase(imageFile, "members");

  // 2. Save URL in backend
  const response = await api.put(`/members/admin/${memberId}/image`, {
    imageUrl,
  });

  return response.data;
};
