import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IsOptional, IsDateString } from 'class-validator';
import { EmailsService } from './emails.service.js';
import { Roles } from '../../decorators/index.js';
import { Role } from '../../common/enums/index.js';
import { ApiResponse } from '../../common/responses/index.js';

class QueueEmailDto {
  @IsOptional()
  @IsDateString()
  scheduledFor?: string;
}

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post('newsletters/:newsletterId/queue')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async queueForNewsletter(
    @Param('newsletterId') newsletterId: string,
    @Body() dto: QueueEmailDto,
  ): Promise<ApiResponse<unknown>> {
    const job = await this.emailsService.queueForNewsletter(
      newsletterId,
      dto.scheduledFor ? new Date(dto.scheduledFor) : undefined,
    );
    return ApiResponse.ok('Email job queued', job);
  }

  @Get('newsletters/:newsletterId/jobs')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async getJobsForNewsletter(
    @Param('newsletterId') newsletterId: string,
  ): Promise<ApiResponse<unknown>> {
    const jobs = await this.emailsService.getJobsForNewsletter(newsletterId);
    return ApiResponse.ok('Email jobs retrieved', jobs);
  }

  @Get('newsletters/:newsletterId/stats')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async getJobStats(
    @Param('newsletterId') newsletterId: string,
  ): Promise<ApiResponse<unknown>> {
    const stats = await this.emailsService.getJobStats(newsletterId);
    return ApiResponse.ok('Email job stats retrieved', stats);
  }

  @Post('jobs/:jobId/process')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async processJob(@Param('jobId') jobId: string): Promise<ApiResponse<null>> {
    await this.emailsService.processJob(jobId);
    return ApiResponse.ok('Job processed');
  }

  @Post('process-pending')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async processPending(): Promise<ApiResponse<null>> {
    await this.emailsService.processNextPendingJobs();
    return ApiResponse.ok('Pending jobs processed');
  }
}
