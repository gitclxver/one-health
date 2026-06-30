export const NEWSLETTER_EMAIL_QUEUE = 'newsletter-email';
export const SEND_NEWSLETTER_JOB = 'send-newsletter';

export const QUEUE_DEFAULTS = {
  attempts: 3,
  backoff: { type: 'exponential' as const, delay: 5_000 },
  removeOnComplete: true,
  removeOnFail: false,
};
