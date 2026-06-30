import { IsString, IsOptional, IsEnum, IsEmail, MinLength } from 'class-validator';
import { MembershipApplicationStatus } from '../../../common/enums';

export class CreateMembershipApplicationDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  interest!: string;
}

export class UpdateMembershipApplicationDto {
  @IsOptional()
  @IsEnum(MembershipApplicationStatus)
  status?: MembershipApplicationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class QueryMembershipApplicationsDto {
  @IsOptional()
  @IsEnum(MembershipApplicationStatus)
  status?: MembershipApplicationStatus;
}
