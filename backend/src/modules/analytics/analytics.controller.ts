import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Roles } from '../../decorators';
import { Role } from '../../common/enums';
import { ApiResponse } from '../../common/responses';

@Controller('analytics')
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboard(): Promise<ApiResponse<unknown>> {
    const stats = await this.analyticsService.getDashboardStats();
    return ApiResponse.ok('Dashboard stats retrieved', stats);
  }

  @Get('top-newsletters')
  async getTopNewsletters(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<ApiResponse<unknown>> {
    const newsletters = await this.analyticsService.getTopNewsletters(limit);
    return ApiResponse.ok('Top newsletters retrieved', newsletters);
  }
}
