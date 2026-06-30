import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvents, type NewsletterPublishedEvent } from '../../../common/events/index.js';
import { SearchService } from '../search.service.js';

@Injectable()
export class NewsletterSearchListener {
  constructor(private readonly searchService: SearchService) {}

  @OnEvent(DomainEvents.NEWSLETTER_PUBLISHED)
  async handlePublished(event: NewsletterPublishedEvent): Promise<void> {
    await this.searchService.indexNewsletter(event.newsletterId);
  }
}
