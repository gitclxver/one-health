import { create } from "zustand";
import {
  fetchAllEvents,
  fetchUpcomingEvents,
  fetchPastEvents,
  fetchEventById,
} from "../services/public/eventService";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  uploadTempEventImage,
  finalizeEventImage,
} from "../services/admin/adminEventService";
import type { Event, EventFormData } from "../models/Event";

interface EventsState {
  allEvents: Event[];
  upcomingEvents: Event[];
  pastEvents: Event[];
  selectedEvent: Event | null;
  isModalOpen: boolean;
  loading: boolean;
  error: string | null;
  editingEvent: Event | null;
  saving: boolean;
  currentEvent: Event | null;

  fetchEventById: (id: number) => Promise<void>;
  fetchAllEvents: () => Promise<void>;
  fetchUpcomingEvents: () => Promise<void>;
  fetchPastEvents: () => Promise<void>;
  selectEvent: (event: Event) => void;
  clearSelectedEvent: () => void;
  openModal: () => void;
  closeModal: () => void;

  setEditingEvent: (event: Event | null) => void;
  saveEvent: (eventData: EventFormData) => Promise<Event>;
  deleteEvent: (id: number) => Promise<void>;

  uploadTempImage: (imageFile: File) => Promise<string>;
  finalizeImage: (tempPath: string, eventId: number) => Promise<string>;
}

export const useEventStore = create<EventsState>((set, get) => ({
  allEvents: [],
  upcomingEvents: [],
  pastEvents: [],
  selectedEvent: null,
  isModalOpen: false,
  loading: false,
  error: null,
  editingEvent: null,
  saving: false,
  currentEvent: null,

  fetchEventById: async (id) => {
    set({ loading: true, error: null });
    try {
      const event = await fetchEventById(id);
      set({ currentEvent: event, loading: false });
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      set({ error, loading: false });
    }
  },

  fetchAllEvents: async () => {
    set({ loading: true, error: null });
    try {
      const events = await fetchAllEvents();
      set({ allEvents: events, loading: false });
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      set({ error, loading: false });
    }
  },

  fetchUpcomingEvents: async () => {
    set({ loading: true, error: null });
    try {
      const events = await fetchUpcomingEvents();
      set({ upcomingEvents: events, loading: false });
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      set({ error, loading: false });
    }
  },

  fetchPastEvents: async () => {
    set({ loading: true, error: null });
    try {
      const events = await fetchPastEvents();
      set({ pastEvents: events, loading: false });
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      set({ error, loading: false });
    }
  },

  selectEvent: (event) => set({ selectedEvent: event }),
  clearSelectedEvent: () => set({ selectedEvent: null }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false, selectedEvent: null }),

  setEditingEvent: (event) => set({ editingEvent: event }),

  saveEvent: async (eventData) => {
    set({ saving: true });
    try {
      let saved: Event;
      if (eventData.id) {
        saved = await updateEvent(eventData.id, eventData);
      } else {
        saved = await createEvent(eventData);
      }
      // Refresh events after save
      await Promise.all([
        get().fetchAllEvents(),
        get().fetchUpcomingEvents(),
        get().fetchPastEvents(),
      ]);
      set({ saving: false });
      return saved;
    } catch (error) {
      set({ saving: false });
      throw error;
    }
  },

  deleteEvent: async (id) => {
    set({ saving: true });
    try {
      await deleteEvent(id);
      // Refresh events after delete
      await Promise.all([
        get().fetchAllEvents(),
        get().fetchUpcomingEvents(),
        get().fetchPastEvents(),
      ]);
      set({ saving: false });
    } catch (error) {
      set({ saving: false });
      throw error;
    }
  },

  uploadTempImage: async (imageFile) => {
    try {
      return await uploadTempEventImage(imageFile);
    } catch (error) {
      console.error("Error uploading temp image:", error);
      throw error;
    }
  },

  finalizeImage: async (tempPath, eventId) => {
    try {
      return await finalizeEventImage(tempPath, eventId);
    } catch (error) {
      console.error("Error finalizing image:", error);
      throw error;
    }
  },
}));
