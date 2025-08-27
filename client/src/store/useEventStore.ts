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
  deleteEvent as deleteEventApi,
  uploadEventImage as uploadEventImageApi,
} from "../services/admin/adminEventService";
import type { Event, EventFormData } from "../models/Event";

interface EventsState {
  allEvents: Event[];
  upcomingEvents: Event[];
  pastEvents: Event[];
  selectedEvent: Event | null;
  editingEvent: Event | null; // Added editingEvent
  isModalOpen: boolean;
  loading: boolean;
  saving: boolean;
  error: string | null;

  fetchEventById: (id: number) => Promise<void>;
  fetchAllEvents: () => Promise<void>;
  fetchUpcomingEvents: () => Promise<void>;
  fetchPastEvents: () => Promise<void>;
  selectEvent: (event: Event) => void;
  closeModal: () => void;

  setEditingEvent: (event: Event | null) => void; // Added setter

  saveEvent: (eventData: EventFormData) => Promise<Event>;
  deleteEvent: (id: number) => Promise<void>;
  uploadEventImage: (eventId: number, imageFile: File) => Promise<Event>;
}

export const useEventStore = create<EventsState>((set, get) => ({
  allEvents: [],
  upcomingEvents: [],
  pastEvents: [],
  selectedEvent: null,
  editingEvent: null, // Initialize editingEvent
  isModalOpen: false,
  loading: false,
  saving: false,
  error: null,

  fetchEventById: async (id) => {
    set({ loading: true, error: null });
    try {
      const event = await fetchEventById(id);
      set({ selectedEvent: event, loading: false, isModalOpen: true });
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to load event";
      set({ error, loading: false });
      throw error;
    }
  },

  fetchAllEvents: async () => {
    set({ loading: true, error: null });
    try {
      const events = await fetchAllEvents();
      set({ allEvents: events, loading: false });
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to load events";
      set({ error, loading: false });
      throw error;
    }
  },

  fetchUpcomingEvents: async () => {
    set({ loading: true, error: null });
    try {
      const events = await fetchUpcomingEvents();
      set({ upcomingEvents: events, loading: false });
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to load upcoming events";
      set({ error, loading: false });
      throw error;
    }
  },

  fetchPastEvents: async () => {
    set({ loading: true, error: null });
    try {
      const events = await fetchPastEvents();
      set({ pastEvents: events, loading: false });
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to load past events";
      set({ error, loading: false });
      throw error;
    }
  },

  selectEvent: (event) => set({ selectedEvent: event, isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false, selectedEvent: null }),

  setEditingEvent: (event) => set({ editingEvent: event }), // Setter for editingEvent

  saveEvent: async (eventData) => {
    set({ saving: true, error: null });
    try {
      let saved: Event;
      if (eventData.id) {
        saved = await updateEvent(eventData.id, eventData);
      } else {
        saved = await createEvent(eventData);
      }
      await Promise.all([
        get().fetchAllEvents(),
        get().fetchUpcomingEvents(),
        get().fetchPastEvents(),
      ]);
      set({ saving: false });
      return saved;
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to save event";
      set({ error, saving: false });
      throw error;
    }
  },

  deleteEvent: async (id) => {
    set({ saving: true, error: null });
    try {
      await deleteEventApi(id);
      await Promise.all([
        get().fetchAllEvents(),
        get().fetchUpcomingEvents(),
        get().fetchPastEvents(),
      ]);
      set({ saving: false });
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to delete event";
      set({ error, saving: false });
      throw error;
    }
  },

  uploadEventImage: async (eventId, imageFile) => {
    set({ saving: true, error: null });
    try {
      const updatedEvent = await uploadEventImageApi(eventId, imageFile);
      await Promise.all([
        get().fetchAllEvents(),
        get().fetchUpcomingEvents(),
        get().fetchPastEvents(),
      ]);
      set({ saving: false });
      return updatedEvent;
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to upload image";
      set({ error, saving: false });
      throw error;
    }
  },
}));
