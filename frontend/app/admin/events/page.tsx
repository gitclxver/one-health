"use client";

import { useEffect, useState } from "react";
import { adminEventsApi } from "@/lib/api/admin";
import { getUserMessage, EMPTY_MESSAGES } from "@/lib/user-messages";
import { notifyError, notifySuccess } from "@/lib/toast";
import { ContentMessage } from "@/components/ui/ContentMessage";
import ImageUpload from "@/components/admin/ImageUpload";
import type { EventItem } from "@/lib/types/api";
import { Loader2 } from "lucide-react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("UPCOMING");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setEvents(await adminEventsApi.list());
    } catch (err) {
      setError(getUserMessage(err, "Unable to load events."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await adminEventsApi.create({
        title,
        description,
        startsAt,
        status,
        ...(location ? { location } : {}),
        ...(imageUrl ? { imageUrl } : {}),
      });
      setTitle("");
      setDescription("");
      setStartsAt("");
      setLocation("");
      setImageUrl("");
      notifySuccess("Event added");
      await load();
    } catch (err) {
      notifyError(getUserMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: string) {
    try {
      await adminEventsApi.remove(id);
      notifySuccess("Event removed");
      await load();
    } catch (err) {
      notifyError(getUserMessage(err));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Events</h1>

      <form
        onSubmit={handleCreate}
        className="bg-white/70 border border-slate-100 rounded-2xl p-5 mb-8 space-y-4"
      >
        <h2 className="font-semibold text-slate-800">Add event</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#6aabaf]"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          rows={3}
          className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#6aabaf]"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (optional)"
          className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#6aabaf]"
        />
        <ImageUpload
          label="Event image"
          value={imageUrl}
          onChange={setImageUrl}
          context="events"
          altText={title || "Event image"}
        />
        <input
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          required
          className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#6aabaf]"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#6aabaf]"
        >
          <option value="UPCOMING">Upcoming</option>
          <option value="PAST">Past</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-full bg-slate-700 text-white text-sm font-semibold disabled:opacity-60 flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Add event
        </button>
      </form>

      {error && <ContentMessage message={error} variant="error" />}
      {loading && <Loader2 className="w-6 h-6 animate-spin text-[#6aabaf] mx-auto" />}
      {!loading && !error && events.length === 0 && (
        <ContentMessage message={EMPTY_MESSAGES.events} />
      )}

      <div className="space-y-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white/70 border border-slate-100 rounded-xl p-4 flex justify-between gap-3"
          >
            <div>
              <p className="font-medium text-slate-800">{event.title}</p>
              <p className="text-xs text-slate-500">
                {event.status} · {new Date(event.startsAt).toLocaleDateString()}
                {event.location ? ` · ${event.location}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleRemove(event.id)}
              className="text-xs text-rose-600 font-semibold shrink-0"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
