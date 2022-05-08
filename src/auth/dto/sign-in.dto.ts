import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class SignInDto {
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  @ValidateIf((o) => !o.email || o.username)
  username: string;

  @ValidateIf((o) => !o.username || o.email)
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(32)
  @IsString()
  password: string;
}
