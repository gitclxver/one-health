import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly client: PrismaClient;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const adapter = new PrismaPg({ connectionString });
    this.client = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
  }

  // Model accessors — repositories use these to query the database
  get user() { return this.client.user; }
  get refreshToken() { return this.client.refreshToken; }
  get newsletter() { return this.client.newsletter; }
  get category() { return this.client.category; }
  get newsletterCategory() { return this.client.newsletterCategory; }
  get media() { return this.client.media; }
  get subscriber() { return this.client.subscriber; }
  get emailJob() { return this.client.emailJob; }
  get auditLog() { return this.client.auditLog; }
  get pageView() { return this.client.pageView; }
  get setting() { return this.client.setting; }
  get event() { return this.client.event; }
  get excoMember() { return this.client.excoMember; }
  get membershipApplication() { return this.client.membershipApplication; }

  $queryRaw<T = unknown>(...args: Parameters<PrismaClient['$queryRaw']>): Promise<T> {
    return this.client.$queryRaw(...args) as Promise<T>;
  }

  $executeRaw(...args: Parameters<PrismaClient['$executeRaw']>): Promise<number> {
    return this.client.$executeRaw(...args);
  }

  $transaction<T>(fn: (client: PrismaClient) => Promise<T>): Promise<T> {
    return this.client.$transaction(fn as Parameters<PrismaClient['$transaction']>[0]) as Promise<T>;
  }

  async onModuleInit(): Promise<void> {
    await this.client.$connect();
    this.logger.log('Database connected');
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
    this.logger.log('Database disconnected');
  }
}
