import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import {
  appConfig,
  databaseConfig,
  jwtConfig,
  redisConfig,
  r2Config,
  emailConfig,
} from './config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { NewslettersModule } from './modules/newsletters/newsletters.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { MediaModule } from './modules/media/media.module';
import { SubscribersModule } from './modules/subscribers/subscribers.module';
import { EmailsModule } from './modules/emails/emails.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SearchModule } from './modules/search/search.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AuditModule } from './modules/audit/audit.module';
import { CacheModule } from './modules/cache/cache.module';
import { SeoModule } from './modules/seo/seo.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { EventsModule } from './modules/events/events.module';
import { ExcoMembersModule } from './modules/exco-members/exco-members.module';
import { MembershipApplicationsModule } from './modules/membership-applications/membership-applications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, redisConfig, r2Config, emailConfig],
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      global: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 100 }],
    }),
    RedisModule,
    PrismaModule,
    AuditModule,
    CacheModule,
    AuthModule,
    UsersModule,
    NewslettersModule,
    CategoriesModule,
    MediaModule,
    SubscribersModule,
    EmailsModule,
    AnalyticsModule,
    SearchModule,
    SeoModule,
    SettingsModule,
    EventsModule,
    ExcoMembersModule,
    MembershipApplicationsModule,
  ],
})
export class AppModule {}
