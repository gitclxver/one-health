import { Module } from '@nestjs/common';
import { NewslettersController } from './newsletters.controller.js';
import { NewslettersService } from './newsletters.service.js';
import { NewslettersRepository } from './newsletters.repository.js';
import { SeoModule } from '../seo/seo.module.js';

@Module({
  imports: [SeoModule],
  controllers: [NewslettersController],
  providers: [NewslettersService, NewslettersRepository],
  exports: [NewslettersService],
})
export class NewslettersModule {}
