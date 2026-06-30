import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvents, type NewsletterViewedEvent } from '../../../common/events/index.js';
import { AnalyticsQueueService } from '../queues/analytics-queue.service.js';

@Injectable()
export class NewsletterViewListener {
  constructor(private readonly analyticsQueue: AnalyticsQueueService) {}

  @OnEvent(DomainEvents.NEWSLETTER_VIEWED)
  async handleViewed(event: NewsletterViewedEvent): Promise<void> {
    await this.analyticsQueue.enqueuePageView({
      newsletterId: event.newsletterId,
      userId: event.userId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
    });
  }
}
