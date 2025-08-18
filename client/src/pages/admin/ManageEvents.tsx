import { useEffect } from "react";
import type { EventFormData } from "../../models/Event";
import { useEventStore } from "../../store/useEventStore";
import AdminHeader from "../../components/admin/AdminHeader";
import EventsForm from "./events/EventsForm";
import EventCardAdmin from "../../components/EventCardAdmin";

export default function ManageEvents() {
  const {
    allEvents,
    editingEvent,
    setEditingEvent,
    fetchAllEvents,
    saveEvent,
    deleteEvent,
    saving,
  } = useEventStore();

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const handleSave = async (
    event: EventFormData,
    onSaved?: (id: number) => void
  ) => {
    try {
      const saved = await saveEvent(event);
      onSaved?.(saved.id);
      setEditingEvent(null);
    } catch (e) {
      alert("Failed to save event.");
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this event?")) return;

    try {
      await deleteEvent(id);
    } catch (e) {
      alert("Failed to delete event.");
      console.error(e);
    }
  };

  const sortedEvents = [...allEvents].sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
  );

  return (
    <>
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #A7CFE1 0%, #6A8B57 100%)",
        }}
      />
      <AdminHeader />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <section className="mb-8 text-center p-6 rounded-3xl bg-white/25 backdrop-blur-md border border-white/20">
          <h1 className="text-4xl font-extrabold text-[#6A8B57]">
            Manage Events
          </h1>
          <p className="mt-2 text-green-900 font-medium">
            Create, update or remove upcoming events.
          </p>
        </section>

        <section className="mb-12 rounded-3xl p-8 bg-white/25 backdrop-blur-md border border-white/20">
          <EventsForm
            onSave={handleSave}
            editingEvent={editingEvent ?? undefined}
            onCancelEdit={() => setEditingEvent(null)}
            saving={saving}
          />
        </section>

        <section className="rounded-3xl p-6 bg-white/25 backdrop-blur-md border border-white/20">
          <h2 className="text-2xl font-bold mb-6 text-[#4f6d33]">Events</h2>

          {sortedEvents.length === 0 ? (
            <p className="text-center text-gray-700">No events available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {sortedEvents.map((event) => (
                <EventCardAdmin
                  key={event.id}
                  event={event}
                  onEdit={() => setEditingEvent(event)}
                  onDelete={() => handleDelete(event.id)}
                  onClick={() => setEditingEvent(event)}
                  
                  disabled={saving}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
