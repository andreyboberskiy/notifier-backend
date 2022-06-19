import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ minimum: 4, maximum: 30 })
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  login: string;

  @ApiProperty({ minimum: 8, maximum: 32 })
  @MinLength(8)
  @MaxLength(32)
  @IsString()
  password: string;
}
