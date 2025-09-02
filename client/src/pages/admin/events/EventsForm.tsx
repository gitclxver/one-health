import { useState, useRef, useEffect } from "react";
import type { Event } from "../../../models/Event";
import { useEventStore } from "../../../store/useEventStore";
import { Calendar, Clock } from "lucide-react";

interface Props {
  event?: Event | null;
  onCancel?: () => void;
  resetTrigger?: number;
}

const DESCRIPTION_LIMIT = 500;

export default function EventsForm({
  event,
  onCancel,
  resetTrigger = 0,
}: Props) {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(""); // formatted YYYY/MM/DD
  const [eventTime, setEventTime] = useState(""); // formatted HH:mm
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousResetTrigger = useRef(resetTrigger);

  const { saveEvent, uploadEventImage, saving, error } = useEventStore();

  const clearForm = () => {
    setTitle("");
    setEventDate("");
    setEventTime("");
    setLocation("");
    setDescription("");
    setImageUrl("");
    setPreviewUrl(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (resetTrigger > previousResetTrigger.current) {
      clearForm();
      previousResetTrigger.current = resetTrigger;
    }
  }, [resetTrigger]);

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      if (event.eventDate) {
        const dt = new Date(event.eventDate);
        setEventDate(formatDateString(dt));
        setEventTime(formatTimeString(dt));
      }
      setLocation(event.location || "");
      setDescription(event.description || "");
      setImageUrl(event.imageUrl || "");
    } else {
      if (resetTrigger === previousResetTrigger.current) clearForm();
    }
  }, [event, resetTrigger]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB");
      return;
    }

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      setPreviewUrl(URL.createObjectURL(file));
    } catch (err) {
      console.error("Image preview failed:", err);
      setUploadError("Failed to process image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !eventDate.trim() ||
      !location.trim() ||
      !eventTime.trim()
    ) {
      alert("Title, Date, Time, and Location are required");
      return;
    }

    const normalizedDate = toNativeDateValue(eventDate.trim());
    const isoDateTime = `${normalizedDate}T${eventTime}:00`; // yyyy-MM-ddTHH:mm:ss

    const eventData: Omit<Event, "id"> & { id?: number } = {
      id: event?.id,
      title: title.trim(),
      eventDate: isoDateTime,
      location: location.trim(),
      description: description.trim(),
      imageUrl,
    };

    try {
      const savedEvent = await saveEvent(eventData);

      if (previewUrl && fileInputRef.current?.files?.[0] && savedEvent.id) {
        const file = fileInputRef.current.files[0];
        await uploadEventImage(savedEvent.id, file);
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      clearForm();
    } catch (err) {
      console.error("Failed to save event:", err);
    }
  };

  const resolvedImageUrl = previewUrl || imageUrl || "";

  // Date input formatting
  const handleDateInput = (value: string) => {
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    let formatted = cleaned;
    if (cleaned.length > 4)
      formatted = cleaned.slice(0, 4) + "/" + cleaned.slice(4);
    if (cleaned.length > 6)
      formatted = formatted.slice(0, 7) + "/" + formatted.slice(7);

    setEventDate(formatted);
  };

  const formatDateString = (value: Date | string) => {
    const d = typeof value === "string" ? new Date(value) : value;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const formatTimeString = (value: Date) => {
    const hours = String(value.getHours()).padStart(2, "0");
    const minutes = String(value.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const toNativeDateValue = (value: string) => {
    const parts = value.split("/");
    if (parts.length !== 3) return "";
    const [year, month, day] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-w-xl max-w-3xl mx-auto p-8 rounded-3xl"
      style={{
        background: "rgba(255, 255, 255, 0.25)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
      }}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Image Upload */}
      <div className="flex justify-center mb-8">
        <div
          className={`w-full aspect-[4/3] max-w-md rounded-lg overflow-hidden bg-gray-100 relative cursor-pointer ${
            isUploadingImage || saving ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() =>
            !isUploadingImage && !saving && fileInputRef.current?.click()
          }
        >
          {resolvedImageUrl ? (
            <img
              src={resolvedImageUrl}
              alt="Event"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              {isUploadingImage ? "Processing..." : "Click to upload"}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            hidden
            disabled={isUploadingImage || saving}
          />
        </div>
      </div>
      {uploadError && (
        <div className="text-red-500 text-sm text-center mb-4 px-4">
          {uploadError}
        </div>
      )}

      {/* Fields */}
      <div className="space-y-6">
        {/* Title */}
        <input
          className="w-full border border-[#6A8B57] p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A8B57] transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Title"
          required
          disabled={saving}
          maxLength={100}
        />

        {/* Date */}
        <div className="relative">
          <label className="absolute left-3 top-0 text-xs text-[#4f6d33] bg-white px-1 rounded">
            YYYY/MM/DD
          </label>
          <input
            type="text"
            inputMode="numeric"
            className="w-full border border-[#6A8B57] p-3 pr-12 rounded-lg text-gray-900 font-mono"
            value={eventDate}
            onChange={(e) => handleDateInput(e.target.value)}
            required
            disabled={saving}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-[#6A8B57]"
            onClick={() => {
              const input = document.getElementById(
                "hidden-date-input"
              ) as HTMLInputElement | null;
              input?.showPicker?.();
            }}
          >
            <Calendar size={20} />
          </button>
          <input
            id="hidden-date-input"
            type="date"
            className="absolute opacity-0 pointer-events-none"
            tabIndex={-1}
            value={toNativeDateValue(eventDate)}
            onChange={(e) => setEventDate(formatDateString(e.target.value))}
            disabled={saving}
          />
        </div>

        {/* Time */}
        <div className="relative">
          <label className="absolute left-3 top-0 text-xs text-[#4f6d33] bg-white px-1 rounded">
            HH:MM
          </label>
          <input
            type="time"
            className="w-full border border-[#6A8B57] p-3 pr-12 rounded-lg text-gray-900 font-mono"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required
            disabled={saving}
          />
          <div className="absolute inset-y-0 right-0 px-3 flex items-center text-[#6A8B57]">
            <Clock size={20} />
          </div>
        </div>

        {/* Location */}
        <input
          className="w-full border border-[#6A8B57] p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A8B57] transition"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Event Location"
          required
          disabled={saving}
          maxLength={100}
        />

        {/* Description */}
        <div>
          <div className="flex justify-end mb-1 pr-2 text-xs text-[#4f6d33] select-none">
            {description.length} / {DESCRIPTION_LIMIT}
          </div>
          <textarea
            className="w-full border border-[#6A8B57] p-3 rounded-lg resize-none text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A8B57] transition"
            value={description}
            onChange={(e) => {
              if (e.target.value.length <= DESCRIPTION_LIMIT) {
                setDescription(e.target.value);
              }
            }}
            rows={5}
            placeholder="Event Description"
            disabled={saving}
            maxLength={DESCRIPTION_LIMIT}
            style={{ overflowY: "auto" }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-6 pt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-[#6A8B57] font-semibold hover:text-[#4f6d33] disabled:opacity-50"
            disabled={saving}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving || isUploadingImage}
          className={`px-6 py-2 rounded-full text-white font-semibold transition-colors ${
            saving || isUploadingImage
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#6A8B57] hover:bg-[#567544]"
          }`}
        >
          {saving ? "Saving..." : event ? "Update" : "Create"} Event
        </button>
      </div>
    </form>
  );
}
