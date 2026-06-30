import { registerAs } from '@nestjs/config';

export const r2Config = registerAs('r2', () => ({
  accessKey: process.env.R2_ACCESS_KEY,
  secretKey: process.env.R2_SECRET_KEY,
  bucket: process.env.R2_BUCKET,
  endpoint: process.env.R2_ENDPOINT,
  publicUrl: process.env.R2_PUBLIC_URL,
}));
