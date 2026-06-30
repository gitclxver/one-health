import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, UpdateUserRoleDto, UpdateUserStatusDto, QueryUsersDto } from './dto';
import { Roles, CurrentUser } from '../../decorators';
import { Role } from '../../common/enums';
import type { AuthenticatedUser } from '../../common/interfaces';
import { ApiResponse, PaginatedApiResponse } from '../../common/responses';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async findAll(@Query() query: QueryUsersDto): Promise<PaginatedApiResponse<unknown>> {
    const result = await this.usersService.findAll(query);
    return new PaginatedApiResponse('Users retrieved', result.data, result.meta);
  }

  @Get('me')
  async getMe(@CurrentUser() user: AuthenticatedUser): Promise<ApiResponse<unknown>> {
    const profile = await this.usersService.findOne(user.id);
    return ApiResponse.ok('Profile retrieved', profile);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async findOne(@Param('id') id: string): Promise<ApiResponse<unknown>> {
    const user = await this.usersService.findOne(id);
    return ApiResponse.ok('User retrieved', user);
  }

  @Patch('me')
  async updateMe(
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApiResponse<unknown>> {
    const updated = await this.usersService.updateProfile(user.id, dto, user);
    return ApiResponse.ok('Profile updated', updated);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() requestor: AuthenticatedUser,
  ): Promise<ApiResponse<unknown>> {
    const updated = await this.usersService.updateProfile(id, dto, requestor);
    return ApiResponse.ok('User updated', updated);
  }

  @Patch(':id/role')
  @Roles(Role.SUPER_ADMIN)
  async updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
  ): Promise<ApiResponse<unknown>> {
    const updated = await this.usersService.updateRole(id, dto);
    return ApiResponse.ok('User role updated', updated);
  }

  @Patch(':id/status')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ): Promise<ApiResponse<unknown>> {
    const updated = await this.usersService.updateStatus(id, dto);
    return ApiResponse.ok('User status updated', updated);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}
