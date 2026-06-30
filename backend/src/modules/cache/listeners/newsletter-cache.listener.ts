import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvents, type NewsletterPublishedEvent } from '../../../common/events/index.js';
import { CacheService } from '../cache.service.js';

@Injectable()
export class NewsletterCacheListener {
  constructor(private readonly cacheService: CacheService) {}

  @OnEvent(DomainEvents.NEWSLETTER_PUBLISHED)
  async handlePublished(event: NewsletterPublishedEvent): Promise<void> {
    await this.cacheService.invalidateNewsletter(event.slug);
  }
}
