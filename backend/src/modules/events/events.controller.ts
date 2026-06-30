import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, QueryEventsDto, UpdateEventDto } from './dto';
import { Public, Roles } from '../../decorators';
import { Role } from '../../common/enums';
import { ApiResponse } from '../../common/responses';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @Get()
  async findAll(@Query() query: QueryEventsDto): Promise<ApiResponse<unknown>> {
    const events = await this.eventsService.findAll(query);
    return ApiResponse.ok('Events retrieved', events);
  }

  @Public()
  @Get(':idOrSlug')
  async findOne(@Param('idOrSlug') idOrSlug: string): Promise<ApiResponse<unknown>> {
    const event = await this.eventsService.findOne(idOrSlug);
    return ApiResponse.ok('Event retrieved', event);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  async create(@Body() dto: CreateEventDto): Promise<ApiResponse<unknown>> {
    const event = await this.eventsService.create(dto);
    return ApiResponse.ok('Event created', event);
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
  ): Promise<ApiResponse<unknown>> {
    const event = await this.eventsService.update(id, dto);
    return ApiResponse.ok('Event updated', event);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.eventsService.remove(id);
  }
}
