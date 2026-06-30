export interface OptimizedImage {
  buffer: Buffer;
  mimeType: string;
  width: number;
  height: number;
  size: number;
}

export interface MediaUploadResult {
  id: string;
  filename: string;
  storageKey: string;
  publicUrl: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  altText: string | null;
}
