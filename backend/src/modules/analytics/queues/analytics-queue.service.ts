import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';
import type { ConnectionOptions } from 'bullmq';
import { REDIS_CONNECTION } from '../../../infrastructure/redis/redis.constants.js';
import {
  ANALYTICS_QUEUE,
  ANALYTICS_QUEUE_DEFAULTS,
  TRACK_PAGE_VIEW_JOB,
  TRACK_SEARCH_JOB,
  type PageViewJobPayload,
  type SearchTrackJobPayload,
} from '../constants/queue.constants.js';

@Injectable()
export class AnalyticsQueueService implements OnModuleDestroy {
  private readonly logger = new Logger(AnalyticsQueueService.name);
  private readonly queue: Queue;

  constructor(@Inject(REDIS_CONNECTION) connection: ConnectionOptions) {
    this.queue = new Queue(ANALYTICS_QUEUE, { connection });
  }

  async enqueuePageView(payload: PageViewJobPayload): Promise<void> {
    await this.queue.add(TRACK_PAGE_VIEW_JOB, payload, {
      ...ANALYTICS_QUEUE_DEFAULTS,
      jobId: `page-view-${payload.newsletterId}-${Date.now()}`,
    });
  }

  async enqueueSearchTrack(payload: SearchTrackJobPayload): Promise<void> {
    await this.queue.add(TRACK_SEARCH_JOB, payload, {
      ...ANALYTICS_QUEUE_DEFAULTS,
      jobId: `search-${payload.query.slice(0, 32)}-${Date.now()}`,
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.queue.close();
  }
}
