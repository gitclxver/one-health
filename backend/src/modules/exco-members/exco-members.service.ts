import { Injectable, NotFoundException } from '@nestjs/common';
import { ExcoMembersRepository } from './exco-members.repository';
import { CreateExcoMemberDto, UpdateExcoMemberDto } from './dto';
import type { ExcoMember } from '../../../generated/prisma/client';

@Injectable()
export class ExcoMembersService {
  constructor(private readonly excoMembersRepository: ExcoMembersRepository) {}

  async create(dto: CreateExcoMemberDto): Promise<ExcoMember> {
    return this.excoMembersRepository.create({
      name: dto.name,
      role: dto.role,
      description: dto.description,
      initials: dto.initials ?? this.initialsFromName(dto.name),
      avatarUrl: dto.avatarUrl,
      colorClass: dto.colorClass,
      sortOrder: dto.sortOrder ?? 0,
      isActive: dto.isActive ?? true,
    });
  }

  async findAll(activeOnly = true): Promise<ExcoMember[]> {
    const where: Record<string, unknown> = { deletedAt: null };
    if (activeOnly) where.isActive = true;

    return this.excoMembersRepository.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string): Promise<ExcoMember> {
    const member = await this.excoMembersRepository.findById(id);
    if (!member) throw new NotFoundException('Executive member not found');
    return member;
  }

  async update(id: string, dto: UpdateExcoMemberDto): Promise<ExcoMember> {
    await this.findOne(id);
    return this.excoMembersRepository.update(id, {
      name: dto.name,
      role: dto.role,
      description: dto.description,
      initials: dto.initials,
      avatarUrl: dto.avatarUrl,
      colorClass: dto.colorClass,
      sortOrder: dto.sortOrder,
      isActive: dto.isActive,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.excoMembersRepository.softDelete(id);
  }

  private initialsFromName(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }
}
