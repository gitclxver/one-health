import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(private readonly configService: ConfigService) {}

  async invalidateNewsletter(slug: string): Promise<void> {
    await this.invalidatePaths([
      '/',
      '/newsletters',
      `/newsletters/${slug}`,
      '/rss',
      '/sitemap.xml',
    ]);
  }

  async invalidatePath(path: string): Promise<void> {
    await this.invalidatePaths([path]);
  }

  async invalidatePaths(paths: string[]): Promise<void> {
    const frontendUrl = this.configService.get<string>('app.frontendUrl');
    const secret = this.configService.get<string>('app.revalidateSecret');

    if (!frontendUrl || !secret) {
      this.logger.debug(`Cache invalidation skipped (paths: ${paths.join(', ')})`);
      return;
    }

    try {
      const response = await fetch(`${frontendUrl}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({ paths }),
      });

      if (!response.ok) {
        this.logger.warn(`Cache invalidation returned ${response.status} for paths: ${paths.join(', ')}`);
      } else {
        this.logger.log(`Cache invalidated for paths: ${paths.join(', ')}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Cache invalidation failed: ${message}`);
    }
  }
}
