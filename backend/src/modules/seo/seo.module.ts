import { Module } from '@nestjs/common';
import { SeoController } from './seo.controller.js';
import { SeoService } from './seo.service.js';
import { SeoCacheListener } from './listeners/seo-cache.listener.js';
import { CacheModule } from '../cache/cache.module.js';

@Module({
  imports: [CacheModule],
  controllers: [SeoController],
  providers: [SeoService, SeoCacheListener],
  exports: [SeoService],
})
export class SeoModule {}
