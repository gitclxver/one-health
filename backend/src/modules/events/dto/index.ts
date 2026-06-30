import { IsString, IsOptional, IsEnum, IsBoolean, IsInt, IsDateString, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { EventStatus } from '../../../common/enums';

export class CreateEventDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @MinLength(10)
  description!: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsDateString()
  startsAt!: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class UpdateEventDto extends CreateEventDto {}

export class QueryEventsDto {
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  featuredOnly?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}
