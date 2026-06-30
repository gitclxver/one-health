import { Module } from '@nestjs/common';
import { EmailsController } from './emails.controller.js';
import { EmailsService } from './emails.service.js';
import { EmailsRepository } from './emails.repository.js';
import { SubscribersModule } from '../subscribers/subscribers.module.js';
import { NewsletterQueueService } from './queues/newsletter-queue.service.js';
import { NewsletterWorkerService } from './workers/newsletter-worker.service.js';
import { NewsletterEmailListener } from './listeners/newsletter-email.listener.js';

@Module({
  imports: [SubscribersModule],
  controllers: [EmailsController],
  providers: [
    EmailsService,
    EmailsRepository,
    NewsletterQueueService,
    NewsletterWorkerService,
    NewsletterEmailListener,
  ],
  exports: [EmailsService],
})
export class EmailsModule {}
