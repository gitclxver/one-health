// src/constants/DEFAULT_IMAGES.ts

const PROJECT_REF = "aoerndsszyusmylcrieq";
const BUCKET = "One%20Health%20Images";
const FOLDER = "defaults";

export const DEFAULT_IMAGES = {
  ARTICLE: `https://${PROJECT_REF}.supabase.co/storage/v1/object/public/${BUCKET}/${FOLDER}/default-article-image.png`,
  AVATAR: `https://${PROJECT_REF}.supabase.co/storage/v1/object/public/${BUCKET}/${FOLDER}/default-avatar.png`,
  EVENT: `https://${PROJECT_REF}.supabase.co/storage/v1/object/public/${BUCKET}/${FOLDER}/default-event-image.png`,
};
