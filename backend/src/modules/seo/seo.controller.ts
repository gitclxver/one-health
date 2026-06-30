import { Controller, Get, Header, UseInterceptors } from '@nestjs/common';
import { SeoService } from './seo.service.js';
import { Public } from '../../decorators/index.js';
import { PublicCacheHeadersInterceptor } from '../../common/interceptors/public-cache-headers.interceptor.js';

@Controller()
@UseInterceptors(PublicCacheHeadersInterceptor)
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Public()
  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  async sitemap(): Promise<string> {
    return this.seoService.generateSitemap();
  }

  @Public()
  @Get('rss.xml')
  @Header('Content-Type', 'application/rss+xml; charset=utf-8')
  async rss(): Promise<string> {
    return this.seoService.generateRssFeed();
  }
}
