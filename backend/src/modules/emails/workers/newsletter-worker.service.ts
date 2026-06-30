import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import type { ConnectionOptions } from 'bullmq';
import type { NewsletterEmailJobPayload } from '../../../common/events/index.js';
import { EmailsService } from '../emails.service.js';
import { NEWSLETTER_EMAIL_QUEUE } from '../constants/queue.constants.js';
import { REDIS_CONNECTION } from '../../../infrastructure/redis/redis.constants.js';

@Injectable()
export class NewsletterWorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NewsletterWorkerService.name);
  private worker: Worker<NewsletterEmailJobPayload> | null = null;

  constructor(
    @Inject(REDIS_CONNECTION) private readonly connection: ConnectionOptions,
    private readonly emailsService: EmailsService,
  ) {}

  onModuleInit(): void {
    this.worker = new Worker<NewsletterEmailJobPayload>(
      NEWSLETTER_EMAIL_QUEUE,
      async (job) => {
        await this.emailsService.processNewsletterEmailJob(job.data);
      },
      {
        connection: this.connection,
        concurrency: 2,
      },
    );

    this.worker.on('completed', (job) => {
      this.logger.log(`Job ${job.id} completed for newsletter ${job.data.newsletterId}`);
    });

    this.worker.on('failed', (job, error) => {
      this.logger.error(
        `Job ${job?.id ?? 'unknown'} failed for newsletter ${job?.data?.newsletterId ?? 'unknown'}: ${error.message}`,
      );
    });

    this.logger.log('Newsletter email worker started');
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close();
  }
}
