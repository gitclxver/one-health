import { Injectable } from '@nestjs/common';
import type { Prisma, ExcoMember } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExcoMembersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ExcoMemberCreateInput): Promise<ExcoMember> {
    return this.prisma.excoMember.create({ data });
  }

  async findMany(params?: {
    where?: Prisma.ExcoMemberWhereInput;
    orderBy?: Prisma.ExcoMemberOrderByWithRelationInput | Prisma.ExcoMemberOrderByWithRelationInput[];
  }): Promise<ExcoMember[]> {
    return this.prisma.excoMember.findMany(params);
  }

  async findById(id: string): Promise<ExcoMember | null> {
    return this.prisma.excoMember.findFirst({ where: { id, deletedAt: null } });
  }

  async update(id: string, data: Prisma.ExcoMemberUpdateInput): Promise<ExcoMember> {
    return this.prisma.excoMember.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<ExcoMember> {
    return this.prisma.excoMember.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
