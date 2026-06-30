import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import type { Request } from 'express';
import { NewslettersService } from './newsletters.service.js';
import { CreateNewsletterDto, UpdateNewsletterDto, QueryNewslettersDto } from './dto/index.js';
import { Roles, CurrentUser, Public } from '../../decorators/index.js';
import { Role } from '../../common/enums/index.js';
import type { AuthenticatedUser } from '../../common/interfaces/index.js';
import { ApiResponse, PaginatedApiResponse } from '../../common/responses/index.js';
import { PublicCacheHeadersInterceptor } from '../../common/interceptors/public-cache-headers.interceptor.js';

@Controller('newsletters')
export class NewslettersController {
  constructor(private readonly newslettersService: NewslettersService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR, Role.AUTHOR)
  async create(
    @Body() dto: CreateNewsletterDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApiResponse<unknown>> {
    const newsletter = await this.newslettersService.create(dto, user);
    return ApiResponse.ok('Newsletter created', newsletter);
  }

  @Public()
  @Get()
  @UseInterceptors(PublicCacheHeadersInterceptor)
  async findAll(
    @Query() query: QueryNewslettersDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PaginatedApiResponse<unknown>> {
    const result = await this.newslettersService.findAll(query, user);
    return new PaginatedApiResponse('Newsletters retrieved', result.data, result.meta);
  }

  @Public()
  @Get(':idOrSlug')
  @UseInterceptors(PublicCacheHeadersInterceptor)
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ): Promise<ApiResponse<unknown>> {
    const newsletter = await this.newslettersService.findOne(idOrSlug, user, {
      ipAddress: req.ip ?? 'unknown',
      userAgent: req.headers['user-agent'] ?? 'unknown',
    });
    return ApiResponse.ok('Newsletter retrieved', newsletter);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR, Role.AUTHOR)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateNewsletterDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApiResponse<unknown>> {
    const newsletter = await this.newslettersService.update(id, dto, user);
    return ApiResponse.ok('Newsletter updated', newsletter);
  }

  @Patch(':id/publish')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  async publish(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApiResponse<unknown>> {
    const newsletter = await this.newslettersService.publish(id, user);
    return ApiResponse.ok('Newsletter published', newsletter);
  }

  @Patch(':id/archive')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async archive(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApiResponse<unknown>> {
    const newsletter = await this.newslettersService.archive(id, user);
    return ApiResponse.ok('Newsletter archived', newsletter);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR, Role.AUTHOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.newslettersService.remove(id, user);
  }
}
