import { Global, Module } from '@nestjs/common';
import { AuditService } from './audit.service.js';
import { NewsletterAuditListener } from './listeners/newsletter-audit.listener.js';
import { AuthAuditListener } from './listeners/auth-audit.listener.js';
import { MediaAuditListener } from './listeners/media-audit.listener.js';

@Global()
@Module({
  providers: [AuditService, NewsletterAuditListener, AuthAuditListener, MediaAuditListener],
  exports: [AuditService],
})
export class AuditModule {}
