import { create } from "zustand";
import {
  fetchCommitteeMembers,
  createCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember,
} from "../services/admin/adminMemberService"; 
import type { Member } from "../models/Member";

interface MembersState {
  committeeMembers: Member[];
  currentMemberIndex: number;
  selectedMember: Member | null;
  isModalOpen: boolean;
  loading: boolean;
  error: string | null;

  editingMember: Member | null;
  saving: boolean;

  fetchAndSetMembers: () => Promise<void>;
  rotateCurrentMember: () => void;
  openModal: (member: Member) => void;
  closeModal: () => void;

  setEditingMember: (member: Member | null) => void;
  saveMember: (
    member: Omit<Member, "id" | "joinDate"> & { id?: number }
  ) => Promise<Member>;
  deleteMember: (id: number) => Promise<void>;
}

export const useMembersStore = create<MembersState>((set, get) => ({
  committeeMembers: [],
  currentMemberIndex: 0,
  selectedMember: null,
  isModalOpen: false,
  loading: false,
  error: null,

  editingMember: null,
  saving: false,

  fetchAndSetMembers: async () => {
    set({ loading: true, error: null });
    try {
      const members = await fetchCommitteeMembers();
      set({ committeeMembers: members, loading: false });
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      set({
        error: error || "Failed to load Committee Members. Please try again.",
        loading: false,
      });
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
    set({ saving: true });
    try {
      let saved: Member;
      if (member.id) {
        saved = await updateCommitteeMember(member.id, member);
      } else {
        saved = await createCommitteeMember(member);
      }
      // Refresh members after save
      await get().fetchAndSetMembers();
      set({ saving: false });
      return saved;
    } catch (error) {
      set({ saving: false });
      throw error;
    }
  },

  deleteMember: async (id) => {
    set({ saving: true });
    try {
      await deleteCommitteeMember(id);
      // Refresh members after delete
      await get().fetchAndSetMembers();
      set({ saving: false });
    } catch (error) {
      set({ saving: false });
      throw error;
    }
  },
}));
