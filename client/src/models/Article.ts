export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  isNewsletterSent?: boolean;
}
