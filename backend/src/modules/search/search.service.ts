import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service.js';
import { DomainEvents, type SearchPerformedEvent } from '../../common/events/index.js';

export interface SearchResultItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  score: number;
}

export interface SearchResponse {
  results: SearchResultItem[];
  total: number;
  took: number;
}

interface FtsRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  score: number;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /** Refreshes the PostgreSQL tsvector column for a published newsletter. */
  async indexNewsletter(newsletterId: string): Promise<void> {
    await this.prisma.$executeRaw`
      UPDATE newsletters
      SET search_vector =
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(content, '')), 'C')
      WHERE id = ${newsletterId}::uuid
        AND status = 'PUBLISHED'
        AND deleted_at IS NULL
    `;
    this.logger.debug(`Search index updated for newsletter ${newsletterId}`);
  }

  async search(query: string, limit = 20, userId?: string): Promise<SearchResponse> {
    const start = Date.now();

    if (!query || query.trim().length < 2) {
      return { results: [], total: 0, took: Date.now() - start };
    }

    const term = query.trim();

    const rows = await this.prisma.$queryRaw<FtsRow[]>`
      SELECT
        n.id,
        n.title,
        n.slug,
        n.excerpt,
        n.published_at AS "publishedAt",
        ts_rank(
          COALESCE(
            n.search_vector,
            setweight(to_tsvector('english', coalesce(n.title, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(n.excerpt, '')), 'B') ||
            setweight(to_tsvector('english', coalesce(n.content, '')), 'C')
          ),
          plainto_tsquery('english', ${term})
        )::float AS score
      FROM newsletters n
      WHERE n.status = 'PUBLISHED'
        AND n.deleted_at IS NULL
        AND (
          COALESCE(
            n.search_vector,
            setweight(to_tsvector('english', coalesce(n.title, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(n.excerpt, '')), 'B') ||
            setweight(to_tsvector('english', coalesce(n.content, '')), 'C')
          ) @@ plainto_tsquery('english', ${term})
        )
      ORDER BY score DESC, n.published_at DESC
      LIMIT ${limit}
    `;

    const took = Date.now() - start;

    this.eventEmitter.emit(DomainEvents.SEARCH_PERFORMED, {
      query: term,
      resultCount: rows.length,
      tookMs: took,
      userId,
    } satisfies SearchPerformedEvent);

    return {
      results: rows.map(({ id, title, slug, excerpt, publishedAt, score }) => ({
        id,
        title,
        slug,
        excerpt,
        publishedAt,
        score,
      })),
      total: rows.length,
      took,
    };
  }
}
