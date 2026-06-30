import { Module } from '@nestjs/common';
import { CacheService } from './cache.service.js';
import { NewsletterCacheListener } from './listeners/newsletter-cache.listener.js';
import { NewsletterArchiveCacheListener } from './listeners/newsletter-archive-cache.listener.js';

@Module({
  providers: [CacheService, NewsletterCacheListener, NewsletterArchiveCacheListener],
  exports: [CacheService],
})
export class CacheModule {}
