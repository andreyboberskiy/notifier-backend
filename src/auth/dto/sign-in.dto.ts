import { IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  login: string;

  @MinLength(8)
  @MaxLength(32)
  @IsString()
  password: string;
}
