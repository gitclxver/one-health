import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomBytes } from 'crypto';
import { SubscribersRepository } from './subscribers.repository.js';
import { CreateSubscriberDto } from './dto/index.js';
import { DomainEvents } from '../../common/events/index.js';
import { buildPaginationMeta, getPaginationSkip } from '../../common/helpers/index.js';
import type { PaginatedResult } from '../../common/interfaces/index.js';
import type { Subscriber } from '../../../generated/prisma/client.js';

@Injectable()
export class SubscribersService {
  constructor(
    private readonly subscribersRepository: SubscribersRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async subscribe(dto: CreateSubscriberDto): Promise<Subscriber> {
    const existing = await this.subscribersRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const verificationToken = randomBytes(32).toString('hex');
    const unsubscribeToken = randomBytes(32).toString('hex');

    const subscriber = await this.subscribersRepository.create({
      email: dto.email,
      verificationToken,
      unsubscribeToken,
    });

    this.eventEmitter.emit(DomainEvents.SUBSCRIBER_CREATED, {
      subscriberId: subscriber.id,
      email: subscriber.email,
    });

    return subscriber;
  }

  async verify(token: string): Promise<Subscriber> {
    const subscriber = await this.subscribersRepository.findByVerificationToken(token);
    if (!subscriber) throw new BadRequestException('Invalid or expired verification token');
    if (subscriber.isVerified) return subscriber;
    return this.subscribersRepository.verify(subscriber.id);
  }

  async unsubscribeByToken(token: string): Promise<void> {
    const subscriber = await this.subscribersRepository.findByUnsubscribeToken(token);
    if (!subscriber) throw new BadRequestException('Invalid unsubscribe token');
    await this.subscribersRepository.delete(subscriber.id);
  }

  async findAll(
    page = 1,
    limit = 20,
    verifiedOnly = false,
  ): Promise<PaginatedResult<Subscriber>> {
    const skip = getPaginationSkip(page, limit);
    const where = verifiedOnly ? { isVerified: true } : undefined;

    const [data, total] = await Promise.all([
      this.subscribersRepository.findMany({ skip, take: limit, where }),
      this.subscribersRepository.count(where),
    ]);

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async remove(id: string): Promise<void> {
    const subscriber = await this.subscribersRepository.findById(id);
    if (!subscriber) throw new NotFoundException('Subscriber not found');
    await this.subscribersRepository.delete(id);
  }

  async findVerified(): Promise<Subscriber[]> {
    return this.subscribersRepository.findMany({ where: { isVerified: true } });
  }
}
