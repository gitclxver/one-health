import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AnalyticsRepository } from './analytics.repository.js';
import type {
  PageViewJobPayload,
  SearchTrackJobPayload,
} from './constants/queue.constants.js';

export interface DashboardStats {
  totalNewsletters: number;
  publishedNewsletters: number;
  totalSubscribers: number;
  verifiedSubscribers: number;
  totalViews: number;
  totalUsers: number;
  totalPageViews: number;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly analyticsRepository: AnalyticsRepository,
  ) {}

  async processPageView(payload: PageViewJobPayload): Promise<void> {
    await this.analyticsRepository.createPageView(payload);
    await this.analyticsRepository.incrementNewsletterViewCount(payload.newsletterId);
    this.logger.debug(`Page view recorded for newsletter ${payload.newsletterId}`);
  }

  async processSearchTrack(payload: SearchTrackJobPayload): Promise<void> {
    this.logger.debug(
      `Search tracked: "${payload.query}" (${payload.resultCount} results, ${payload.tookMs}ms)`,
    );
  }

  async recordNewsletterPublished(newsletterId: string): Promise<void> {
    await this.prisma.newsletter.findFirst({
      where: { id: newsletterId, deletedAt: null },
      select: { id: true },
    });
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const [
      totalNewsletters,
      publishedNewsletters,
      totalSubscribers,
      verifiedSubscribers,
      viewsAgg,
      totalUsers,
      totalPageViews,
    ] = await Promise.all([
      this.prisma.newsletter.count({ where: { deletedAt: null } }),
      this.prisma.newsletter.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
      this.prisma.subscriber.count(),
      this.prisma.subscriber.count({ where: { isVerified: true } }),
      this.prisma.newsletter.aggregate({ _sum: { viewCount: true } }),
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.pageView.count(),
    ]);

    return {
      totalNewsletters,
      publishedNewsletters,
      totalSubscribers,
      verifiedSubscribers,
      totalViews: viewsAgg._sum.viewCount ?? 0,
      totalUsers,
      totalPageViews,
    };
  }

  async getTopNewsletters(
    limit = 10,
  ): Promise<Array<{ id: string; title: string; viewCount: number }>> {
    return this.prisma.newsletter.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      orderBy: { viewCount: 'desc' },
      take: limit,
      select: { id: true, title: true, viewCount: true },
    });
  }
}
