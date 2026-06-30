import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvents, type NewsletterArchivedEvent } from '../../../common/events/index.js';
import { CacheService } from '../cache.service.js';

@Injectable()
export class NewsletterArchiveCacheListener {
  constructor(private readonly cacheService: CacheService) {}

  @OnEvent(DomainEvents.NEWSLETTER_ARCHIVED)
  async handleArchived(event: NewsletterArchivedEvent): Promise<void> {
    await this.cacheService.invalidateNewsletter(event.slug);
  }
}
