import { Injectable } from '@nestjs/common';
import type { Prisma, Event } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EventsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EventCreateInput): Promise<Event> {
    return this.prisma.event.create({ data });
  }

  async findMany(params: {
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput | Prisma.EventOrderByWithRelationInput[];
    take?: number;
    skip?: number;
  }): Promise<Event[]> {
    return this.prisma.event.findMany(params);
  }

  async findById(id: string): Promise<Event | null> {
    return this.prisma.event.findFirst({ where: { id, deletedAt: null } });
  }

  async findBySlug(slug: string): Promise<Event | null> {
    return this.prisma.event.findFirst({ where: { slug, deletedAt: null } });
  }

  async update(id: string, data: Prisma.EventUpdateInput): Promise<Event> {
    return this.prisma.event.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<Event> {
    return this.prisma.event.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
