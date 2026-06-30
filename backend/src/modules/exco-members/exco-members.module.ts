import { Module } from '@nestjs/common';
import { ExcoMembersController } from './exco-members.controller';
import { ExcoMembersService } from './exco-members.service';
import { ExcoMembersRepository } from './exco-members.repository';

@Module({
  controllers: [ExcoMembersController],
  providers: [ExcoMembersService, ExcoMembersRepository],
  exports: [ExcoMembersService],
})
export class ExcoMembersModule {}
