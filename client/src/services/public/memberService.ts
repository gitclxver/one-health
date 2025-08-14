import api from "../../utils/api";
import type { Member } from "../../models/Member";

export const fetchCommitteeMembers = async (): Promise<Member[]> => {
  try {
    const response = await api.get("/members/active");
    return response.data;
  } catch (error) {
    console.error("Error fetching committee members:", error);
    throw new Error("Failed to fetch committee members");
  }
};
