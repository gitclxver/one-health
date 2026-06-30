import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import type { ConnectionOptions } from 'bullmq';
import { REDIS_CONNECTION } from '../../../infrastructure/redis/redis.constants.js';
import { AnalyticsService } from '../analytics.service.js';
import {
  ANALYTICS_QUEUE,
  TRACK_PAGE_VIEW_JOB,
  TRACK_SEARCH_JOB,
  type PageViewJobPayload,
  type SearchTrackJobPayload,
} from '../constants/queue.constants.js';

@Injectable()
export class AnalyticsWorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AnalyticsWorkerService.name);
  private worker: Worker | null = null;

  constructor(
    @Inject(REDIS_CONNECTION) private readonly connection: ConnectionOptions,
    private readonly analyticsService: AnalyticsService,
  ) {}

  onModuleInit(): void {
    this.worker = new Worker(
      ANALYTICS_QUEUE,
      async (job) => {
        if (job.name === TRACK_PAGE_VIEW_JOB) {
          await this.analyticsService.processPageView(job.data as PageViewJobPayload);
        } else if (job.name === TRACK_SEARCH_JOB) {
          await this.analyticsService.processSearchTrack(job.data as SearchTrackJobPayload);
        }
      },
      { connection: this.connection, concurrency: 5 },
    );

    this.worker.on('failed', (job, error) => {
      this.logger.error(`Analytics job ${job?.id} failed: ${error.message}`);
    });

    this.logger.log('Analytics worker started');
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close();
  }
}
