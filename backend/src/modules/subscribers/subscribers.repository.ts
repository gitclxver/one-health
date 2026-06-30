import { Injectable } from '@nestjs/common';
import type { Prisma, Subscriber } from '../../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class SubscribersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    email: string;
    verificationToken: string;
    unsubscribeToken: string;
  }): Promise<Subscriber> {
    return this.prisma.subscriber.create({ data });
  }

  async findByEmail(email: string): Promise<Subscriber | null> {
    return this.prisma.subscriber.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<Subscriber | null> {
    return this.prisma.subscriber.findUnique({ where: { id } });
  }

  async findByVerificationToken(token: string): Promise<Subscriber | null> {
    return this.prisma.subscriber.findUnique({ where: { verificationToken: token } });
  }

  async findByUnsubscribeToken(token: string): Promise<Subscriber | null> {
    return this.prisma.subscriber.findUnique({ where: { unsubscribeToken: token } });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.SubscriberWhereInput;
  }): Promise<Subscriber[]> {
    return this.prisma.subscriber.findMany({ ...params, orderBy: { createdAt: 'desc' } });
  }

  async count(where?: Prisma.SubscriberWhereInput): Promise<number> {
    return this.prisma.subscriber.count({ where });
  }

  async verify(id: string): Promise<Subscriber> {
    return this.prisma.subscriber.update({
      where: { id },
      data: { isVerified: true, verificationToken: null },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subscriber.delete({ where: { id } });
  }
}
