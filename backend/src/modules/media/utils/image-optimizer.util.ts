import sharp from 'sharp';
import type { OptimizedImage } from '../interfaces/media.interface.js';

const MAX_WIDTH = 1920;
const WEBP_QUALITY = 85;

export async function optimizeImage(input: Buffer): Promise<OptimizedImage> {
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    mimeType: 'image/webp',
    width: info.width,
    height: info.height,
    size: data.length,
  };
}

export function buildStorageKey(
  filename: string,
  context: 'newsletters' | 'events' | 'exco' = 'newsletters',
): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `media/${context}/${year}/${month}/${filename}`;
}

export function buildPublicUrl(cdnBaseUrl: string, storageKey: string): string {
  const base = cdnBaseUrl.replace(/\/$/, '');
  return `${base}/${storageKey}`;
}
