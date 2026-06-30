import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvents, type MediaUploadedEvent } from '../../../common/events/index.js';
import { AuditService } from '../audit.service.js';

@Injectable()
export class MediaAuditListener {
  constructor(private readonly auditService: AuditService) {}

  @OnEvent(DomainEvents.MEDIA_UPLOADED)
  async handleUploaded(event: MediaUploadedEvent): Promise<void> {
    await this.auditService.log({
      action: 'MEDIA_UPLOADED',
      resource: 'media',
      resourceId: event.mediaId,
      userId: event.userId,
      metadata: { filename: event.filename, publicUrl: event.publicUrl },
    });
  }
}
