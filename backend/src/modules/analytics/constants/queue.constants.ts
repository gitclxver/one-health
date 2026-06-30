export const ANALYTICS_QUEUE = 'analytics';
export const TRACK_PAGE_VIEW_JOB = 'track-page-view';
export const TRACK_SEARCH_JOB = 'track-search';

export const ANALYTICS_QUEUE_DEFAULTS = {
  attempts: 3,
  backoff: { type: 'exponential' as const, delay: 3_000 },
  removeOnComplete: true,
  removeOnFail: false,
};

export interface PageViewJobPayload {
  newsletterId: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
}

export interface SearchTrackJobPayload {
  query: string;
  resultCount: number;
  tookMs: number;
  userId?: string;
}
