import api from "../../utils/api";
import type { Event, EventFormData } from "../../models/Event";
import { uploadImageToSupabase } from "../../utils/uploadImage";

export const createEvent = async (eventData: EventFormData): Promise<Event> => {
  const response = await api.post("/events/admin", eventData);
  return response.data;
};

export const updateEvent = async (
  id: number,
  eventData: Partial<EventFormData>
): Promise<Event> => {
  const response = await api.put(`/events/admin/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await api.delete(`/events/admin/${id}`);
};

// ======== Upload event image (Supabase flow) ========
export const uploadEventImage = async (
  eventId: number,
  imageFile: File
): Promise<Event> => {
  // 1. Upload to Supabase
  const imageUrl = await uploadImageToSupabase(imageFile, "events");

  // 2. Save URL in backend
  const response = await api.put(`/events/admin/${eventId}/image`, {
    imageUrl,
  });

  return response.data;
};
