import { Injectable } from '@nestjs/common';
import type { Prisma, Newsletter } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';

const newsletterWithRelations = {
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      avatarUrl: true,
    },
  },
  categories: { include: { category: true } },
} satisfies Prisma.NewsletterInclude;

export type NewsletterWithRelations = Prisma.NewsletterGetPayload<{
  include: typeof newsletterWithRelations;
}>;

const SOFT_DELETE_FILTER = { deletedAt: null } satisfies Prisma.NewsletterWhereInput;

@Injectable()
export class NewslettersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.NewsletterCreateInput): Promise<NewsletterWithRelations> {
    return this.prisma.newsletter.create({
      data,
      include: newsletterWithRelations,
    });
  }

  async findById(id: string): Promise<NewsletterWithRelations | null> {
    return this.prisma.newsletter.findFirst({
      where: { id, ...SOFT_DELETE_FILTER },
      include: newsletterWithRelations,
    });
  }

  async findBySlug(slug: string): Promise<NewsletterWithRelations | null> {
    return this.prisma.newsletter.findFirst({
      where: { slug, ...SOFT_DELETE_FILTER },
      include: newsletterWithRelations,
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.NewsletterWhereInput;
    orderBy?: Prisma.NewsletterOrderByWithRelationInput;
  }): Promise<NewsletterWithRelations[]> {
    return this.prisma.newsletter.findMany({
      ...params,
      where: { ...params.where, ...SOFT_DELETE_FILTER },
      include: newsletterWithRelations,
    });
  }

  async count(where?: Prisma.NewsletterWhereInput): Promise<number> {
    return this.prisma.newsletter.count({
      where: { ...where, ...SOFT_DELETE_FILTER },
    });
  }

  async findManySummaries(params: {
    skip?: number;
    take?: number;
    where?: Prisma.NewsletterWhereInput;
    orderBy?: Prisma.NewsletterOrderByWithRelationInput;
  }) {
    return this.prisma.newsletter.findMany({
      skip: params.skip,
      take: params.take,
      where: { ...params.where, ...SOFT_DELETE_FILTER },
      orderBy: params.orderBy,
      select: {
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        readingTime: true,
      },
    });
  }

  async update(id: string, data: Prisma.NewsletterUpdateInput): Promise<NewsletterWithRelations> {
    return this.prisma.newsletter.update({
      where: { id },
      data,
      include: newsletterWithRelations,
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.newsletter.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const count = await this.prisma.newsletter.count({
      where: {
        slug,
        ...SOFT_DELETE_FILTER,
        id: excludeId ? { not: excludeId } : undefined,
      },
    });
    return count > 0;
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.prisma.newsletter.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }
}
