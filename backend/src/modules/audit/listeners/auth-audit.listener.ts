import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  DomainEvents,
  type UserRegisteredEvent,
  type UserLoggedInEvent,
} from '../../../common/events/index.js';
import { AuditService } from '../audit.service.js';

@Injectable()
export class AuthAuditListener {
  constructor(private readonly auditService: AuditService) {}

  @OnEvent(DomainEvents.USER_REGISTERED)
  async handleRegistered(event: UserRegisteredEvent): Promise<void> {
    await this.auditService.log({
      action: 'USER_REGISTERED',
      resource: 'user',
      resourceId: event.userId,
      userId: event.userId,
      metadata: { email: event.email },
    });
  }

  @OnEvent(DomainEvents.USER_LOGGED_IN)
  async handleLoggedIn(event: UserLoggedInEvent): Promise<void> {
    await this.auditService.log({
      action: 'USER_LOGGED_IN',
      resource: 'user',
      resourceId: event.userId,
      userId: event.userId,
      metadata: { email: event.email },
    });
  }
}
