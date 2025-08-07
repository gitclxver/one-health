// data/committeeApi.ts

import type { TeamMember } from "../components/TeamMemberCard";

const STORAGE_KEY = "committeeMembers";

export async function fetchCommitteeMembers(): Promise<TeamMember[]> {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as TeamMember[];
  } catch (err) {
    console.error("Failed to parse committee members from localStorage:", err);
    return [];
  }
}

export function saveCommitteeMembers(members: TeamMember[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}
