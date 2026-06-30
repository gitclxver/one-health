import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvents, type NewsletterPublishedEvent } from '../../../common/events/index.js';
import { AnalyticsService } from '../analytics.service.js';

@Injectable()
export class NewsletterAnalyticsListener {
  private readonly logger = new Logger(NewsletterAnalyticsListener.name);

  constructor(private readonly analyticsService: AnalyticsService) {}

  @OnEvent(DomainEvents.NEWSLETTER_PUBLISHED)
  async handlePublished(event: NewsletterPublishedEvent): Promise<void> {
    await this.analyticsService.recordNewsletterPublished(event.newsletterId);
    this.logger.log(`Analytics recorded publish for newsletter ${event.newsletterId}`);
  }
}
