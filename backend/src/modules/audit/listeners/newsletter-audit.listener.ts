import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  DomainEvents,
  type NewsletterPublishedEvent,
  type NewsletterCreatedEvent,
  type NewsletterArchivedEvent,
} from '../../../common/events/index.js';
import { AuditService } from '../audit.service.js';

@Injectable()
export class NewsletterAuditListener {
  constructor(private readonly auditService: AuditService) {}

  @OnEvent(DomainEvents.NEWSLETTER_PUBLISHED)
  async handlePublished(event: NewsletterPublishedEvent): Promise<void> {
    await this.auditService.log({
      action: 'NEWSLETTER_PUBLISHED',
      resource: 'newsletter',
      resourceId: event.newsletterId,
      userId: event.userId,
      metadata: { title: event.title, slug: event.slug },
    });
  }

  @OnEvent(DomainEvents.NEWSLETTER_CREATED)
  async handleCreated(event: NewsletterCreatedEvent): Promise<void> {
    await this.auditService.log({
      action: 'NEWSLETTER_CREATED',
      resource: 'newsletter',
      resourceId: event.newsletterId,
      userId: event.userId,
      metadata: { title: event.title, slug: event.slug },
    });
  }

  @OnEvent(DomainEvents.NEWSLETTER_ARCHIVED)
  async handleArchived(event: NewsletterArchivedEvent): Promise<void> {
    await this.auditService.log({
      action: 'NEWSLETTER_ARCHIVED',
      resource: 'newsletter',
      resourceId: event.newsletterId,
      userId: event.userId,
      metadata: { title: event.title, slug: event.slug },
    });
  }
}
