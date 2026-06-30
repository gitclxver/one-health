import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EmailsRepository } from './emails.repository.js';
import { SubscribersService } from '../subscribers/subscribers.service.js';
import type { EmailJob } from '../../../generated/prisma/client.js';
import type { NewsletterEmailJobPayload } from '../../common/events/index.js';
import { EmailJobStatus } from '../../common/enums/index.js';

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);

  constructor(
    private readonly emailsRepository: EmailsRepository,
    private readonly subscribersService: SubscribersService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Ensures a single EmailJob exists per newsletter dispatch (idempotent).
   * Called by the event listener before enqueueing to BullMQ.
   */
  async ensureEmailJob(newsletterId: string, scheduledFor?: Date): Promise<EmailJob> {
    const existing = await this.emailsRepository.findActiveJobForNewsletter(newsletterId);
    if (existing) return existing;

    const job = await this.emailsRepository.create({
      newsletter: { connect: { id: newsletterId } },
      scheduledFor,
    });

    this.logger.log(`Email job ${job.id} created for newsletter ${newsletterId}`);
    return job;
  }

  /** @deprecated Prefer event-driven flow — kept for manual admin triggers. */
  async queueForNewsletter(newsletterId: string, scheduledFor?: Date): Promise<EmailJob> {
    return this.ensureEmailJob(newsletterId, scheduledFor);
  }

  /**
   * BullMQ worker entry point — processes a queued newsletter email job.
   */
  async processNewsletterEmailJob(payload: NewsletterEmailJobPayload): Promise<void> {
    await this.processJob(payload.emailJobId);
  }

  /**
   * Processes a single email job — sends the newsletter to all verified subscribers.
   */
  async processJob(jobId: string): Promise<void> {
    const job = await this.emailsRepository.findById(jobId);
    if (!job) throw new NotFoundException('Email job not found');

    if (job.status === EmailJobStatus.COMPLETED) {
      this.logger.debug(`Job ${jobId} already completed, skipping`);
      return;
    }

    if (job.status !== EmailJobStatus.PENDING && job.status !== EmailJobStatus.FAILED) {
      this.logger.warn(`Job ${jobId} is in status ${job.status}, skipping`);
      return;
    }

    await this.emailsRepository.markProcessing(jobId);

    try {
      const subscribers = await this.subscribersService.findVerified();

      if (subscribers.length === 0) {
        this.logger.warn(`No verified subscribers for job ${jobId}`);
        await this.emailsRepository.markCompleted(jobId);
        return;
      }

      await this.sendBatch(job.newsletterId, subscribers.map((s) => s.email));
      await this.emailsRepository.markCompleted(jobId);
      this.logger.log(`Job ${jobId}: sent to ${subscribers.length} subscribers`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Job ${jobId} failed: ${message}`);
      await this.emailsRepository.markFailed(jobId, message);
      throw error;
    }
  }

  async processNextPendingJobs(limit = 5): Promise<void> {
    const pending = await this.emailsRepository.findPending(limit);
    for (const job of pending) {
      await this.processJob(job.id);
    }
  }

  async getJobsForNewsletter(newsletterId: string): Promise<EmailJob[]> {
    return this.emailsRepository.findByNewsletter(newsletterId);
  }

  async getJobStats(newsletterId: string): Promise<Record<EmailJobStatus, number>> {
    return this.emailsRepository.countByStatus(newsletterId);
  }

  private async sendBatch(newsletterId: string, emails: string[]): Promise<void> {
    const resendApiKey = this.configService.get<string>('email.resendApiKey');
    const fromAddress = this.configService.get<string>('email.fromAddress') ?? 'noreply@yourdomain.com';

    if (!resendApiKey) {
      this.logger.warn('Resend not configured — skipping actual delivery');
      return;
    }

    const resend = new Resend(resendApiKey);
    const subject = `New publication available`;
    const html = `<p>A new newsletter has been published. <a href="#">Read more</a></p>`;

    for (const to of emails) {
      const { error } = await resend.emails.send({ from: fromAddress, to, subject, html });
      if (error) {
        throw new Error(`Resend failed for ${to}: ${error.message}`);
      }
    }

    this.logger.log(`Newsletter ${newsletterId} sent to ${emails.length} subscribers via Resend`);
  }
}
