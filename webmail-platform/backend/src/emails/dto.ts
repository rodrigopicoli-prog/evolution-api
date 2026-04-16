import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @IsString()
  accountId: string;

  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  body: string;
}

export class UpdateEmailDto {
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}
