import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvents, type SearchPerformedEvent } from '../../../common/events/index.js';
import { AnalyticsQueueService } from '../queues/analytics-queue.service.js';

@Injectable()
export class SearchAnalyticsListener {
  constructor(private readonly analyticsQueue: AnalyticsQueueService) {}

  @OnEvent(DomainEvents.SEARCH_PERFORMED)
  async handleSearch(event: SearchPerformedEvent): Promise<void> {
    await this.analyticsQueue.enqueueSearchTrack({
      query: event.query,
      resultCount: event.resultCount,
      tookMs: event.tookMs,
      userId: event.userId,
    });
  }
}
