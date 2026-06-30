export function formatPublishedDate(iso: string | null | undefined): string {
  if (!iso) return "Draft";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatReadingTime(minutes: number | null | undefined): string {
  if (!minutes || minutes < 1) return "1 min read";
  return `${minutes} min read`;
}
