import { IsBoolean, IsEmail, IsInt, IsString } from 'class-validator';

export class CreateEmailAccountDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  imapHost: string;

  @IsInt()
  imapPort: number;

  @IsString()
  smtpHost: string;

  @IsInt()
  smtpPort: number;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsBoolean()
  useTls: boolean;
}
