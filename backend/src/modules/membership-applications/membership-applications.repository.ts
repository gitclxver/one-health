import { Injectable } from '@nestjs/common';
import type { Prisma, MembershipApplication } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MembershipApplicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.MembershipApplicationCreateInput): Promise<MembershipApplication> {
    return this.prisma.membershipApplication.create({ data });
  }

  async findMany(params?: {
    where?: Prisma.MembershipApplicationWhereInput;
    orderBy?: Prisma.MembershipApplicationOrderByWithRelationInput;
  }): Promise<MembershipApplication[]> {
    return this.prisma.membershipApplication.findMany(params);
  }

  async findById(id: string): Promise<MembershipApplication | null> {
    return this.prisma.membershipApplication.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.MembershipApplicationUpdateInput): Promise<MembershipApplication> {
    return this.prisma.membershipApplication.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.membershipApplication.delete({ where: { id } });
  }
}
