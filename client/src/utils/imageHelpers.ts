const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

export const getImageUrl = (
  imagePath?: string,
  fallback: string = "/default-avatar.png"
): string => {
  if (!imagePath || typeof imagePath !== "string") return fallback;

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
    return imagePath;

  const cleanedPath = imagePath.replace(/^\/+/, "").replace(/^uploads\//, "");

  return `${BASE_URL}/uploads/${cleanedPath}`;
};
