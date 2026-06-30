import { IsString, IsOptional, MaxLength, IsEnum, IsBoolean } from 'class-validator';
import { Role } from '../../../common/enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  lastName?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class UpdateUserRoleDto {
  @IsEnum(Role)
  role: Role;
}

export class UpdateUserStatusDto {
  @IsBoolean()
  isActive: boolean;
}
