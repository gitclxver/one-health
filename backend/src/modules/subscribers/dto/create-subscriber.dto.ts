import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSubscriberDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  lastName?: string;
}
