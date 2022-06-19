import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsUrl,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ParseTypeEnum } from 'template/types/parse-type-enums.type';

export class CreateTemplateDto {
  @ApiProperty({ minimum: 4, maximum: 70 })
  @IsString()
  @MinLength(4)
  @MaxLength(70)
  name: string;

  @ApiPropertyOptional({ minimum: 24, maximum: 300 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(24)
  @MaxLength(300)
  description: string;

  @ApiProperty()
  @IsUrl()
  siteUrl: string;

  @ApiProperty()
  @IsUrl()
  checkUrl: string;

  @ApiProperty({ minimum: 2, maximum: 300 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(300)
  selector: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  userId: number;

  @ApiProperty({ minimum: 4, maximum: 200 })
  @IsString()
  @MinLength(4)
  @MaxLength(200)
  notifyPhrase: string;

  @ApiProperty({ enum: ParseTypeEnum })
  @IsEnum(ParseTypeEnum)
  parseType: ParseTypeEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  excludedSelectors: string[];

  @ApiPropertyOptional({
    type: 'array',
    example: [{ label: 'Name', selector: '.name' }],
  })
  @IsOptional()
  @IsArray()
  grabConfig: { label: string; selector: string }[];
}
