import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';
import type { ConnectionOptions } from 'bullmq';
import type { NewsletterEmailJobPayload } from '../../../common/events/index.js';
import {
  NEWSLETTER_EMAIL_QUEUE,
  QUEUE_DEFAULTS,
  SEND_NEWSLETTER_JOB,
} from '../constants/queue.constants.js';
import { REDIS_CONNECTION } from '../../../infrastructure/redis/redis.constants.js';

@Injectable()
export class NewsletterQueueService implements OnModuleDestroy {
  private readonly logger = new Logger(NewsletterQueueService.name);
  private readonly queue: Queue;

  constructor(@Inject(REDIS_CONNECTION) connection: ConnectionOptions) {
    this.queue = new Queue(NEWSLETTER_EMAIL_QUEUE, { connection });
  }

  async addSendJob(payload: NewsletterEmailJobPayload): Promise<void> {
    await this.queue.add(SEND_NEWSLETTER_JOB, payload, {
      ...QUEUE_DEFAULTS,
      jobId: `newsletter-email-${payload.newsletterId}`,
    });
    this.logger.log(`BullMQ job queued for newsletter ${payload.newsletterId}`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.queue.close();
  }
}
