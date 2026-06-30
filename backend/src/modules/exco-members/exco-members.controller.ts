import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExcoMembersService } from './exco-members.service';
import { CreateExcoMemberDto, UpdateExcoMemberDto } from './dto';
import { Public, Roles } from '../../decorators';
import { Role } from '../../common/enums';
import { ApiResponse } from '../../common/responses';

@Controller('exco-members')
export class ExcoMembersController {
  constructor(private readonly excoMembersService: ExcoMembersService) {}

  @Public()
  @Get()
  async findAll(@Query('all') all?: string): Promise<ApiResponse<unknown>> {
    const members = await this.excoMembersService.findAll(all !== 'true');
    return ApiResponse.ok('Executive members retrieved', members);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<unknown>> {
    const member = await this.excoMembersService.findOne(id);
    return ApiResponse.ok('Executive member retrieved', member);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async create(@Body() dto: CreateExcoMemberDto): Promise<ApiResponse<unknown>> {
    const member = await this.excoMembersService.create(dto);
    return ApiResponse.ok('Executive member created', member);
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateExcoMemberDto,
  ): Promise<ApiResponse<unknown>> {
    const member = await this.excoMembersService.update(id, dto);
    return ApiResponse.ok('Executive member updated', member);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.excoMembersService.remove(id);
  }
}
