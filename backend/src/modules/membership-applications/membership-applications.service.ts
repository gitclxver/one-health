import { Injectable, NotFoundException } from '@nestjs/common';
import { MembershipApplicationsRepository } from './membership-applications.repository';
import {
  CreateMembershipApplicationDto,
  QueryMembershipApplicationsDto,
  UpdateMembershipApplicationDto,
} from './dto';
import type { MembershipApplication } from '../../../generated/prisma/client';

@Injectable()
export class MembershipApplicationsService {
  constructor(private readonly repository: MembershipApplicationsRepository) {}

  async create(dto: CreateMembershipApplicationDto): Promise<MembershipApplication> {
    return this.repository.create({
      fullName: dto.fullName,
      email: dto.email,
      interest: dto.interest,
    });
  }

  async findAll(query: QueryMembershipApplicationsDto): Promise<MembershipApplication[]> {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;

    return this.repository.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<MembershipApplication> {
    const application = await this.repository.findById(id);
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  async update(id: string, dto: UpdateMembershipApplicationDto): Promise<MembershipApplication> {
    await this.findOne(id);
    return this.repository.update(id, {
      status: dto.status,
      notes: dto.notes,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.delete(id);
  }
}
