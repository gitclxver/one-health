import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { NewsletterSearchListener } from './listeners/newsletter-search.listener';

@Module({
  controllers: [SearchController],
  providers: [SearchService, NewsletterSearchListener],
  exports: [SearchService],
})
export class SearchModule {}
