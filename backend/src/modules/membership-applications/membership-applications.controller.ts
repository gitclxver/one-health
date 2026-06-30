import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MembershipApplicationsService } from './membership-applications.service';
import {
  CreateMembershipApplicationDto,
  QueryMembershipApplicationsDto,
  UpdateMembershipApplicationDto,
} from './dto';
import { Public, Roles } from '../../decorators';
import { Role } from '../../common/enums';
import { ApiResponse } from '../../common/responses';

@Controller('membership-applications')
export class MembershipApplicationsController {
  constructor(private readonly service: MembershipApplicationsService) {}

  @Public()
  @Post()
  async create(@Body() dto: CreateMembershipApplicationDto): Promise<ApiResponse<unknown>> {
    const application = await this.service.create(dto);
    return ApiResponse.ok('Application submitted successfully', application);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async findAll(@Query() query: QueryMembershipApplicationsDto): Promise<ApiResponse<unknown>> {
    const applications = await this.service.findAll(query);
    return ApiResponse.ok('Applications retrieved', applications);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async findOne(@Param('id') id: string): Promise<ApiResponse<unknown>> {
    const application = await this.service.findOne(id);
    return ApiResponse.ok('Application retrieved', application);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMembershipApplicationDto,
  ): Promise<ApiResponse<unknown>> {
    const application = await this.service.update(id, dto);
    return ApiResponse.ok('Application updated', application);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.service.remove(id);
  }
}
