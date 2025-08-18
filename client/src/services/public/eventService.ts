import api from "../../utils/api";
import type { Event } from "../../models/Event";

export const fetchAllEvents = async (): Promise<Event[]> => {
  const response = await api.get("/events");
  return response.data;
};

export const fetchUpcomingEvents = async (): Promise<Event[]> => {
  const response = await api.get("/events/upcoming");
  return response.data;
};

export const fetchPastEvents = async (): Promise<Event[]> => {
  const response = await api.get("/events/past");
  return response.data;
};

export const fetchEventById = async (id: number): Promise<Event> => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};
