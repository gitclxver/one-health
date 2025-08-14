import api from "../../utils/api";
import type { Member } from "../../models/Member";

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

export const uploadTempImage = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", imageFile); // Backend expects "image" param

  const response = await api.post("/members/admin/upload-temp", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
};


export const finalizeTempImage = async (
  tempImagePath: string,
  memberId: number
): Promise<string> => {
  const response = await api.post(`/members/admin/finalize-image/${memberId}`, {
    tempPath: tempImagePath,
  });
  
  return response.data;
};

export const uploadMemberImage = async (
  memberId: number,
  imageFile: File
): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await api.post(
    `/members/admin/upload-image/${memberId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.finalPath;
}

