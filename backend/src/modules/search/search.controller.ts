import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';
import { SearchService } from './search.service.js';
import { Public, CurrentUser } from '../../decorators/index.js';
import { ApiResponse } from '../../common/responses/index.js';
import { PublicCacheHeadersInterceptor } from '../../common/interceptors/public-cache-headers.interceptor.js';
import { UseInterceptors } from '@nestjs/common';
import type { AuthenticatedUser } from '../../common/interfaces/index.js';

class SearchQueryDto {
  @IsString()
  @MinLength(2)
  q: string;
}

@Controller('search')
@UseInterceptors(PublicCacheHeadersInterceptor)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  async search(
    @Query() query: SearchQueryDto,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @CurrentUser() user?: AuthenticatedUser,
  ): Promise<ApiResponse<unknown>> {
    const results = await this.searchService.search(query.q, limit, user?.id);
    return ApiResponse.ok('Search results', results);
  }
}
