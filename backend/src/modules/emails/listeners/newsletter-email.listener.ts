import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvents, type NewsletterPublishedEvent } from '../../../common/events/index.js';
import { EmailsService } from '../emails.service.js';
import { NewsletterQueueService } from '../queues/newsletter-queue.service.js';

@Injectable()
export class NewsletterEmailListener {
  private readonly logger = new Logger(NewsletterEmailListener.name);

  constructor(
    private readonly emailsService: EmailsService,
    private readonly newsletterQueueService: NewsletterQueueService,
  ) {}

  @OnEvent(DomainEvents.NEWSLETTER_PUBLISHED)
  async handlePublished(event: NewsletterPublishedEvent): Promise<void> {
    const emailJob = await this.emailsService.ensureEmailJob(event.newsletterId);

    await this.newsletterQueueService.addSendJob({
      emailJobId: emailJob.id,
      newsletterId: event.newsletterId,
      title: event.title,
      slug: event.slug,
    });

    this.logger.log(`Email dispatch queued for newsletter ${event.newsletterId}`);
  }
}
