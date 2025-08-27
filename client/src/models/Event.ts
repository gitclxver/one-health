export interface Event {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  eventDate: string;
  location?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type EventFormData = Omit<Event, "id" | "createdAt" | "updatedAt"> & {
  id?: number;
};
