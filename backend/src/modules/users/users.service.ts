import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UpdateUserDto, UpdateUserRoleDto, UpdateUserStatusDto, QueryUsersDto } from './dto';
import { buildPaginationMeta, getPaginationSkip } from '../../common/helpers';
import { PaginatedResult } from '../../common/interfaces';
import { AuthenticatedUser } from '../../common/interfaces';
import { Role } from '../../common/enums';
import type { User, Prisma } from '../../../generated/prisma/client.js';

type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(query: QueryUsersDto): Promise<PaginatedResult<SafeUser>> {
    const { page = 1, limit = 20, role, search } = query;
    const skip = getPaginationSkip(page, limit);

    const where: Prisma.UserWhereInput = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.usersRepository.findMany({ skip, take: limit, where, orderBy: { createdAt: 'desc' } }),
      this.usersRepository.count(where),
    ]);

    return {
      data: users.map(this.sanitize),
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findOne(id: string): Promise<SafeUser> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return this.sanitize(user);
  }

  async updateProfile(id: string, dto: UpdateUserDto, requestor: AuthenticatedUser): Promise<SafeUser> {
    if (id !== requestor.id && requestor.role !== Role.SUPER_ADMIN && requestor.role !== Role.ADMIN) {
      throw new ForbiddenException('Cannot update another user\'s profile');
    }

    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.usersRepository.update(id, dto);
    return this.sanitize(updated);
  }

  async updateRole(id: string, dto: UpdateUserRoleDto): Promise<SafeUser> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.usersRepository.update(id, { role: dto.role });
    return this.sanitize(updated);
  }

  async updateStatus(id: string, dto: UpdateUserStatusDto): Promise<SafeUser> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.usersRepository.update(id, { isActive: dto.isActive });
    return this.sanitize(updated);
  }

  async remove(id: string): Promise<void> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepository.delete(id);
  }

  private sanitize(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _hash, ...rest } = user;
    return rest;
  }
}
