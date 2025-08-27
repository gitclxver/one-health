import { create } from "zustand";
import {
  fetchCommitteeMembers,
  createCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember,
  uploadMemberImage as uploadMemberImageApi,
} from "../services/admin/adminMemberService";
import type { Member } from "../models/Member";

interface MembersState {
  committeeMembers: Member[];
  currentMemberIndex: number;
  selectedMember: Member | null;
  isModalOpen: boolean;
  loading: boolean;
  saving: boolean;
  error: string | null;
  editingMember: Member | null;

  fetchAndSetMembers: () => Promise<void>;
  rotateCurrentMember: () => void;
  openModal: (member: Member) => void;
  closeModal: () => void;

  setEditingMember: (member: Member | null) => void;
  saveMember: (
    member: Omit<Member, "id" | "joinDate"> & { id?: number }
  ) => Promise<Member>;
  deleteMember: (id: number) => Promise<void>;
  uploadMemberImage: (memberId: number, imageFile: File) => Promise<Member>;
}

export const useMembersStore = create<MembersState>((set, get) => ({
  committeeMembers: [],
  currentMemberIndex: 0,
  selectedMember: null,
  isModalOpen: false,
  loading: false,
  saving: false,
  error: null,
  editingMember: null,

  fetchAndSetMembers: async () => {
    set({ loading: true, error: null });
    try {
      const members = await fetchCommitteeMembers();
      set({ committeeMembers: members, loading: false });
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to load members";
      set({ error, loading: false });
      throw error;
    }
  },

  openModal: (member) => set({ selectedMember: member, isModalOpen: true }),
  closeModal: () => set({ selectedMember: null, isModalOpen: false }),

  rotateCurrentMember: () => {
    const { committeeMembers, currentMemberIndex } = get();
    if (committeeMembers.length > 0) {
      const nextIndex = (currentMemberIndex + 1) % committeeMembers.length;
      set({ currentMemberIndex: nextIndex });
    }
  },

  setEditingMember: (member) => set({ editingMember: member }),

  saveMember: async (member) => {
    set({ saving: true, error: null });
    try {
      let saved: Member;
      if (member.id) {
        saved = await updateCommitteeMember(member.id, member);
      } else {
        saved = await createCommitteeMember(member);
      }
      await get().fetchAndSetMembers();
      set({ saving: false });
      return saved;
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to save member";
      set({ error, saving: false });
      throw error;
    }
  },

  deleteMember: async (id) => {
    set({ saving: true, error: null });
    try {
      await deleteCommitteeMember(id);
      await get().fetchAndSetMembers();
      set({ saving: false });
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to delete member";
      set({ error, saving: false });
      throw error;
    }
  },

  uploadMemberImage: async (memberId, imageFile) => {
    set({ saving: true, error: null });
    try {
      const updatedMember = await uploadMemberImageApi(memberId, imageFile);
      await get().fetchAndSetMembers();
      set({ saving: false });
      return updatedMember;
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to upload image";
      set({ error, saving: false });
      throw error;
    }
  },
}));
