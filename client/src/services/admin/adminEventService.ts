import api from "../../utils/api";
import type { Event, EventFormData } from "../../models/Event";

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

export const uploadTempEventImage = async (
  imageFile: File
): Promise<string> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await api.post("/events/admin/upload-temp", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const finalizeEventImage = async (
  tempImagePath: string,
  eventId: number
): Promise<string> => {
  const response = await api.post(`/events/admin/finalize-image/${eventId}`, {
    tempPath: tempImagePath,
  });

  return response.data;
};

export const uploadEventImage = async (
  eventId: number,
  imageFile: File
): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await api.post(
    `/events/admin/upload-image/${eventId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
