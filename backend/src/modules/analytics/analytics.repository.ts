import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { PageView } from '../../../generated/prisma/client';

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPageView(data: {
    newsletterId: string;
    userId?: string;
    ipAddress: string;
    userAgent: string;
  }): Promise<PageView> {
    return this.prisma.pageView.create({
      data: {
        newsletter: { connect: { id: data.newsletterId } },
        user: data.userId ? { connect: { id: data.userId } } : undefined,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  async incrementNewsletterViewCount(newsletterId: string): Promise<void> {
    await this.prisma.newsletter.update({
      where: { id: newsletterId },
      data: { viewCount: { increment: 1 } },
    });
  }
}
