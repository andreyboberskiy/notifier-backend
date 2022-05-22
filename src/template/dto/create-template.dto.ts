import {
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsUrl,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(24)
  @MaxLength(300)
  description: string;

  @IsUrl()
  siteUrl: string;

  @IsUrl()
  checkUrl: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(300)
  selector: string;

  @IsOptional()
  @IsNumber()
  userId: number;

  @IsString()
  @MinLength(4)
  @MaxLength(200)
  notifyPhrase: string;
}