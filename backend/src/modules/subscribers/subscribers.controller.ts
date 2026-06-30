import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { SubscribersService } from './subscribers.service.js';
import { CreateSubscriberDto } from './dto/index.js';
import { Roles, Public } from '../../decorators/index.js';
import { Role } from '../../common/enums/index.js';
import { ApiResponse, PaginatedApiResponse } from '../../common/responses/index.js';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Public()
  @Post()
  async subscribe(@Body() dto: CreateSubscriberDto): Promise<ApiResponse<unknown>> {
    const subscriber = await this.subscribersService.subscribe(dto);
    return ApiResponse.ok('Check your email to confirm your subscription', { id: subscriber.id });
  }

  @Public()
  @Get('verify/:token')
  async verify(@Param('token') token: string): Promise<ApiResponse<null>> {
    await this.subscribersService.verify(token);
    return ApiResponse.ok('Email verified successfully');
  }

  @Public()
  @Delete('unsubscribe/:token')
  @HttpCode(HttpStatus.OK)
  async unsubscribe(@Param('token') token: string): Promise<ApiResponse<null>> {
    await this.subscribersService.unsubscribeByToken(token);
    return ApiResponse.ok('Unsubscribed successfully');
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('verifiedOnly', new DefaultValuePipe(false), ParseBoolPipe) verifiedOnly: boolean,
  ): Promise<PaginatedApiResponse<unknown>> {
    const result = await this.subscribersService.findAll(page, limit, verifiedOnly);
    return new PaginatedApiResponse('Subscribers retrieved', result.data, result.meta);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.subscribersService.remove(id);
  }
}
