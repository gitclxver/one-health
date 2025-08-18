import { useEffect, useRef, useState } from "react";
import type { EventFormData } from "../../../models/Event";
import { useEventStore } from "../../../store/useEventStore";

interface Props {
  onSave: (event: EventFormData, onSaved?: (id: number) => void) => void;
  editingEvent?: EventFormData | null;
  onCancelEdit: () => void;
  saving: boolean;
}

export default function EventsForm({
  onSave,
  editingEvent,
  onCancelEdit,
  saving,
}: Props) {
  const [event, setEvent] = useState<EventFormData>({
    title: "",
    description: "",
    eventDate: new Date().toISOString(),
    imageUrl: "",
    location: "",
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadTempImage, finalizeImage } = useEventStore();

  useEffect(() => {
    if (editingEvent) {
      setEvent(editingEvent);
      setPreviewUrl(null);
    } else {
      resetForm();
    }
  }, [editingEvent]);

  const resetForm = () => {
    setEvent({
      title: "",
      description: "",
      eventDate: new Date().toISOString(),
      imageUrl: "",
      location: "",
    });
    setPreviewUrl(null);
    setUploadError(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

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
      const uploadedPath = await uploadTempImage(file);
      setEvent((prev) => ({ ...prev, imageUrl: uploadedPath }));
      setPreviewUrl(URL.createObjectURL(file));
    } catch {
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!event.title || !event.description) {
      alert("Title and description are required.");
      return;
    }

    const isTemp = event.imageUrl?.includes("temp-");

    const onSavedCallback = async (id: number) => {
      if (isTemp && id && event.imageUrl) {
        try {
          await finalizeImage(event.imageUrl, id);
        } catch (err) {
          console.error(err);
        }
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };

    onSave({ ...event, id: event.id || undefined }, onSavedCallback);
  };

  const resolvedImageUrl = previewUrl
    ? previewUrl
    : event.imageUrl?.startsWith("http") || event.imageUrl?.startsWith("/")
    ? event.imageUrl
    : event.imageUrl
    ? `${import.meta.env.VITE_API_BASE_URL}/${event.imageUrl}`
    : "";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-8 rounded-3xl bg-white/25 backdrop-blur-md border border-white/20"
    >
      <div className="flex justify-center mb-6">
        <div
          className={`w-32 h-32 rounded-lg overflow-hidden bg-gray-200 cursor-pointer hover:opacity-80 relative ${
            isUploadingImage ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          {resolvedImageUrl ? (
            <img
              src={resolvedImageUrl}
              alt="Event"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-sm text-gray-500">
              {isUploadingImage ? "Uploading..." : "Upload Image"}
            </div>
          )}
          {isUploadingImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm">
              Uploading...
            </div>
          )}
          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept="image/*"
            disabled={isUploadingImage}
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {uploadError && (
        <p className="text-red-500 text-sm text-center mb-4">{uploadError}</p>
      )}

      <div className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={event.title}
          onChange={handleChange}
          className="w-full border border-[#6A8B57] p-3 rounded-lg"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={event.location}
          onChange={handleChange}
          className="w-full border border-[#6A8B57] p-3 rounded-lg"
        />
        <input
          type="datetime-local"
          name="eventDate"
          value={new Date(event.eventDate).toISOString().slice(0, 16)}
          onChange={handleChange}
          className="w-full border border-[#6A8B57] p-3 rounded-lg"
        />
        <textarea
          name="description"
          placeholder="Event Description"
          rows={5}
          value={event.description}
          onChange={handleChange}
          className="w-full border border-[#6A8B57] p-3 rounded-lg"
          required
        />
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <button
          type="submit"
          disabled={saving || isUploadingImage}
          className="bg-[#6A8B57] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#567544] disabled:opacity-50"
        >
          {saving ? "Saving..." : editingEvent ? "Update Event" : "Add Event"}
        </button>
        {editingEvent && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-[#6A8B57] hover:text-[#4f6d33]"
            disabled={saving}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
