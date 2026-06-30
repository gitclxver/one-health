import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  DomainEvents,
  type NewsletterPublishedEvent,
  type NewsletterArchivedEvent,
} from '../../../common/events/index.js';
import { CacheService } from '../../cache/cache.service.js';

@Injectable()
export class SeoCacheListener {
  constructor(private readonly cacheService: CacheService) {}

  @OnEvent(DomainEvents.NEWSLETTER_PUBLISHED)
  async handlePublished(event: NewsletterPublishedEvent): Promise<void> {
    await this.cacheService.invalidatePaths([
      '/',
      '/newsletters',
      `/newsletters/${event.slug}`,
      '/sitemap.xml',
      '/rss.xml',
    ]);
  }

  @OnEvent(DomainEvents.NEWSLETTER_ARCHIVED)
  async handleArchived(event: NewsletterArchivedEvent): Promise<void> {
    await this.cacheService.invalidatePaths([
      '/',
      '/newsletters',
      `/newsletters/${event.slug}`,
      '/sitemap.xml',
      '/rss.xml',
    ]);
  }
}
