"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { mediaApi, type MediaContext } from "@/lib/api/media";
import { getUserMessage } from "@/lib/user-messages";
import { notifyError, notifySuccess } from "@/lib/toast";
import { getImageUrl } from "@/lib/image/getImageUrl";

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  context: MediaContext;
  altText?: string;
  square?: boolean;
}

export default function ImageUpload({
  label,
  value,
  onChange,
  context,
  altText,
  square = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const media = await mediaApi.upload(file, { context, altText });
      onChange(media.publicUrl);
      notifySuccess("Image uploaded");
    } catch (err) {
      notifyError(getUserMessage(err, "Unable to upload image. Please try again."));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const previewUrl = value ? getImageUrl(value) : null;
  const aspectClass = square ? "aspect-square max-w-[160px]" : "aspect-[4/3] max-w-xs";

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      {previewUrl ? (
        <div className={`relative w-full ${aspectClass} rounded-xl overflow-hidden border border-slate-200 bg-slate-50`}>
          <Image src={previewUrl} alt={altText ?? label} fill className="object-cover" sizes="320px" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-slate-600 hover:text-rose-600 shadow-sm"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={`w-full ${aspectClass} rounded-xl border-2 border-dashed border-slate-200 bg-white/50 hover:border-[#6aabaf] hover:bg-[#B3DEE2]/10 transition-colors flex flex-col items-center justify-center gap-2 text-slate-500 disabled:opacity-60`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-[#6aabaf]" />
              <span className="text-xs font-medium">Uploading…</span>
            </>
          ) : (
            <>
              <ImagePlus className="w-6 h-6 text-[#6aabaf]" />
              <span className="text-xs font-medium">Click to upload image</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
    </div>
  );
}
