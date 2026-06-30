import { IsString, IsOptional, IsBoolean, IsEmail, MaxLength } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  siteName?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  footer?: string;

  @IsOptional()
  @IsString()
  homepageBanner?: string;

  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;
}
