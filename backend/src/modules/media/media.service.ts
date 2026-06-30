import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { v4 as uuidv4 } from 'uuid';
import { MediaRepository } from './media.repository.js';
import { R2StorageService } from './r2-storage.service.js';
import { UploadMediaDto } from './dto/index.js';
import { DomainEvents } from '../../common/events/index.js';
import type { AuthenticatedUser } from '../../common/interfaces/index.js';
import { Role } from '../../common/enums/index.js';
import type { Media } from '../../../generated/prisma/client';
import { validateUploadedFile } from './utils/file-filter.util.js';
import { optimizeImage, buildStorageKey } from './utils/image-optimizer.util.js';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly r2Storage: R2StorageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async upload(
    file: Express.Multer.File,
    dto: UploadMediaDto,
    uploader: AuthenticatedUser,
  ): Promise<Media> {
    try {
      validateUploadedFile(file);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid file';
      throw new BadRequestException(message);
    }

    let optimized;
    try {
      optimized = await optimizeImage(file.buffer);
    } catch {
      throw new BadRequestException('File is not a valid image');
    }

    const filename = `${uuidv4()}.webp`;
    const context = dto.context ?? 'newsletters';
    const storageKey = buildStorageKey(filename, context);

    const existing = await this.mediaRepository.findByStorageKey(storageKey);
    if (existing) {
      throw new BadRequestException('Upload conflict — please retry');
    }

    const publicUrl = await this.r2Storage.upload(
      storageKey,
      optimized.buffer,
      optimized.mimeType,
    );

    const media = await this.mediaRepository.create({
      filename,
      storageKey,
      publicUrl,
      mimeType: optimized.mimeType,
      size: optimized.size,
      width: optimized.width,
      height: optimized.height,
      altText: dto.altText,
      uploadedBy: { connect: { id: uploader.id } },
      newsletter: dto.newsletterId ? { connect: { id: dto.newsletterId } } : undefined,
    });

    this.eventEmitter.emit(DomainEvents.MEDIA_UPLOADED, {
      mediaId: media.id,
      filename: media.filename,
      publicUrl: media.publicUrl,
      userId: uploader.id,
    });

    this.logger.log(
      `Media ${media.id} uploaded by ${uploader.id} (${optimized.width}x${optimized.height}, ${optimized.size} bytes)`,
    );

    return media;
  }

  async findAll(uploaderId?: string, page = 1, limit = 20): Promise<Media[]> {
    const skip = (page - 1) * limit;
    const where = uploaderId ? { uploadedById: uploaderId } : undefined;
    return this.mediaRepository.findMany({ skip, take: limit, where });
  }

  async findOne(id: string): Promise<Media> {
    const media = await this.mediaRepository.findById(id);
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }

  async updateAltText(id: string, altText: string, requestor: AuthenticatedUser): Promise<Media> {
    const media = await this.findOne(id);
    this.assertCanModify(media, requestor);
    return this.mediaRepository.updateAltText(id, altText);
  }

  async remove(id: string, requestor: AuthenticatedUser): Promise<void> {
    const media = await this.findOne(id);
    this.assertCanModify(media, requestor);

    this.logger.log(`Soft-deleting media ${id} (${media.storageKey})`);
    await this.mediaRepository.softDelete(id);
  }

  private assertCanModify(media: Media, requestor: AuthenticatedUser): void {
    const isAdmin = [Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR].includes(requestor.role);
    const isOwner = media.uploadedById === requestor.id;
    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Cannot modify media uploaded by another user');
    }
  }
}
