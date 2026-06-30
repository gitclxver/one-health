import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateSettingsDto } from './dto/update-settings.dto.js';
import type { Setting } from '../../../generated/prisma/client.js';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns the single settings row, creating defaults if it doesn't exist yet.
   */
  async get(): Promise<Setting> {
    const existing = await this.prisma.setting.findFirst();
    if (existing) return existing;

    this.logger.log('No settings row found — creating defaults');
    return this.prisma.setting.create({
      data: {
        siteName: 'One Health',
        maintenanceMode: false,
      },
    });
  }

  /**
   * Updates the singleton settings row atomically.
   */
  async update(dto: UpdateSettingsDto): Promise<Setting> {
    const settings = await this.get();
    return this.prisma.setting.update({
      where: { id: settings.id },
      data: dto,
    });
  }
}
