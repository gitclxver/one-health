export enum DomainEvents {
  NEWSLETTER_PUBLISHED = 'newsletter.published',
  NEWSLETTER_CREATED = 'newsletter.created',
  NEWSLETTER_ARCHIVED = 'newsletter.archived',
  NEWSLETTER_VIEWED = 'newsletter.viewed',

  MEDIA_UPLOADED = 'media.uploaded',

  USER_REGISTERED = 'user.registered',
  USER_LOGGED_IN = 'user.logged_in',

  SUBSCRIBER_CREATED = 'subscriber.created',
  SEARCH_PERFORMED = 'search.performed',
}

export interface NewsletterPublishedEvent {
  newsletterId: string;
  title: string;
  slug: string;
  publishedAt: Date;
  userId?: string;
}

export interface NewsletterCreatedEvent {
  newsletterId: string;
  title: string;
  slug: string;
  userId: string;
}

export interface NewsletterArchivedEvent {
  newsletterId: string;
  title: string;
  slug: string;
  userId?: string;
}

export interface NewsletterViewedEvent {
  newsletterId: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
}

export interface SearchPerformedEvent {
  query: string;
  resultCount: number;
  tookMs: number;
  userId?: string;
}

export interface MediaUploadedEvent {
  mediaId: string;
  filename: string;
  publicUrl: string;
  userId: string;
}

export interface UserRegisteredEvent {
  userId: string;
  email: string;
}

export interface UserLoggedInEvent {
  userId: string;
  email: string;
}

export interface SubscriberCreatedEvent {
  subscriberId: string;
  email: string;
}

export interface NewsletterEmailJobPayload {
  emailJobId: string;
  newsletterId: string;
  title: string;
  slug: string;
}
