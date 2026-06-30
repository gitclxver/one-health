import { IsString, IsOptional, IsIn } from 'class-validator';

export class UploadMediaDto {
  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsString()
  newsletterId?: string;

  /** Storage folder under media/ — newsletters, events, or exco */
  @IsOptional()
  @IsString()
  @IsIn(['newsletters', 'events', 'exco'])
  context?: 'newsletters' | 'events' | 'exco';
}
