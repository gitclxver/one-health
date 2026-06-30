import { Module } from '@nestjs/common';
import { SubscribersController } from './subscribers.controller.js';
import { SubscribersService } from './subscribers.service.js';
import { SubscribersRepository } from './subscribers.repository.js';

@Module({
  controllers: [SubscribersController],
  providers: [SubscribersService, SubscribersRepository],
  exports: [SubscribersService],
})
export class SubscribersModule {}
