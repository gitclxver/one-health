import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES } from '../../../common/constants/index.js';

type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

export function imageFileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
    callback(new Error(`File type ${file.mimetype} is not allowed`), false);
    return;
  }
  callback(null, true);
}

export function validateUploadedFile(file: Express.Multer.File | undefined): void {
  if (!file) {
    throw new Error('No file provided');
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('File exceeds the 5 MB size limit');
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
    throw new Error(`File type ${file.mimetype} is not allowed`);
  }
}

export const multerUploadOptions = {
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
  fileFilter: imageFileFilter,
};
