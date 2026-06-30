import { Injectable } from '@nestjs/common';
import type { Prisma, EmailJob } from '../../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { EmailJobStatus } from '../../common/enums/index.js';

@Injectable()
export class EmailsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EmailJobCreateInput): Promise<EmailJob> {
    return this.prisma.emailJob.create({ data });
  }

  async findActiveJobForNewsletter(newsletterId: string): Promise<EmailJob | null> {
    return this.prisma.emailJob.findFirst({
      where: {
        newsletterId,
        status: {
          in: [EmailJobStatus.PENDING, EmailJobStatus.PROCESSING, EmailJobStatus.COMPLETED],
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<EmailJob | null> {
    return this.prisma.emailJob.findUnique({ where: { id } });
  }

  async findPending(take = 10): Promise<EmailJob[]> {
    return this.prisma.emailJob.findMany({
      where: { status: EmailJobStatus.PENDING },
      orderBy: { createdAt: 'asc' },
      take,
    });
  }

  async findByNewsletter(newsletterId: string): Promise<EmailJob[]> {
    return this.prisma.emailJob.findMany({
      where: { newsletterId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markProcessing(id: string): Promise<void> {
    await this.prisma.emailJob.update({
      where: { id },
      data: { status: EmailJobStatus.PROCESSING },
    });
  }

  async markCompleted(id: string): Promise<void> {
    await this.prisma.emailJob.update({
      where: { id },
      data: { status: EmailJobStatus.COMPLETED, completedAt: new Date() },
    });
  }

  async markFailed(id: string, errorMessage: string): Promise<void> {
    await this.prisma.emailJob.update({
      where: { id },
      data: {
        status: EmailJobStatus.FAILED,
        errorMessage,
        attempts: { increment: 1 },
      },
    });
  }

  async incrementAttempts(id: string): Promise<void> {
    await this.prisma.emailJob.update({
      where: { id },
      data: { attempts: { increment: 1 } },
    });
  }

  async countByStatus(newsletterId: string): Promise<Record<EmailJobStatus, number>> {
    const counts = await this.prisma.emailJob.groupBy({
      by: ['status'],
      where: { newsletterId },
      _count: { id: true },
    });

    const result = Object.values(EmailJobStatus).reduce(
      (acc, s) => ({ ...acc, [s]: 0 }),
      {} as Record<EmailJobStatus, number>,
    );

    for (const c of counts) {
      result[c.status as EmailJobStatus] = c._count.id;
    }

    return result;
  }

  async findMany(where?: Prisma.EmailJobWhereInput): Promise<EmailJob[]> {
    return this.prisma.emailJob.findMany({ where, orderBy: { createdAt: 'desc' } });
  }
}
