import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpsertSettingDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  key: string;

  @IsString()
  value: string;
}
