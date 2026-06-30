import { Global, Module } from '@nestjs/common';
import { redisConnectionProvider } from './redis.provider.js';

@Global()
@Module({
  providers: [redisConnectionProvider],
  exports: [redisConnectionProvider],
})
export class RedisModule {}
