import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller.js';
import { AnalyticsService } from './analytics.service.js';
import { AnalyticsRepository } from './analytics.repository.js';
import { AnalyticsQueueService } from './queues/analytics-queue.service.js';
import { AnalyticsWorkerService } from './workers/analytics-worker.service.js';
import { NewsletterAnalyticsListener } from './listeners/newsletter-analytics.listener.js';
import { NewsletterViewListener } from './listeners/newsletter-view.listener.js';
import { SearchAnalyticsListener } from './listeners/search-analytics.listener.js';

@Module({
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    AnalyticsRepository,
    AnalyticsQueueService,
    AnalyticsWorkerService,
    NewsletterAnalyticsListener,
    NewsletterViewListener,
    SearchAnalyticsListener,
  ],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
