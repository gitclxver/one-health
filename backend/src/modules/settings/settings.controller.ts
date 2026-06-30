import { Controller, Get, Patch, Body } from '@nestjs/common';
import { SettingsService } from './settings.service.js';
import { UpdateSettingsDto } from './dto/update-settings.dto.js';
import { Roles, Public } from '../../decorators/index.js';
import { Role } from '../../common/enums/index.js';
import { ApiResponse } from '../../common/responses/index.js';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Get()
  async get(): Promise<ApiResponse<unknown>> {
    const settings = await this.settingsService.get();
    return ApiResponse.ok('Settings retrieved', settings);
  }

  @Patch()
  @Roles(Role.SUPER_ADMIN)
  async update(@Body() dto: UpdateSettingsDto): Promise<ApiResponse<unknown>> {
    const settings = await this.settingsService.update(dto);
    return ApiResponse.ok('Settings updated', settings);
  }
}
