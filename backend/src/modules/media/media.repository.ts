import { Injectable } from '@nestjs/common';
import type { Prisma, Media } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';

const SOFT_DELETE_FILTER = { deletedAt: null } satisfies Prisma.MediaWhereInput;

@Injectable()
export class MediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.MediaCreateInput): Promise<Media> {
    return this.prisma.media.create({ data });
  }

  async findById(id: string): Promise<Media | null> {
    return this.prisma.media.findFirst({ where: { id, ...SOFT_DELETE_FILTER } });
  }

  async findByStorageKey(storageKey: string): Promise<Media | null> {
    return this.prisma.media.findFirst({ where: { storageKey, ...SOFT_DELETE_FILTER } });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.MediaWhereInput;
  }): Promise<Media[]> {
    return this.prisma.media.findMany({
      ...params,
      where: { ...params.where, ...SOFT_DELETE_FILTER },
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(where?: Prisma.MediaWhereInput): Promise<number> {
    return this.prisma.media.count({ where: { ...where, ...SOFT_DELETE_FILTER } });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.media.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async updateAltText(id: string, altText: string): Promise<Media> {
    return this.prisma.media.update({
      where: { id },
      data: { altText },
    });
  }
}
