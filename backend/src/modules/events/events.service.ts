import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsRepository } from './events.repository';
import { CreateEventDto, QueryEventsDto, UpdateEventDto } from './dto';
import { generateSlug } from '../../common/helpers';
import { EventStatus } from '../../common/enums';
import type { Event } from '../../../generated/prisma/client';

@Injectable()
export class EventsService {
  constructor(private readonly eventsRepository: EventsRepository) {}

  async create(dto: CreateEventDto): Promise<Event> {
    const slug = await this.uniqueSlug(generateSlug(dto.title));
    return this.eventsRepository.create({
      title: dto.title,
      slug,
      description: dto.description,
      location: dto.location,
      imageUrl: dto.imageUrl,
      startsAt: new Date(dto.startsAt),
      endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      status: dto.status ?? EventStatus.UPCOMING,
      isFeatured: dto.isFeatured ?? false,
      sortOrder: dto.sortOrder ?? 0,
    });
  }

  async findAll(query: QueryEventsDto): Promise<Event[]> {
    const where: Record<string, unknown> = { deletedAt: null };
    if (query.status) where.status = query.status;
    if (query.featuredOnly) where.isFeatured = true;

    return this.eventsRepository.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { startsAt: 'desc' }],
      take: query.limit ?? 50,
    });
  }

  async findOne(idOrSlug: string): Promise<Event> {
    const event =
      (await this.eventsRepository.findById(idOrSlug)) ??
      (await this.eventsRepository.findBySlug(idOrSlug));
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    await this.findOne(id);
    return this.eventsRepository.update(id, {
      title: dto.title,
      description: dto.description,
      location: dto.location,
      imageUrl: dto.imageUrl,
      startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
      endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      status: dto.status,
      isFeatured: dto.isFeatured,
      sortOrder: dto.sortOrder,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.eventsRepository.softDelete(id);
  }

  private async uniqueSlug(base: string): Promise<string> {
    let slug = base;
    let counter = 1;
    while (await this.eventsRepository.findBySlug(slug)) {
      slug = `${base}-${counter++}`;
    }
    return slug;
  }
}
