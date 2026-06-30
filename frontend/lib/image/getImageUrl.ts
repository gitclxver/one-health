const FALLBACK = "/assets/research_img.png";

/**
 * Resolves CDN or storage paths to a full image URL.
 * Backend media URLs may already be absolute CDN links.
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return FALLBACK;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;

  const cdn = process.env.NEXT_PUBLIC_CDN_URL?.replace(/\/$/, "");
  if (!cdn) return `/${path.replace(/^\//, "")}`;
  return `${cdn}/${path.replace(/^\//, "")}`;
}
