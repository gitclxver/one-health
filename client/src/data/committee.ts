import type { TeamMember } from "../components/TeamMemberCard";

export function getCommittee(): TeamMember[] {
  return JSON.parse(localStorage.getItem("committee") || "[]");
}

export function saveCommittee(members: TeamMember[]) {
  localStorage.setItem("committee", JSON.stringify(members));
}

export function addMember(member: TeamMember) {
  const current = getCommittee();
  saveCommittee([...current, member]);
}

export function updateMember(updated: TeamMember) {
  const current = getCommittee().map((m) =>
    m.id === updated.id ? updated : m
  );
  saveCommittee(current);
}

export function deleteMember(id: string) {
  const current = getCommittee().filter((m) => m.id !== id);
  saveCommittee(current);
}
