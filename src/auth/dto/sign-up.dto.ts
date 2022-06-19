import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({ minimum: 4, maximum: 30 })
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    minimum: 8,
    maximum: 32,
  })
  @MinLength(8)
  @MaxLength(32)
  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
}
