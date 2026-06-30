import { Module } from '@nestjs/common';
import { MediaController } from './media.controller.js';
import { MediaService } from './media.service.js';
import { MediaRepository } from './media.repository.js';
import { R2StorageService } from './r2-storage.service.js';

@Module({
  controllers: [MediaController],
  providers: [MediaService, MediaRepository, R2StorageService],
  exports: [MediaService],
})
export class MediaModule {}
