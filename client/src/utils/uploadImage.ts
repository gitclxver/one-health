import imageCompression from "browser-image-compression";
import { supabase } from "../lib/supabaseClient";

export interface UploadOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  quality?: number;
}

export const uploadImageToSupabase = async (
  file: File,
  folder: "articles" | "events" | "members",
  options: UploadOptions = {}
): Promise<string> => {
  try {
    // Validate file
    if (!file.type.startsWith("image/")) {
      throw new Error("Please select a valid image file");
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit (updated from 10MB comment)
      throw new Error("Image size must be less than 5MB");
    }

    // Compression options
    const compressionOptions = {
      maxSizeMB: options.maxSizeMB || 0.5,
      maxWidthOrHeight: options.maxWidthOrHeight || 1280,
      useWebWorker: true,
      initialQuality: options.quality || 0.8,
    };

    // Compress image
    const compressed = await imageCompression(file, compressionOptions);

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${timestamp}_${randomId}.${extension}`;
    const path = `${folder}/${filename}`;

    // Upload to Supabase
    const { error: uploadError } = await supabase.storage
      .from("One Health Images")
      .upload(path, compressed, {
        cacheControl: "3600",
        upsert: false,
        contentType: compressed.type,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("One Health Images")
      .getPublicUrl(path);

    if (!urlData.publicUrl) {
      throw new Error("Failed to generate public URL");
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error("Image upload error:", error);
    throw error instanceof Error ? error : new Error("Unknown upload error");
  }
};

export const deleteImageFromSupabase = async (
  imageUrl: string
): Promise<void> => {
  try {
    // Extract path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split("/");
    const bucketIndex = pathParts.findIndex(
      (part) => part === "One%20Health%20Images" || part === "One Health Images"
    );

    if (bucketIndex === -1) {
      throw new Error("Invalid Supabase image URL");
    }

    const path = pathParts.slice(bucketIndex + 1).join("/");

    const { error } = await supabase.storage
      .from("One Health Images")
      .remove([path]);

    if (error) {
      console.error("Failed to delete image:", error.message);
      // Don't throw error for delete failures - log and continue
    }
  } catch (error) {
    console.error("Image deletion error:", error);
    // Don't throw error for delete failures
  }
};
