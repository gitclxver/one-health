import { Module } from '@nestjs/common';
import { MembershipApplicationsController } from './membership-applications.controller';
import { MembershipApplicationsService } from './membership-applications.service';
import { MembershipApplicationsRepository } from './membership-applications.repository';

@Module({
  controllers: [MembershipApplicationsController],
  providers: [MembershipApplicationsService, MembershipApplicationsRepository],
  exports: [MembershipApplicationsService],
})
export class MembershipApplicationsModule {}
