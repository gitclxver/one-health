import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NewslettersRepository, NewsletterWithRelations } from './newsletters.repository.js';
import { CreateNewsletterDto, UpdateNewsletterDto, QueryNewslettersDto } from './dto/index.js';
import {
  generateSlug,
  generateUniqueSlug,
  buildPaginationMeta,
  getPaginationSkip,
  calculateReadingTime,
} from '../../common/helpers/index.js';
import { DomainEvents } from '../../common/events/index.js';
import { toPublicListItem } from './mappers/newsletter-public.mapper.js';
import type { PublicNewsletterListItem, PublicNewsletterDetail } from './mappers/newsletter-public.mapper.js';
import { SeoService } from '../seo/seo.service.js';
import type { PaginatedResult, AuthenticatedUser } from '../../common/interfaces/index.js';
import { NewsletterStatus, Role } from '../../common/enums/index.js';
import type { Prisma } from '../../../generated/prisma/client';

export interface ViewContext {
  ipAddress: string;
  userAgent: string;
}

@Injectable()
export class NewslettersService {
  constructor(
    private readonly newslettersRepository: NewslettersRepository,
    private readonly seoService: SeoService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    dto: CreateNewsletterDto,
    author: AuthenticatedUser,
  ): Promise<NewsletterWithRelations> {
    const slug = await this.resolveUniqueSlug(dto.title);
    const readingTime = calculateReadingTime(dto.content);

    const data: Prisma.NewsletterCreateInput = {
      title: dto.title,
      slug,
      excerpt: dto.excerpt,
      content: dto.content,
      featuredImage: dto.featuredImage,
      seoTitle: dto.seoTitle,
      seoDescription: dto.seoDescription,
      readingTime,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      status: NewsletterStatus.DRAFT,
      author: { connect: { id: author.id } },
      categories: dto.categoryIds?.length
        ? {
            create: dto.categoryIds.map((categoryId) => ({
              category: { connect: { id: categoryId } },
            })),
          }
        : undefined,
    };

    const newsletter = await this.newslettersRepository.create(data);

    this.eventEmitter.emit(DomainEvents.NEWSLETTER_CREATED, {
      newsletterId: newsletter.id,
      title: newsletter.title,
      slug: newsletter.slug,
      userId: author.id,
    });

    return newsletter;
  }

  async findAll(
    query: QueryNewslettersDto,
    requestor?: AuthenticatedUser,
  ): Promise<PaginatedResult<NewsletterWithRelations | PublicNewsletterListItem>> {
    const { page = 1, limit = 20, status, categorySlug, search, authorId } = query;
    const skip = getPaginationSkip(page, limit);

    const where: Prisma.NewsletterWhereInput = {};

    const canSeeAll =
      requestor &&
      [Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR, Role.AUTHOR].includes(requestor.role);

    if (!canSeeAll) {
      where.status = NewsletterStatus.PUBLISHED;
    } else if (status) {
      where.status = status;
    }

    if (categorySlug) {
      where.categories = { some: { category: { slug: categorySlug } } };
    }
    if (authorId) where.authorId = authorId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (!canSeeAll) {
      const [items, total] = await Promise.all([
        this.newslettersRepository.findManySummaries({
          skip,
          take: limit,
          where,
          orderBy: { publishedAt: 'desc' },
        }),
        this.newslettersRepository.count(where),
      ]);
      return { data: items.map(toPublicListItem), meta: buildPaginationMeta(total, page, limit) };
    }

    const [items, total] = await Promise.all([
      this.newslettersRepository.findMany({
        skip,
        take: limit,
        where,
        orderBy: { publishedAt: 'desc' },
      }),
      this.newslettersRepository.count(where),
    ]);

    return { data: items, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOne(
    idOrSlug: string,
    requestor?: AuthenticatedUser,
    viewContext?: ViewContext,
  ): Promise<NewsletterWithRelations | PublicNewsletterDetail> {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(idOrSlug);

    const newsletter = isUuid
      ? await this.newslettersRepository.findById(idOrSlug)
      : await this.newslettersRepository.findBySlug(idOrSlug);

    if (!newsletter) throw new NotFoundException('Newsletter not found');

    const canViewDraft =
      requestor && [Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR].includes(requestor.role);
    const isOwn = requestor && newsletter.authorId === requestor.id;

    if (newsletter.status !== NewsletterStatus.PUBLISHED && !canViewDraft && !isOwn) {
      throw new NotFoundException('Newsletter not found');
    }

    const isPublicRead = newsletter.status === NewsletterStatus.PUBLISHED && !canViewDraft;

    if (isPublicRead && viewContext) {
      this.eventEmitter.emit(DomainEvents.NEWSLETTER_VIEWED, {
        newsletterId: newsletter.id,
        userId: requestor?.id,
        ipAddress: viewContext.ipAddress,
        userAgent: viewContext.userAgent,
      });
    }

    if (isPublicRead) {
      const seo = this.seoService.buildNewsletterSeo(newsletter);
      return {
        id: newsletter.id,
        ...toPublicListItem(newsletter),
        content: newsletter.content,
        seoTitle: seo.seoTitle,
        seoDescription: seo.seoDescription,
        canonicalUrl: seo.canonicalUrl,
        ogImage: seo.ogImage,
        openGraph: seo.openGraph,
      };
    }

    return newsletter;
  }

  async update(
    id: string,
    dto: UpdateNewsletterDto,
    requestor: AuthenticatedUser,
  ): Promise<NewsletterWithRelations> {
    const newsletter = await this.newslettersRepository.findById(id);
    if (!newsletter) throw new NotFoundException('Newsletter not found');
    this.assertCanModify(newsletter, requestor);

    const data: Prisma.NewsletterUpdateInput = {
      excerpt: dto.excerpt,
      content: dto.content,
      featuredImage: dto.featuredImage,
      seoTitle: dto.seoTitle,
      seoDescription: dto.seoDescription,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
    };

    if (dto.title && dto.title !== newsletter.title) {
      data.title = dto.title;
      data.slug = await this.resolveUniqueSlug(dto.title, id);
    }

    if (dto.content) {
      data.readingTime = calculateReadingTime(dto.content);
    }

    if (dto.categoryIds !== undefined) {
      data.categories = {
        deleteMany: {},
        create: dto.categoryIds.map((categoryId) => ({
          category: { connect: { id: categoryId } },
        })),
      };
    }

    return this.newslettersRepository.update(id, data);
  }

  async publish(id: string, requestor: AuthenticatedUser): Promise<NewsletterWithRelations> {
    const newsletter = await this.newslettersRepository.findById(id);
    if (!newsletter) throw new NotFoundException('Newsletter not found');
    this.assertCanModify(newsletter, requestor);

    const seoFields = this.seoService.resolvePublishSeoFields(newsletter);
    const publishedAt = new Date();

    const published = await this.newslettersRepository.update(id, {
      status: NewsletterStatus.PUBLISHED,
      publishedAt,
      seoTitle: seoFields.seoTitle,
      seoDescription: seoFields.seoDescription,
      canonicalUrl: seoFields.canonicalUrl,
      ogImage: seoFields.ogImage,
    });

    this.eventEmitter.emit(DomainEvents.NEWSLETTER_PUBLISHED, {
      newsletterId: published.id,
      title: published.title,
      slug: published.slug,
      publishedAt: published.publishedAt ?? publishedAt,
      userId: requestor.id,
    });

    return published;
  }

  async archive(id: string, requestor: AuthenticatedUser): Promise<NewsletterWithRelations> {
    const newsletter = await this.newslettersRepository.findById(id);
    if (!newsletter) throw new NotFoundException('Newsletter not found');
    this.assertCanModify(newsletter, requestor);

    const archived = await this.newslettersRepository.update(id, { status: NewsletterStatus.ARCHIVED });

    this.eventEmitter.emit(DomainEvents.NEWSLETTER_ARCHIVED, {
      newsletterId: archived.id,
      title: archived.title,
      slug: archived.slug,
      userId: requestor.id,
    });

    return archived;
  }

  async remove(id: string, requestor: AuthenticatedUser): Promise<void> {
    const newsletter = await this.newslettersRepository.findById(id);
    if (!newsletter) throw new NotFoundException('Newsletter not found');
    this.assertCanModify(newsletter, requestor);
    await this.newslettersRepository.softDelete(id);
  }

  private assertCanModify(
    newsletter: NewsletterWithRelations,
    requestor: AuthenticatedUser,
  ): void {
    const isAdmin = [Role.SUPER_ADMIN, Role.ADMIN].includes(requestor.role);
    const isOwn = newsletter.authorId === requestor.id;
    if (!isAdmin && !isOwn) {
      throw new ForbiddenException('You do not have permission to modify this newsletter');
    }
  }

  private async resolveUniqueSlug(title: string, excludeId?: string): Promise<string> {
    let slug = generateSlug(title);
    let attempt = 0;

    while (await this.newslettersRepository.slugExists(slug, excludeId)) {
      attempt++;
      slug = generateUniqueSlug(title, String(attempt));
      if (attempt > 10) throw new ConflictException('Could not generate a unique slug');
    }

    return slug;
  }
}
