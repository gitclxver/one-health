export const ROLES_KEY = 'roles';
export const CURRENT_USER_KEY = 'user';
export const IS_PUBLIC_KEY = 'isPublic';

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB — images only
export const MAX_IMAGE_SIZE_BYTES = MAX_FILE_SIZE_BYTES;
